import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const TeacherCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Avatar */}
        <div className="flex items-start gap-3 p-4 pb-3">
          <Skeleton className="h-12 w-12 rounded-full border-2 border-background" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-4 pb-3 space-y-1.5">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-3 w-28" />
        </div>

        {/* Department */}
        <div className="px-4 pb-3">
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Subjects */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-4 w-18 rounded-full" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 p-3 pt-0 border-t mt-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCardSkeleton;
