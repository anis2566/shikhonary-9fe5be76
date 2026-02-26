import React, { useState } from 'react';
import {
  Check,
  X,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { mockTeachers } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';

const weeklyData = [
  { day: 'Mon', present: 18, absent: 2 },
  { day: 'Tue', present: 19, absent: 1 },
  { day: 'Wed', present: 17, absent: 3 },
  { day: 'Thu', present: 20, absent: 0 },
  { day: 'Fri', present: 16, absent: 4 },
  { day: 'Sat', present: 15, absent: 5 },
];

const departments = ['All', 'Science', 'Mathematics', 'English', 'Social Studies', 'Languages'];

const TeacherAttendancePage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');

  const attendanceGrid = mockTeachers.map((t) => ({
    ...t,
    attendance: {
      mon: Math.random() > 0.1 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late',
      tue: Math.random() > 0.05 ? 'present' : 'absent',
      wed: Math.random() > 0.15 ? 'present' : Math.random() > 0.5 ? 'absent' : 'excused',
      thu: Math.random() > 0.05 ? 'present' : 'absent',
      fri: Math.random() > 0.1 ? 'present' : 'late',
      sat: Math.random() > 0.2 ? 'present' : 'absent',
    },
    attendanceRate: Math.round(85 + Math.random() * 12),
  }));

  const stats = {
    totalPresent: 18,
    totalAbsent: 1,
    totalLate: 1,
    averageRate: 92.3,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <Check className="w-4 h-4 text-green-600" />;
      case 'absent': return <X className="w-4 h-4 text-destructive" />;
      case 'late': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'excused': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/10';
      case 'absent': return 'bg-destructive/10';
      case 'late': return 'bg-amber-500/10';
      case 'excused': return 'bg-blue-500/10';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Teacher Attendance</h1>
          <p className="text-muted-foreground mt-1">Track and manage teacher attendance records</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600"><Check className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPresent}</p>
                <p className="text-xs text-muted-foreground">Present Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive"><X className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.totalAbsent}</p>
                <p className="text-xs text-muted-foreground">Absent Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><Clock className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.totalLate}</p>
                <p className="text-xs text-muted-foreground">Late Arrivals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><UserCheck className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.averageRate}%</p>
                <p className="text-xs text-muted-foreground">Avg. Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Dept summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Overview</CardTitle>
            <CardDescription>Teacher attendance distribution this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="present" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary" /><span className="text-xs text-muted-foreground">Present</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-destructive" /><span className="text-xs text-muted-foreground">Absent</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Department Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Science', 'Mathematics', 'English', 'Languages'].map((dept) => {
              const rate = Math.round(85 + Math.random() * 12);
              return (
                <div key={dept} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{dept}</span>
                    <span className="font-medium">{rate}%</span>
                  </div>
                  <Progress
                    value={rate}
                    className={cn(
                      'h-2',
                      rate >= 90 && '[&>div]:bg-green-500',
                      rate >= 75 && rate < 90 && '[&>div]:bg-amber-500',
                      rate < 75 && '[&>div]:bg-destructive'
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Weekly Teacher Attendance</CardTitle>
              <CardDescription>Week of January 20 - 25, 2024</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm">This Week</Button>
              <Button variant="outline" size="icon"><ChevronRight className="w-4 h-4" /></Button>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All Departments" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Teacher</TableHead>
                  <TableHead className="text-center w-16">Mon</TableHead>
                  <TableHead className="text-center w-16">Tue</TableHead>
                  <TableHead className="text-center w-16">Wed</TableHead>
                  <TableHead className="text-center w-16">Thu</TableHead>
                  <TableHead className="text-center w-16">Fri</TableHead>
                  <TableHead className="text-center w-16">Sat</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceGrid.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {teacher.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">{teacher.subjectNames?.[0] || 'N/A'} • {teacher.department || 'General'}</p>
                        </div>
                      </div>
                    </TableCell>
                    {Object.entries(teacher.attendance).map(([day, status]) => (
                      <TableCell key={day} className="text-center">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mx-auto', getStatusBg(status))}>
                          {getStatusIcon(status)}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Badge variant={teacher.attendanceRate >= 90 ? 'default' : 'secondary'} className="text-xs">
                        {teacher.attendanceRate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-green-600" /></div><span className="text-sm text-muted-foreground">Present</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-destructive/10 flex items-center justify-center"><X className="w-3.5 h-3.5 text-destructive" /></div><span className="text-sm text-muted-foreground">Absent</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center"><Clock className="w-3.5 h-3.5 text-amber-500" /></div><span className="text-sm text-muted-foreground">Late</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center"><AlertCircle className="w-3.5 h-3.5 text-blue-500" /></div><span className="text-sm text-muted-foreground">Excused</span></div>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;
