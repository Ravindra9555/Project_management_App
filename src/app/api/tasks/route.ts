import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import { dbConnect } from "@/app/config/dbConfig";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const rawData = await request.json();

    const {
      title,
      description,
      eta,
      dueDate,
      projectId,
      createdBy,
      assignedTo,
      priority,
      status,
      audioNoteUrl,
      progressLogs
    } = rawData;

    // Basic validation
    if (!title || !projectId || !createdBy) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: title, projectId, createdBy" },
        { status: 400 }
      );
    }

    // Optional: Validate progressLogs if provided
    const validStatuses = ["todo", "in-progress", "review", "done"];
    const formattedLogs = Array.isArray(progressLogs)
      ? progressLogs.map((log) => ({
          message: log.message || "",
          status: validStatuses.includes(log.status) ? log.status : "todo",
          updatedAt: log.updatedAt ? new Date(log.updatedAt) : new Date(),
        }))
      : [];

    const task = await Task.create({
      title,
      description,
      eta: eta ? new Date(eta) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      createdBy,
      assignedTo,
      priority: priority || "medium",
      status: status || "todo",
      audioNoteUrl,
      progressLogs: formattedLogs,
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });

  } catch (err) {
    console.error("Task creation error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: err },
      { status: 500 }
    );
  }
}

