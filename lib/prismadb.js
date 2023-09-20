// Import the PrismaClient from the Prisma package.
import { PrismaClient } from "@prisma/client";

// Create a Prisma client instance named "client."
const client = global.prismadb || new PrismaClient();

// Check if the Node.js environment is in production mode.
if (process.env.NODE_ENV === "production") {
  // If it's in production, set the "global.prismadb" property to the "client" instance.
  global.prismadb = client;
}

// Export the "client" instance, making it available for use in other parts of your application.
export default client;
