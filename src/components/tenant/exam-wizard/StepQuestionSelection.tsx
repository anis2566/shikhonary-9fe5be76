import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileQuestion,
  Eye,
  Layers,
  Tag,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  mockMcqs,
  mockCqs,
  mockSubjects,
  mockChapters,
  mockTopics,
  McqData,
} from '@/lib/academic-mock-data';
import { Cq } from '@/types';

interface SelectedQuestion {
  id: string;
  type: 'mcq' | 'cq';
}

interface StepQuestionSelectionProps {
  data: {
    subjectId: string;
    selectedQuestions: SelectedQuestion[];
    mcqCount: number;
    cqCount: number;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: SelectedQuestion[] | number) => void;
}

const typeColors: Record<string, string> = {
  single: 'bg-blue-500/10 text-blue-600 border-blue-200',
  multiple: 'bg-purple-500/10 text-purple-600 border-purple-200',
  assertion: 'bg-amber-500/10 text-amber-600 border-amber-200',
  statement: 'bg-green-500/10 text-green-600 border-green-200',
};

const QuestionCard: React.FC<{
  question: McqData | Cq;
  type: 'mcq' | 'cq';
  isSelected: boolean;
  onToggle: () => void;
  onPreview: () => void;
}> = ({ question, type, isSelected, onToggle, onPreview }) => {
  const mcq = type === 'mcq' ? (question as McqData) : null;
  const cq = type === 'cq' ? (question as Cq) : null;

  const subject = mockSubjects.find((s) => s.id === question.subjectId);
  const chapter = mockChapters.find((c) => c.id === question.chapterId);

  return (
    <div
      className={cn(
        'relative border rounded-lg p-4 transition-all cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      )}
      onClick={onToggle}
    >
      {/* Selection Indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <Eye className="w-4 h-4" />
        </button>
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
            isSelected
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-muted-foreground/30'
          )}
        >
          {isSelected && <Check className="w-3 h-3" />}
        </div>
      </div>

      {/* Question Type & Metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-2 pr-20">
        <Badge variant="outline" className="text-xs">
          {type.toUpperCase()}
        </Badge>
        {mcq && (
          <>
            <Badge
              variant="outline"
              className={cn('text-xs capitalize', typeColors[mcq.type] || '')}
            >
              {mcq.type}
            </Badge>
            <Badge variant="outline" className="text-xs bg-muted">
              {mcq.session}
            </Badge>
          </>
        )}
      </div>

      {/* Question Text */}
      <p className="text-sm font-medium line-clamp-2 mb-2">
        {mcq ? mcq.question : cq?.context}
      </p>

      {/* Subject & Chapter */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen className="w-3 h-3" />
        <span>{subject?.displayName}</span>
        <span>•</span>
        <span>{chapter?.displayName}</span>
      </div>

      {/* Options preview for MCQ */}
      {mcq && mcq.options.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-1">
          {mcq.options.slice(0, 4).map((option, idx) => (
            <div
              key={idx}
              className={cn(
                'text-xs px-2 py-1 rounded truncate',
                mcq.answer === String.fromCharCode(65 + idx)
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {String.fromCharCode(65 + idx)}. {option}
            </div>
          ))}
        </div>
      )}

      {/* CQ parts preview */}
      {cq && (
        <div className="mt-3 flex gap-2">
          {['A', 'B', 'C', 'D'].map((part) => (
            <Badge key={part} variant="outline" className="text-xs">
              Part {part}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

const QuestionPreviewDialog: React.FC<{
  question: McqData | Cq | null;
  type: 'mcq' | 'cq';
  isOpen: boolean;
  onClose: () => void;
}> = ({ question, type, isOpen, onClose }) => {
  if (!question) return null;

  const mcq = type === 'mcq' ? (question as McqData) : null;
  const cq = type === 'cq' ? (question as Cq) : null;

  const subject = mockSubjects.find((s) => s.id === question.subjectId);
  const chapter = mockChapters.find((c) => c.id === question.chapterId);
  const topic = mockTopics.find((t) => t.id === question.topicId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Question Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{type.toUpperCase()}</Badge>
            {mcq && (
              <>
                <Badge
                  variant="outline"
                  className={cn('capitalize', typeColors[mcq.type] || '')}
                >
                  {mcq.type}
                </Badge>
                <Badge variant="outline" className="bg-muted">
                  Session {mcq.session}
                </Badge>
                {mcq.source && (
                  <Badge variant="outline">
                    <Tag className="w-3 h-3 mr-1" />
                    {mcq.source}
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{subject?.displayName}</span>
            <span>›</span>
            <span>{chapter?.displayName}</span>
            {topic && (
              <>
                <span>›</span>
                <span>{topic.displayName}</span>
              </>
            )}
          </div>

          {/* MCQ Content */}
          {mcq && (
            <div className="space-y-4">
              {mcq.context && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Context / Passage
                  </p>
                  <p className="text-sm">{mcq.context}</p>
                </div>
              )}

              <div>
                <p className="font-medium mb-3">{mcq.question}</p>

                <div className="space-y-2">
                  {mcq.options.map((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isCorrect = mcq.answer === letter;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg border',
                          isCorrect
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-muted/50'
                        )}
                      >
                        <span
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                            isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-muted-foreground/20'
                          )}
                        >
                          {letter}
                        </span>
                        <span className="text-sm">{option}</span>
                        {isCorrect && (
                          <Check className="w-4 h-4 text-green-500 ml-auto shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {mcq.explanation && (
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-xs font-medium text-blue-600 mb-1">
                    Explanation
                  </p>
                  <p className="text-sm">{mcq.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* CQ Content */}
          {cq && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Stimulus / Context
                </p>
                <p className="text-sm">{cq.context}</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Part A (Knowledge)', text: cq.questionA },
                  { label: 'Part B (Understanding)', text: cq.questionB },
                  { label: 'Part C (Application)', text: cq.questionC },
                  { label: 'Part D (Higher Order)', text: cq.questionD },
                ].map((part, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {part.label}
                    </p>
                    <p className="text-sm">{part.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Total Marks:</span>
                <Badge>{cq.marks}</Badge>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StepQuestionSelection: React.FC<StepQuestionSelectionProps> = ({
  data,
  errors,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'mcq' | 'cq'>('mcq');
  const [filterChapter, setFilterChapter] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSession, setFilterSession] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<{
    question: McqData | Cq;
    type: 'mcq' | 'cq';
  } | null>(null);

  // Filter questions based on subject and other filters
  const filteredMcqs = useMemo(() => {
    return mockMcqs.filter((mcq) => {
      const matchesSubject = !data.subjectId || mcq.subjectId === data.subjectId;
      const matchesSearch =
        !searchQuery ||
        mcq.question.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChapter =
        filterChapter === 'all' || mcq.chapterId === filterChapter;
      const matchesType = filterType === 'all' || mcq.type === filterType;
      const matchesSession =
        filterSession === 'all' || mcq.session.toString() === filterSession;
      const isActive = mcq.isActive;

      return (
        matchesSubject &&
        matchesSearch &&
        matchesChapter &&
        matchesType &&
        matchesSession &&
        isActive
      );
    });
  }, [data.subjectId, searchQuery, filterChapter, filterType, filterSession]);

  const filteredCqs = useMemo(() => {
    return mockCqs.filter((cq) => {
      const matchesSubject = !data.subjectId || cq.subjectId === data.subjectId;
      const matchesSearch =
        !searchQuery ||
        cq.context?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cq.questionA.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChapter =
        filterChapter === 'all' || cq.chapterId === filterChapter;
      const isActive = cq.isActive;

      return matchesSubject && matchesSearch && matchesChapter && isActive;
    });
  }, [data.subjectId, searchQuery, filterChapter]);

  // Get available chapters for filter
  const availableChapters = useMemo(() => {
    if (!data.subjectId) return mockChapters;
    return mockChapters.filter((c) => c.subjectId === data.subjectId);
  }, [data.subjectId]);

  // Get unique sessions
  const availableSessions = useMemo(() => {
    const sessions = [...new Set(mockMcqs.map((m) => m.session))];
    return sessions.sort((a, b) => b - a);
  }, []);

  // Selected counts
  const selectedMcqs = data.selectedQuestions.filter((q) => q.type === 'mcq');
  const selectedCqs = data.selectedQuestions.filter((q) => q.type === 'cq');

  const isQuestionSelected = (id: string, type: 'mcq' | 'cq') => {
    return data.selectedQuestions.some((q) => q.id === id && q.type === type);
  };

  const toggleQuestion = (id: string, type: 'mcq' | 'cq') => {
    const isSelected = isQuestionSelected(id, type);
    let newSelection: SelectedQuestion[];

    if (isSelected) {
      newSelection = data.selectedQuestions.filter(
        (q) => !(q.id === id && q.type === type)
      );
    } else {
      newSelection = [...data.selectedQuestions, { id, type }];
    }

    onChange('selectedQuestions', newSelection);

    // Auto-update counts
    const mcqCount = newSelection.filter((q) => q.type === 'mcq').length;
    const cqCount = newSelection.filter((q) => q.type === 'cq').length;
    onChange('mcqCount', mcqCount);
    onChange('cqCount', cqCount);
  };

  const selectAll = (type: 'mcq' | 'cq') => {
    const questions = type === 'mcq' ? filteredMcqs : filteredCqs;
    const existingOther = data.selectedQuestions.filter((q) => q.type !== type);
    const newSelection = [
      ...existingOther,
      ...questions.map((q) => ({ id: q.id, type })),
    ];
    onChange('selectedQuestions', newSelection);
    
    const mcqCount = newSelection.filter((q) => q.type === 'mcq').length;
    const cqCount = newSelection.filter((q) => q.type === 'cq').length;
    onChange('mcqCount', mcqCount);
    onChange('cqCount', cqCount);
  };

  const clearAll = (type: 'mcq' | 'cq') => {
    const newSelection = data.selectedQuestions.filter((q) => q.type !== type);
    onChange('selectedQuestions', newSelection);
    
    if (type === 'mcq') onChange('mcqCount', 0);
    else onChange('cqCount', 0);
  };

  const clearFilters = () => {
    setFilterChapter('all');
    setFilterType('all');
    setFilterSession('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    filterChapter !== 'all' ||
    filterType !== 'all' ||
    filterSession !== 'all' ||
    searchQuery;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Select Questions</h2>
        <p className="text-sm text-muted-foreground">
          Choose questions from the question bank for this exam
        </p>
      </div>

      {/* Selection Summary */}
      <div className="flex flex-wrap gap-3 p-4 rounded-lg bg-muted/50 border">
        <div className="flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-primary" />
          <span className="font-medium">Selected:</span>
        </div>
        <Badge
          variant={selectedMcqs.length > 0 ? 'default' : 'outline'}
          className="gap-1"
        >
          {selectedMcqs.length} MCQs
        </Badge>
        <Badge
          variant={selectedCqs.length > 0 ? 'default' : 'outline'}
          className="gap-1"
        >
          {selectedCqs.length} CQs
        </Badge>
        <span className="text-sm text-muted-foreground ml-auto">
          Total: {data.selectedQuestions.length} questions
        </span>
      </div>

      {/* Subject notice */}
      {!data.subjectId && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-600">No subject selected</p>
            <p className="text-sm text-amber-600/80">
              Showing questions from all subjects. Go back to step 3 to select a
              specific subject for filtered results.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab('mcq')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
            activeTab === 'mcq'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <span>MCQ</span>
          <Badge variant="secondary" className="text-xs">
            {filteredMcqs.length}
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cq')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
            activeTab === 'cq'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <span>CQ</span>
          <Badge variant="secondary" className="text-xs">
            {filteredCqs.length}
          </Badge>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            variant={showFilters ? 'secondary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>

        <Collapsible open={showFilters}>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-3 p-4 rounded-lg border bg-muted/30">
              <div className="space-y-1 min-w-[150px]">
                <Label className="text-xs">Chapter</Label>
                <Select value={filterChapter} onValueChange={setFilterChapter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All chapters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    {availableChapters.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        {ch.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeTab === 'mcq' && (
                <>
                  <div className="space-y-1 min-w-[130px]">
                    <Label className="text-xs">Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="multiple">Multiple</SelectItem>
                        <SelectItem value="assertion">Assertion</SelectItem>
                        <SelectItem value="statement">Statement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 min-w-[120px]">
                    <Label className="text-xs">Session</Label>
                    <Select value={filterSession} onValueChange={setFilterSession}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="All sessions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sessions</SelectItem>
                        {availableSessions.map((s) => (
                          <SelectItem key={s} value={s.toString()}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="self-end"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => selectAll(activeTab)}
          className="text-sm text-primary hover:underline"
        >
          Select All ({activeTab === 'mcq' ? filteredMcqs.length : filteredCqs.length})
        </button>
        <span className="text-muted-foreground">|</span>
        <button
          type="button"
          onClick={() => clearAll(activeTab)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear Selected (
          {activeTab === 'mcq' ? selectedMcqs.length : selectedCqs.length})
        </button>
      </div>

      {/* Questions Grid */}
      <ScrollArea className="h-[400px] rounded-lg border p-4">
        {activeTab === 'mcq' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMcqs.map((mcq) => (
              <QuestionCard
                key={mcq.id}
                question={mcq}
                type="mcq"
                isSelected={isQuestionSelected(mcq.id, 'mcq')}
                onToggle={() => toggleQuestion(mcq.id, 'mcq')}
                onPreview={() => setPreviewQuestion({ question: mcq, type: 'mcq' })}
              />
            ))}
            {filteredMcqs.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <FileQuestion className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No MCQs found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cq' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCqs.map((cq) => (
              <QuestionCard
                key={cq.id}
                question={cq}
                type="cq"
                isSelected={isQuestionSelected(cq.id, 'cq')}
                onToggle={() => toggleQuestion(cq.id, 'cq')}
                onPreview={() => setPreviewQuestion({ question: cq, type: 'cq' })}
              />
            ))}
            {filteredCqs.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <FileQuestion className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No CQs found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Warning if no questions selected */}
      {data.selectedQuestions.length === 0 && errors.selectedQuestions && (
        <p className="text-sm text-destructive">{errors.selectedQuestions}</p>
      )}

      {/* Preview Dialog */}
      <QuestionPreviewDialog
        question={previewQuestion?.question || null}
        type={previewQuestion?.type || 'mcq'}
        isOpen={!!previewQuestion}
        onClose={() => setPreviewQuestion(null)}
      />
    </div>
  );
};

export default StepQuestionSelection;
