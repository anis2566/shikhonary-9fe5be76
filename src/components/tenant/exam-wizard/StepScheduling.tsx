import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  generateTimeSlots,
  durationPresets,
  ScheduleConflict,
} from '@/lib/exam-scheduling-utils';

interface StepSchedulingProps {
  data: {
    startDate?: Date;
    startTime: string;
    duration: number;
  };
  conflicts: ScheduleConflict[];
  errors: Record<string, string>;
  onChange: (field: string, value: Date | string | number) => void;
}

const timeSlots = generateTimeSlots();

const StepScheduling: React.FC<StepSchedulingProps> = ({
  data,
  conflicts,
  errors,
  onChange,
}) => {
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const calculateEndTime = () => {
    if (!data.startDate || !data.startTime) return null;

    const [hours, minutes] = data.startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + data.duration;

    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    const period = endHours >= 12 ? 'PM' : 'AM';
    const displayHour = endHours > 12 ? endHours - 12 : endHours === 0 ? 12 : endHours;

    return `${displayHour}:${endMins.toString().padStart(2, '0')} ${period}`;
  };

  const endTime = calculateEndTime();

  const errorConflicts = conflicts.filter((c) => c.severity === 'error');
  const warningConflicts = conflicts.filter((c) => c.severity === 'warning');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Schedule Exam</h2>
        <p className="text-sm text-muted-foreground">
          Set the date, time, and duration for the examination
        </p>
      </div>

      {/* Conflict Alerts */}
      {errorConflicts.length > 0 && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-destructive">Scheduling Conflicts</p>
              {errorConflicts.map((conflict, idx) => (
                <p key={idx} className="text-sm text-destructive/80">
                  {conflict.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {warningConflicts.length > 0 && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-amber-600">Warnings</p>
              {warningConflicts.map((conflict, idx) => (
                <p key={idx} className="text-sm text-amber-600/80">
                  {conflict.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Picker */}
        <div className="space-y-2">
          <Label>
            Exam Date <span className="text-destructive">*</span>
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !data.startDate && 'text-muted-foreground',
                  errors.startDate && 'border-destructive'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? (
                  format(data.startDate, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => {
                  onChange('startDate', date as Date);
                  setCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate}</p>
          )}
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <Label>
            Start Time <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.startTime}
            onValueChange={(value) => onChange('startTime', value)}
          >
            <SelectTrigger
              className={cn(errors.startTime && 'border-destructive')}
            >
              <SelectValue placeholder="Select time">
                {data.startTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {timeSlots.find((s) => s.value === data.startTime)?.label}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot.value} value={slot.value}>
                  {slot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.startTime && (
            <p className="text-sm text-destructive">{errors.startTime}</p>
          )}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <Label>
          Duration <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {durationPresets.map((preset) => (
            <Button
              key={preset.value}
              type="button"
              variant={data.duration === preset.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange('duration', preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Custom:</span>
          <input
            type="number"
            min="10"
            max="480"
            value={data.duration}
            onChange={(e) => onChange('duration', parseInt(e.target.value) || 60)}
            className="w-20 h-9 px-3 rounded-md border border-input bg-background text-sm"
          />
          <span className="text-sm text-muted-foreground">minutes</span>
        </div>
        {errors.duration && (
          <p className="text-sm text-destructive">{errors.duration}</p>
        )}
      </div>

      {/* Summary Card */}
      {data.startDate && data.startTime && (
        <div className="p-4 rounded-lg bg-muted/50 border">
          <p className="font-medium mb-2">Exam Schedule Summary</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{format(data.startDate, 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Time</p>
              <p className="font-medium">
                {timeSlots.find((s) => s.value === data.startTime)?.label}
                {endTime && ` - ${endTime}`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{data.duration} minutes</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                Pending
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepScheduling;
