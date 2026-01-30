import React from 'react';
import {
  Users,
  GraduationCap,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  mockDashboardStats,
  examPerformanceData,
  attendanceData,
  examTypeDistribution,
  mockExams,
  mockAnnouncements,
  recentActivities,
} from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';

const TenantOverview: React.FC = () => {
  const stats = mockDashboardStats;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle={`${stats.activeStudents} active`}
          icon={GraduationCap}
          trend={{ value: 8, isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          subtitle={`${stats.totalBatches} batches`}
          icon={Users}
          trend={{ value: 2, isPositive: true }}
          color="secondary"
        />
        <StatCard
          title="Total Exams"
          value={stats.totalExams}
          subtitle={`${stats.ongoingExams} ongoing`}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          color="accent"
        />
        <StatCard
          title="Avg. Score"
          value={`${stats.averageExamScore}%`}
          subtitle={`${stats.totalAttempts} attempts`}
          icon={TrendingUp}
          trend={{ value: 3.5, isPositive: true }}
          color="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Performance Trend</CardTitle>
                <CardDescription>Average exam scores over time</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={examPerformanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorScore)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Exam Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Exam Types</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={examTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {examTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {examTypeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Weekly Attendance</CardTitle>
                <CardDescription>Present vs Absent students</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {stats.averageAttendance}% avg
              </Badge>
            </div>
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
                  <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pass Rate</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Attendance Rate</span>
                <span className="font-medium">{stats.averageAttendance}%</span>
              </div>
              <Progress value={stats.averageAttendance} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Batch Capacity</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exams Completed</span>
                <span className="font-medium">
                  {Math.round((stats.completedExams / stats.totalExams) * 100)}%
                </span>
              </div>
              <Progress
                value={Math.round((stats.completedExams / stats.totalExams) * 100)}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Exams, Announcements, Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming Exams</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tenant/exams">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockExams
              .filter((e) => e.status === 'Published' || e.status === 'Pending')
              .slice(0, 3)
              .map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      exam.status === 'Published'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted-foreground/10 text-muted-foreground'
                    )}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{exam.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={exam.status === 'Published' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {exam.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(exam.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Announcements</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tenant/announcements">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAnnouncements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-2">
                  {announcement.isPinned && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      Pinned
                    </Badge>
                  )}
                  <Badge
                    variant={
                      announcement.priority === 'HIGH' || announcement.priority === 'URGENT'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="text-xs shrink-0"
                  >
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-sm font-medium mt-2 line-clamp-1">
                  {announcement.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {announcement.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-muted">
                    {activity.type === 'exam' && (
                      <FileText className="w-3.5 h-3.5 text-primary" />
                    )}
                    {activity.type === 'student' && (
                      <GraduationCap className="w-3.5 h-3.5 text-accent" />
                    )}
                    {activity.type === 'result' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    )}
                    {activity.type === 'announcement' && (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {activity.type === 'attendance' && (
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-1">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  color: 'primary' | 'secondary' | 'accent' | 'success';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-green-500/10 text-green-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={cn('p-2.5 rounded-lg', colorClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
            )}
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-green-600' : 'text-destructive'
              )}
            >
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantOverview;
