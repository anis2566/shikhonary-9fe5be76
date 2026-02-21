import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Trash2, ChevronDown, ChevronUp, FileJson, Copy, AlertCircle, CheckCircle2, Plus, X, Edit3 } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { McqData, mockSubjects, mockChapters, mockTopics, mockSubTopics, getSubjectById, getChapterById, getTopicById, getSubTopicById, getChaptersBySubject, getTopicsByChapter, getSubTopicsByTopic } from '@/lib/academic-mock-data';
import { cn } from '@/lib/utils';

const SAMPLE_JSON: Omit<McqData, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>[] = [
  {
    question: "Which of the following is a fundamental force in nature?",
    options: ["Friction", "Gravitational force", "Tension", "Normal force"],
    statements: [],
    answer: "B",
    type: "single",
    reference: ["NCERT Physics Class 11"],
    explanation: "Gravitational force is one of the four fundamental forces. Friction, tension, and normal force are contact forces derived from electromagnetic interactions.",
    isMath: false,
    session: 2024,
    source: "Board Exam 2024",
    subjectId: "subject-1",
    chapterId: "chapter-2",
    topicId: "topic-4",
  },
  {
    question: "Consider the following statements about Newton's laws:\nI. First law defines inertia\nII. Second law gives F=ma\nIII. Third law applies only to contact forces\n\nWhich statements are correct?",
    options: ["I and II only", "II and III only", "I, II, and III", "I only"],
    statements: ["First law defines inertia", "Second law gives F=ma", "Third law applies only to contact forces"],
    answer: "A",
    type: "statement",
    reference: ["Physics MCQ Bank", "Newton's Principia"],
    explanation: "Statements I and II are correct. Statement III is wrong — Newton's third law applies to all forces including non-contact forces like gravity.",
    isMath: false,
    session: 2024,
    source: "Competitive Exam",
    context: "Newton formulated three laws of motion that form the foundation of classical mechanics.",
    subjectId: "subject-1",
    chapterId: "chapter-2",
    topicId: "topic-4",
  },
  {
    question: "Assertion (A): An object moving in a circle at constant speed has acceleration.\nReason (R): Acceleration is the rate of change of velocity, which is a vector.",
    options: [
      "Both A and R are true and R is the correct explanation of A",
      "Both A and R are true but R is not the correct explanation of A",
      "A is true but R is false",
      "A is false but R is true"
    ],
    statements: [],
    answer: "A",
    type: "assertion",
    reference: ["Circular Motion Guide"],
    explanation: "In circular motion, the direction of velocity changes constantly, resulting in centripetal acceleration even at constant speed. R correctly explains why — velocity is a vector.",
    isMath: false,
    session: 2023,
    subjectId: "subject-1",
    chapterId: "chapter-1",
    topicId: "topic-2",
    subTopicId: "subtopic-3",
  },
  {
    question: "The dimensional formula of momentum is:",
    options: ["[MLT⁻¹]", "[MLT⁻²]", "[ML²T⁻¹]", "[ML⁻¹T⁻²]"],
    statements: [],
    answer: "A",
    type: "single",
    reference: ["Dimensional Analysis"],
    explanation: "Momentum = mass × velocity = M × LT⁻¹ = [MLT⁻¹]",
    isMath: true,
    session: 2024,
    source: "Practice Set",
    subjectId: "subject-1",
    chapterId: "chapter-2",
    topicId: "topic-4",
  },
];

interface ImportedMcq extends Omit<McqData, 'id' | 'createdAt' | 'updatedAt'> {
  _tempId: string;
  _isValid: boolean;
  _errors: string[];
  _isExpanded: boolean;
}

const MCQ_TYPES = [
  { value: 'single', label: 'Single Answer' },
  { value: 'multiple', label: 'Multiple Answers' },
  { value: 'assertion', label: 'Assertion-Reason' },
  { value: 'statement', label: 'Statement Based' },
];

const validateMcq = (mcq: any): string[] => {
  const errors: string[] = [];
  if (!mcq.question || mcq.question.trim().length === 0) errors.push('Question is required');
  if (!mcq.options || !Array.isArray(mcq.options) || mcq.options.length < 2) errors.push('At least 2 options required');
  if (!mcq.answer || mcq.answer.trim().length === 0) errors.push('Answer is required');
  if (!mcq.type) errors.push('Question type is required');
  if (!mcq.subjectId) errors.push('Subject is required');
  if (!mcq.chapterId) errors.push('Chapter is required');
  if (typeof mcq.session !== 'number' || mcq.session < 1900) errors.push('Valid session year required');
  return errors;
};

const McqImport: React.FC = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [importedMcqs, setImportedMcqs] = useState<ImportedMcq[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [hasImported, setHasImported] = useState(false);

  const handleLoadSample = () => {
    setJsonInput(JSON.stringify(SAMPLE_JSON, null, 2));
    toast.success('Sample JSON loaded');
  };

  const handleCopySchema = () => {
    const schema = {
      question: "string (required)",
      options: ["string array (min 2)"],
      statements: ["string array (optional)"],
      answer: "string, e.g. 'A', 'B' (required)",
      type: "single | multiple | assertion | statement (required)",
      reference: ["string array (optional)"],
      explanation: "string (optional)",
      isMath: "boolean (default false)",
      session: "number, e.g. 2024 (required)",
      source: "string (optional)",
      questionUrl: "string URL (optional)",
      context: "string (optional)",
      contextUrl: "string URL (optional)",
      subjectId: "string UUID (required)",
      chapterId: "string UUID (required)",
      topicId: "string UUID (optional)",
      subTopicId: "string UUID (optional)",
    };
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    toast.success('Schema copied to clipboard');
  };

  const handleImport = () => {
    setParseError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      const mcqArray = Array.isArray(parsed) ? parsed : [parsed];

      const processed: ImportedMcq[] = mcqArray.map((mcq, idx) => {
        const errors = validateMcq(mcq);
        return {
          question: mcq.question || '',
          options: mcq.options || ['', ''],
          statements: mcq.statements || [],
          answer: mcq.answer || '',
          type: mcq.type || 'single',
          reference: mcq.reference || [],
          explanation: mcq.explanation || '',
          isMath: mcq.isMath || false,
          session: mcq.session || new Date().getFullYear(),
          source: mcq.source || '',
          questionUrl: mcq.questionUrl || '',
          context: mcq.context || '',
          contextUrl: mcq.contextUrl || '',
          subjectId: mcq.subjectId || '',
          chapterId: mcq.chapterId || '',
          topicId: mcq.topicId || '',
          subTopicId: mcq.subTopicId || '',
          isActive: true,
          _tempId: `import-${Date.now()}-${idx}`,
          _isValid: errors.length === 0,
          _errors: errors,
          _isExpanded: false,
        };
      });

      setImportedMcqs(processed);
      setHasImported(true);
      const valid = processed.filter(m => m._isValid).length;
      const invalid = processed.length - valid;
      toast.success(`Parsed ${processed.length} MCQs (${valid} valid, ${invalid} with issues)`);
    } catch (e: any) {
      setParseError(e.message || 'Invalid JSON');
      toast.error('Failed to parse JSON');
    }
  };

  const updateMcq = (tempId: string, updates: Partial<ImportedMcq>) => {
    setImportedMcqs(prev => prev.map(m => {
      if (m._tempId !== tempId) return m;
      const updated = { ...m, ...updates };
      const errors = validateMcq(updated);
      return { ...updated, _isValid: errors.length === 0, _errors: errors };
    }));
  };

  const removeMcq = (tempId: string) => {
    setImportedMcqs(prev => prev.filter(m => m._tempId !== tempId));
    toast.info('MCQ removed');
  };

  const toggleExpand = (tempId: string) => {
    setImportedMcqs(prev => prev.map(m =>
      m._tempId === tempId ? { ...m, _isExpanded: !m._isExpanded } : m
    ));
  };

  const expandAll = () => setImportedMcqs(prev => prev.map(m => ({ ...m, _isExpanded: true })));
  const collapseAll = () => setImportedMcqs(prev => prev.map(m => ({ ...m, _isExpanded: false })));

  const handleSaveAll = () => {
    const valid = importedMcqs.filter(m => m._isValid);
    if (valid.length === 0) {
      toast.error('No valid MCQs to save');
      return;
    }
    console.log('Saving MCQs:', valid.map(({ _tempId, _isValid, _errors, _isExpanded, ...rest }) => rest));
    toast.success(`${valid.length} MCQs saved successfully!`);
    navigate('/admin/mcqs');
  };

  const validCount = importedMcqs.filter(m => m._isValid).length;
  const invalidCount = importedMcqs.length - validCount;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title="Import MCQs"
        subtitle="Import multiple choice questions from JSON data"
      />

      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin/mcqs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to MCQs
          </Button>
          {hasImported && importedMcqs.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> {validCount} valid
              </Badge>
              {invalidCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" /> {invalidCount} invalid
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* JSON Input Section */}
        {!hasImported && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileJson className="h-5 w-5 text-primary" />
                JSON Input
              </CardTitle>
              <CardDescription>
                Paste your MCQ JSON data below. It should be an array of MCQ objects or a single MCQ object.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleLoadSample}>
                  <FileJson className="h-4 w-4 mr-1" />
                  Load Sample Data
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopySchema}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Schema
                </Button>
              </div>

              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[\n  {\n    "question": "Your question here",\n    "options": ["A", "B", "C", "D"],\n    "answer": "A",\n    "type": "single",\n    "session": 2024,\n    "subjectId": "subject-1",\n    "chapterId": "chapter-1"\n  }\n]'
                rows={16}
                className="font-mono text-sm resize-y"
              />

              {parseError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Parse Error: {parseError}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button onClick={handleImport} disabled={!jsonInput.trim()} size="lg">
                  <Upload className="h-4 w-4 mr-2" />
                  Import & Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Imported MCQs Preview & Edit */}
        {hasImported && importedMcqs.length > 0 && (
          <>
            {/* Controls Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setHasImported(false); setImportedMcqs([]); }}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to JSON
                </Button>
                <Button variant="outline" size="sm" onClick={expandAll}>Expand All</Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>Collapse All</Button>
              </div>
              <Button onClick={handleSaveAll} disabled={validCount === 0} size="lg" className="gap-2">
                <Save className="h-4 w-4" />
                Save {validCount} MCQ{validCount !== 1 ? 's' : ''}
              </Button>
            </div>

            {/* MCQ Cards */}
            <div className="space-y-4">
              {importedMcqs.map((mcq, index) => (
                <McqEditCard
                  key={mcq._tempId}
                  mcq={mcq}
                  index={index}
                  onUpdate={updateMcq}
                  onRemove={removeMcq}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </div>

            {/* Bottom Save Bar */}
            <div className="sticky bottom-4 bg-card border rounded-lg p-4 shadow-lg flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {importedMcqs.length} MCQ{importedMcqs.length !== 1 ? 's' : ''} imported • {validCount} ready to save
              </p>
              <Button onClick={handleSaveAll} disabled={validCount === 0} className="gap-2">
                <Save className="h-4 w-4" />
                Save All Valid MCQs
              </Button>
            </div>
          </>
        )}

        {hasImported && importedMcqs.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No MCQs imported. Go back and try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => setHasImported(false)}>
              Back to JSON Input
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── Editable MCQ Card ──────────────────────────────────────────────────

interface McqEditCardProps {
  mcq: ImportedMcq;
  index: number;
  onUpdate: (tempId: string, updates: Partial<ImportedMcq>) => void;
  onRemove: (tempId: string) => void;
  onToggleExpand: (tempId: string) => void;
}

const McqEditCard: React.FC<McqEditCardProps> = ({ mcq, index, onUpdate, onRemove, onToggleExpand }) => {
  const subject = getSubjectById(mcq.subjectId);
  const chapter = getChapterById(mcq.chapterId);
  const topic = mcq.topicId ? getTopicById(mcq.topicId) : null;

  const typeLabel = MCQ_TYPES.find(t => t.value === mcq.type)?.label || mcq.type;
  const answerIndex = mcq.answer.charCodeAt(0) - 65;

  const availableChapters = mcq.subjectId ? getChaptersBySubject(mcq.subjectId) : [];
  const availableTopics = mcq.chapterId ? getTopicsByChapter(mcq.chapterId) : [];
  const availableSubTopics = mcq.topicId ? getSubTopicsByTopic(mcq.topicId) : [];

  const updateOption = (idx: number, value: string) => {
    const newOpts = [...mcq.options];
    newOpts[idx] = value;
    onUpdate(mcq._tempId, { options: newOpts });
  };

  const addOption = () => {
    if (mcq.options.length < 6) {
      onUpdate(mcq._tempId, { options: [...mcq.options, ''] });
    }
  };

  const removeOption = (idx: number) => {
    if (mcq.options.length > 2) {
      const newOpts = mcq.options.filter((_, i) => i !== idx);
      onUpdate(mcq._tempId, { options: newOpts });
    }
  };

  const updateStatement = (idx: number, value: string) => {
    const newStmts = [...mcq.statements];
    newStmts[idx] = value;
    onUpdate(mcq._tempId, { statements: newStmts });
  };

  const addStatement = () => {
    onUpdate(mcq._tempId, { statements: [...mcq.statements, ''] });
  };

  const removeStatement = (idx: number) => {
    onUpdate(mcq._tempId, { statements: mcq.statements.filter((_, i) => i !== idx) });
  };

  const updateReference = (idx: number, value: string) => {
    const newRefs = [...mcq.reference];
    newRefs[idx] = value;
    onUpdate(mcq._tempId, { reference: newRefs });
  };

  const addReference = () => {
    onUpdate(mcq._tempId, { reference: [...mcq.reference, ''] });
  };

  const removeReference = (idx: number) => {
    onUpdate(mcq._tempId, { reference: mcq.reference.filter((_, i) => i !== idx) });
  };

  return (
    <Card className={cn(
      "transition-all",
      !mcq._isValid && "border-destructive/50 bg-destructive/5"
    )}>
      {/* Collapsed Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => onToggleExpand(mcq._tempId)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-bold text-muted-foreground w-8 shrink-0">#{index + 1}</span>
          {mcq._isValid ? (
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          )}
          <p className="text-sm font-medium truncate flex-1">{mcq.question || 'Untitled question'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="text-xs">{typeLabel}</Badge>
          {subject && <Badge variant="outline" className="text-xs hidden sm:inline-flex">{subject.displayName}</Badge>}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onRemove(mcq._tempId); }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          {mcq._isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded Edit Form */}
      {mcq._isExpanded && (
        <div className="px-4 pb-4 space-y-5 border-t pt-4">
          {/* Errors */}
          {mcq._errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {mcq._errors.map((e, i) => <span key={i} className="block text-xs">{e}</span>)}
              </AlertDescription>
            </Alert>
          )}

          {/* Classification */}
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Classification</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
              <div className="space-y-1">
                <Label className="text-xs">Subject *</Label>
                <Select value={mcq.subjectId} onValueChange={(v) => onUpdate(mcq._tempId, { subjectId: v, chapterId: '', topicId: '', subTopicId: '' })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Subject" /></SelectTrigger>
                  <SelectContent>
                    {mockSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Chapter *</Label>
                <Select value={mcq.chapterId} onValueChange={(v) => onUpdate(mcq._tempId, { chapterId: v, topicId: '', subTopicId: '' })} disabled={!mcq.subjectId}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Chapter" /></SelectTrigger>
                  <SelectContent>
                    {availableChapters.map(c => <SelectItem key={c.id} value={c.id}>{c.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Topic</Label>
                <Select value={mcq.topicId || ''} onValueChange={(v) => onUpdate(mcq._tempId, { topicId: v, subTopicId: '' })} disabled={!mcq.chapterId}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Topic" /></SelectTrigger>
                  <SelectContent>
                    {availableTopics.map(t => <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sub-Topic</Label>
                <Select value={mcq.subTopicId || ''} onValueChange={(v) => onUpdate(mcq._tempId, { subTopicId: v })} disabled={!mcq.topicId}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Sub-Topic" /></SelectTrigger>
                  <SelectContent>
                    {availableSubTopics.map(s => <SelectItem key={s.id} value={s.id}>{s.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Type & Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Type *</Label>
              <Select value={mcq.type} onValueChange={(v) => onUpdate(mcq._tempId, { type: v })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MCQ_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Session *</Label>
              <Input
                type="number"
                value={mcq.session}
                onChange={(e) => onUpdate(mcq._tempId, { session: parseInt(e.target.value) || 0 })}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Source</Label>
              <Input
                value={mcq.source || ''}
                onChange={(e) => onUpdate(mcq._tempId, { source: e.target.value })}
                className="h-9 text-xs"
                placeholder="e.g. Board Exam"
              />
            </div>
            <div className="flex items-end gap-2 pb-0.5">
              <div className="flex items-center gap-2">
                <Switch
                  checked={mcq.isMath}
                  onCheckedChange={(v) => onUpdate(mcq._tempId, { isMath: v })}
                  className="scale-75"
                />
                <Label className="text-xs">Math</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Context */}
          <div className="space-y-2">
            <Label className="text-xs">Context / Passage</Label>
            <Textarea
              value={mcq.context || ''}
              onChange={(e) => onUpdate(mcq._tempId, { context: e.target.value })}
              placeholder="Optional context..."
              rows={2}
              className="text-sm resize-y"
            />
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Label className="text-xs">Question *</Label>
            <Textarea
              value={mcq.question}
              onChange={(e) => onUpdate(mcq._tempId, { question: e.target.value })}
              rows={3}
              className="text-sm resize-y"
            />
          </div>

          {/* Statements */}
          {(mcq.type === 'statement' || mcq.statements.length > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Statements</Label>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addStatement}>
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              {mcq.statements.map((stmt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                  <Input
                    value={stmt}
                    onChange={(e) => updateStatement(i, e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeStatement(i)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Options & Answer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Options & Answer *</Label>
              {mcq.options.length < 6 && (
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addOption}>
                  <Plus className="h-3 w-3 mr-1" /> Add Option
                </Button>
              )}
            </div>
            {mcq.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isCorrect = mcq.answer === letter;
              return (
                <div key={i} className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => onUpdate(mcq._tempId, { answer: letter })}
                    className={cn(
                      "h-8 w-8 rounded-full text-xs font-bold flex items-center justify-center border-2 transition-colors shrink-0",
                      isCorrect
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-primary"
                    )}
                  >
                    {letter}
                  </button>
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className={cn("h-8 text-xs flex-1", isCorrect && "ring-1 ring-primary/50")}
                    placeholder={`Option ${letter}`}
                  />
                  {mcq.options.length > 2 && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeOption(i)}>
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">Click the letter circle to set as correct answer</p>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label className="text-xs">Explanation</Label>
            <Textarea
              value={mcq.explanation || ''}
              onChange={(e) => onUpdate(mcq._tempId, { explanation: e.target.value })}
              rows={2}
              className="text-sm resize-y"
              placeholder="Optional explanation..."
            />
          </div>

          {/* References */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">References</Label>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addReference}>
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            {mcq.reference.map((ref, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={ref}
                  onChange={(e) => updateReference(i, e.target.value)}
                  className="h-8 text-xs flex-1"
                  placeholder="Reference source"
                />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeReference(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Image URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Question Image URL</Label>
              <Input
                value={mcq.questionUrl || ''}
                onChange={(e) => onUpdate(mcq._tempId, { questionUrl: e.target.value })}
                className="h-8 text-xs"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Context Image URL</Label>
              <Input
                value={mcq.contextUrl || ''}
                onChange={(e) => onUpdate(mcq._tempId, { contextUrl: e.target.value })}
                className="h-8 text-xs"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default McqImport;
