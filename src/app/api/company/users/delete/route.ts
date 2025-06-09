import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import User from "@/models/User";
import Company from "@/models/Company";

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId } = body;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.accountType !== "organization") {
      return NextResponse.json({ message: "Only company users can be deleted via this route" }, { status: 400 });
    }

    await Company.findByIdAndUpdate(user.companyId, {
      $pull: { members: user._id }
    });

    await User.findByIdAndDelete(user._id);

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("[COMPANY_USER_DELETE_ERROR]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
