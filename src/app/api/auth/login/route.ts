

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Export an async function called POST that takes a Request object as a parameter
export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Destructure the email and password from the request body
    const { email, password } = await req.json();
    // If either email or password is not provided, return a 400 status code with a message
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Find a user in the database with the provided email
    const user = await User.findOne({ email: email.toLowerCase() })
    // .populate("subscriptionPlan");
    // if(user.subscriptionPlan !==null){
    //   user.subscriptionPlan = await user.subscriptionPlan.populate("subscriptionPlan");
    // }
    // if(user.accountType ==="organization"){
    //   user.company = await user.companyId.populate("Company");
    // }
    // console.log(user)
    // If no user is found, return a 404 status code with a message
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // If the passwords do not match, return a 401 status code with a message
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Create a JWT token with the user's information
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
        companyId: user.companyId || null,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // If the user is not active, return a 401 status code with a message
    if (user.isActive === false) {
      return NextResponse.json({ message: "User is not active" }, { status: 401 });
    }
    // console.log(token)
    // Return a 200 status code with a message, the user's information, and the token
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountType: user.accountType || null,
          companyId: user.companyId || null,
          profilePic: user.profilePic,
          isActive: user.isActive,
          subscriptionPlan: user.subscriptionPlan || null,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log any errors that occur
    console.error("Login Error:", error);
    // Return a 500 status code with a message and the error
    return NextResponse.json({ message: "Login failed", error }, { status: 500 });
  }
}
