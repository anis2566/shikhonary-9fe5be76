import React, { useState, useMemo, useCallback } from 'react';
import {
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
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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

interface RandomConfig {
  mcqCount: number;
  cqCount: number;
  chapterIds: string[];
  types: string[];
  sessions: number[];
  balanceByChapter: boolean;
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

// Random Selection Panel Component
const RandomSelectionPanel: React.FC<{
  config: RandomConfig;
  onConfigChange: (config: RandomConfig) => void;
  onGenerate: () => void;
  availableChapters: typeof mockChapters;
  availableSessions: number[];
  maxMcqs: number;
  maxCqs: number;
}> = ({
  config,
  onConfigChange,
  onGenerate,
  availableChapters,
  availableSessions,
  maxMcqs,
  maxCqs,
}) => {
  const questionTypes = ['single', 'multiple', 'assertion', 'statement'];

  const toggleChapter = (chapterId: string) => {
    const newChapterIds = config.chapterIds.includes(chapterId)
      ? config.chapterIds.filter((id) => id !== chapterId)
      : [...config.chapterIds, chapterId];
    onConfigChange({ ...config, chapterIds: newChapterIds });
  };

  const toggleType = (type: string) => {
    const newTypes = config.types.includes(type)
      ? config.types.filter((t) => t !== type)
      : [...config.types, type];
    onConfigChange({ ...config, types: newTypes });
  };

  const toggleSession = (session: number) => {
    const newSessions = config.sessions.includes(session)
      ? config.sessions.filter((s) => s !== session)
      : [...config.sessions, session];
    onConfigChange({ ...config, sessions: newSessions });
  };

  return (
    <div className="space-y-6 p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
          <Dices className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold">Random Question Selection</h3>
          <p className="text-sm text-muted-foreground">
            Configure criteria and auto-select questions
          </p>
        </div>
      </div>

      {/* Question Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>MCQ Count</Label>
            <span className="text-sm font-medium">{config.mcqCount}</span>
          </div>
          <Slider
            value={[config.mcqCount]}
            onValueChange={([value]) =>
              onConfigChange({ ...config, mcqCount: value })
            }
            max={maxMcqs}
            min={0}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Available: {maxMcqs} MCQs
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>CQ Count</Label>
            <span className="text-sm font-medium">{config.cqCount}</span>
          </div>
          <Slider
            value={[config.cqCount]}
            onValueChange={([value]) =>
              onConfigChange({ ...config, cqCount: value })
            }
            max={maxCqs}
            min={0}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Available: {maxCqs} CQs
          </p>
        </div>
      </div>

      {/* Chapter Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Chapters
          </Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onConfigChange({
                  ...config,
                  chapterIds: availableChapters.map((c) => c.id),
                })
              }
              className="text-xs text-primary hover:underline"
            >
              All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              type="button"
              onClick={() => onConfigChange({ ...config, chapterIds: [] })}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              None
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableChapters.map((chapter) => (
            <Badge
              key={chapter.id}
              variant={
                config.chapterIds.includes(chapter.id) ? 'default' : 'outline'
              }
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleChapter(chapter.id)}
            >
              {chapter.displayName}
              {config.chapterIds.includes(chapter.id) && (
                <Check className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
          {availableChapters.length === 0 && (
            <p className="text-sm text-muted-foreground">No chapters available</p>
          )}
        </div>
      </div>

      {/* Question Types */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Question Types (MCQ)
          </Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onConfigChange({ ...config, types: [...questionTypes] })
              }
              className="text-xs text-primary hover:underline"
            >
              All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              type="button"
              onClick={() => onConfigChange({ ...config, types: [] })}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              None
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {questionTypes.map((type) => (
            <Badge
              key={type}
              variant={config.types.includes(type) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer capitalize transition-all hover:scale-105',
                config.types.includes(type) && typeColors[type]
              )}
              onClick={() => toggleType(type)}
            >
              {type}
              {config.types.includes(type) && (
                <Check className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Session Years */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Session Years
          </Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onConfigChange({ ...config, sessions: [...availableSessions] })
              }
              className="text-xs text-primary hover:underline"
            >
              All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              type="button"
              onClick={() => onConfigChange({ ...config, sessions: [] })}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              None
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSessions.map((session) => (
            <Badge
              key={session}
              variant={config.sessions.includes(session) ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleSession(session)}
            >
              {session}
              {config.sessions.includes(session) && (
                <Check className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Balance Option */}
      <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
        <div>
          <p className="font-medium text-sm">Balance by Chapter</p>
          <p className="text-xs text-muted-foreground">
            Distribute questions evenly across selected chapters
          </p>
        </div>
        <Switch
          checked={config.balanceByChapter}
          onCheckedChange={(checked) =>
            onConfigChange({ ...config, balanceByChapter: checked })
          }
        />
      </div>

      {/* Generate Button */}
      <Button
        type="button"
        onClick={onGenerate}
        className="w-full gap-2"
        size="lg"
      >
        <Sparkles className="w-5 h-5" />
        Generate Random Selection
      </Button>
    </div>
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
  const [selectionMode, setSelectionMode] = useState<'manual' | 'random'>('manual');
  const [previewQuestion, setPreviewQuestion] = useState<{
    question: McqData | Cq;
    type: 'mcq' | 'cq';
  } | null>(null);

  // Random selection config
  const [randomConfig, setRandomConfig] = useState<RandomConfig>({
    mcqCount: 5,
    cqCount: 2,
    chapterIds: [],
    types: ['single', 'multiple', 'assertion', 'statement'],
    sessions: [],
    balanceByChapter: false,
  });

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

  // Available questions for random selection (respecting subject filter)
  const availableMcqsForRandom = useMemo(() => {
    return mockMcqs.filter((mcq) => {
      const matchesSubject = !data.subjectId || mcq.subjectId === data.subjectId;
      const matchesChapter =
        randomConfig.chapterIds.length === 0 ||
        randomConfig.chapterIds.includes(mcq.chapterId);
      const matchesType =
        randomConfig.types.length === 0 || randomConfig.types.includes(mcq.type);
      const matchesSession =
        randomConfig.sessions.length === 0 ||
        randomConfig.sessions.includes(mcq.session);
      const isActive = mcq.isActive;

      return matchesSubject && matchesChapter && matchesType && matchesSession && isActive;
    });
  }, [data.subjectId, randomConfig]);

  const availableCqsForRandom = useMemo(() => {
    return mockCqs.filter((cq) => {
      const matchesSubject = !data.subjectId || cq.subjectId === data.subjectId;
      const matchesChapter =
        randomConfig.chapterIds.length === 0 ||
        randomConfig.chapterIds.includes(cq.chapterId);
      const isActive = cq.isActive;

      return matchesSubject && matchesChapter && isActive;
    });
  }, [data.subjectId, randomConfig]);

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

  // Random selection generator
  const generateRandomSelection = useCallback(() => {
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    let selectedMcqIds: string[] = [];
    let selectedCqIds: string[] = [];

    if (randomConfig.balanceByChapter && randomConfig.chapterIds.length > 0) {
      // Balanced selection by chapter
      const mcqsPerChapter = Math.ceil(
        randomConfig.mcqCount / randomConfig.chapterIds.length
      );
      const cqsPerChapter = Math.ceil(
        randomConfig.cqCount / randomConfig.chapterIds.length
      );

      for (const chapterId of randomConfig.chapterIds) {
        const chapterMcqs = availableMcqsForRandom.filter(
          (m) => m.chapterId === chapterId
        );
        const chapterCqs = availableCqsForRandom.filter(
          (c) => c.chapterId === chapterId
        );

        const shuffledMcqs = shuffleArray(chapterMcqs);
        const shuffledCqs = shuffleArray(chapterCqs);

        selectedMcqIds.push(
          ...shuffledMcqs.slice(0, mcqsPerChapter).map((m) => m.id)
        );
        selectedCqIds.push(
          ...shuffledCqs.slice(0, cqsPerChapter).map((c) => c.id)
        );
      }

      // Trim to exact counts
      selectedMcqIds = selectedMcqIds.slice(0, randomConfig.mcqCount);
      selectedCqIds = selectedCqIds.slice(0, randomConfig.cqCount);
    } else {
      // Simple random selection
      const shuffledMcqs = shuffleArray(availableMcqsForRandom);
      const shuffledCqs = shuffleArray(availableCqsForRandom);

      selectedMcqIds = shuffledMcqs
        .slice(0, randomConfig.mcqCount)
        .map((m) => m.id);
      selectedCqIds = shuffledCqs.slice(0, randomConfig.cqCount).map((c) => c.id);
    }

    const newSelection: SelectedQuestion[] = [
      ...selectedMcqIds.map((id) => ({ id, type: 'mcq' as const })),
      ...selectedCqIds.map((id) => ({ id, type: 'cq' as const })),
    ];

    onChange('selectedQuestions', newSelection);
    onChange('mcqCount', selectedMcqIds.length);
    onChange('cqCount', selectedCqIds.length);

    // Switch to manual mode to show selected questions
    setSelectionMode('manual');
  }, [availableMcqsForRandom, availableCqsForRandom, randomConfig, onChange]);

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

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 rounded-lg bg-muted">
        <button
          type="button"
          onClick={() => setSelectionMode('manual')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
            selectionMode === 'manual'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Search className="w-4 h-4" />
          Manual Selection
        </button>
        <button
          type="button"
          onClick={() => setSelectionMode('random')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
            selectionMode === 'random'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Shuffle className="w-4 h-4" />
          Random Selection
        </button>
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

      {/* Random Selection Mode */}
      {selectionMode === 'random' && (
        <RandomSelectionPanel
          config={randomConfig}
          onConfigChange={setRandomConfig}
          onGenerate={generateRandomSelection}
          availableChapters={availableChapters}
          availableSessions={availableSessions}
          maxMcqs={availableMcqsForRandom.length}
          maxCqs={availableCqsForRandom.length}
        />
      )}

      {/* Manual Selection Mode */}
      {selectionMode === 'manual' && (
        <>
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

            {/* Regenerate button when questions are selected */}
            {data.selectedQuestions.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectionMode('random')}
                className="ml-auto gap-1 text-primary"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            )}
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
                        <Select
                          value={filterSession}
                          onValueChange={setFilterSession}
                        >
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
              Select All (
              {activeTab === 'mcq' ? filteredMcqs.length : filteredCqs.length})
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
                    onPreview={() =>
                      setPreviewQuestion({ question: mcq, type: 'mcq' })
                    }
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
                    onPreview={() =>
                      setPreviewQuestion({ question: cq, type: 'cq' })
                    }
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
        </>
      )}

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
