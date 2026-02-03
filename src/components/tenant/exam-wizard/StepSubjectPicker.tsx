import React from 'react';
import { BookOpen, Search, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock subjects data - in real app, this would come from the backend
const mockSubjects = [
  { id: 'sub-1', name: 'Physics', code: 'PHY', chapters: 12, color: 'blue' },
  { id: 'sub-2', name: 'Mathematics', code: 'MATH', chapters: 15, color: 'purple' },
  { id: 'sub-3', name: 'Chemistry', code: 'CHEM', chapters: 14, color: 'green' },
  { id: 'sub-4', name: 'English', code: 'ENG', chapters: 10, color: 'amber' },
  { id: 'sub-5', name: 'Bengali', code: 'BAN', chapters: 8, color: 'rose' },
  { id: 'sub-6', name: 'Biology', code: 'BIO', chapters: 16, color: 'emerald' },
  { id: 'sub-7', name: 'ICT', code: 'ICT', chapters: 6, color: 'cyan' },
  { id: 'sub-8', name: 'Higher Math', code: 'HMATH', chapters: 12, color: 'indigo' },
];

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
  purple: 'bg-purple-500/10 text-purple-600 border-purple-200',
  green: 'bg-green-500/10 text-green-600 border-green-200',
  amber: 'bg-amber-500/10 text-amber-600 border-amber-200',
  rose: 'bg-rose-500/10 text-rose-600 border-rose-200',
  emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
};

interface StepSubjectPickerProps {
  data: {
    subjectId: string;
    chapterIds: string[];
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string | string[]) => void;
}

const StepSubjectPicker: React.FC<StepSubjectPickerProps> = ({
  data,
  errors,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSubjects = mockSubjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSubject = mockSubjects.find((s) => s.id === data.subjectId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Select Subject</h2>
        <p className="text-sm text-muted-foreground">
          Choose the subject for this examination
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {selectedSubject && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-medium">Selected:</span>
          <Badge className={cn(colorClasses[selectedSubject.color])}>
            {selectedSubject.name}
          </Badge>
          <button
            type="button"
            onClick={() => onChange('subjectId', '')}
            className="ml-auto text-sm text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSubjects.map((subject) => {
          const isSelected = data.subjectId === subject.id;

          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onChange('subjectId', subject.id)}
              className={cn(
                'flex flex-col items-start p-4 rounded-lg border-2 text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <Badge
                  variant="outline"
                  className={cn('text-xs', colorClasses[subject.color])}
                >
                  {subject.code}
                </Badge>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="font-semibold">{subject.name}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Layers className="w-3 h-3" />
                <span>{subject.chapters} chapters</span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No subjects found</p>
        </div>
      )}

      <div className="p-4 rounded-lg bg-muted/50 border">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> You can create exams with questions from multiple chapters.
          Chapter selection will be available in the question bank during question selection.
        </p>
      </div>
    </div>
  );
};

export default StepSubjectPicker;
