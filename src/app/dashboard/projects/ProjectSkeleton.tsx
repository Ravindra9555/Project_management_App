// app/dashboard/projects/ProjectSkeleton.tsx
import { Skeleton } from "@/app/components/ui/custom-ui";
import { Card, CardHeader, CardContent, CardFooter } from "@/app/components/ui/card";

const CardSkeleton = () => (
  <Card className="flex flex-col bg-neutral-900 border-neutral-800">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 bg-neutral-800" />
      <Skeleton className="h-4 w-full mt-2 bg-neutral-800" />
    </CardHeader>
    <CardContent className="flex-grow space-y-4">
      <div>
        <Skeleton className="h-2 w-full rounded-full bg-neutral-800" />
      </div>
      <div className="flex -space-x-2">
        <Skeleton className="h-10 w-10 rounded-full bg-neutral-800" />
        <Skeleton className="h-10 w-10 rounded-full bg-neutral-800" />
        <Skeleton className="h-10 w-10 rounded-full bg-neutral-800" />
      </div>
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <Skeleton className="h-6 w-24 rounded-full bg-neutral-800" />
      <Skeleton className="h-4 w-32 bg-neutral-800" />
    </CardFooter>
  </Card>
);

export const ProjectsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};