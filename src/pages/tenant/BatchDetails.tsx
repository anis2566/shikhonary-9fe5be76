import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  GraduationCap,
  MoreHorizontal,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  UserPlus,
  FileText,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { mockBatches, mockStudents, mockExams } from '@/lib/tenant-mock-data';

const BatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [studentSearch, setStudentSearch] = useState('');

  // Find batch and related data
  const batch = mockBatches.find((b) => b.id === id) || mockBatches[0];
  const batchStudents = mockStudents.filter((s) => s.batchId === batch.id);
  const batchExams = mockExams.filter((e) => e.batchId === batch.id);

  // Filter students by search
  const filteredStudents = batchStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Calculate stats
  const capacityPercent = batch.capacity
    ? Math.round((batch.currentSize / batch.capacity) * 100)
    : 0;

  const stats = {
    totalStudents: batchStudents.length,
    activeStudents: batchStudents.filter((s) => s.isActive).length,
    totalExams: batchExams.length,
    completedExams: batchExams.filter((e) => e.status === 'Completed').length,
    avgScore: batchExams.length > 0
      ? Math.round(batchExams.reduce((acc, e) => acc + e.avgScore, 0) / batchExams.length)
      : 0,
    upcomingExams: batchExams.filter((e) => e.status === 'Pending').length,
  };

  const handleDelete = () => {
    toast.error('Delete this batch?', {
      description: 'All students will be unassigned. This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => {
          toast.success('Batch deleted');
          navigate('/tenant/batches');
        },
      },
    });
  };

  const getCapacityColor = () => {
    if (capacityPercent >= 90) return 'text-destructive';
    if (capacityPercent >= 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tenant">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tenant/batches">Batches</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{batch.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 mt-1">
            <Link to="/tenant/batches">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {batch.name}
              </h1>
              <Badge variant={batch.isActive ? 'default' : 'secondary'}>
                {batch.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>{batch.className}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{batch.academicYear}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span className={cn('font-medium', getCapacityColor())}>
                  {batch.currentSize}/{batch.capacity || '∞'} students
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-12 sm:ml-0">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/tenant/batches/${batch.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export Students
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeStudents}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalExams}</p>
                  <p className="text-xs text-muted-foreground">Exams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">{stats.avgScore}%</p>
                    {stats.avgScore >= 70 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Avg. Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.upcomingExams}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Capacity</span>
                  <span className={cn('text-sm font-bold', getCapacityColor())}>
                    {capacityPercent}%
                  </span>
                </div>
                <Progress
                  value={capacityPercent}
                  className={cn(
                    'h-2',
                    capacityPercent >= 90 && '[&>div]:bg-destructive',
                    capacityPercent >= 70 && capacityPercent < 90 && '[&>div]:bg-amber-500'
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">
            Overview
          </TabsTrigger>
          <TabsTrigger value="students" className="flex-1 sm:flex-none">
            Students
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex-1 sm:flex-none">
            Exams
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Batch Info */}
            <Card>
              <CardHeader>
                <CardTitle>Batch Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Batch Name</p>
                    <p className="font-medium">{batch.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-medium">{batch.className}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Academic Year</p>
                    <p className="font-medium">{batch.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={batch.isActive ? 'default' : 'secondary'}>
                      {batch.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Size</p>
                    <p className="font-medium">{batch.currentSize} students</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Capacity</p>
                    <p className="font-medium">{batch.capacity || 'Unlimited'}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Capacity Usage</p>
                  <div className="space-y-2">
                    <Progress
                      value={capacityPercent}
                      className={cn(
                        'h-3',
                        capacityPercent >= 90 && '[&>div]:bg-destructive',
                        capacityPercent >= 70 && capacityPercent < 90 && '[&>div]:bg-amber-500'
                      )}
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {batch.currentSize} of {batch.capacity || '∞'}
                      </span>
                      <span className={cn('font-medium', getCapacityColor())}>
                        {capacityPercent}% used
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Exams */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Exams</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/tenant/exams">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {batchExams.length > 0 ? (
                  <div className="space-y-3">
                    {batchExams.slice(0, 5).map((exam) => (
                      <div
                        key={exam.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg',
                              exam.status === 'Completed'
                                ? 'bg-emerald-500/10'
                                : exam.status === 'Ongoing'
                                ? 'bg-blue-500/10'
                                : 'bg-muted'
                            )}
                          >
                            <BookOpen
                              className={cn(
                                'w-4 h-4',
                                exam.status === 'Completed'
                                  ? 'text-emerald-500'
                                  : exam.status === 'Ongoing'
                                  ? 'text-blue-500'
                                  : 'text-muted-foreground'
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{exam.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {exam.type} • {exam.totalMarks} marks
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            exam.status === 'Completed'
                              ? 'default'
                              : exam.status === 'Ongoing'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {exam.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No exams scheduled</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link to="/tenant/exams/create">Create Exam</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Students */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students with highest average scores</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tenant/students">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {batchStudents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {batchStudents.slice(0, 4).map((student, index) => (
                    <Link
                      key={student.id}
                      to={`/tenant/students/${student.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={student.imageUrl} />
                          <AvatarFallback>
                            {student.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {index < 3 && (
                          <div
                            className={cn(
                              'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white',
                              index === 0
                                ? 'bg-amber-500'
                                : index === 1
                                ? 'bg-slate-400'
                                : 'bg-amber-700'
                            )}
                          >
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Roll: {student.roll}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No students in this batch</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button asChild>
              <Link to="/tenant/students/create">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Roll</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.imageUrl} />
                            <AvatarFallback>
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              to={`/tenant/students/${student.id}`}
                              className="font-medium hover:underline"
                            >
                              {student.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.roll || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.group || '-'}</Badge>
                      </TableCell>
                      <TableCell>
                        {student.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/tenant/students/${student.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          {studentSearch ? 'No matching students found' : 'No students in this batch'}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-4">
          <div className="flex justify-end">
            <Button asChild>
              <Link to="/tenant/exams/create">
                <FileText className="w-4 h-4 mr-2" />
                Schedule Exam
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Avg. Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <Link
                          to={`/tenant/exams/${exam.id}`}
                          className="font-medium hover:underline"
                        >
                          {exam.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{exam.type}</Badge>
                      </TableCell>
                      <TableCell>{exam.totalMarks}</TableCell>
                      <TableCell>{exam.duration} min</TableCell>
                      <TableCell>{exam.attemptCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {exam.avgScore}%
                          {exam.avgScore >= 70 ? (
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            exam.status === 'Completed'
                              ? 'default'
                              : exam.status === 'Ongoing'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {exam.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {batchExams.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">No exams scheduled for this batch</p>
                        <Button variant="outline" size="sm" className="mt-3" asChild>
                          <Link to="/tenant/exams/create">Schedule Exam</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchDetails;
