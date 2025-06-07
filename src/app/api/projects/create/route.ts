// app/api/project/create/route.ts
import { NextResponse } from "next/server";
import { getTokenData } from "../../../../helpers/getTokenData";
import { dbConnect } from "@/app/config/dbConfig";
import Project from "@/app/models/Project";
import User from "@/app/models/User";
import SubscriptionPlan from "@/app/models/SubscriptionPlan";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const tokenData = await getTokenData(req);
    if (!tokenData || !tokenData.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
     console.log("[PROJECT_CREATE_REQUEST]", tokenData);

    const { name, description, assignedUsers, deadline } = await req.json();
    const userId = tokenData.id;

    // Fetch user and plan
    const user = await User.findById(userId).populate("subscriptionPlan");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const plan = user.subscriptionPlan;
    if (!plan) return NextResponse.json({ message: "No plan selected" }, { status: 403 });

    const projectCount = await Project.countDocuments({ createdBy: userId });

    if (projectCount >= plan.projectLimit) {
      return NextResponse.json({ message: "Project limit reached for your plan" }, { status: 403 });
    }

    // Create project
    const project = await Project.create({
      name,
      description,
      createdBy: userId,
      assignedUsers: assignedUsers || [],
      deadline,
    });

    return NextResponse.json({
      message: "Project created successfully",
      project,
    }, { status: 201 });

  } catch (err) {
    console.error("[PROJECT_CREATE_ERROR]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
