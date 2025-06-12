// In: app/dashboard/projects/[projectId]/tasks/TaskPageSkeleton.tsx
import { Skeleton } from "@/app/components/ui/custom-ui";

const TaskCardSkeleton = () => (
  <div className="p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg space-y-3">
    <Skeleton className="h-5 w-3/4 bg-neutral-700" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-16 rounded-full bg-neutral-700" />
      <div className="flex -space-x-2">
        <Skeleton className="h-6 w-6 rounded-full bg-neutral-700" />
      </div>
    </div>
  </div>
);

export const TaskPageSkeleton = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-neutral-800" />
          <Skeleton className="h-4 w-48 bg-neutral-800" />
        </div>
        <Skeleton className="h-10 w-32 bg-neutral-800" />
      </div>

      {/* Kanban Board Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['To Do', 'In Progress', 'Done'].map(title => (
          <div key={title} className="bg-neutral-900 p-4 rounded-lg">
            <Skeleton className="h-6 w-1/2 mb-4 bg-neutral-800" />
            <div className="space-y-4">
              <TaskCardSkeleton />
              <TaskCardSkeleton />
              <TaskCardSkeleton />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};