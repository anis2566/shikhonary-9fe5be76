import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  Users,
  Award,
  TrendingUp,
  Printer,
  Eye,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { mockStudents, mockExams } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface SubjectResult {
  subject: string;
  obtained: number;
  total: number;
  grade: string;
}

interface ReportCard {
  studentId: string;
  studentName: string;
  className: string;
  batchName: string;
  examTitle: string;
  subjects: SubjectResult[];
  totalObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank: number;
  remarks: string;
}

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'English', 'Biology'];

const generateMockReportCards = (): ReportCard[] => {
  return mockStudents.slice(0, 10).map((student, idx) => {
    const subjectResults: SubjectResult[] = subjects.map((sub) => {
      const total = 100;
      const obtained = Math.round(35 + Math.random() * 60);
      const pct = (obtained / total) * 100;
      const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'F';
      return { subject: sub, obtained, total, grade };
    });

    const totalObtained = subjectResults.reduce((a, s) => a + s.obtained, 0);
    const totalMarks = subjectResults.reduce((a, s) => a + s.total, 0);
    const percentage = Math.round((totalObtained / totalMarks) * 100);
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'F';

    return {
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      batchName: student.batchName,
      examTitle: 'Mid-Term Examination 2024',
      subjects: subjectResults,
      totalObtained,
      totalMarks,
      percentage,
      grade,
      rank: idx + 1,
      remarks: percentage >= 80 ? 'Excellent performance' : percentage >= 60 ? 'Good performance' : percentage >= 40 ? 'Average performance' : 'Needs improvement',
    };
  });
};

const ReportCardPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState('mid-term');
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

  const reportCards = generateMockReportCards();

  const filteredCards = reportCards.filter((r) =>
    r.studentName.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.rank - b.rank);

  const avgPercentage = Math.round(reportCards.reduce((a, r) => a + r.percentage, 0) / reportCards.length);
  const passCount = reportCards.filter((r) => r.percentage >= 40).length;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-primary/10 text-primary';
      case 'A': return 'bg-green-500/10 text-green-600';
      case 'B': return 'bg-blue-500/10 text-blue-600';
      case 'C': return 'bg-amber-500/10 text-amber-600';
      case 'F': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDownload = (report: ReportCard) => {
    toast({ title: 'Downloading Report Card', description: `Report card for ${report.studentName} is being generated.` });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Report Cards</h1>
          <p className="text-muted-foreground mt-1">Generate and view student report cards</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><Users className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{reportCards.length}</p><p className="text-xs text-muted-foreground">Total Students</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600"><TrendingUp className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{avgPercentage}%</p><p className="text-xs text-muted-foreground">Class Average</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><Award className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{passCount}/{reportCards.length}</p><p className="text-xs text-muted-foreground">Passed</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><GraduationCap className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{reportCards.filter((r) => r.grade === 'A+' || r.grade === 'A').length}</p><p className="text-xs text-muted-foreground">Top Performers</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Select Exam" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mid-term">Mid-Term Examination 2024</SelectItem>
            <SelectItem value="final">Final Examination 2024</SelectItem>
            <SelectItem value="weekly">Weekly Test - Jan W3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((report) => (
          <Card key={report.studentId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {report.studentName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{report.studentName}</p>
                    <p className="text-xs text-muted-foreground">{report.className} • {report.batchName}</p>
                  </div>
                </div>
                <Badge className={cn('text-xs', getGradeColor(report.grade))}>{report.grade}</Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-medium">{report.totalObtained}/{report.totalMarks}</span>
                </div>
                <Progress value={report.percentage} className={cn('h-2',
                  report.percentage >= 80 && '[&>div]:bg-green-500',
                  report.percentage >= 40 && report.percentage < 80 && '[&>div]:bg-amber-500',
                  report.percentage < 40 && '[&>div]:bg-destructive'
                )} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Rank #{report.rank}</span>
                  <span>{report.percentage}%</span>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedReport(report)}>
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(report)}>
                  <Download className="w-3.5 h-3.5 mr-1" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No report cards found.</p>
          </CardContent>
        </Card>
      )}

      {/* Report Card Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-lg">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Report Card - {selectedReport.studentName}</DialogTitle>
                <DialogDescription>{selectedReport.examTitle}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Class: {selectedReport.className}</span>
                  <span className="text-muted-foreground">Batch: {selectedReport.batchName}</span>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2 font-medium">Subject</th>
                        <th className="text-center p-2 font-medium">Obtained</th>
                        <th className="text-center p-2 font-medium">Total</th>
                        <th className="text-center p-2 font-medium">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.subjects.map((sub) => (
                        <tr key={sub.subject} className="border-t border-border">
                          <td className="p-2">{sub.subject}</td>
                          <td className="p-2 text-center font-medium">{sub.obtained}</td>
                          <td className="p-2 text-center text-muted-foreground">{sub.total}</td>
                          <td className="p-2 text-center">
                            <Badge className={cn('text-xs', getGradeColor(sub.grade))}>{sub.grade}</Badge>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-border bg-muted/30 font-medium">
                        <td className="p-2">Total</td>
                        <td className="p-2 text-center">{selectedReport.totalObtained}</td>
                        <td className="p-2 text-center">{selectedReport.totalMarks}</td>
                        <td className="p-2 text-center">
                          <Badge className={cn('text-xs', getGradeColor(selectedReport.grade))}>{selectedReport.grade}</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{selectedReport.percentage}%</p>
                    <p className="text-xs text-muted-foreground">Percentage</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">#{selectedReport.rank}</p>
                    <p className="text-xs text-muted-foreground">Rank</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{selectedReport.grade}</p>
                    <p className="text-xs text-muted-foreground">Grade</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Remarks</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReport.remarks}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => handleDownload(selectedReport)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportCardPage;
