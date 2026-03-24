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
  MoreHorizontal,
  Plus,
  UserCheck,
  Briefcase,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Activity,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  mockStudents,
  mockTeachers,
  mockBatches,
  mockGuardians,
  mockStaff,
} from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';
import {
  TodayHighlightsWidget,
  AttendanceSummaryWidget,
} from '@/components/tenant/DashboardWidgets';
import { EnhancedStatCard, MobileEnhancedStatCard } from '@/components/tenant/stats';
import { WidgetCustomizer } from '@/components/tenant/dashboard';
import { useDashboardWidgets } from '@/hooks/useDashboardWidgets';
import { useIsMobile } from '@/hooks/use-mobile';

// Sparkline data for stats
const statsSparklineData = {
  students: [420, 435, 445, 460, 475, 485, 485],
  teachers: [22, 22, 23, 24, 24, 24, 24],
  exams: [38, 42, 45, 48, 52, 56, 56],
  batches: [5, 6, 6, 7, 8, 8, 8],
  guardians: [180, 195, 210, 220, 230, 240, 245],
  staff: [8, 9, 10, 10, 11, 12, 12],
};

// Quick navigation links
const quickNavLinks = [
  { label: 'Students', href: '/tenant/students', icon: GraduationCap, count: mockStudents.length, color: 'text-primary' },
  { label: 'Teachers', href: '/tenant/teachers', icon: Users, count: mockTeachers.length, color: 'text-chart-2' },
  { label: 'Batches', href: '/tenant/batches', icon: BookOpen, count: mockBatches.length, color: 'text-chart-3' },
  { label: 'Guardians', href: '/tenant/guardians', icon: ShieldCheck, count: mockGuardians.length, color: 'text-chart-4' },
  { label: 'Staff', href: '/tenant/staff', icon: Briefcase, count: mockStaff.length, color: 'text-chart-5' },
  { label: 'Exams', href: '/tenant/exams', icon: FileText, count: mockExams.length, color: 'text-accent-foreground' },
];

const TenantOverview: React.FC = () => {
  const stats = mockDashboardStats;
  const isMobile = useIsMobile();

  const {
    widgets,
    isVisible,
    toggleWidgetVisibility,
    reorderWidgets,
    resetToDefaults,
  } = useDashboardWidgets();

  const activeStudents = mockStudents.filter(s => s.isActive).length;
  const activeTeachers = mockTeachers.filter(t => t.isActive).length;
  const activeStaff = mockStaff.filter(s => s.isActive).length;
  const activeGuardians = mockGuardians.filter(g => g.isActive).length;

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Mobile Welcome Banner */}
      <div className="lg:hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-4">
          <h1 className="text-xl font-bold text-foreground">Good morning! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's your academy overview</p>
        </div>
      </div>

      {/* Desktop Page Header */}
      <div className="hidden lg:flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <WidgetCustomizer
            widgets={widgets}
            onToggleVisibility={toggleWidgetVisibility}
            onReorder={reorderWidgets}
            onReset={resetToDefaults}
          />
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button size="sm" asChild>
            <Link to="/tenant/exams/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="lg:hidden flex gap-2">
        <Button className="flex-1" size="sm" asChild>
          <Link to="/tenant/exams/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/tenant/calendar">
            <Calendar className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* ===== PRIMARY STATS ===== */}
      {/* Mobile: Horizontal scroll */}
      <div className="lg:hidden -mx-4 px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          <MobileEnhancedStatCard
            title="Students"
            value={mockStudents.length}
            subtitle={`${activeStudents} active`}
            icon={GraduationCap}
            trend={{ value: 8, isPositive: true }}
            color="primary"
            sparklineData={statsSparklineData.students}
            href="/tenant/students"
          />
          <MobileEnhancedStatCard
            title="Teachers"
            value={mockTeachers.length}
            subtitle={`${activeTeachers} active`}
            icon={Users}
            trend={{ value: 2, isPositive: true }}
            color="secondary"
            sparklineData={statsSparklineData.teachers}
            href="/tenant/teachers"
          />
          <MobileEnhancedStatCard
            title="Batches"
            value={mockBatches.length}
            subtitle={`${stats.totalBatches} total`}
            icon={BookOpen}
            trend={{ value: 5, isPositive: true }}
            color="accent"
            sparklineData={statsSparklineData.batches}
            href="/tenant/batches"
          />
          <MobileEnhancedStatCard
            title="Guardians"
            value={mockGuardians.length}
            subtitle={`${activeGuardians} active`}
            icon={ShieldCheck}
            trend={{ value: 4, isPositive: true }}
            color="success"
            sparklineData={statsSparklineData.guardians}
            href="/tenant/guardians"
          />
          <MobileEnhancedStatCard
            title="Staff"
            value={mockStaff.length}
            subtitle={`${activeStaff} active`}
            icon={Briefcase}
            trend={{ value: 3, isPositive: true }}
            color="primary"
            sparklineData={statsSparklineData.staff}
            href="/tenant/staff"
          />
          <MobileEnhancedStatCard
            title="Exams"
            value={stats.totalExams}
            subtitle={`${stats.ongoingExams} ongoing`}
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            color="secondary"
            sparklineData={statsSparklineData.exams}
            href="/tenant/exams"
          />
        </div>
      </div>

      {/* Desktop: 6-column stats grid */}
      <div className="hidden lg:grid grid-cols-3 xl:grid-cols-6 gap-4">
        <EnhancedStatCard
          title="Students"
          value={mockStudents.length}
          subtitle={`${activeStudents} active`}
          icon={GraduationCap}
          trend={{ value: 8, isPositive: true }}
          color="primary"
          sparklineData={statsSparklineData.students}
          href="/tenant/students"
        />
        <EnhancedStatCard
          title="Teachers"
          value={mockTeachers.length}
          subtitle={`${activeTeachers} active`}
          icon={Users}
          trend={{ value: 2, isPositive: true }}
          color="secondary"
          sparklineData={statsSparklineData.teachers}
          href="/tenant/teachers"
        />
        <EnhancedStatCard
          title="Batches"
          value={mockBatches.length}
          subtitle={`${stats.totalBatches} total`}
          icon={BookOpen}
          trend={{ value: 5, isPositive: true }}
          color="accent"
          sparklineData={statsSparklineData.batches}
          href="/tenant/batches"
        />
        <EnhancedStatCard
          title="Guardians"
          value={mockGuardians.length}
          subtitle={`${activeGuardians} active`}
          icon={ShieldCheck}
          trend={{ value: 4, isPositive: true }}
          color="success"
          sparklineData={statsSparklineData.guardians}
          href="/tenant/guardians"
        />
        <EnhancedStatCard
          title="Staff"
          value={mockStaff.length}
          subtitle={`${activeStaff} active`}
          icon={Briefcase}
          trend={{ value: 3, isPositive: true }}
          color="primary"
          sparklineData={statsSparklineData.staff}
          href="/tenant/staff"
        />
        <EnhancedStatCard
          title="Exams"
          value={stats.totalExams}
          subtitle={`${stats.ongoingExams} ongoing`}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          color="secondary"
          sparklineData={statsSparklineData.exams}
          href="/tenant/exams"
        />
      </div>

      {/* ===== COMPARISON METRICS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 lg:p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-lg lg:text-xl font-bold">85%</p>
              <p className="text-[10px] lg:text-xs text-muted-foreground">Pass Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-chart-2/5 border-chart-2/20">
          <CardContent className="p-3 lg:p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-chart-2/10">
              <UserCheck className="w-4 h-4 text-chart-2" />
            </div>
            <div>
              <p className="text-lg lg:text-xl font-bold">{stats.averageAttendance}%</p>
              <p className="text-[10px] lg:text-xs text-muted-foreground">Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-chart-3/5 border-chart-3/20">
          <CardContent className="p-3 lg:p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-chart-3/10">
              <TrendingUp className="w-4 h-4 text-chart-3" />
            </div>
            <div>
              <p className="text-lg lg:text-xl font-bold">{stats.averageExamScore}%</p>
              <p className="text-[10px] lg:text-xs text-muted-foreground">Avg Score</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-chart-4/5 border-chart-4/20">
          <CardContent className="p-3 lg:p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-chart-4/10">
              <Activity className="w-4 h-4 text-chart-4" />
            </div>
            <div>
              <p className="text-lg lg:text-xl font-bold">78%</p>
              <p className="text-[10px] lg:text-xs text-muted-foreground">Batch Capacity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== MOBILE WIDGETS ===== */}
      <div className="lg:hidden space-y-4">
        <TodayHighlightsWidget />
        <AttendanceSummaryWidget />
      </div>

      {/* ===== QUICK NAVIGATION GRID (Mobile) ===== */}
      <div className="lg:hidden">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-3 gap-2">
          {quickNavLinks.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
            >
              <item.icon className={cn('w-5 h-5', item.color)} />
              <span className="text-xs font-medium text-foreground">{item.label}</span>
              <span className="text-[10px] text-muted-foreground">{item.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== CHARTS ROW (Desktop) ===== */}
      {isVisible('performance-chart') && (
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Performance Trend</CardTitle>
                  <CardDescription>Average exam scores over time</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/tenant/analytics">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Details
                  </Link>
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
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Chart - Simplified */}
      <Card className="lg:hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Performance Trend</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
              <Link to="/tenant/analytics">View Details</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={examPerformanceData}>
                <defs>
                  <linearGradient id="colorScoreMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgScore"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorScoreMobile)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ===== ATTENDANCE & QUICK STATS (Desktop) ===== */}
      {isVisible('weekly-attendance') && (
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Weekly Attendance</CardTitle>
                  <CardDescription>Present vs Absent students</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">{stats.averageAttendance}% avg</Badge>
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Pass Rate', value: 85 },
                { label: 'Attendance Rate', value: stats.averageAttendance },
                { label: 'Batch Capacity', value: 78 },
                { label: 'Exams Completed', value: Math.round((stats.completedExams / stats.totalExams) * 100) },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== MOBILE UPCOMING EXAMS ===== */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Upcoming Exams</h2>
          <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
            <Link to="/tenant/exams">View all</Link>
          </Button>
        </div>
        <div className="-mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {mockExams
              .filter((e) => e.status === 'Published' || e.status === 'Pending')
              .slice(0, 4)
              .map((exam) => (
                <Card key={exam.id} className="min-w-[200px] snap-start shrink-0">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn('p-1.5 rounded-lg', exam.status === 'Published' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <Badge variant={exam.status === 'Published' ? 'default' : 'secondary'} className="text-[10px] px-1.5">
                        {exam.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium truncate">{exam.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(exam.startDate).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* ===== MOBILE RECENT ACTIVITY ===== */}
      <Card className="lg:hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {recentActivities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-muted shrink-0">
                  {activity.type === 'exam' && <FileText className="w-3 h-3 text-primary" />}
                  {activity.type === 'student' && <GraduationCap className="w-3 h-3 text-chart-3" />}
                  {activity.type === 'result' && <CheckCircle2 className="w-3 h-3 text-chart-2" />}
                  {activity.type === 'announcement' && <AlertCircle className="w-3 h-3 text-chart-4" />}
                  {activity.type === 'attendance' && <Clock className="w-3 h-3 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground line-clamp-1">{activity.message}</p>
                  <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===== DESKTOP BOTTOM ROW ===== */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Exams */}
        {isVisible('upcoming-exams') && (
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
                  <div key={exam.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className={cn('p-2 rounded-lg', exam.status === 'Published' ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground')}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{exam.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={exam.status === 'Published' ? 'default' : 'secondary'} className="text-xs">{exam.status}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(exam.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Announcements */}
        {isVisible('announcements') && (
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
                <div key={announcement.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start gap-2">
                    {announcement.isPinned && (
                      <Badge variant="outline" className="text-xs shrink-0">Pinned</Badge>
                    )}
                    <Badge
                      variant={announcement.priority === 'HIGH' || announcement.priority === 'URGENT' ? 'destructive' : 'secondary'}
                      className="text-xs shrink-0"
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mt-2 line-clamp-1">{announcement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {isVisible('recent-activity') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-muted">
                      {activity.type === 'exam' && <FileText className="w-3.5 h-3.5 text-primary" />}
                      {activity.type === 'student' && <GraduationCap className="w-3.5 h-3.5 text-chart-3" />}
                      {activity.type === 'result' && <CheckCircle2 className="w-3.5 h-3.5 text-chart-2" />}
                      {activity.type === 'announcement' && <AlertCircle className="w-3.5 h-3.5 text-chart-4" />}
                      {activity.type === 'attendance' && <Clock className="w-3.5 h-3.5 text-muted-foreground" />}
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
        )}
      </div>
    </div>
  );
};

export default TenantOverview;
