import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { mockCqs, mockSubjects, mockChapters, mockTopics, mockSubTopics, getChaptersBySubject, getTopicsByChapter, getSubTopicsByTopic } from '@/lib/academic-mock-data';

const cqSchema = z.object({
  context: z.string().optional(),
  questionA: z.string().min(1, 'Question (a) is required'),
  questionB: z.string().min(1, 'Question (b) is required'),
  questionC: z.string().min(1, 'Question (c) is required'),
  questionD: z.string().min(1, 'Question (d) is required'),
  marks: z.number().min(1, 'Marks must be at least 1'),
  subjectId: z.string().min(1, 'Subject is required'),
  chapterId: z.string().min(1, 'Chapter is required'),
  topicId: z.string().optional(),
  subTopicId: z.string().optional(),
  isActive: z.boolean(),
});

type CqFormData = z.infer<typeof cqSchema>;

const CqForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [availableChapters, setAvailableChapters] = useState(mockChapters);
  const [availableTopics, setAvailableTopics] = useState(mockTopics);
  const [availableSubTopics, setAvailableSubTopics] = useState(mockSubTopics);

  const form = useForm<CqFormData>({
    resolver: zodResolver(cqSchema),
    defaultValues: {
      context: '',
      questionA: '',
      questionB: '',
      questionC: '',
      questionD: '',
      marks: 10,
      subjectId: '',
      chapterId: '',
      topicId: '',
      subTopicId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const cq = mockCqs.find((c) => c.id === id);
      if (cq) {
        form.reset({
          context: cq.context || '',
          questionA: cq.questionA,
          questionB: cq.questionB,
          questionC: cq.questionC,
          questionD: cq.questionD,
          marks: cq.marks,
          subjectId: cq.subjectId,
          chapterId: cq.chapterId,
          topicId: cq.topicId || '',
          subTopicId: cq.subTopicId || '',
          isActive: cq.isActive,
        });
        setAvailableChapters(getChaptersBySubject(cq.subjectId));
        if (cq.chapterId) {
          setAvailableTopics(getTopicsByChapter(cq.chapterId));
        }
        if (cq.topicId) {
          setAvailableSubTopics(getSubTopicsByTopic(cq.topicId));
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

  const onSubmit = (data: CqFormData) => {
    console.log('CQ Data:', data);
    toast.success(isEditing ? 'CQ updated successfully' : 'CQ created successfully');
    navigate('/admin/cqs');
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={isEditing ? 'Edit CQ' : 'Create CQ'}
        subtitle={isEditing ? 'Update question details' : 'Add a new creative question'}
      />

      <div className="p-4 lg:p-6">
        <Button variant="ghost" onClick={() => navigate('/admin/cqs')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to CQs
        </Button>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          {/* Context & Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="context">Context / Stimulus (optional)</Label>
                <Textarea
                  id="context"
                  {...form.register('context')}
                  placeholder="Enter the context or stimulus for the question..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionA">Question (a) *</Label>
                <Textarea
                  id="questionA"
                  {...form.register('questionA')}
                  placeholder="Enter question (a)..."
                  rows={2}
                />
                {form.formState.errors.questionA && (
                  <p className="text-xs text-destructive">{form.formState.errors.questionA.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionB">Question (b) *</Label>
                <Textarea
                  id="questionB"
                  {...form.register('questionB')}
                  placeholder="Enter question (b)..."
                  rows={2}
                />
                {form.formState.errors.questionB && (
                  <p className="text-xs text-destructive">{form.formState.errors.questionB.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionC">Question (c) *</Label>
                <Textarea
                  id="questionC"
                  {...form.register('questionC')}
                  placeholder="Enter question (c)..."
                  rows={2}
                />
                {form.formState.errors.questionC && (
                  <p className="text-xs text-destructive">{form.formState.errors.questionC.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionD">Question (d) *</Label>
                <Textarea
                  id="questionD"
                  {...form.register('questionD')}
                  placeholder="Enter question (d)..."
                  rows={2}
                />
                {form.formState.errors.questionD && (
                  <p className="text-xs text-destructive">{form.formState.errors.questionD.message}</p>
                )}
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
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="marks">Total Marks</Label>
                <Input
                  id="marks"
                  type="number"
                  {...form.register('marks', { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center justify-between max-w-xs">
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
            <Button type="button" variant="outline" onClick={() => navigate('/admin/cqs')}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update CQ' : 'Create CQ'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CqForm;
