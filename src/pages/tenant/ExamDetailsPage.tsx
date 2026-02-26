import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  FileText,
  Award,
  TrendingUp,
  Download,
  Play,
  Edit,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { mockExams, mockExamAttempts } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';

const ExamDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const exam = mockExams.find((e) => e.id === id);

  if (!exam) {
    return (
      <div className="p-6 text-center">
        <FileText className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-4">The exam you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/tenant/exams')}>Back to Exams</Button>
      </div>
    );
  }

  const examAttempts = mockExamAttempts.filter((a) => a.examId === exam.id);
  const avgScore = examAttempts.length > 0
    ? examAttempts.reduce((acc, a) => acc + a.percentage, 0) / examAttempts.length
    : 0;
  const passCount = examAttempts.filter((a) => a.percentage >= 40).length;
  const failCount = examAttempts.length - passCount;
  const highestScore = examAttempts.length > 0 ? Math.max(...examAttempts.map((a) => a.percentage)) : 0;
  const lowestScore = examAttempts.length > 0 ? Math.min(...examAttempts.map((a) => a.percentage)) : 0;

  const gradeDistribution = [
    { grade: 'A+ (90-100)', count: examAttempts.filter((a) => a.percentage >= 90).length, color: 'hsl(var(--primary))' },
    { grade: 'A (80-89)', count: examAttempts.filter((a) => a.percentage >= 80 && a.percentage < 90).length, color: '#22c55e' },
    { grade: 'B (60-79)', count: examAttempts.filter((a) => a.percentage >= 60 && a.percentage < 80).length, color: '#eab308' },
    { grade: 'C (40-59)', count: examAttempts.filter((a) => a.percentage >= 40 && a.percentage < 60).length, color: '#f97316' },
    { grade: 'F (<40)', count: examAttempts.filter((a) => a.percentage < 40).length, color: 'hsl(var(--destructive))' },
  ];

  const passFailData = [
    { name: 'Pass', value: passCount, color: '#22c55e' },
    { name: 'Fail', value: failCount, color: 'hsl(var(--destructive))' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Ongoing': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Published': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const sortedAttempts = [...examAttempts].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/exams')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{exam.title}</h1>
              <Badge variant="outline" className={cn('text-xs', getStatusColor(exam.status))}>
                {exam.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{exam.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(exam.startDate).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{exam.duration} min</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{exam.totalMarks} marks</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{exam.attemptCount} attempts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/tenant/exams/${exam.id}/questions`}><Edit className="w-4 h-4 mr-2" />Questions</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><Users className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{examAttempts.length}</p><p className="text-xs text-muted-foreground">Total Attempts</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600"><TrendingUp className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{avgScore.toFixed(1)}%</p><p className="text-xs text-muted-foreground">Average Score</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><Award className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{highestScore}%</p><p className="text-xs text-muted-foreground">Highest Score</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><BarChart3 className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{examAttempts.length > 0 ? ((passCount / examAttempts.length) * 100).toFixed(0) : 0}%</p><p className="text-xs text-muted-foreground">Pass Rate</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attempts">Student Attempts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Grade Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="grade" className="text-xs" tick={{ fontSize: 10 }} />
                      <YAxis className="text-xs" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pass/Fail Pie */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Pass / Fail Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  {examAttempts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={passFailData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                          {passFailData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No attempts yet</p>
                  )}
                </div>
                <div className="flex items-center justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500" /><span className="text-xs text-muted-foreground">Pass ({passCount})</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-destructive" /><span className="text-xs text-muted-foreground">Fail ({failCount})</span></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exam Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Exam Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div><p className="text-muted-foreground">Type</p><p className="font-medium mt-1">{exam.type}</p></div>
                <div><p className="text-muted-foreground">Duration</p><p className="font-medium mt-1">{exam.duration} minutes</p></div>
                <div><p className="text-muted-foreground">Total Marks</p><p className="font-medium mt-1">{exam.totalMarks}</p></div>
                <div><p className="text-muted-foreground">Pass Mark</p><p className="font-medium mt-1">{Math.round(exam.totalMarks * 0.4)}</p></div>
                <div><p className="text-muted-foreground">Start Date</p><p className="font-medium mt-1">{new Date(exam.startDate).toLocaleDateString()}</p></div>
                <div><p className="text-muted-foreground">End Date</p><p className="font-medium mt-1">{new Date(exam.endDate).toLocaleDateString()}</p></div>
                <div><p className="text-muted-foreground">Lowest Score</p><p className="font-medium mt-1">{lowestScore}%</p></div>
                <div><p className="text-muted-foreground">Score Range</p><p className="font-medium mt-1">{lowestScore}% – {highestScore}%</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attempts" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden sm:table-cell">Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead className="hidden lg:table-cell">Accuracy</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAttempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No attempts recorded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedAttempts.map((attempt, index) => (
                      <TableRow key={attempt.id}>
                        <TableCell>
                          <div className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                            index === 0 && 'bg-amber-500/20 text-amber-600',
                            index === 1 && 'bg-slate-300/50 text-slate-600',
                            index === 2 && 'bg-orange-400/20 text-orange-600',
                            index > 2 && 'bg-muted text-muted-foreground'
                          )}>
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {attempt.studentName.split(' ').map((n) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{attempt.studentName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm font-medium">{attempt.score}/{attempt.totalQuestions}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={attempt.percentage} className={cn('w-16 h-2',
                              attempt.percentage >= 80 && '[&>div]:bg-green-500',
                              attempt.percentage >= 40 && attempt.percentage < 80 && '[&>div]:bg-amber-500',
                              attempt.percentage < 40 && '[&>div]:bg-destructive'
                            )} />
                            <span className="text-sm font-medium">{attempt.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            <span className="text-green-600">{attempt.correctAnswers} ✓</span>
                            <span className="mx-1 text-muted-foreground">|</span>
                            <span className="text-destructive">{attempt.wrongAnswers} ✗</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={attempt.percentage >= 40 ? 'default' : 'destructive'} className="text-xs">
                            {attempt.percentage >= 40 ? 'Pass' : 'Fail'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
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

export default ExamDetailsPage;
