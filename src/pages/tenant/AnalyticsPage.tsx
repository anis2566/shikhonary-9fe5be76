import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Award,
  Target,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  mockDashboardStats,
  examPerformanceData,
  subjectPerformanceData,
  examTypeDistribution,
} from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const stats = mockDashboardStats;

  // Mock data for analytics
  const performanceByClass = [
    { class: 'Class 10', avgScore: 72, students: 45 },
    { class: 'Class 9', avgScore: 68, students: 42 },
    { class: 'Class 8', avgScore: 75, students: 38 },
    { class: 'Class 7', avgScore: 70, students: 35 },
  ];

  const radarData = [
    { subject: 'Physics', score: 72, fullMark: 100 },
    { subject: 'Chemistry', score: 68, fullMark: 100 },
    { subject: 'Math', score: 78, fullMark: 100 },
    { subject: 'Biology', score: 65, fullMark: 100 },
    { subject: 'English', score: 82, fullMark: 100 },
    { subject: 'Bengali', score: 75, fullMark: 100 },
  ];

  const gradeDistribution = [
    { grade: 'A+', count: 15, color: 'hsl(var(--chart-1))' },
    { grade: 'A', count: 28, color: 'hsl(var(--chart-2))' },
    { grade: 'A-', count: 35, color: 'hsl(var(--chart-3))' },
    { grade: 'B', count: 42, color: 'hsl(var(--chart-4))' },
    { grade: 'C', count: 22, color: 'hsl(var(--chart-5))' },
    { grade: 'F', count: 8, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into student performance and engagement
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageExamScore}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs text-green-600">+3.2%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">85%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs text-green-600">+2.8%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-green-500/10 text-green-600">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exam Completion</p>
                <p className="text-2xl font-bold">92%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-xs text-destructive">-1.2%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time/Question</p>
                <p className="text-2xl font-bold">45s</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs text-green-600">-5s faster</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Score Trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Score Trend</CardTitle>
                <CardDescription>Average scores and pass rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={examPerformanceData}>
                      <defs>
                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
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
                      <Area
                        type="monotone"
                        dataKey="avgScore"
                        stroke="hsl(var(--primary))"
                        fill="url(#colorAvg)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="passRate"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Class-wise Performance */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Class Performance</CardTitle>
                <CardDescription>Average scores by class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceByClass}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="class" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Subject Radar */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Subject Analysis</CardTitle>
                <CardDescription>Performance across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subject Bar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Subject Scores</CardTitle>
                <CardDescription>Detailed subject-wise performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectPerformanceData.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{subject.subject}</span>
                        <span className="font-medium">{subject.avgScore}%</span>
                      </div>
                      <Progress
                        value={subject.avgScore}
                        className={cn(
                          'h-2',
                          subject.avgScore >= 75 && '[&>div]:bg-green-500',
                          subject.avgScore >= 60 && subject.avgScore < 75 && '[&>div]:bg-amber-500',
                          subject.avgScore < 60 && '[&>div]:bg-destructive'
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Grade Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Grade Distribution</CardTitle>
                <CardDescription>Student grades breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        label={({ grade, count }) => `${grade}: ${count}`}
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Exam Type Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Exam Types</CardTitle>
                <CardDescription>Distribution by exam category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={examTypeDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {examTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Top Performers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Top Performers
          </CardTitle>
          <CardDescription>Students with highest average scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Rahim Ahmed', score: 92, rank: 1, class: 'Class 10' },
              { name: 'Fatima Begum', score: 89, rank: 2, class: 'Class 10' },
              { name: 'Karim Hassan', score: 87, rank: 3, class: 'Class 9' },
            ].map((student) => (
              <div
                key={student.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                    student.rank === 1 && 'bg-amber-500/20 text-amber-600',
                    student.rank === 2 && 'bg-slate-300/50 text-slate-600',
                    student.rank === 3 && 'bg-orange-400/20 text-orange-600'
                  )}
                >
                  #{student.rank}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.class}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {student.score}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
