// app/api/project/route.ts
import { NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";
import { dbConnect } from "@/app/config/dbConfig";
import User from "@/app/models/User";
import Project from "@/app/models/Project";
export async function GET(req: Request) {
  try {
    await dbConnect();
    const tokenData = await getTokenData(req);
    if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findById(tokenData.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const filter = user.role === "admin"
      ? { } // admin sees all projects
      : {
          $or: [
            { createdBy: user._id },
            { assignedUsers: user._id }
          ]
        };

    const projects = await Project
      .find(filter)
      .populate("assignedUsers", "name email role")
      .populate("createdBy", "name email");

    return NextResponse.json({ projects }, { status: 200 });

  } catch (err) {
    console.error("[PROJECT_LIST_ERROR]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
