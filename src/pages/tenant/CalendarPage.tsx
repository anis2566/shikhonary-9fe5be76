import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  FileText,
  Users,
  Clock,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addDays } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'exam' | 'class' | 'meeting' | 'deadline';
  batch?: string;
  subject?: string;
}

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Physics Weekly Test', date: new Date(2026, 1, 5), time: '10:00 AM', type: 'exam', batch: 'Class 10 - A', subject: 'Physics' },
  { id: '2', title: 'Math Final Exam', date: new Date(2026, 1, 10), time: '9:00 AM', type: 'exam', batch: 'Class 9', subject: 'Mathematics' },
  { id: '3', title: 'Parent-Teacher Meeting', date: new Date(2026, 1, 12), time: '4:00 PM', type: 'meeting' },
  { id: '4', title: 'Chemistry Lab', date: new Date(2026, 1, 5), time: '2:00 PM', type: 'class', batch: 'Class 11', subject: 'Chemistry' },
  { id: '5', title: 'Fee Collection Deadline', date: new Date(2026, 1, 15), time: '11:59 PM', type: 'deadline' },
  { id: '6', title: 'Biology Quiz', date: new Date(2026, 1, 18), time: '11:00 AM', type: 'exam', batch: 'Class 12', subject: 'Biology' },
  { id: '7', title: 'Sports Day', date: new Date(2026, 1, 20), time: '8:00 AM', type: 'meeting' },
  { id: '8', title: 'English Test', date: new Date(2026, 1, 2), time: '10:00 AM', type: 'exam', batch: 'Class 8', subject: 'English' },
];

const eventTypeConfig = {
  exam: { color: 'bg-primary', textColor: 'text-primary', icon: FileText, label: 'Exam' },
  class: { color: 'bg-accent', textColor: 'text-accent', icon: Users, label: 'Class' },
  meeting: { color: 'bg-secondary', textColor: 'text-secondary-foreground', icon: Users, label: 'Meeting' },
  deadline: { color: 'bg-destructive', textColor: 'text-destructive', icon: Clock, label: 'Deadline' },
};

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 2));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 1, 2));
  const [view, setView] = useState<'month' | 'week'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => isSameDay(event.date, date));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const navigatePrev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const goToToday = () => {
    const today = new Date(2026, 1, 2); // Using mock "today"
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-primary" />
            Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={navigatePrev}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg font-semibold min-w-[160px] text-center">
                  {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Week of' MMM d")}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={navigateNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'week')}>
                <TabsList className="h-8">
                  <TabsTrigger value="month" className="text-xs px-3 h-6">Month</TabsTrigger>
                  <TabsTrigger value="week" className="text-xs px-3 h-6">Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {view === 'month' ? (
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date(2026, 1, 2));

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "min-h-[80px] lg:min-h-[100px] p-1 rounded-lg border border-transparent transition-colors text-left",
                        isCurrentMonth ? 'bg-card' : 'bg-muted/30',
                        isSelected && 'border-primary bg-primary/5',
                        !isSelected && 'hover:bg-muted/50'
                      )}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1",
                        !isCurrentMonth && 'text-muted-foreground',
                        isToday && 'text-primary'
                      )}>
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 rounded-full",
                          isToday && 'bg-primary text-primary-foreground'
                        )}>
                          {format(day, 'd')}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-[10px] px-1 py-0.5 rounded truncate",
                              eventTypeConfig[event.type].color,
                              'text-white'
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-muted-foreground px-1">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date(2026, 1, 2));

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "min-h-[300px] p-2 rounded-lg border border-transparent transition-colors text-left",
                        'bg-card',
                        isSelected && 'border-primary bg-primary/5',
                        !isSelected && 'hover:bg-muted/50'
                      )}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-2 text-center",
                        isToday && 'text-primary'
                      )}>
                        <span className={cn(
                          "inline-flex items-center justify-center w-8 h-8 rounded-full",
                          isToday && 'bg-primary text-primary-foreground'
                        )}>
                          {format(day, 'd')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs p-1.5 rounded",
                              eventTypeConfig[event.type].color,
                              'text-white'
                            )}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-[10px] opacity-80">{event.time}</div>
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <div className="space-y-4">
          {/* Selected date info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No events scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => {
                    const config = eventTypeConfig[event.type];
                    const Icon = config.icon;
                    return (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('p-2 rounded-lg', `${config.color}/10`)}>
                            <Icon className={cn('w-4 h-4', config.textColor)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-[10px]">
                                {config.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{event.time}</span>
                            </div>
                            <p className="text-sm font-medium">{event.title}</p>
                            {event.batch && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.batch} • {event.subject}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event type legend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(eventTypeConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded', config.color)} />
                      <span className="text-xs text-muted-foreground">{config.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming events summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(eventTypeConfig).map(([key, config]) => {
                  const count = mockEvents.filter(
                    e => e.type === key && isSameMonth(e.date, currentDate)
                  ).length;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{config.label}s</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
