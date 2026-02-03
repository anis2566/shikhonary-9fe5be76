import React from 'react';
import { CalendarDays, CalendarRange, GraduationCap, ClipboardCheck, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { examTypes } from '@/lib/exam-scheduling-utils';

interface StepBasicInfoProps {
  data: {
    title: string;
    description: string;
    type: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'calendar-days': CalendarDays,
  'calendar-range': CalendarRange,
  'graduation-cap': GraduationCap,
  'clipboard-check': ClipboardCheck,
  'book-open': BookOpen,
};

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Enter the exam title and select the type of examination
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Exam Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., Weekly Physics Test - Chapter 5"
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            className={cn(errors.title && 'border-destructive')}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the exam content..."
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label>
            Exam Type <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {examTypes.map((type) => {
              const Icon = iconMap[type.icon];
              const isSelected = data.type === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onChange('type', type.value)}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg shrink-0',
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {type.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;
