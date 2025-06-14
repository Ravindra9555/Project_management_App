// In: app/dashboard/projects/[projectId]/tasks/components/KanbanColumn.tsx
"use client";

import { useMemo } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import { Task, TaskStatus, statusConfig } from "./types";
import { DraggableTaskCard } from "./TaskCard";

export const KanbanColumn = ({ status, tasks, onClickTask }: {
  status: TaskStatus;
  tasks: Task[];
  onClickTask: (task: Task) => void;
}) => {
  const taskIds = useMemo(() => tasks.map((t) => t._id), [tasks]);
  
  // FIX: Make the column a droppable container with its status as the ID
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className={`p-4 rounded-lg border-t-4 ${statusConfig[status].color}`}>
      <div className="flex items-center gap-2 mb-4">
        {statusConfig[status].icon}
        <h2 className="font-semibold text-lg">{statusConfig[status].label}</h2>
        <span className="text-sm font-mono bg-neutral-700 text-neutral-300 rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      <div className="space-y-4">
        <SortableContext items={taskIds}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <DraggableTaskCard key={task._id} task={task} onClick={() => onClickTask(task)} />
            ))
          ) : (
            <div className="text-center py-10 text-neutral-600 border-2 border-dashed border-neutral-800 rounded-lg flex items-center justify-center h-24">
              Drop tasks here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};