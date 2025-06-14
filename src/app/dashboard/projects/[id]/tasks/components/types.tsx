// In: app/dashboard/projects/[projectId]/tasks/components/types.ts
import { Flag, GripVertical, CheckCircle } from "lucide-react";

// --- TYPE DEFINITIONS ---
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ProjectUser = { _id: string; name: string; email: string; role: string };
export type ProjectDetails = { _id: string; name: string; description: string; assignedUsers: ProjectUser[]; };
export type RawTask = Omit<Task, 'assignedTo'> & { assignedTo: string[] };
export type Task = { _id: string; title: string; description: string; assignedTo: { _id: string; name: string; email: string }[]; priority: TaskPriority; status: TaskStatus; dueDate: string; };

// --- CONFIGURATION OBJECTS ---
export const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: React.ReactNode }> = {
  low: { label: "Low", color: "text-gray-400", icon: <Flag className="h-4 w-4" /> },
  medium: { label: "Medium", color: "text-yellow-400", icon: <Flag className="h-4 w-4" /> },
  high: { label: "High", color: "text-red-400", icon: <Flag className="h-4 w-4" /> },
};
export const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  todo: { label: "To Do", color: "border-neutral-700 bg-neutral-800", icon: <GripVertical className="h-5 w-5 text-neutral-400"/> },
  "in-progress": { label: "In Progress", color: "border-blue-700 bg-blue-950", icon: <div className="h-4 w-4 rounded-full border-2 border-blue-400" /> },
  done: { label: "Done", color: "border-emerald-700 bg-emerald-950", icon: <CheckCircle className="h-5 w-5 text-emerald-400"/> },
};