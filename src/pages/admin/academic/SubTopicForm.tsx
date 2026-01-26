import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubTopic, useSubTopicMutations, useSubTopics, useTopics } from '@/hooks/useAcademicData';

const subTopicSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Name must be lowercase with hyphens only'),
  display_name: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  position: z.number().min(0, 'Position must be 0 or greater'),
  topic_id: z.string().min(1, 'Topic is required'),
  is_active: z.boolean(),
});

type SubTopicFormData = z.infer<typeof subTopicSchema>;

const SubTopicForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';
  const isViewing = Boolean(id) && !window.location.pathname.includes('edit') && id !== 'create';

  const { data: existingSubTopic, isLoading: loadingSubTopic } = useSubTopic(id || '');
  const { data: subTopics = [] } = useSubTopics();
  const { data: topics = [] } = useTopics();
  const { create, update } = useSubTopicMutations();

  const form = useForm<SubTopicFormData>({
    resolver: zodResolver(subTopicSchema),
    defaultValues: { name: '', display_name: '', description: '', position: 0, topic_id: '', is_active: true },
  });

  useEffect(() => {
    if (!isEditing && !isViewing) form.setValue('position', subTopics.length);
  }, [subTopics.length, isEditing, isViewing, form]);

  useEffect(() => {
    if (existingSubTopic) {
      form.reset({
        name: existingSubTopic.name,
        display_name: existingSubTopic.display_name,
        description: existingSubTopic.description || '',
        position: existingSubTopic.position,
        topic_id: existingSubTopic.topic_id,
        is_active: existingSubTopic.is_active,
      });
    }
  }, [existingSubTopic, form]);

  const onSubmit = (data: SubTopicFormData) => {
    const payload = {
      name: data.name,
      display_name: data.display_name,
      description: data.description || null,
      position: data.position,
      topic_id: data.topic_id,
      is_active: data.is_active,
    };
    if (isEditing && id) {
      update.mutate({ id, data: payload }, { onSuccess: () => navigate('/admin/subtopics') });
    } else {
      create.mutate(payload, { onSuccess: () => navigate('/admin/subtopics') });
    }
  };

  const handleGenerateSlug = () => {
    const displayName = form.watch('display_name');
    if (displayName) form.setValue('name', displayName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim());
  };

  const getTopicName = (topicId: string) => topics.find((t) => t.id === topicId)?.display_name || 'N/A';

  if (loadingSubTopic && (isEditing || isViewing)) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/subtopics')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">{isViewing ? 'View Sub-Topic' : isEditing ? 'Edit Sub-Topic' : 'Create Sub-Topic'}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{isViewing ? 'View sub-topic details' : isEditing ? 'Update sub-topic information' : 'Add a new sub-topic'}</p>
              </div>
            </div>
            {!isViewing && <Button onClick={form.handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>{(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}{isEditing ? 'Update' : 'Create'}</Button>}
            {isViewing && <Button onClick={() => navigate(`/admin/subtopics/${id}/edit`)}>Edit Sub-Topic</Button>}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Parent Topic</CardTitle><CardDescription>Select the topic this sub-topic belongs to</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="topic_id">Topic *</Label>
                <Select value={form.watch('topic_id')} onValueChange={(value) => form.setValue('topic_id', value)} disabled={isViewing}>
                  <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
                  <SelectContent>{topics.map((topic) => <SelectItem key={topic.id} value={topic.id}>{topic.display_name}</SelectItem>)}</SelectContent>
                </Select>
                {form.formState.errors.topic_id && <p className="text-xs text-destructive">{form.formState.errors.topic_id.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Enter the basic details for this sub-topic</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name *</Label>
                <Input id="display_name" {...form.register('display_name')} placeholder="Scalar Quantities" disabled={isViewing} />
                {form.formState.errors.display_name && <p className="text-xs text-destructive">{form.formState.errors.display_name.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Slug *</Label>
                  <div className="flex gap-2">
                    <Input id="name" {...form.register('name')} placeholder="scalar-quantities" disabled={isViewing} className="flex-1" />
                    {!isViewing && <Button type="button" variant="outline" size="sm" onClick={handleGenerateSlug}>Generate</Button>}
                  </div>
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" type="number" {...form.register('position', { valueAsNumber: true })} disabled={isViewing} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register('description')} placeholder="Optional description..." disabled={isViewing} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Status & Visibility</CardTitle><CardDescription>Control the visibility of this sub-topic</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><Label htmlFor="is_active" className="text-base">Active Status</Label><p className="text-sm text-muted-foreground">Inactive sub-topics won't be visible to users</p></div>
                <Switch id="is_active" checked={form.watch('is_active')} onCheckedChange={(checked) => form.setValue('is_active', checked)} disabled={isViewing} />
              </div>
            </CardContent>
          </Card>

          {isViewing && existingSubTopic && (
            <Card>
              <CardHeader><CardTitle>Metadata</CardTitle><CardDescription>System information about this sub-topic</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Topic</p><p className="font-medium">{getTopicName(existingSubTopic.topic_id)}</p></div>
                  <div><p className="text-muted-foreground">Created At</p><p className="font-medium">{new Date(existingSubTopic.created_at).toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Last Updated</p><p className="font-medium">{new Date(existingSubTopic.updated_at).toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Sub-Topic ID</p><p className="font-mono text-xs">{existingSubTopic.id}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isViewing && (
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/subtopics')}>Cancel</Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>{(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}{isEditing ? 'Update Sub-Topic' : 'Create Sub-Topic'}</Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubTopicForm;
