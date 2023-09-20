import NextAuth from "next-auth/next"; // Import NextAuth for authentication
import Credentials from "next-auth/providers/credentials"; // Import the Credentials provider for email/password authentication
import prismadb from "@/lib/prismadb"; // Import a database library/module (prismadb)
import { compare } from "bcrypt"; // Import the "compare" function from bcrypt for password comparison
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      id: "credentials", // Identifier for this authentication provider
      name: "Credentials", // Name of the provider (used for display)
      credentials: {
        email: {
          label: "Email", // Label for the email input field
          type: "text", // Input field type (text)
        },
        password: {
          label: "Password", // Label for the password input field
          type: "password", // Input field type (password)
        },
      },
      async authorize(credentials) {
        // Authorization function that checks the provided credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Query the database to find a user with the provided email
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // Check if the user or their hashed password does not exist
        if (!user || !user.hashedPassword) {
          throw new Error("Email does not exist");
        }

        // Compare the provided password with the stored hashed password using bcrypt
        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        // If the password is incorrect, throw an error
        if (!isCorrectPassword) {
          throw new Error("Incorrect password");
        }

        // If everything is successful, return the user object
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth", // Define the sign-in page URL
  },
  debug: process.env.NODE_ENV === "development", // Enable debugging in development mode
  session: {
    strategy: "jwt", // Use JWT (JSON Web Tokens) for session management
  },
  adapter: PrismaAdapter(prismadb),
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET, // Secret key for JWT
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret key for NextAuth
});
