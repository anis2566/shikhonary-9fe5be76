import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X, BookOpen, Layers, Settings, Tag, Image, FileText, Calculator, Link2 } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { mockMcqs, mockSubjects, mockChapters, mockTopics, mockSubTopics, getChaptersBySubject, getTopicsByChapter, getSubTopicsByTopic } from '@/lib/academic-mock-data';
import { cn } from '@/lib/utils';

const mcqSchema = z.object({
  question: z.string().trim().min(1, 'Question is required').max(5000, 'Question must be less than 5000 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required').max(6, 'Maximum 6 options allowed'),
  statements: z.array(z.string()).default([]),
  answer: z.string().min(1, 'Correct answer is required'),
  type: z.string().min(1, 'Question type is required'),
  reference: z.array(z.string()).default([]),
  explanation: z.string().max(5000, 'Explanation must be less than 5000 characters').optional(),
  isMath: z.boolean().default(false),
  session: z.number().int().min(1900, 'Invalid session year').max(2100, 'Invalid session year'),
  source: z.string().max(200, 'Source must be less than 200 characters').optional(),
  questionUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  context: z.string().max(5000, 'Context must be less than 5000 characters').optional(),
  contextUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  subjectId: z.string().uuid('Subject is required'),
  chapterId: z.string().uuid('Chapter is required'),
  topicId: z.string().uuid().optional().or(z.literal('')),
  subTopicId: z.string().uuid().optional().or(z.literal('')),
});

type McqFormData = z.infer<typeof mcqSchema>;

const MCQ_TYPES = [
  { value: 'single', label: 'Single Answer', description: 'One correct answer from options' },
  { value: 'multiple', label: 'Multiple Answers', description: 'Multiple correct answers possible' },
  { value: 'assertion', label: 'Assertion-Reason', description: 'Evaluate assertion and reason statements' },
  { value: 'statement', label: 'Statement Based', description: 'Analyze given statements' },
];

const McqForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [statements, setStatements] = useState<string[]>([]);
  const [references, setReferences] = useState<string[]>([]);
  const [availableChapters, setAvailableChapters] = useState(mockChapters);
  const [availableTopics, setAvailableTopics] = useState(mockTopics);
  const [availableSubTopics, setAvailableSubTopics] = useState(mockSubTopics);

  const form = useForm<McqFormData>({
    resolver: zodResolver(mcqSchema),
    defaultValues: {
      question: '',
      options: ['', '', '', ''],
      statements: [],
      answer: '',
      type: 'single',
      reference: [],
      explanation: '',
      isMath: false,
      session: new Date().getFullYear(),
      source: '',
      questionUrl: '',
      context: '',
      contextUrl: '',
      subjectId: '',
      chapterId: '',
      topicId: '',
      subTopicId: '',
    },
  });

  const watchedType = form.watch('type');

  useEffect(() => {
    if (isEditing && id) {
      const mcq = mockMcqs.find((m) => m.id === id);
      if (mcq) {
        form.reset({
          question: mcq.question,
          options: mcq.options,
          statements: mcq.statements,
          answer: mcq.answer,
          type: mcq.type,
          reference: mcq.reference,
          explanation: mcq.explanation || '',
          isMath: mcq.isMath,
          session: mcq.session,
          source: mcq.source || '',
          questionUrl: mcq.questionUrl || '',
          context: mcq.context || '',
          contextUrl: mcq.contextUrl || '',
          subjectId: mcq.subjectId,
          chapterId: mcq.chapterId,
          topicId: mcq.topicId || '',
          subTopicId: mcq.subTopicId || '',
        });
        setOptions(mcq.options);
        setStatements(mcq.statements);
        setReferences(mcq.reference);
        setAvailableChapters(getChaptersBySubject(mcq.subjectId));
        if (mcq.chapterId) {
          setAvailableTopics(getTopicsByChapter(mcq.chapterId));
        }
        if (mcq.topicId) {
          setAvailableSubTopics(getSubTopicsByTopic(mcq.topicId));
        }
      }
    }
  }, [id, isEditing, form]);

  const handleSubjectChange = (value: string) => {
    form.setValue('subjectId', value);
    form.setValue('chapterId', '');
    form.setValue('topicId', '');
    form.setValue('subTopicId', '');
    setAvailableChapters(getChaptersBySubject(value));
    setAvailableTopics([]);
    setAvailableSubTopics([]);
  };

  const handleChapterChange = (value: string) => {
    form.setValue('chapterId', value);
    form.setValue('topicId', '');
    form.setValue('subTopicId', '');
    setAvailableTopics(getTopicsByChapter(value));
    setAvailableSubTopics([]);
  };

  const handleTopicChange = (value: string) => {
    form.setValue('topicId', value);
    form.setValue('subTopicId', '');
    setAvailableSubTopics(getSubTopicsByTopic(value));
  };

  // Options management
  const addOption = () => {
    if (options.length < 6) {
      const newOptions = [...options, ''];
      setOptions(newOptions);
      form.setValue('options', newOptions);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      form.setValue('options', newOptions);
      // Clear answer if removed option was selected
      const removedLetter = String.fromCharCode(65 + index);
      if (form.watch('answer') === removedLetter) {
        form.setValue('answer', '');
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    form.setValue('options', newOptions);
  };

  // Statements management
  const addStatement = () => {
    const newStatements = [...statements, ''];
    setStatements(newStatements);
    form.setValue('statements', newStatements);
  };

  const removeStatement = (index: number) => {
    const newStatements = statements.filter((_, i) => i !== index);
    setStatements(newStatements);
    form.setValue('statements', newStatements);
  };

  const updateStatement = (index: number, value: string) => {
    const newStatements = [...statements];
    newStatements[index] = value;
    setStatements(newStatements);
    form.setValue('statements', newStatements);
  };

  // References management
  const addReference = () => {
    const newRefs = [...references, ''];
    setReferences(newRefs);
    form.setValue('reference', newRefs);
  };

  const removeReference = (index: number) => {
    const newRefs = references.filter((_, i) => i !== index);
    setReferences(newRefs);
    form.setValue('reference', newRefs);
  };

  const updateReference = (index: number, value: string) => {
    const newRefs = [...references];
    newRefs[index] = value;
    setReferences(newRefs);
    form.setValue('reference', newRefs);
  };

  const onSubmit = (data: McqFormData) => {
    // Clean up optional empty strings
    const cleanedData = {
      ...data,
      topicId: data.topicId || undefined,
      subTopicId: data.subTopicId || undefined,
      questionUrl: data.questionUrl || undefined,
      contextUrl: data.contextUrl || undefined,
      source: data.source || undefined,
      explanation: data.explanation || undefined,
      context: data.context || undefined,
    };
    console.log('MCQ Data:', cleanedData);
    toast.success(isEditing ? 'MCQ updated successfully' : 'MCQ created successfully');
    navigate('/admin/mcqs');
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title={isEditing ? 'Edit MCQ' : 'Create MCQ'}
        subtitle={isEditing ? 'Update question details' : 'Add a new multiple choice question'}
      />

      <div className="p-4 lg:p-6">
        <Button variant="ghost" onClick={() => navigate('/admin/mcqs')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MCQs
        </Button>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          {/* Question Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Question Type
              </CardTitle>
              <CardDescription>Select the type of MCQ you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={form.watch('type')}
                onValueChange={(value) => form.setValue('type', value)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {MCQ_TYPES.map((type) => (
                  <div key={type.value}>
                    <RadioGroupItem
                      value={type.value}
                      id={type.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type.value}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border-2 border-muted bg-popover p-4 cursor-pointer transition-all",
                        "hover:bg-accent hover:text-accent-foreground",
                        "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      )}
                    >
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {form.formState.errors.type && (
                <p className="text-xs text-destructive mt-2">{form.formState.errors.type.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Classification
              </CardTitle>
              <CardDescription>Link this question to the academic hierarchy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject <span className="text-destructive">*</span></Label>
                  <Select value={form.watch('subjectId')} onValueChange={handleSubjectChange}>
                    <SelectTrigger className={cn(form.formState.errors.subjectId && "border-destructive")}>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.subjectId && (
                    <p className="text-xs text-destructive">{form.formState.errors.subjectId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Chapter <span className="text-destructive">*</span></Label>
                  <Select
                    value={form.watch('chapterId')}
                    onValueChange={handleChapterChange}
                    disabled={!form.watch('subjectId')}
                  >
                    <SelectTrigger className={cn(form.formState.errors.chapterId && "border-destructive")}>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableChapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.chapterId && (
                    <p className="text-xs text-destructive">{form.formState.errors.chapterId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Topic <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge></Label>
                  <Select
                    value={form.watch('topicId') || ''}
                    onValueChange={handleTopicChange}
                    disabled={!form.watch('chapterId') || availableTopics.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sub-Topic <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge></Label>
                  <Select
                    value={form.watch('subTopicId') || ''}
                    onValueChange={(value) => form.setValue('subTopicId', value)}
                    disabled={!form.watch('topicId') || availableSubTopics.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubTopics.map((subTopic) => (
                        <SelectItem key={subTopic.id} value={subTopic.id}>
                          {subTopic.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Question Content
              </CardTitle>
              <CardDescription>Enter the main question and optional context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Context (shown first for reading flow) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="context">Context / Passage</Label>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
                <Textarea
                  id="context"
                  {...form.register('context')}
                  placeholder="Add any background passage, paragraph, or context that the question refers to..."
                  rows={3}
                  className="resize-y"
                />
                <p className="text-xs text-muted-foreground">This will be displayed above the question</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="contextUrl">Context Image URL</Label>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
                <div className="flex gap-2">
                  <Image className="h-4 w-4 mt-3 text-muted-foreground" />
                  <Input
                    id="contextUrl"
                    {...form.register('contextUrl')}
                    placeholder="https://example.com/context-image.png"
                    className="flex-1"
                  />
                </div>
              </div>

              <Separator />

              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question">Question <span className="text-destructive">*</span></Label>
                <Textarea
                  id="question"
                  {...form.register('question')}
                  placeholder="Enter the question text..."
                  rows={3}
                  className={cn("resize-y", form.formState.errors.question && "border-destructive")}
                />
                {form.formState.errors.question && (
                  <p className="text-xs text-destructive">{form.formState.errors.question.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="questionUrl">Question Image URL</Label>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
                <div className="flex gap-2">
                  <Image className="h-4 w-4 mt-3 text-muted-foreground" />
                  <Input
                    id="questionUrl"
                    {...form.register('questionUrl')}
                    placeholder="https://example.com/question-image.png"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Statements (for assertion/statement types) */}
              {(watchedType === 'assertion' || watchedType === 'statement') && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Statements</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {watchedType === 'assertion' 
                            ? 'Add assertion and reason statements'
                            : 'Add statements to analyze'}
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addStatement}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Statement
                      </Button>
                    </div>
                    {statements.length === 0 && (
                      <div className="text-center py-4 border-2 border-dashed rounded-lg">
                        <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No statements added yet</p>
                      </div>
                    )}
                    {statements.map((statement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                          {watchedType === 'assertion' 
                            ? (index === 0 ? 'A' : 'R') 
                            : (index + 1)}
                        </span>
                        <Input
                          value={statement}
                          onChange={(e) => updateStatement(index, e.target.value)}
                          placeholder={watchedType === 'assertion' 
                            ? (index === 0 ? 'Assertion statement' : 'Reason statement')
                            : `Statement ${index + 1}`}
                          className="flex-1"
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeStatement(index)} className="shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Options & Answer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Options & Answer
              </CardTitle>
              <CardDescription>Add answer options and mark the correct one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Options <span className="text-destructive">*</span></Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addOption} 
                    disabled={options.length >= 6}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option ({options.length}/6)
                  </Button>
                </div>
                <div className="space-y-2">
                  {options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const isSelected = form.watch('answer') === letter;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => form.setValue('answer', letter)}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-all",
                            isSelected 
                              ? "bg-green-500 text-white ring-2 ring-green-500 ring-offset-2" 
                              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          )}
                          title={isSelected ? 'Correct answer' : 'Click to mark as correct'}
                        >
                          {letter}
                        </button>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${letter}`}
                          className={cn("flex-1", isSelected && "border-green-500 bg-green-50 dark:bg-green-950/20")}
                        />
                        {options.length > 2 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)} className="shrink-0">
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click on the letter to mark it as the correct answer
                </p>
                {form.formState.errors.answer && (
                  <p className="text-xs text-destructive">{form.formState.errors.answer.message}</p>
                )}
              </div>

              <Separator />

              {/* Explanation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="explanation">Explanation</Label>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
                <Textarea
                  id="explanation"
                  {...form.register('explanation')}
                  placeholder="Explain why this is the correct answer..."
                  rows={3}
                  className="resize-y"
                />
              </div>
            </CardContent>
          </Card>

          {/* Metadata & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Metadata & Settings
              </CardTitle>
              <CardDescription>Additional information and settings for this question</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session">Session Year <span className="text-destructive">*</span></Label>
                  <Input
                    id="session"
                    type="number"
                    {...form.register('session', { valueAsNumber: true })}
                    placeholder="e.g., 2024"
                    className={cn(form.formState.errors.session && "border-destructive")}
                  />
                  {form.formState.errors.session && (
                    <p className="text-xs text-destructive">{form.formState.errors.session.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="source">Source</Label>
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  </div>
                  <Input
                    id="source"
                    {...form.register('source')}
                    placeholder="e.g., Board Exam 2023, Textbook Ch.5"
                  />
                </div>
              </div>

              {/* References */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label>References</Label>
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addReference}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Reference
                  </Button>
                </div>
                {references.length === 0 && (
                  <p className="text-sm text-muted-foreground">No references added</p>
                )}
                {references.map((ref, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      value={ref}
                      onChange={(e) => updateReference(index, e.target.value)}
                      placeholder={`Reference ${index + 1} (book, page, URL, etc.)`}
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeReference(index)} className="shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Toggle settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label htmlFor="isMath" className="cursor-pointer">Contains Mathematical Content</Label>
                      <p className="text-xs text-muted-foreground">Enable LaTeX/math rendering for this question</p>
                    </div>
                  </div>
                  <Switch
                    id="isMath"
                    checked={form.watch('isMath')}
                    onCheckedChange={(checked) => form.setValue('isMath', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 -mx-4 lg:-mx-6 border-t">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/mcqs')}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              {isEditing ? 'Update MCQ' : 'Create MCQ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default McqForm;
