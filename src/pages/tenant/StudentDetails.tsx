import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Printer,
  UserX,
  UserCheck,
  Trash2,
  Share2,
  Copy,
  Heart,
  Globe,
  Users,
  Building,
  Hash,
  BadgeCheck,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockStudents, mockExamAttempts, type Student, type ExamAttempt } from '@/lib/tenant-mock-data';
import { format, differenceInYears, parseISO } from 'date-fns';
import { toast } from 'sonner';

// Info row component for consistent display
const InfoRow = ({ 
  icon: Icon, 
  label, 
  value, 
  className = '' 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: React.ReactNode; 
  className?: string;
}) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value || '—'}</p>
    </div>
  </div>
);

// Stat card for quick stats
const QuickStatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  color = 'primary',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'success' | 'warning' | 'destructive';
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{value}</span>
              {subValue && (
                <span className="text-xs text-muted-foreground">{subValue}</span>
              )}
            </div>
          </div>
          {trend && (
            <TrendingUp
              className={`w-4 h-4 ${
                trend === 'up'
                  ? 'text-green-500'
                  : trend === 'down'
                  ? 'text-red-500 rotate-180'
                  : 'text-muted-foreground'
              }`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Exam attempt row
const ExamAttemptRow = ({ attempt }: { attempt: ExamAttempt }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'In Progress':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'Auto-Submitted':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{attempt.examTitle}</h4>
        <p className="text-xs text-muted-foreground">
          {attempt.startTime && format(parseISO(attempt.startTime), 'PPp')}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className={`text-lg font-bold ${getScoreColor(attempt.percentage)}`}>
            {attempt.percentage}%
          </p>
          <p className="text-xs text-muted-foreground">
            {attempt.score}/{attempt.totalQuestions * 4}
          </p>
        </div>
        
        <div className="text-center min-w-[60px]">
          <p className="text-sm font-medium">#{attempt.rank || '—'}</p>
          <p className="text-xs text-muted-foreground">Rank</p>
        </div>
        
        <Badge variant="outline" className={getStatusColor(attempt.status)}>
          {attempt.status}
        </Badge>
      </div>
    </motion.div>
  );
};

// Attendance record component
const AttendanceRecord = ({
  date,
  status,
}: {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}) => {
  const statusConfig = {
    PRESENT: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    ABSENT: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    LATE: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    EXCUSED: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${config.bg}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
      <div className="flex-1">
        <p className="text-xs font-medium">{format(parseISO(date), 'EEE, MMM d')}</p>
      </div>
      <span className={`text-xs font-medium ${config.color}`}>{status}</span>
    </div>
  );
};

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Find student by ID
  const student = mockStudents.find((s) => s.id === id);
  const studentAttempts = mockExamAttempts.filter((a) => a.studentId === id);

  // Calculate age
  const calculateAge = (dob: string) => {
    return differenceInYears(new Date(), parseISO(dob));
  };

  // Mock attendance data
  const mockAttendance = [
    { date: '2024-02-01', status: 'PRESENT' as const },
    { date: '2024-02-02', status: 'PRESENT' as const },
    { date: '2024-02-03', status: 'LATE' as const },
    { date: '2024-02-04', status: 'PRESENT' as const },
    { date: '2024-02-05', status: 'ABSENT' as const },
    { date: '2024-02-06', status: 'PRESENT' as const },
    { date: '2024-02-07', status: 'EXCUSED' as const },
  ];

  // Calculate stats
  const attendancePercentage = 85;
  const avgScore = studentAttempts.length > 0
    ? Math.round(studentAttempts.reduce((acc, a) => acc + a.percentage, 0) / studentAttempts.length)
    : 0;

  const handleCopyId = () => {
    if (student) {
      navigator.clipboard.writeText(student.studentId);
      toast.success('Student ID copied to clipboard');
    }
  };

  const handleToggleStatus = () => {
    setShowDeactivateDialog(false);
    toast.success(student?.isActive ? 'Student deactivated' : 'Student activated');
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    toast.success('Student deleted successfully');
    navigate('/tenant/students');
  };

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <User className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Student Not Found</h2>
        <p className="text-muted-foreground">The student you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/tenant/students')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
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
              <Link to="/tenant/students">Students</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{student.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Student Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col sm:flex-row gap-4 -mt-12">
                {/* Avatar */}
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={student.imageUrl} alt={student.name} />
                  <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 pt-2 sm:pt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{student.name}</h1>
                    <Badge
                      variant={student.isActive ? 'default' : 'secondary'}
                      className={student.isActive ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : ''}
                    >
                      {student.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <button
                      onClick={handleCopyId}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <Hash className="w-3.5 h-3.5" />
                      {student.studentId}
                      <Copy className="w-3 h-3" />
                    </button>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {student.className}
                    </span>
                    {student.batchName && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {student.batchName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-start gap-2 sm:pt-8">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/tenant/students/${id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Export Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="w-4 h-4 mr-2" />
                        Print ID Card
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowDeactivateDialog(true)}>
                        {student.isActive ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <QuickStatCard
          icon={ClipboardList}
          label="Exams Taken"
          value={studentAttempts.length}
          subValue="total"
          color="primary"
        />
        <QuickStatCard
          icon={Trophy}
          label="Avg. Score"
          value={`${avgScore}%`}
          trend={avgScore >= 70 ? 'up' : 'down'}
          color={avgScore >= 70 ? 'success' : 'warning'}
        />
        <QuickStatCard
          icon={CheckCircle2}
          label="Attendance"
          value={`${attendancePercentage}%`}
          trend="up"
          color="success"
        />
        <QuickStatCard
          icon={BadgeCheck}
          label="Best Rank"
          value="#1"
          subValue="in Physics"
          color="primary"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="academic" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Academic</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Exams</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <InfoRow icon={User} label="Full Name" value={student.name} />
                    <InfoRow icon={Hash} label="Student ID" value={student.studentId} />
                    <InfoRow icon={Mail} label="Email" value={student.email} />
                    <InfoRow icon={Phone} label="Primary Phone" value={student.primaryPhone} />
                    <InfoRow icon={Phone} label="Secondary Phone" value={student.secondaryPhone} />
                    <InfoRow
                      icon={Calendar}
                      label="Date of Birth"
                      value={
                        student.dateOfBirth
                          ? `${format(parseISO(student.dateOfBirth), 'PPP')} (${calculateAge(student.dateOfBirth)} years)`
                          : undefined
                      }
                    />
                  </CardContent>
                </Card>

                {/* Personal Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <InfoRow icon={User} label="Gender" value={student.gender} />
                    <InfoRow icon={Heart} label="Blood Group" value={student.bloodGroup} />
                    <InfoRow icon={Globe} label="Nationality" value={student.nationality} />
                    <InfoRow icon={Building} label="Religion" value={student.religion} />
                    <InfoRow icon={User} label="Father's Name" value={student.fatherName} />
                    <InfoRow icon={User} label="Mother's Name" value={student.motherName} />
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Present Address</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {student.presentAddress || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Permanent Address</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {student.permanentAddress || 'Not provided'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Academic Tab */}
            <TabsContent value="academic" className="space-y-6 mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Academic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <InfoRow icon={GraduationCap} label="Class" value={student.className} />
                    <InfoRow icon={Users} label="Batch" value={student.batchName} />
                    <InfoRow icon={Hash} label="Roll Number" value={student.roll} />
                    <InfoRow icon={Building} label="Section" value={student.section} />
                    <InfoRow icon={Clock} label="Shift" value={student.shift} />
                    <InfoRow icon={BookOpen} label="Group" value={student.group} />
                  </CardContent>
                </Card>

                {/* Performance Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Overall Score</span>
                        <span className="font-medium">{avgScore}%</span>
                      </div>
                      <Progress value={avgScore} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Attendance Rate</span>
                        <span className="font-medium">{attendancePercentage}%</span>
                      </div>
                      <Progress value={attendancePercentage} className="h-2" />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-primary">{studentAttempts.length}</p>
                        <p className="text-xs text-muted-foreground">Total Exams</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-green-600">
                          {studentAttempts.filter((a) => a.percentage >= 60).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Passed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subject Performance */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Subject Performance
                    </CardTitle>
                    <CardDescription>Performance breakdown by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { subject: 'Physics', score: 78, trend: 'up' },
                        { subject: 'Chemistry', score: 72, trend: 'up' },
                        { subject: 'Mathematics', score: 85, trend: 'up' },
                        { subject: 'Biology', score: 68, trend: 'down' },
                      ].map((item) => (
                        <div
                          key={item.subject}
                          className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{item.subject}</h4>
                            <TrendingUp
                              className={`w-4 h-4 ${
                                item.trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'
                              }`}
                            />
                          </div>
                          <p className="text-2xl font-bold">{item.score}%</p>
                          <Progress value={item.score} className="h-1.5 mt-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Exams Tab */}
            <TabsContent value="exams" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Exam History
                      </CardTitle>
                      <CardDescription>All exam attempts and results</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {studentAttempts.length > 0 ? (
                    studentAttempts.map((attempt) => (
                      <ExamAttemptRow key={attempt.id} attempt={attempt} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-1">No Exam Attempts</h3>
                      <p className="text-sm text-muted-foreground">
                        This student hasn't taken any exams yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-6 mt-0">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Attendance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${attendancePercentage * 2.51} 251`}
                            className="text-primary"
                          />
                        </svg>
                        <span className="absolute text-xl font-bold">{attendancePercentage}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Overall Attendance</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Present: 18</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Absent: 2</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span>Late: 1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>Excused: 1</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Attendance */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Recent Attendance</CardTitle>
                        <CardDescription>Last 7 days</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {mockAttendance.map((record, index) => (
                        <AttendanceRecord
                          key={index}
                          date={record.date}
                          status={record.status}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      {/* Metadata Footer */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Created: {format(parseISO(student.createdAt), 'PPP')}</span>
              {student.updatedAt && (
                <span>Last Updated: {format(parseISO(student.updatedAt), 'PPP')}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>ID: {student.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deactivate Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {student.isActive ? 'Deactivate' : 'Activate'} Student?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {student.isActive
                ? 'This will prevent the student from accessing their account and taking exams. You can reactivate them later.'
                : 'This will restore the student\'s access to their account and allow them to take exams.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              {student.isActive ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student's
              profile and all associated data including exam history and attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
