// In: app/dashboard/projects/[projectId]/tasks/components/TaskCard.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {  differenceInDays, parseISO } from "date-fns";
import { Calendar } from "lucide-react";

import { AnimatedTooltip } from "@/app/components/ui/animated-tooltip.tsx";
import { Task, priorityConfig } from "./types";

// The visual card component
export const TaskCard = ({ task, isOverlay = false }: { task: Task, isOverlay?: boolean }) => {
    const dueDate = parseISO(task.dueDate);
    const daysLeft = differenceInDays(dueDate, new Date());
    const deadlineText = daysLeft < 0 ? "Overdue" : daysLeft === 0 ? "Today" : `${daysLeft}d left`;
    const deadlineColor = daysLeft < 1 ? "text-red-400" : daysLeft < 7 ? "text-yellow-400" : "text-neutral-400";
    
    return (
        <div className={`p-4 bg-neutral-800/80 border border-neutral-700 rounded-lg ${isOverlay ? "shadow-2xl" : ""}`}>
            <h4 className="font-semibold text-neutral-100">{task.title}</h4>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-4 text-sm">
                    <span className={`flex items-center gap-1.5 ${priorityConfig[task.priority].color}`}>{priorityConfig[task.priority].icon}{priorityConfig[task.priority].label}</span>
                    <span className={`flex items-center gap-1.5 ${deadlineColor}`}><Calendar className="h-4 w-4"/> {deadlineText}</span>
                </div>
                <div className="flex -space-x-2">
                    <AnimatedTooltip items={task.assignedTo.map(user => ({ id: user._id, name: user.name, email: user.email, image: "" }))} />
                </div>
            </div>
        </div>
    );
};

// The draggable wrapper
export const DraggableTaskCard = ({ task, onClick }: { task: Task; onClick: () => void; }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id, data: { type: 'Task', task }});
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={isDragging ? 'opacity-50' : ''}>
      <button onClick={onClick} className="w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg">
        <TaskCard task={task} />
      </button>
    </div>
  );
};