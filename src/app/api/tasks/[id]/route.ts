import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import { dbConnect } from "@/app/config/dbConfig";

interface progressLogs {
  message: string;
  status: string;
  updatedAt: Date;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const updateData = await request.json();

    // Convert dates if present
    if (updateData.eta) updateData.eta = new Date(updateData.eta);
    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);

    // Handle progressLogs format if provided
    if (Array.isArray(updateData.progressLogs)) {
      updateData.progressLogs = updateData?.progressLogs?.map((log: progressLogs) => ({
        message: log.message || "",
        status: log.status || "todo",
        updatedAt: log.updatedAt ? new Date(log.updatedAt) : new Date(),
      }));
    }

    if (Array.isArray(updateData.assignedTo)) {
      updateData.assignedTo = updateData?.assignedTo?.map((id: string) => {
        return id;
      });
    }
    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise< { id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
