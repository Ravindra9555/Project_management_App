import { dbConnect } from "@/app/config/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { companyId, role } = body;

    if (!companyId || !role) {
      return NextResponse.json(
        { message: "companyId and role are required" },
        { status: 400 }
      );
    }

    const users = await User.find({ companyId, role });

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
