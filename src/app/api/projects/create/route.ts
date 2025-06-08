// // app/api/project/create/route.ts
// import { NextResponse } from "next/server";
// import { getTokenData } from "../../../../helpers/getTokenData";
// import { dbConnect } from "@/app/config/dbConfig";
// import Project from "../../../../models/Project";
// import User from "../../../../models/User";

// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     const tokenData = await getTokenData(req);
//     if (!tokenData || !tokenData.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
    
//      console.log("[PROJECT_CREATE_REQUEST]", tokenData);

//     const { name, description, assignedUsers, deadline } = await req.json();
//     const userId = tokenData.id;

//     // Fetch user and plan
//     const user = await User.findById(userId).populate("subscriptionPlan");
//     if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     const plan = user.subscriptionPlan;
//     if (!plan) return NextResponse.json({ message: "No plan selected" }, { status: 403 });

//     const projectCount = await Project.countDocuments({ createdBy: userId });

//     if (projectCount >= plan.projectLimit) {
//       return NextResponse.json({ message: "Project limit reached for your plan" }, { status: 403 });
//     }

//     // Create project
//     const project = await Project.create({
//       name,
//       description,
//       createdBy: userId,
//       assignedUsers: assignedUsers || [],
//       deadline,
//     });

//     return NextResponse.json({
//       message: "Project created successfully",
//       project,
//     }, { status: 201 });

//   } catch (err) {
//     console.error("[PROJECT_CREATE_ERROR]", err);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }


// app/api/project/create/route.ts
import { NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";
import { dbConnect } from "@/app/config/dbConfig";
import Project from "@/models/Project";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const tokenData = await getTokenData(req);
    if (!tokenData?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, description, assignedUsers, deadline } = await req.json();
    const userId = tokenData.id;

    const user = await User.findById(userId).populate("subscriptionPlan");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const plan = user.subscriptionPlan;
    if (!plan) {
      return NextResponse.json({ message: "No active plan" }, { status: 403 });
    }

    // Project limit check
    const projectCount = await Project.countDocuments({ createdBy: userId });
    if (projectCount >= plan.projectLimit) {
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
