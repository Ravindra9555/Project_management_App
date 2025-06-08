

import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Export an asynchronous function named POST that takes a Request object as a parameter
export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();
    // Destructure the name, email, and password from the request body
    const { name, email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      // Return a JSON response with a 400 status code and a message if email or password is not provided
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Return a JSON response with a 409 status code and a message if the email already exists
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create a new user in the database
    const user = await User.create({
      name: name || "User",  // fallback if name not provided
      email,
      password: hashedPassword,
      accountType: "individual",
    });
    
    

    // Return a JSON response with a 201 status code and a message if the user is created successfully
    return NextResponse.json({ message: "User created", userId: user._id }, { status: 201 });
  } catch (error) {
    // Log the error to the console
    console.error("Signup error:", error);
    // Return a JSON response with a 500 status code and a message if there is an error
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
