 import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
export async function POST(req: Request) {
    await dbConnect();

    const { email, password } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).populate("subscriptionPlan");
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
      const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }
    // Generate a JWT token and return it

    const token = await jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );

    return NextResponse.json(
        {
            message: "Login successful",
            user :{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                isActive: user.isActive,
                subscriptionPlan: user.subscriptionPlan,
            },
            token,
        },
        { status: 200 }     
    );
    

    
}