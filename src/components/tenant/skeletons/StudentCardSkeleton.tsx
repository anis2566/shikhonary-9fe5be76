import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StudentCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        {/* Header with Avatar */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-2 space-y-1">
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-3 space-y-1.5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCardSkeleton;
