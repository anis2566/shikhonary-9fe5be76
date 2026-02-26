import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { mockTimetables, type DayOfWeek, type TimetableSlot } from '@/lib/tenant-mock-data';

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const slotTypeColors: Record<string, string> = {
  CLASS: 'bg-primary/10 border-primary/30 text-primary',
  BREAK: 'bg-muted border-muted-foreground/20 text-muted-foreground',
  LAB: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
  ASSEMBLY: 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
};

const TimetablePage: React.FC = () => {
  const [selectedTimetable, setSelectedTimetable] = useState(mockTimetables[0]?.id || '');

  const timetable = useMemo(
    () => mockTimetables.find((t) => t.id === selectedTimetable),
    [selectedTimetable],
  );

  const slotsByDay = useMemo(() => {
    if (!timetable) return {};
    const map: Record<string, TimetableSlot[]> = {};
    for (const day of DAYS) {
      map[day] = timetable.slots
        .filter((s) => s.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [timetable]);

  const uniqueTimes = useMemo(() => {
    if (!timetable) return [];
    const times = new Set<string>();
    timetable.slots.forEach((s) => times.add(`${s.startTime}-${s.endTime}`));
    return Array.from(times).sort();
  }, [timetable]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timetable / Routine</h1>
          <p className="text-muted-foreground text-sm">Weekly class schedule overview</p>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" /> Select Timetable:
          </div>
          <Select value={selectedTimetable} onValueChange={setSelectedTimetable}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="Select timetable" />
            </SelectTrigger>
            <SelectContent>
              {mockTimetables.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {timetable && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{timetable.className}</Badge>
              <Badge variant="outline">{timetable.batchName}</Badge>
              <Badge variant="secondary">{timetable.academicYear}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      {timetable && timetable.slots.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase w-24">Time</th>
                  {DAYS.map((day) => (
                    <th key={day} className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueTimes.map((timeRange, idx) => {
                  const [start, end] = timeRange.split('-');
                  return (
                    <motion.tr
                      key={timeRange}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b last:border-0"
                    >
                      <td className="p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {start} – {end}
                        </div>
                      </td>
                      {DAYS.map((day) => {
                        const slot = slotsByDay[day]?.find(
                          (s) => s.startTime === start && s.endTime === end,
                        );
                        if (!slot) {
                          return <td key={day} className="p-2"><div className="h-16" /></td>;
                        }
                        return (
                          <td key={day} className="p-2">
                            <div className={cn(
                              'rounded-lg border p-2 h-16 flex flex-col justify-center text-center transition-colors',
                              slotTypeColors[slot.type] || slotTypeColors.CLASS,
                            )}>
                              <p className="text-xs font-semibold truncate">{slot.subjectName}</p>
                              {slot.type !== 'BREAK' && (
                                <>
                                  <p className="text-[10px] opacity-75 truncate">{slot.teacherName}</p>
                                  {slot.room && <p className="text-[10px] opacity-60">{slot.room}</p>}
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            {timetable ? 'No slots configured for this timetable.' : 'Select a timetable to view the schedule.'}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" /> Class</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" /> Lab</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-muted border border-muted-foreground/20" /> Break</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/30" /> Assembly</div>
      </div>
    </div>
  );
};

export default TimetablePage;
