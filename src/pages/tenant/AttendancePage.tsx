import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mockBatches, mockStudents, attendanceData } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';

const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock attendance data for the grid
  const attendanceGrid = mockStudents.slice(0, 8).map((student) => ({
    ...student,
    attendance: {
      mon: Math.random() > 0.15 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late',
      tue: Math.random() > 0.1 ? 'present' : 'absent',
      wed: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'absent' : 'excused',
      thu: Math.random() > 0.1 ? 'present' : 'absent',
      fri: Math.random() > 0.15 ? 'present' : 'late',
      sat: Math.random() > 0.25 ? 'present' : 'absent',
    },
    attendanceRate: Math.round(75 + Math.random() * 20),
  }));

  const stats = {
    totalPresent: 142,
    totalAbsent: 14,
    totalLate: 8,
    averageRate: 87.5,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <X className="w-4 h-4 text-destructive" />;
      case 'late':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'excused':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/10';
      case 'absent':
        return 'bg-destructive/10';
      case 'late':
        return 'bg-amber-500/10';
      case 'excused':
        return 'bg-blue-500/10';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage student attendance records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => navigate('/tenant/mark-attendance')}>
            <Calendar className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <Check className="w-5 h-5" />
              </div>
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
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                <X className="w-5 h-5" />
              </div>
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
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
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
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageRate}%</p>
                <p className="text-xs text-muted-foreground">Avg. Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Overview</CardTitle>
            <CardDescription>Attendance distribution this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="present" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-xs text-muted-foreground">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-destructive" />
                <span className="text-xs text-muted-foreground">Absent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Batch Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockBatches.slice(0, 4).map((batch) => {
              const rate = Math.round(80 + Math.random() * 15);
              return (
                <div key={batch.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{batch.name}</span>
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

      {/* Attendance Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Weekly Attendance</CardTitle>
              <CardDescription>Week of January 20 - 25, 2024</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                This Week
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {mockBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
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
                  <TableHead className="min-w-[200px]">Student</TableHead>
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
                {attendanceGrid.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {student.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.className} • {student.batchName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {Object.entries(student.attendance).map(([day, status]) => (
                      <TableCell key={day} className="text-center">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center mx-auto',
                            getStatusBg(status)
                          )}
                        >
                          {getStatusIcon(status)}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Badge
                        variant={student.attendanceRate >= 85 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {student.attendanceRate}%
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
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-green-600" />
          </div>
          <span className="text-sm text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-destructive/10 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-destructive" />
          </div>
          <span className="text-sm text-muted-foreground">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <span className="text-sm text-muted-foreground">Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="text-sm text-muted-foreground">Excused</span>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
