import React, { useState, useCallback } from 'react';
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
import { toast } from 'sonner';
import { McqData, mockSubjects, mockChapters, mockTopics, mockSubTopics, getSubjectById, getChapterById, getTopicById, getSubTopicById, getChaptersBySubject, getTopicsByChapter, getSubTopicsByTopic } from '@/lib/academic-mock-data';
import { cn } from '@/lib/utils';

const SAMPLE_JSON: Omit<McqData, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'subjectId' | 'chapterId' | 'topicId' | 'subTopicId'>[] = [
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
    explanation: "In circular motion, the direction of velocity changes constantly, resulting in centripetal acceleration even at constant speed.",
    isMath: false,
    session: 2023,
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
  },
];

interface ImportedMcq extends Omit<McqData, 'id' | 'createdAt' | 'updatedAt'> {
  _tempId: string;
  _isValid: boolean;
  _errors: string[];
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
  if (typeof mcq.session !== 'number' || mcq.session < 1900) errors.push('Valid session year required');
  return errors;
};

const McqImport: React.FC = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [importedMcqs, setImportedMcqs] = useState<ImportedMcq[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [hasImported, setHasImported] = useState(false);

  // Global classification
  const [globalSubjectId, setGlobalSubjectId] = useState('');
  const [globalChapterId, setGlobalChapterId] = useState('');
  const [globalTopicId, setGlobalTopicId] = useState('');
  const [globalSubTopicId, setGlobalSubTopicId] = useState('');

  const globalChapters = globalSubjectId ? getChaptersBySubject(globalSubjectId) : [];
  const globalTopics = globalChapterId ? getTopicsByChapter(globalChapterId) : [];
  const globalSubTopics = globalTopicId ? getSubTopicsByTopic(globalTopicId) : [];

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
    };
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    toast.success('Schema copied to clipboard');
  };

  const handleImport = () => {
    if (!globalSubjectId || !globalChapterId) {
      toast.error('Please select Subject and Chapter before importing');
      return;
    }
    setParseError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      const mcqArray = Array.isArray(parsed) ? parsed : [parsed];

      const processed: ImportedMcq[] = mcqArray.map((mcq, idx) => {
        const entry = {
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
          subjectId: globalSubjectId,
          chapterId: globalChapterId,
          topicId: globalTopicId,
          subTopicId: globalSubTopicId,
          isActive: true,
          _tempId: `import-${Date.now()}-${idx}`,
          _isValid: true,
          _errors: [] as string[],
        };
        const errors = validateMcq(entry);
        return { ...entry, _isValid: errors.length === 0, _errors: errors };
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

  const handleSaveAll = () => {
    const valid = importedMcqs.filter(m => m._isValid);
    if (valid.length === 0) {
      toast.error('No valid MCQs to save');
      return;
    }
    console.log('Saving MCQs:', valid.map(({ _tempId, _isValid, _errors, ...rest }) => rest));
    toast.success(`${valid.length} MCQs saved successfully!`);
    navigate('/admin/mcqs');
  };

  const validCount = importedMcqs.filter(m => m._isValid).length;
  const invalidCount = importedMcqs.length - validCount;

  const globalSubject = globalSubjectId ? getSubjectById(globalSubjectId) : null;
  const globalChapter = globalChapterId ? getChapterById(globalChapterId) : null;
  const globalTopic = globalTopicId ? getTopicById(globalTopicId) : null;
  const globalSubTopic = globalSubTopicId ? getSubTopicById(globalSubTopicId) : null;

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

        {/* Global Classification */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Academic Classification</CardTitle>
            <CardDescription className="text-xs">This applies to all imported MCQs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Subject *</Label>
                <Select value={globalSubjectId} onValueChange={(v) => { setGlobalSubjectId(v); setGlobalChapterId(''); setGlobalTopicId(''); setGlobalSubTopicId(''); }}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                  <SelectContent>
                    {mockSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Chapter *</Label>
                <Select value={globalChapterId} onValueChange={(v) => { setGlobalChapterId(v); setGlobalTopicId(''); setGlobalSubTopicId(''); }} disabled={!globalSubjectId}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select Chapter" /></SelectTrigger>
                  <SelectContent>
                    {globalChapters.map(c => <SelectItem key={c.id} value={c.id}>{c.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Topic</Label>
                <Select value={globalTopicId} onValueChange={(v) => { setGlobalTopicId(v); setGlobalSubTopicId(''); }} disabled={!globalChapterId}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select Topic" /></SelectTrigger>
                  <SelectContent>
                    {globalTopics.map(t => <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sub-Topic</Label>
                <Select value={globalSubTopicId} onValueChange={setGlobalSubTopicId} disabled={!globalTopicId}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select Sub-Topic" /></SelectTrigger>
                  <SelectContent>
                    {globalSubTopics.map(s => <SelectItem key={s.id} value={s.id}>{s.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {hasImported && importedMcqs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {globalSubject && <Badge variant="secondary" className="text-xs">{globalSubject.displayName}</Badge>}
                {globalChapter && <Badge variant="outline" className="text-xs">{globalChapter.displayName}</Badge>}
                {globalTopic && <Badge variant="outline" className="text-xs">{globalTopic.displayName}</Badge>}
                {globalSubTopic && <Badge variant="outline" className="text-xs">{globalSubTopic.displayName}</Badge>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* JSON Input Section */}
        {!hasImported && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileJson className="h-5 w-5 text-primary" />
                JSON Input
              </CardTitle>
              <CardDescription>
                Paste your MCQ JSON data below. Classification fields (subject, chapter, etc.) are set above.
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
                placeholder='[\n  {\n    "question": "Your question here",\n    "options": ["A", "B", "C", "D"],\n    "answer": "A",\n    "type": "single",\n    "session": 2024\n  }\n]'
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

        {/* Imported MCQs Preview */}
        {hasImported && importedMcqs.length > 0 && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => { setHasImported(false); setImportedMcqs([]); }}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to JSON
              </Button>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground hidden sm:block">Double-click any field to edit</p>
                <Button onClick={handleSaveAll} disabled={validCount === 0} size="lg" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save {validCount} MCQ{validCount !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {importedMcqs.map((mcq, index) => (
                <McqDisplayCard
                  key={mcq._tempId}
                  mcq={mcq}
                  index={index}
                  onUpdate={updateMcq}
                  onRemove={removeMcq}
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

// ─── Double-click-to-edit field ─────────────────────────────────────────

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  renderDisplay?: (value: string) => React.ReactNode;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, multiline, className, placeholder, renderDisplay }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const startEditing = () => {
    setDraft(value);
    setEditing(true);
  };

  const commit = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  if (editing) {
    if (multiline) {
      return (
        <Textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Escape') cancel(); }}
          rows={3}
          className={cn("text-sm resize-y", className)}
        />
      );
    }
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') cancel();
        }}
        className={cn("h-8 text-sm", className)}
      />
    );
  }

  const isEmpty = !value || value.trim() === '';

  return (
    <div
      onDoubleClick={startEditing}
      className={cn(
        "cursor-pointer rounded px-2 py-1 min-h-[28px] hover:bg-muted/50 transition-colors border border-transparent hover:border-border",
        isEmpty && "text-muted-foreground italic",
        className
      )}
      title="Double-click to edit"
    >
      {renderDisplay ? renderDisplay(value) : (isEmpty ? (placeholder || 'Double-click to edit') : value)}
    </div>
  );
};

// ─── MCQ Display Card (read-only with double-click edit) ───────────────

interface McqDisplayCardProps {
  mcq: ImportedMcq;
  index: number;
  onUpdate: (tempId: string, updates: Partial<ImportedMcq>) => void;
  onRemove: (tempId: string) => void;
}

const McqDisplayCard: React.FC<McqDisplayCardProps> = ({ mcq, index, onUpdate, onRemove }) => {
  const typeLabel = MCQ_TYPES.find(t => t.value === mcq.type)?.label || mcq.type;
  const answerIndex = mcq.answer.charCodeAt(0) - 65;

  const updateOption = (idx: number, value: string) => {
    const newOpts = [...mcq.options];
    newOpts[idx] = value;
    onUpdate(mcq._tempId, { options: newOpts });
  };

  const updateStatement = (idx: number, value: string) => {
    const newStmts = [...mcq.statements];
    newStmts[idx] = value;
    onUpdate(mcq._tempId, { statements: newStmts });
  };

  const updateReference = (idx: number, value: string) => {
    const newRefs = [...mcq.reference];
    newRefs[idx] = value;
    onUpdate(mcq._tempId, { reference: newRefs });
  };

  return (
    <Card className={cn(
      "transition-all",
      !mcq._isValid && "border-destructive/50 bg-destructive/5"
    )}>
      <div className="p-4 space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="text-sm font-bold text-muted-foreground mt-0.5 w-7 shrink-0">#{index + 1}</span>
            {mcq._isValid ? (
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-1" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-1" />
            )}
            <div className="flex-1 min-w-0">
              <EditableField
                value={mcq.question}
                onSave={(v) => onUpdate(mcq._tempId, { question: v })}
                multiline
                className="font-medium"
                renderDisplay={(v) => <p className="whitespace-pre-wrap text-sm font-medium">{v || 'Untitled question'}</p>}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="text-xs">{typeLabel}</Badge>
            <Badge variant="outline" className="text-xs">{mcq.session}</Badge>
            {mcq.isMath && <Badge variant="outline" className="text-xs font-mono">Math</Badge>}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onRemove(mcq._tempId)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Errors */}
        {mcq._errors.length > 0 && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-3.5 w-3.5" />
            <AlertDescription className="text-xs">
              {mcq._errors.join(' • ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Context */}
        {(mcq.context || mcq.type === 'statement') && (
          <div className="pl-9">
            <Label className="text-xs text-muted-foreground">Context</Label>
            <EditableField
              value={mcq.context || ''}
              onSave={(v) => onUpdate(mcq._tempId, { context: v })}
              multiline
              placeholder="No context"
              renderDisplay={(v) => v ? <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded p-2">{v}</p> : null}
            />
          </div>
        )}

        {/* Statements */}
        {mcq.statements.length > 0 && (
          <div className="pl-9 space-y-1">
            <Label className="text-xs text-muted-foreground">Statements</Label>
            {mcq.statements.map((stmt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                <EditableField
                  value={stmt}
                  onSave={(v) => updateStatement(i, v)}
                  className="flex-1 text-sm"
                />
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        <div className="pl-9 space-y-1">
          {mcq.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isCorrect = mcq.answer === letter;
            return (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdate(mcq._tempId, { answer: letter })}
                  className={cn(
                    "h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center border-2 transition-colors shrink-0",
                    isCorrect
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-primary"
                  )}
                >
                  {letter}
                </button>
                <EditableField
                  value={opt}
                  onSave={(v) => updateOption(i, v)}
                  className={cn("flex-1 text-sm", isCorrect && "font-semibold text-primary")}
                  renderDisplay={(v) => (
                    <span className={cn("text-sm", isCorrect && "font-semibold text-primary")}>{v || `Option ${letter}`}</span>
                  )}
                />
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground mt-1">Click letter to set answer • Double-click option to edit</p>
        </div>

        {/* Explanation */}
        {mcq.explanation && (
          <div className="pl-9">
            <Label className="text-xs text-muted-foreground">Explanation</Label>
            <EditableField
              value={mcq.explanation || ''}
              onSave={(v) => onUpdate(mcq._tempId, { explanation: v })}
              multiline
              placeholder="No explanation"
              renderDisplay={(v) => v ? <p className="text-sm text-muted-foreground/80 whitespace-pre-wrap">{v}</p> : null}
            />
          </div>
        )}

        {/* Metadata Row */}
        <div className="pl-9 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {mcq.source && (
            <span>Source: <EditableField
              value={mcq.source || ''}
              onSave={(v) => onUpdate(mcq._tempId, { source: v })}
              className="inline text-xs"
              renderDisplay={(v) => <span className="font-medium text-foreground">{v}</span>}
            /></span>
          )}
          {mcq.reference.length > 0 && (
            <span>Refs: {mcq.reference.map((r, i) => (
              <EditableField
                key={i}
                value={r}
                onSave={(v) => updateReference(i, v)}
                className="inline text-xs mx-0.5"
                renderDisplay={(v) => <Badge variant="outline" className="text-[10px] h-5">{v}</Badge>}
              />
            ))}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default McqImport;
