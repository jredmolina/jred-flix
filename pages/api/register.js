import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb";

// Define an asynchronous function named "handler" which handles HTTP requests
export default async function handler(req, res) {
  // Check if the HTTP request method is not "POST", if it's not, return a 405 (Method Not Allowed) response
  if (req.method != "POST") {
    return res.status(405).end();
  }

  try {
    // Destructure the "email", "name", and "password" properties from the request body
    const { email, name, password } = req.body;

    // Query the database to check if a user with the same email already exists
    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    // If a user with the same email exists, return a 422 (Unprocessable Entity) response with an error message
    if (existingUser) {
      return res.status(422).json({ error: "Email taken" });
    }
    // Hash the provided password using bcrypt with a cost factor of 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user record in the database with the provided email, name, hashed password, image (empty string), and email verification date
    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    });
    // Return a 200 (OK) response with the created user data in JSON format
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    // If an error occurs during the process, log the error and return a 400 (Bad Request) response
    console.log(error);
    return res.status(400).end();
  }
}
