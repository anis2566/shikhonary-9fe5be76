import React, { useState } from 'react';
import {
  Search,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  LineChart,
  Line,
} from 'recharts';
import { mockExamAttempts, subjectPerformanceData, examPerformanceData } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';

const ResultsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('all');

  const filteredAttempts = mockExamAttempts.filter((attempt) => {
    const matchesSearch =
      attempt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attempt.examTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExam = selectedExam === 'all' || attempt.examId === selectedExam;

    return matchesSearch && matchesExam;
  });

  // Sort by score descending
  const sortedAttempts = [...filteredAttempts].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Results</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze exam results and student performance
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockExamAttempts.length}</p>
                <p className="text-xs text-muted-foreground">Total Attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(
                    mockExamAttempts.reduce((acc, a) => acc + a.percentage, 0) /
                    mockExamAttempts.length
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-xs text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.max(...mockExamAttempts.map((a) => a.percentage))}%
                </p>
                <p className="text-xs text-muted-foreground">Highest Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(
                    (mockExamAttempts.filter((a) => a.percentage >= 40).length /
                      mockExamAttempts.length) *
                    100
                  ).toFixed(0)}
                  %
                </p>
                <p className="text-xs text-muted-foreground">Pass Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Score Trend</CardTitle>
            <CardDescription>Average scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="passRate"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Subject Performance</CardTitle>
            <CardDescription>Average scores by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} className="text-xs" />
                  <YAxis dataKey="subject" type="category" className="text-xs" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by student or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                <SelectItem value="exam-1">Weekly Test - Physics</SelectItem>
                <SelectItem value="exam-4">Practice Quiz - Chemistry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Recent Results</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell">Exam</TableHead>
                <TableHead className="hidden sm:table-cell">Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead className="hidden lg:table-cell">Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAttempts.map((attempt, index) => (
                <TableRow key={attempt.id}>
                  <TableCell>
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                        index === 0 && 'bg-amber-500/20 text-amber-600',
                        index === 1 && 'bg-slate-300/50 text-slate-600',
                        index === 2 && 'bg-orange-400/20 text-orange-600',
                        index > 2 && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {attempt.studentName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{attempt.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm">{attempt.examTitle}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm font-medium">
                      {attempt.score}/{attempt.totalQuestions}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={attempt.percentage}
                        className={cn(
                          'w-16 h-2',
                          attempt.percentage >= 80 && '[&>div]:bg-green-500',
                          attempt.percentage >= 40 &&
                            attempt.percentage < 80 &&
                            '[&>div]:bg-amber-500',
                          attempt.percentage < 40 && '[&>div]:bg-destructive'
                        )}
                      />
                      <span className="text-sm font-medium">{attempt.percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm">
                      <span className="text-green-600">{attempt.correctAnswers} ✓</span>
                      <span className="mx-1 text-muted-foreground">|</span>
                      <span className="text-destructive">{attempt.wrongAnswers} ✗</span>
                      {attempt.skippedQuestions > 0 && (
                        <>
                          <span className="mx-1 text-muted-foreground">|</span>
                          <span className="text-muted-foreground">
                            {attempt.skippedQuestions} skipped
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPage;
