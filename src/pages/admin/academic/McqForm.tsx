import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { mockMcqs, mockSubjects, mockChapters, mockTopics, mockSubTopics, getChaptersBySubject, getTopicsByChapter, getSubTopicsByTopic } from '@/lib/academic-mock-data';

const mcqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required'),
  answer: z.string().min(1, 'Answer is required'),
  explanation: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  marks: z.number().min(0.5, 'Marks must be at least 0.5'),
  subjectId: z.string().min(1, 'Subject is required'),
  chapterId: z.string().min(1, 'Chapter is required'),
  topicId: z.string().optional(),
  subTopicId: z.string().optional(),
  isActive: z.boolean(),
});

type McqFormData = z.infer<typeof mcqSchema>;

const McqForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [availableChapters, setAvailableChapters] = useState(mockChapters);
  const [availableTopics, setAvailableTopics] = useState(mockTopics);
  const [availableSubTopics, setAvailableSubTopics] = useState(mockSubTopics);

  const form = useForm<McqFormData>({
    resolver: zodResolver(mcqSchema),
    defaultValues: {
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
      difficulty: 'MEDIUM',
      marks: 1,
      subjectId: '',
      chapterId: '',
      topicId: '',
      subTopicId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const mcq = mockMcqs.find((m) => m.id === id);
      if (mcq) {
        form.reset({
          question: mcq.question,
          options: mcq.options,
          answer: mcq.answer,
          explanation: mcq.explanation || '',
          difficulty: mcq.difficulty,
          marks: mcq.marks,
          subjectId: mcq.subjectId,
          chapterId: mcq.chapterId,
          topicId: mcq.topicId || '',
          subTopicId: mcq.subTopicId || '',
          isActive: mcq.isActive,
        });
        setOptions(mcq.options);
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
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    form.setValue('options', newOptions);
  };

  const onSubmit = (data: McqFormData) => {
    console.log('MCQ Data:', data);
    toast.success(isEditing ? 'MCQ updated successfully' : 'MCQ created successfully');
    navigate('/admin/mcqs');
  };

  return (
    <div className="min-h-screen">
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
          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Textarea
                  id="question"
                  {...form.register('question')}
                  placeholder="Enter the question..."
                  rows={3}
                />
                {form.formState.errors.question && (
                  <p className="text-xs text-destructive">{form.formState.errors.question.message}</p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Options *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOption} disabled={options.length >= 6}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Answer */}
              <div className="space-y-2">
                <Label htmlFor="answer">Correct Answer *</Label>
                <Select value={form.watch('answer')} onValueChange={(value) => form.setValue('answer', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.filter(o => o.trim()).map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {String.fromCharCode(65 + index)}. {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.answer && (
                  <p className="text-xs text-destructive">{form.formState.errors.answer.message}</p>
                )}
              </div>

              {/* Explanation */}
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (optional)</Label>
                <Textarea
                  id="explanation"
                  {...form.register('explanation')}
                  placeholder="Explain the correct answer..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={form.watch('subjectId')} onValueChange={handleSubjectChange}>
                    <SelectTrigger>
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
                  <Label>Chapter *</Label>
                  <Select
                    value={form.watch('chapterId')}
                    onValueChange={handleChapterChange}
                    disabled={!form.watch('subjectId')}
                  >
                    <SelectTrigger>
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
                  <Label>Topic (optional)</Label>
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
                  <Label>Sub-Topic (optional)</Label>
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

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty *</Label>
                  <Select
                    value={form.watch('difficulty')}
                    onValueChange={(value: 'EASY' | 'MEDIUM' | 'HARD') => form.setValue('difficulty', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marks">Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    step="0.5"
                    {...form.register('marks', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/mcqs')}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update MCQ' : 'Create MCQ'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default McqForm;
