// In: app/dashboard/members/MembersPageSkeleton.tsx
import { Skeleton } from "@/app/components/ui/custom-ui";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/ui/tabel";

export const MembersPageSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <Skeleton className="h-8 w-48 bg-neutral-800" />
      <Skeleton className="h-10 w-36 bg-neutral-800" />
    </div>
    <div className="flex flex-col md:flex-row gap-2 md:items-center p-2 bg-neutral-900/50 border border-neutral-800 rounded-lg">
      <Skeleton className="h-10 flex-grow bg-neutral-800" />
      <Skeleton className="h-10 w-48 bg-neutral-800" />
    </div>

    {/* Table Skeleton */}
    <div className="border border-neutral-800 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead><Skeleton className="h-4 w-32 bg-neutral-800" /></TableHead>
            <TableHead><Skeleton className="h-4 w-24 bg-neutral-800" /></TableHead>
            <TableHead><Skeleton className="h-4 w-24 bg-neutral-800" /></TableHead>
            <TableHead><Skeleton className="h-4 w-32 bg-neutral-800" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16 bg-neutral-800" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-neutral-800 hover:bg-transparent">
              <TableCell><div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full bg-neutral-800" /><div className="space-y-1.5"><Skeleton className="h-4 w-32 bg-neutral-800" /><Skeleton className="h-3 w-48 bg-neutral-800" /></div></div></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full bg-neutral-800" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24 rounded-full bg-neutral-800" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28 bg-neutral-800" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8 bg-neutral-800" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);