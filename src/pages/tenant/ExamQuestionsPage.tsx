import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Search,
  Filter,
  Check,
  X,
  BookOpen,
  FileQuestion,
  Eye,
  Tag,
  AlertCircle,
  Shuffle,
  Dices,
  RefreshCw,
  Settings2,
  Sparkles,
  Layers,
  BarChart3,
  Bookmark,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  mockMcqs,
  mockCqs,
  mockSubjects,
  mockChapters,
  mockTopics,
  McqData,
} from '@/lib/academic-mock-data';
import { mockExams } from '@/lib/tenant-mock-data';
import { Cq } from '@/types';
import { useQuestionBookmarks } from '@/hooks/useQuestionBookmarks';
import { useAuth } from '@/hooks/useAuth';

interface SelectedQuestion {
  id: string;
  type: 'mcq' | 'cq';
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

      <p className="text-sm font-medium line-clamp-2 mb-2">
        {mcq ? mcq.question : cq?.context}
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen className="w-3 h-3" />
        <span>{subject?.displayName}</span>
        <span>•</span>
        <span>{chapter?.displayName}</span>
      </div>

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

const ExamQuestionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBookmarkedIds, isLoading: bookmarksLoading } = useQuestionBookmarks();

  // Get bookmarked IDs for both types
  const bookmarkedMcqIds = getBookmarkedIds('mcq');
  const bookmarkedCqIds = getBookmarkedIds('cq');

  // Find exam (mock for now)
  const exam = mockExams.find((e) => e.id === id);

  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<'mcq' | 'cq'>('mcq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<{
    question: McqData | Cq;
    type: 'mcq' | 'cq';
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get unique chapters from questions
  const availableChapters = useMemo(() => {
    const chapters = new Set<string>();
    mockMcqs.forEach((q) => chapters.add(q.chapterId));
    mockCqs.forEach((q) => chapters.add(q.chapterId));
    return mockChapters.filter((c) => chapters.has(c.id));
  }, []);

  // Filter questions
  const filteredMcqs = useMemo(() => {
    return mockMcqs.filter((q) => {
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChapter = !selectedChapter || q.chapterId === selectedChapter;
      const matchesBookmark = !showBookmarkedOnly || bookmarkedMcqIds.includes(q.id);
      return matchesSearch && matchesChapter && matchesBookmark;
    });
  }, [searchQuery, selectedChapter, showBookmarkedOnly, bookmarkedMcqIds]);

  const filteredCqs = useMemo(() => {
    return mockCqs.filter((q) => {
      const matchesSearch = q.context.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChapter = !selectedChapter || q.chapterId === selectedChapter;
      const matchesBookmark = !showBookmarkedOnly || bookmarkedCqIds.includes(q.id);
      return matchesSearch && matchesChapter && matchesBookmark;
    });
  }, [searchQuery, selectedChapter, showBookmarkedOnly, bookmarkedCqIds]);

  const isSelected = useCallback(
    (id: string, type: 'mcq' | 'cq') => {
      return selectedQuestions.some((q) => q.id === id && q.type === type);
    },
    [selectedQuestions]
  );

  const toggleQuestion = useCallback((id: string, type: 'mcq' | 'cq') => {
    setSelectedQuestions((prev) => {
      const exists = prev.some((q) => q.id === id && q.type === type);
      if (exists) {
        return prev.filter((q) => !(q.id === id && q.type === type));
      }
      return [...prev, { id, type }];
    });
  }, []);

  const selectedMcqs = selectedQuestions.filter((q) => q.type === 'mcq').length;
  const selectedCqs = selectedQuestions.filter((q) => q.type === 'cq').length;

  const bookmarkedMcqCount = useMemo(() => {
    return bookmarkedMcqIds.length;
  }, [bookmarkedMcqIds]);

  const bookmarkedCqCount = useMemo(() => {
    return bookmarkedCqIds.length;
  }, [bookmarkedCqIds]);

  const totalBookmarks = bookmarkedMcqCount + bookmarkedCqCount;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Questions saved successfully!', {
        description: `${selectedMcqs} MCQs and ${selectedCqs} CQs added to the exam.`,
      });
      navigate('/tenant/exams');
    } catch (error) {
      toast.error('Failed to save questions');
    } finally {
      setIsSaving(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedChapter('');
    setShowBookmarkedOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedChapter || showBookmarkedOnly;

  if (!exam) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Exam not found</p>
        <Button variant="link" onClick={() => navigate('/tenant/exams')}>
          Back to Exams
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/exams')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Select Questions</h1>
                <p className="text-sm text-muted-foreground">{exam.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex">
                {selectedMcqs} MCQ • {selectedCqs} CQ
              </Badge>
              <Button onClick={handleSave} disabled={isSaving || selectedQuestions.length === 0}>
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Questions
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Selection Stats */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedMcqs}</p>
                  <p className="text-xs text-muted-foreground">MCQs Selected</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedCqs}</p>
                  <p className="text-xs text-muted-foreground">CQs Selected</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedQuestions.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              {selectedQuestions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuestions([])}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Chapters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Chapters</SelectItem>
                  {availableChapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {totalBookmarks > 0 && (
                <Toggle
                  pressed={showBookmarkedOnly}
                  onPressedChange={setShowBookmarkedOnly}
                  className="gap-2"
                >
                  <Bookmark className={cn('w-4 h-4', showBookmarkedOnly && 'fill-current')} />
                  <span className="hidden sm:inline">Bookmarked</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {activeTab === 'mcq' ? bookmarkedMcqCount : bookmarkedCqCount}
                  </Badge>
                </Toggle>
              )}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'mcq' | 'cq')}>
          <TabsList className="mb-4">
            <TabsTrigger value="mcq" className="gap-2">
              <FileQuestion className="w-4 h-4" />
              MCQs
              <Badge variant="secondary" className="ml-1">
                {filteredMcqs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="cq" className="gap-2">
              <BookOpen className="w-4 h-4" />
              CQs
              <Badge variant="secondary" className="ml-1">
                {filteredCqs.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mcq">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMcqs.map((mcq) => (
                <QuestionCard
                  key={mcq.id}
                  question={mcq}
                  type="mcq"
                  isSelected={isSelected(mcq.id, 'mcq')}
                  onToggle={() => toggleQuestion(mcq.id, 'mcq')}
                  onPreview={() => setPreviewQuestion({ question: mcq, type: 'mcq' })}
                />
              ))}
              {filteredMcqs.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FileQuestion className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No MCQs found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cq">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCqs.map((cq) => (
                <QuestionCard
                  key={cq.id}
                  question={cq}
                  type="cq"
                  isSelected={isSelected(cq.id, 'cq')}
                  onToggle={() => toggleQuestion(cq.id, 'cq')}
                  onPreview={() => setPreviewQuestion({ question: cq, type: 'cq' })}
                />
              ))}
              {filteredCqs.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No CQs found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

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

export default ExamQuestionsPage;
