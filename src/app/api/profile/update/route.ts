import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import User from "../../../../models/User";
import { getTokenData } from "@/helpers/getTokenData";

interface UpdateData {
  name: string;
  profilePic?: string;
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const tokenData = await getTokenData(req);
    if (!tokenData?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(tokenData.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { name, profilePic } = await req.json();
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const updateData: UpdateData = { name };
    if (profilePic) updateData.profilePic = profilePic;

    const updatedUser = await User.findByIdAndUpdate(tokenData.id, updateData, {
      new: true,
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          profilePic: updatedUser.profilePic,
          email: updatedUser.email,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[PROFILE_UPDATE_ERROR]", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}