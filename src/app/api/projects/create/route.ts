import { NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";
import { dbConnect } from "@/app/config/dbConfig";
import Project from "@/models/Project";
import User from "@/models/User";
import SubscriptionPlan from "@/models/SubscriptionPlan";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const tokenData = await getTokenData(req);
    if (!tokenData?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, description, assignedUsers, deadline } = await req.json();
    const userId = tokenData.id;

    const user = await User.findById(userId);
    // .populate("subscriptionPlan");
    console.log(user);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.role === "worker" && !user.subscriptionPlan) {
      return NextResponse.json(
        { message: "Worker can not create Project" },
        { status: 400 }
      );
    } else if (["admin"].includes(user.role) && !user.subscriptionPlan) {
      return NextResponse.json({ message: "No active plan" }, { status: 403 });
    } else if (user.accountType === "individual" && !user.subscriptionPlan) {
      return NextResponse.json({ message: "No active plan" }, { status: 403 });
    }
    let projectCount = 0;
    let projectLimit = 0;

    if (
      ["engineer", "client", "admin"].includes(user.role) &&
      user.accountType === "organization"
    ) {
      projectCount = await Project.countDocuments({
        companyId: user.companyId,
      });
      const plan = await SubscriptionPlan.findOne({
        companyId: user.companyId,
      });
      projectLimit = plan?.projectLimit || 0;
    } else if (user.accountType === "individual") {
      projectCount = await Project.countDocuments({ createdBy: userId });
      const plan = await SubscriptionPlan.findOne({ userId: userId });
      projectLimit = plan?.projectLimit || 0;
    }

    console.log({projectCount, projectLimit});
    // Project limit check
    if (projectCount >= projectLimit) {
      return NextResponse.json(
        { message: "Project limit reached for your plan" },
        { status: 403 }
      );
    }

    // Create project, attach companyId if user belongs to organization
    const newProject = await Project.create({
      name,
      description,
      createdBy: userId,
      assignedUsers: assignedUsers || [],
      deadline,
      companyId: user.companyId || null,
    });

    return NextResponse.json(
      { message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (err) {
    console.error("[PROJECT_CREATE_ERROR]", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err },
      { status: 500 }
    );
  }
}
