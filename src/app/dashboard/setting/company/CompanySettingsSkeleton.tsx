// In: app/dashboard/settings/company/CompanySettingsSkeleton.tsx
import { Skeleton } from "@/app/components/ui/custom-ui";
import { Card, CardContent, CardHeader, CardFooter } from "@/app/components/ui/card";

export const CompanySettingsSkeleton = () => (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="space-y-2 mb-8">
            <Skeleton className="h-8 w-48 bg-neutral-800" />
            <Skeleton className="h-4 w-72 bg-neutral-800" />
        </div>
        
        <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
                <Skeleton className="h-5 w-32 bg-neutral-800" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-20 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                </div>
                <div className="space-y-2"><Skeleton className="h-4 w-20 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-20 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                </div>
            </CardContent>
            <CardFooter className="border-t border-neutral-800 px-6 py-4 flex justify-end">
                <Skeleton className="h-10 w-32 bg-neutral-800" />
            </CardFooter>
        </Card>
    </div>
);