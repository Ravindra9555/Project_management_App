// app/api/project/[id]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import { getTokenData } from "@/helpers/getTokenData";
import Project from "../../../../models/Project";
import User from "../../../../models/User";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const tokenData = await getTokenData(req);
    if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findById(tokenData.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const project = await Project.findById(params.id)
      .populate("assignedUsers", " name email role")
      .populate("createdBy", "name email");

    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    const isInvolved = user.role === "admin"
      || project.createdBy._id.equals(user._id)
      || project.assignedUsers.some((u: any) => u._id.equals(user._id));

    if (!isInvolved) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    return NextResponse.json({ project }, { status: 200 });

  } catch (err) {
    console.error("[PROJECT_SINGLE_ERROR]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

 // Export an async function called DELETE that takes in a Request object and a destructured params object with an id property
 export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        // Connect to the database
        await dbConnect();
        // Get the token data from the request
        const tokenData = await getTokenData(req);
        // If the token data does not have an id, return a 401 Unauthorized response
        if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
        const user = await User.findById(tokenData.id);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    
        const project = await Project.findById(params.id);
        if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });
    
        const isAdmin = user.role === "admin";
        const isOwner = project.createdBy.equals(user._id);
    
        if (!isAdmin && !isOwner) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
    
        await Project.findByIdAndDelete(params.id);
        return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    
    } catch (err) {
        console.error("[PROJECT_DELETE_ERROR]", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


// Export an async function called PUT that takes in a Request object and an object with a params property
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await dbConnect();
    // Get the token data from the request
    const tokenData = await getTokenData(req);
    // If the token data does not have an id, return a 401 Unauthorized response
    if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Find the user by the id in the token data
    const user = await User.findById(tokenData.id);
    // If the user is not found, return a 404 Not Found response
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Find the project by the id in the params
    const project = await Project.findById(params.id);
    // If the project is not found, return a 404 Not Found response
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    // Check if the user is an admin or the owner of the project
    const isAdmin = user.role === "admin";
    const isOwner = project.createdBy.equals(user._id);
    // If the user is not an admin or the owner, return a 403 Forbidden response
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Subscription plan check (same as in create route)
    // If the user is a worker and does not have a subscription plan, return a 403 Forbidden response
    if (user.role === "worker" && !user.subscriptionPlan) {
      return NextResponse.json({ message: "Worker cannot update projects" }, { status: 403 });
    // If the user is an admin and does not have a subscription plan, return a 403 Forbidden response
    } else if (["admin"].includes(user.role) && !user.subscriptionPlan) {
      return NextResponse.json({ message: "No active plan" }, { status: 403 });
    // If the user is an individual and does not have a subscription plan, return a 403 Forbidden response
    } else if (user.accountType === "individual" && !user.subscriptionPlan) {
      return NextResponse.json({ message: "No active plan" }, { status: 403 });
    }

    // Get the data from the request body
    const { name, description, assignedUsers, deadline, status } = await req.json();

    // Update the project with the new data
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        assignedUsers: assignedUsers || [],
        deadline,
        status,
      },
      { new: true }
    )
      // Populate the assignedUsers and createdBy fields
      .populate("assignedUsers", "name email role")
      .populate("createdBy", "name email");

    // Return a 200 OK response with the updated project
    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    // Log the error
    console.error("[PROJECT_UPDATE_ERROR]", error);
    // Return a 500 Internal Server Error response
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}