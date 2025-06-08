import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import Task from "@/models/Task";

export async function GET(
  request: NextRequest,
  
) {
  await dbConnect();
 
  const projectId  = request.nextUrl.searchParams.get("projectId");

  try {
    const tasks = await Task.find({ projectId })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("projectId", "title");

    return NextResponse.json(
      { success: true, data: tasks },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks by project ID:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching tasks", error },
      { status: 500 }
    );
  }
}