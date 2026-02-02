import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ExamCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between bg-muted/50">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <div className="p-4">
          {/* Title and Description */}
          <div className="mb-3 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center p-2 bg-muted/50 rounded-lg space-y-1">
                <Skeleton className="h-5 w-8 mx-auto" />
                <Skeleton className="h-2 w-12 mx-auto" />
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Question breakdown */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamCardSkeleton;
