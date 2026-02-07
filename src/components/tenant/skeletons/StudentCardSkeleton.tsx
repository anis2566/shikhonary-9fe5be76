import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StudentCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      {/* Status Bar Skeleton */}
      <Skeleton className="h-1 w-full rounded-none" />

      <CardContent className="p-4">
        {/* Header with Avatar */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-14 w-14 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>

        {/* Academic Info Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Info Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-2.5 space-y-1.5">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-3.5 w-36" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <div className="flex items-start gap-2">
            <Skeleton className="h-6 w-6 rounded-md shrink-0" />
            <Skeleton className="h-8 flex-1 rounded-md" />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCardSkeleton;
