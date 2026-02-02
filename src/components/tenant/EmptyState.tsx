import React from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  Search, 
  Inbox, 
  Bell,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Plus,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateType = 
  | 'students' 
  | 'teachers' 
  | 'exams' 
  | 'batches' 
  | 'search' 
  | 'notifications' 
  | 'results' 
  | 'attendance' 
  | 'analytics'
  | 'generic';

interface EmptyStateConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    icon?: React.ElementType;
  };
  secondaryAction?: {
    label: string;
    icon?: React.ElementType;
  };
  illustration?: React.ReactNode;
}

const emptyStateConfigs: Record<EmptyStateType, EmptyStateConfig> = {
  students: {
    icon: GraduationCap,
    title: 'No students yet',
    description: 'Start building your academy by adding your first student. You can add them individually or import in bulk.',
    primaryAction: { label: 'Add Student', icon: Plus },
    secondaryAction: { label: 'Import CSV', icon: Upload },
  },
  teachers: {
    icon: Users,
    title: 'No teachers added',
    description: 'Add teachers to assign them to batches and manage your classes effectively.',
    primaryAction: { label: 'Add Teacher', icon: Plus },
    secondaryAction: { label: 'Invite via Email', icon: Upload },
  },
  exams: {
    icon: FileText,
    title: 'No exams created',
    description: 'Create your first exam to start assessing your students. You can choose from various exam types.',
    primaryAction: { label: 'Create Exam', icon: Plus },
  },
  batches: {
    icon: Users,
    title: 'No batches created',
    description: 'Organize your students into batches for better class management and scheduling.',
    primaryAction: { label: 'Create Batch', icon: Plus },
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'We couldn\'t find anything matching your search. Try adjusting your filters or search terms.',
    secondaryAction: { label: 'Clear Filters', icon: RefreshCw },
  },
  notifications: {
    icon: Bell,
    title: 'All caught up!',
    description: 'You have no new notifications. We\'ll let you know when something important happens.',
  },
  results: {
    icon: ClipboardList,
    title: 'No results available',
    description: 'Results will appear here once exams are completed and graded.',
  },
  attendance: {
    icon: Calendar,
    title: 'No attendance records',
    description: 'Start tracking attendance for your batches. Records will appear here.',
    primaryAction: { label: 'Mark Attendance', icon: Plus },
  },
  analytics: {
    icon: BarChart3,
    title: 'No data to analyze',
    description: 'Analytics will be available once you have enough exam and attendance data.',
  },
  generic: {
    icon: Inbox,
    title: 'Nothing here yet',
    description: 'This section is empty. Start adding content to see it here.',
    primaryAction: { label: 'Get Started', icon: Plus },
  },
};

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  className?: string;
  compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
  className,
  compact = false,
}) => {
  const config = emptyStateConfigs[type];
  const Icon = config.icon;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const primaryLabel = primaryActionLabel || config.primaryAction?.label;
  const secondaryLabel = secondaryActionLabel || config.secondaryAction?.label;
  const PrimaryIcon = config.primaryAction?.icon;
  const SecondaryIcon = config.secondaryAction?.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      {/* Illustrated Icon */}
      <div className={cn(
        "relative mb-4",
        compact ? "w-16 h-16" : "w-24 h-24"
      )}>
        {/* Background decorative circles */}
        <div className={cn(
          "absolute inset-0 rounded-full bg-primary/5",
          "animate-pulse"
        )} />
        <div className={cn(
          "absolute rounded-full bg-primary/10",
          compact ? "inset-2" : "inset-4"
        )} />
        
        {/* Main icon container */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          compact ? "scale-75" : ""
        )}>
          <div className={cn(
            "rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center",
            compact ? "w-12 h-12" : "w-16 h-16"
          )}>
            <Icon className={cn(
              "text-primary",
              compact ? "w-6 h-6" : "w-8 h-8"
            )} />
          </div>
        </div>

        {/* Decorative elements */}
        {!compact && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent/40" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-primary/30" />
            <div className="absolute top-1/2 -right-3 w-2 h-2 rounded-full bg-accent/50" />
          </>
        )}
      </div>

      {/* Text content */}
      <h3 className={cn(
        "font-semibold text-foreground mb-2",
        compact ? "text-base" : "text-xl"
      )}>
        {displayTitle}
      </h3>
      <p className={cn(
        "text-muted-foreground max-w-sm",
        compact ? "text-xs" : "text-sm"
      )}>
        {displayDescription}
      </p>

      {/* Actions */}
      {(onPrimaryAction || onSecondaryAction) && (
        <div className={cn(
          "flex flex-col sm:flex-row items-center gap-2",
          compact ? "mt-4" : "mt-6"
        )}>
          {onPrimaryAction && primaryLabel && (
            <Button 
              onClick={onPrimaryAction}
              size={compact ? "sm" : "default"}
            >
              {PrimaryIcon && <PrimaryIcon className="w-4 h-4 mr-2" />}
              {primaryLabel}
            </Button>
          )}
          {onSecondaryAction && secondaryLabel && (
            <Button 
              variant="outline" 
              onClick={onSecondaryAction}
              size={compact ? "sm" : "default"}
            >
              {SecondaryIcon && <SecondaryIcon className="w-4 h-4 mr-2" />}
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
