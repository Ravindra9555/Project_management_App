// app/api/project/[id]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import { getTokenData } from "@/helpers/getTokenData";
import Project from "@/app/models/Project";
import User from "@/app/models/User";

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

 export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const tokenData = await getTokenData(req);
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


export async function PUT(req:Request, {params} : {params: {id: string }}) {
    try {
        await dbConnect();
        const tokenData = await getTokenData(req);
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
        const { name, description, assignedUsers, deadline } = await req.json();
        const updatedProject = await Project.findByIdAndUpdate(
            params.id,
            { name, description, assignedUsers, deadline },
            { new: true }
        ).populate("assignedUsers", "name email role")
         .populate("createdBy", "name email");
        return NextResponse.json({ message: "Project updated successfully", project: updatedProject }, { status: 200 });
        
    } catch (error) {
        console.error("[PROJECT_UPDATE_ERROR]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        
    }
    
}