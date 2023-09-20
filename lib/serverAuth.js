import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import prismadb from "@/lib/prismadb";

// This function is responsible for server-side authentication.
const serverAuth = async (req) => {
  // Attempt to get the session using the provided request.
  const session = await getSession({ req });

  // If there is no user in the session or no email in the user data, throw an error indicating that the user is not signed in.
  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  // Query the database to find the user with the email from the session.
  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  // If no user is found in the database, throw an error indicating that the user is not signed in.
  if (!currentUser) {
    throw new Error("Not signed in");
  }

  // Return an object containing the currentUser.
  return { currentUser };
};

// Export the serverAuth function to make it available for use in other parts of your code.
export default serverAuth;
