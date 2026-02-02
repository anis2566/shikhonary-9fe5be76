import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  TrendingUp,
  Users,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodayHighlight {
  id: string;
  type: 'exam' | 'attendance' | 'result' | 'deadline';
  title: string;
  subtitle: string;
  time?: string;
  status: 'urgent' | 'warning' | 'success' | 'info';
}

const todayHighlights: TodayHighlight[] = [
  {
    id: '1',
    type: 'exam',
    title: 'Physics Weekly Test',
    subtitle: 'Class 10 - Morning Batch',
    time: '10:00 AM',
    status: 'info',
  },
  {
    id: '2',
    type: 'attendance',
    title: '5 students absent',
    subtitle: 'Class 9 - Evening Batch',
    status: 'warning',
  },
  {
    id: '3',
    type: 'result',
    title: 'Math Quiz results ready',
    subtitle: '23 students completed',
    status: 'success',
  },
  {
    id: '4',
    type: 'deadline',
    title: 'Fee collection deadline',
    subtitle: '12 pending payments',
    time: 'Today',
    status: 'urgent',
  },
];

const upcomingEvents = [
  { id: '1', title: 'Parent-Teacher Meeting', date: 'Tomorrow', time: '4:00 PM' },
  { id: '2', title: 'Half-Yearly Exams Start', date: 'Feb 10', time: '9:00 AM' },
  { id: '3', title: 'Sports Day', date: 'Feb 15', time: '8:00 AM' },
];

const getStatusStyles = (status: TodayHighlight['status']) => {
  switch (status) {
    case 'urgent':
      return {
        bg: 'bg-destructive/10',
        text: 'text-destructive',
        icon: AlertTriangle,
      };
    case 'warning':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600',
        icon: AlertTriangle,
      };
    case 'success':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600',
        icon: CheckCircle2,
      };
    case 'info':
    default:
      return {
        bg: 'bg-primary/10',
        text: 'text-primary',
        icon: Clock,
      };
  }
};

const getTypeIcon = (type: TodayHighlight['type']) => {
  switch (type) {
    case 'exam':
      return FileText;
    case 'attendance':
      return Users;
    case 'result':
      return TrendingUp;
    case 'deadline':
      return CalendarDays;
  }
};

// Today's Highlights Widget
export const TodayHighlightsWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Today's Highlights
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {todayHighlights.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {todayHighlights.map((item) => {
          const styles = getStatusStyles(item.status);
          const TypeIcon = getTypeIcon(item.type);
          
          return (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
                'hover:bg-muted/50',
                styles.bg
              )}
            >
              <div className={cn('p-2 rounded-lg', styles.bg)}>
                <TypeIcon className={cn('w-4 h-4', styles.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
              {item.time && (
                <span className={cn('text-xs font-medium', styles.text)}>
                  {item.time}
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

// Attendance Summary Widget
export const AttendanceSummaryWidget: React.FC = () => {
  const presentCount = 245;
  const absentCount = 18;
  const totalCount = presentCount + absentCount;
  const presentPercentage = Math.round((presentCount / totalCount) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Today's Attendance
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
            <Link to="/tenant/attendance">
              View all <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-primary">{presentPercentage}%</p>
            <p className="text-xs text-muted-foreground">Overall attendance</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Present:</span>
              <span className="font-medium">{presentCount}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Absent:</span>
              <span className="font-medium">{absentCount}</span>
            </div>
          </div>
        </div>
        <Progress value={presentPercentage} className="h-2" />
        
        {/* Batch-wise summary */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Morning Batch</p>
            <p className="text-sm font-medium">96% present</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Evening Batch</p>
            <p className="text-sm font-medium">89% present</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Upcoming Events Widget
export const UpcomingEventsWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Upcoming Events
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            + Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {upcomingEvents.map((event, index) => (
          <div
            key={event.id}
            className={cn(
              'flex items-center gap-3 pb-3',
              index < upcomingEvents.length - 1 && 'border-b border-border'
            )}
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
              <span className="text-xs text-primary font-medium">
                {event.date.split(' ')[0]}
              </span>
              {event.date.split(' ')[1] && (
                <span className="text-[10px] text-muted-foreground">
                  {event.date.split(' ')[1]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.title}</p>
              <p className="text-xs text-muted-foreground">{event.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Quick Metrics Widget (Mobile-optimized)
export const QuickMetricsWidget: React.FC = () => {
  const metrics = [
    { label: 'Pass Rate', value: 85, color: 'primary' },
    { label: 'Attendance', value: 93, color: 'accent' },
    { label: 'Completion', value: 72, color: 'secondary' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Quick Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-medium">{metric.value}%</span>
            </div>
            <Progress 
              value={metric.value} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Export all widgets
export {
  todayHighlights,
  upcomingEvents,
};
