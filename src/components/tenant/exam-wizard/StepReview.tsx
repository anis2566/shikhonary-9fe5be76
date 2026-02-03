import React from 'react';
import { format } from 'date-fns';
import {
  FileText,
  Users,
  BookOpen,
  Calendar,
  Clock,
  Settings,
  Edit,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { examTypes } from '@/lib/exam-scheduling-utils';
import { mockBatches } from '@/lib/tenant-mock-data';

// Mock subjects - same as StepSubjectPicker
const mockSubjects = [
  { id: 'sub-1', name: 'Physics', code: 'PHY' },
  { id: 'sub-2', name: 'Mathematics', code: 'MATH' },
  { id: 'sub-3', name: 'Chemistry', code: 'CHEM' },
  { id: 'sub-4', name: 'English', code: 'ENG' },
  { id: 'sub-5', name: 'Bengali', code: 'BAN' },
  { id: 'sub-6', name: 'Biology', code: 'BIO' },
  { id: 'sub-7', name: 'ICT', code: 'ICT' },
  { id: 'sub-8', name: 'Higher Math', code: 'HMATH' },
];

interface ExamFormData {
  title: string;
  description: string;
  type: string;
  batchIds: string[];
  subjectId: string;
  chapterIds: string[];
  startDate?: Date;
  startTime: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  mcqCount: number;
  cqCount: number;
  hasNegativeMark: boolean;
  negativeMark: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  allowReview: boolean;
}

interface StepReviewProps {
  data: ExamFormData;
  onEditStep: (step: number) => void;
}

const StepReview: React.FC<StepReviewProps> = ({ data, onEditStep }) => {
  const examType = examTypes.find((t) => t.value === data.type);
  const selectedBatches = mockBatches.filter((b) => data.batchIds.includes(b.id));
  const selectedSubject = mockSubjects.find((s) => s.id === data.subjectId);
  const totalStudents = selectedBatches.reduce((sum, b) => sum + b.currentSize, 0);

  const sections = [
    {
      title: 'Basic Information',
      step: 1,
      icon: FileText,
      items: [
        { label: 'Title', value: data.title || 'Not set' },
        { label: 'Description', value: data.description || 'No description' },
        { label: 'Type', value: examType?.label || 'Not selected' },
      ],
    },
    {
      title: 'Batches',
      step: 2,
      icon: Users,
      items: [
        {
          label: 'Selected Batches',
          value:
            selectedBatches.length > 0
              ? selectedBatches.map((b) => b.name).join(', ')
              : 'None selected',
        },
        { label: 'Total Students', value: totalStudents.toString() },
      ],
    },
    {
      title: 'Subject',
      step: 3,
      icon: BookOpen,
      items: [
        { label: 'Subject', value: selectedSubject?.name || 'Not selected' },
        { label: 'Code', value: selectedSubject?.code || '-' },
      ],
    },
    {
      title: 'Schedule',
      step: 4,
      icon: Calendar,
      items: [
        {
          label: 'Date',
          value: data.startDate
            ? format(data.startDate, 'EEEE, MMMM d, yyyy')
            : 'Not set',
        },
        { label: 'Time', value: data.startTime || 'Not set' },
        { label: 'Duration', value: `${data.duration} minutes` },
      ],
    },
    {
      title: 'Configuration',
      step: 5,
      icon: Settings,
      items: [
        { label: 'Total Marks', value: data.totalMarks.toString() },
        {
          label: 'Passing Marks',
          value: `${data.passingMarks} (${Math.round(
            (data.passingMarks / data.totalMarks) * 100
          )}%)`,
        },
        { label: 'MCQ Count', value: data.mcqCount.toString() },
        { label: 'CQ Count', value: data.cqCount.toString() },
        {
          label: 'Negative Marking',
          value: data.hasNegativeMark ? `-${data.negativeMark} per wrong` : 'Disabled',
        },
      ],
    },
  ];

  const settings = [
    { label: 'Shuffle Questions', enabled: data.shuffleQuestions },
    { label: 'Show Results', enabled: data.showResults },
    { label: 'Allow Review', enabled: data.allowReview },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review & Confirm</h2>
        <p className="text-sm text-muted-foreground">
          Please review all details before creating the exam
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{section.title}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditStep(section.step)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="p-3 space-y-2">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-right max-w-[60%] truncate">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings Summary */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium text-sm mb-3">Exam Settings</h3>
        <div className="flex flex-wrap gap-2">
          {settings.map((setting) => (
            <Badge
              key={setting.label}
              variant={setting.enabled ? 'default' : 'outline'}
              className={cn(
                setting.enabled
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'text-muted-foreground'
              )}
            >
              {setting.enabled ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : null}
              {setting.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-primary/10 text-center">
          <p className="text-2xl font-bold text-primary">{totalStudents}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-500/10 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {data.mcqCount + data.cqCount}
          </p>
          <p className="text-xs text-muted-foreground">Questions</p>
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 text-center">
          <p className="text-2xl font-bold text-green-600">{data.totalMarks}</p>
          <p className="text-xs text-muted-foreground">Total Marks</p>
        </div>
        <div className="p-3 rounded-lg bg-amber-500/10 text-center">
          <p className="text-2xl font-bold text-amber-600">{data.duration}</p>
          <p className="text-xs text-muted-foreground">Minutes</p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border">
        <p className="text-sm text-muted-foreground">
          <strong>Next Steps:</strong> After creating the exam, you can add
          questions from the question bank and publish it when ready.
        </p>
      </div>
    </div>
  );
};

export default StepReview;
