import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Printer,
  Users,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  TrendingUp,
  Filter,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  exportToCSV,
  exportToExcel,
  studentColumns,
  attendanceColumns,
  resultColumns,
  teacherColumns,
  batchColumns,
  getExportFilename,
} from '@/lib/export-utils';
import {
  generateReportCardPDF,
  generateMarksheetPDF,
  downloadPDF,
  printPDF,
  StudentReportData,
  ExamMarksheet,
} from '@/lib/pdf-generator';

// Mock data for exports
const mockStudents = [
  { id: 'STU001', name: 'Rahima Akter', email: 'rahima@example.com', phone: '01712345678', batch: 'Morning', class: 'Class 10', guardianName: 'Mohammad Akter', guardianPhone: '01798765432', enrollmentDate: '2024-01-15', status: 'Active' },
  { id: 'STU002', name: 'Karim Hasan', email: 'karim@example.com', phone: '01812345678', batch: 'Evening', class: 'Class 10', guardianName: 'Abdul Hasan', guardianPhone: '01898765432', enrollmentDate: '2024-01-20', status: 'Active' },
  { id: 'STU003', name: 'Fatima Begum', email: 'fatima@example.com', phone: '01912345678', batch: 'Morning', class: 'Class 9', guardianName: 'Jamal Uddin', guardianPhone: '01998765432', enrollmentDate: '2024-02-01', status: 'Active' },
];

const mockResults = [
  { examName: 'Half Yearly 2024', studentId: 'STU001', studentName: 'Rahima Akter', subject: 'Physics', totalMarks: 100, obtainedMarks: 85, percentage: 85, grade: 'A+', rank: 1 },
  { examName: 'Half Yearly 2024', studentId: 'STU002', studentName: 'Karim Hasan', subject: 'Physics', totalMarks: 100, obtainedMarks: 78, percentage: 78, grade: 'A', rank: 2 },
  { examName: 'Half Yearly 2024', studentId: 'STU003', studentName: 'Fatima Begum', subject: 'Physics', totalMarks: 100, obtainedMarks: 72, percentage: 72, grade: 'A', rank: 3 },
];

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'export' | 'report';
  formats?: string[];
}

const reportTypes: ReportType[] = [
  {
    id: 'students',
    title: 'Student List',
    description: 'Export complete student data with contact information',
    icon: GraduationCap,
    category: 'export',
    formats: ['CSV', 'Excel'],
  },
  {
    id: 'teachers',
    title: 'Teacher List',
    description: 'Export teacher data with subjects and qualifications',
    icon: Users,
    category: 'export',
    formats: ['CSV', 'Excel'],
  },
  {
    id: 'batches',
    title: 'Batch Summary',
    description: 'Export batch details with student counts',
    icon: ClipboardList,
    category: 'export',
    formats: ['CSV', 'Excel'],
  },
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Export attendance records by date range',
    icon: CalendarDays,
    category: 'export',
    formats: ['CSV', 'Excel'],
  },
  {
    id: 'results',
    title: 'Exam Results',
    description: 'Export exam results with grades and rankings',
    icon: TrendingUp,
    category: 'export',
    formats: ['CSV', 'Excel'],
  },
  {
    id: 'report-card',
    title: 'Student Report Card',
    description: 'Generate individual student progress reports',
    icon: FileText,
    category: 'report',
    formats: ['PDF'],
  },
  {
    id: 'marksheet',
    title: 'Exam Marksheet',
    description: 'Generate class-wise exam marksheets',
    icon: FileSpreadsheet,
    category: 'report',
    formats: ['PDF'],
  },
];

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('export');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [teacherRemarks, setTeacherRemarks] = useState('');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportType, setReportType] = useState<'report-card' | 'marksheet' | null>(null);

  const handleExport = async (type: string, format: 'csv' | 'excel') => {
    setIsExporting(`${type}-${format}`);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const filename = getExportFilename(type);
      
      switch (type) {
        case 'students':
          format === 'csv' 
            ? exportToCSV(mockStudents, studentColumns, filename)
            : exportToExcel(mockStudents, studentColumns, filename);
          break;
        case 'results':
          format === 'csv'
            ? exportToCSV(mockResults, resultColumns, filename)
            : exportToExcel(mockResults, resultColumns, filename);
          break;
        // Add other cases as needed
        default:
          format === 'csv'
            ? exportToCSV(mockStudents, studentColumns, filename)
            : exportToExcel(mockStudents, studentColumns, filename);
      }

      toast({
        title: 'Export Successful',
        description: `${type} data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleGenerateReportCard = () => {
    if (!selectedStudent) {
      toast({ title: 'Error', description: 'Please select a student', variant: 'destructive' });
      return;
    }

    const reportData: StudentReportData = {
      studentName: 'Rahima Akter',
      studentId: 'STU001',
      class: 'Class 10',
      batch: 'Morning Batch',
      rollNumber: '10',
      guardianName: 'Mohammad Akter',
      reportPeriod: 'January - June 2024',
      subjects: [
        { name: 'Physics', fullMarks: 100, obtainedMarks: 85, grade: 'A+', teacherName: 'Dr. Rahman' },
        { name: 'Chemistry', fullMarks: 100, obtainedMarks: 78, grade: 'A', teacherName: 'Mrs. Sultana' },
        { name: 'Mathematics', fullMarks: 100, obtainedMarks: 92, grade: 'A+', teacherName: 'Mr. Karim' },
        { name: 'Biology', fullMarks: 100, obtainedMarks: 88, grade: 'A+', teacherName: 'Ms. Fatima' },
        { name: 'English', fullMarks: 100, obtainedMarks: 75, grade: 'A', teacherName: 'Mr. Ahmed' },
        { name: 'Bangla', fullMarks: 100, obtainedMarks: 82, grade: 'A+', teacherName: 'Mrs. Begum' },
      ],
      attendance: {
        totalDays: 120,
        presentDays: 112,
        absentDays: 5,
        lateDays: 3,
        percentage: 93,
      },
      teacherRemarks: teacherRemarks || 'Rahima is an excellent student with consistent performance. She actively participates in class and shows great dedication to her studies.',
    };

    const doc = generateReportCardPDF(reportData);
    downloadPDF(doc, `report_card_${reportData.studentId}`);
    
    toast({
      title: 'Report Card Generated',
      description: 'PDF has been downloaded successfully',
    });
    
    setShowReportDialog(false);
    setTeacherRemarks('');
    setSelectedStudent('');
  };

  const handleGenerateMarksheet = () => {
    if (!selectedExam) {
      toast({ title: 'Error', description: 'Please select an exam', variant: 'destructive' });
      return;
    }

    const marksheetData: ExamMarksheet = {
      examName: 'Half Yearly Examination 2024',
      examDate: 'February 15, 2024',
      class: 'Class 10',
      subject: 'Physics',
      totalMarks: 100,
      students: [
        { rank: 1, rollNumber: '10', name: 'Rahima Akter', obtainedMarks: 92, percentage: 92, grade: 'A+' },
        { rank: 2, rollNumber: '15', name: 'Karim Hasan', obtainedMarks: 88, percentage: 88, grade: 'A+' },
        { rank: 3, rollNumber: '08', name: 'Fatima Begum', obtainedMarks: 85, percentage: 85, grade: 'A+' },
        { rank: 4, rollNumber: '22', name: 'Jamal Uddin', obtainedMarks: 78, percentage: 78, grade: 'A' },
        { rank: 5, rollNumber: '05', name: 'Ayesha Khatun', obtainedMarks: 75, percentage: 75, grade: 'A' },
        { rank: 6, rollNumber: '18', name: 'Rahim Khan', obtainedMarks: 72, percentage: 72, grade: 'A' },
        { rank: 7, rollNumber: '12', name: 'Salma Begum', obtainedMarks: 68, percentage: 68, grade: 'A-' },
        { rank: 8, rollNumber: '30', name: 'Habib Rahman', obtainedMarks: 65, percentage: 65, grade: 'A-' },
        { rank: 9, rollNumber: '25', name: 'Nasrin Akter', obtainedMarks: 58, percentage: 58, grade: 'B' },
        { rank: 10, rollNumber: '03', name: 'Kabir Hossain', obtainedMarks: 52, percentage: 52, grade: 'B' },
      ],
    };

    const doc = generateMarksheetPDF(marksheetData);
    downloadPDF(doc, `marksheet_${selectedExam}`);
    
    toast({
      title: 'Marksheet Generated',
      description: 'PDF has been downloaded successfully',
    });
    
    setShowReportDialog(false);
    setSelectedExam('');
  };

  const openReportDialog = (type: 'report-card' | 'marksheet') => {
    setReportType(type);
    setShowReportDialog(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Exports</h1>
        <p className="text-muted-foreground">
          Generate reports and export data in various formats
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Exports This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <FileText className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-muted-foreground">Report Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <ClipboardList className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Marksheets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Printer className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-muted-foreground">Prints</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export" className="gap-2">
            <Download className="h-4 w-4" />
            Data Exports
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            PDF Reports
          </TabsTrigger>
        </TabsList>

        {/* Data Exports Tab */}
        <TabsContent value="export" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes
              .filter((r) => r.category === 'export')
              .map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <report.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.description}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExport(report.id, 'csv')}
                            disabled={isExporting === `${report.id}-csv`}
                          >
                            {isExporting === `${report.id}-csv` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-1" />
                                CSV
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExport(report.id, 'excel')}
                            disabled={isExporting === `${report.id}-excel`}
                          >
                            {isExporting === `${report.id}-excel` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <FileSpreadsheet className="h-4 w-4 mr-1" />
                                Excel
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* PDF Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Card Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Student Report Card
                </CardTitle>
                <CardDescription>
                  Generate individual progress reports with grades and attendance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Preview will appear here
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => openReportDialog('report-card')}
                >
                  <FileText className="h-4 w-4" />
                  Generate Report Card
                </Button>
              </CardContent>
            </Card>

            {/* Marksheet Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                  Exam Marksheet
                </CardTitle>
                <CardDescription>
                  Generate class-wise marksheets with rankings and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Preview will appear here
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full gap-2"
                  variant="secondary"
                  onClick={() => openReportDialog('marksheet')}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Generate Marksheet
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Generation Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {reportType === 'report-card' ? 'Generate Report Card' : 'Generate Marksheet'}
            </DialogTitle>
            <DialogDescription>
              {reportType === 'report-card'
                ? 'Select a student to generate their progress report'
                : 'Select an exam to generate the class marksheet'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {reportType === 'report-card' ? (
              <>
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STU001">Rahima Akter - Class 10</SelectItem>
                      <SelectItem value="STU002">Karim Hasan - Class 10</SelectItem>
                      <SelectItem value="STU003">Fatima Begum - Class 9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Report Period</Label>
                  <Select defaultValue="jan-jun-2024">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan-jun-2024">January - June 2024</SelectItem>
                      <SelectItem value="jul-dec-2023">July - December 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Teacher's Remarks (Optional)</Label>
                  <Textarea
                    placeholder="Add personalized remarks for the student..."
                    value={teacherRemarks}
                    onChange={(e) => setTeacherRemarks(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Select Exam</Label>
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an exam..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="half-yearly-2024">Half Yearly 2024</SelectItem>
                      <SelectItem value="final-2023">Final Exam 2023</SelectItem>
                      <SelectItem value="weekly-test-15">Weekly Test #15</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select defaultValue="class-10">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class-10">Class 10</SelectItem>
                      <SelectItem value="class-9">Class 9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select defaultValue="physics">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={
                reportType === 'report-card'
                  ? handleGenerateReportCard
                  : handleGenerateMarksheet
              }
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Generate PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;
