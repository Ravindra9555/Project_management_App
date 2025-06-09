import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import User from "@/models/User";
import Company from "@/models/Company";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, role, companyId } = await req.json();

    if (!name || !email || !password || !role || !companyId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!["engineer", "worker", "client"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      accountType: "organization",
      role,
      companyId
    });

    company.members.push(user._id);
    await company.save();

    return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });
  } catch (err) {
    console.error("[COMPANY_USER_REGISTER_ERROR]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
