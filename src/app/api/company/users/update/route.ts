import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { name, role, isActive, userId, } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (role && !["engineer", "worker", "client"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    user.name = name || user.name;
    user.role = role || user.role;
    user.isActive = typeof isActive === "boolean" ? isActive : user.isActive;

    await user.save();

    return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
  } catch (err) {
    console.error("[COMPANY_USER_UPDATE_ERROR]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
