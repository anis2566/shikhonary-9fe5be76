import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AcademicTopic } from '@/types';
import { mockTopics, mockChapters, getChapterById } from '@/lib/academic-mock-data';

const topicSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Name must be lowercase with hyphens only'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  chapterId: z.string().min(1, 'Chapter is required'),
  isActive: z.boolean(),
});

type TopicFormData = z.infer<typeof topicSchema>;

const TopicForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';
  const isViewing = Boolean(id) && !window.location.pathname.includes('edit') && id !== 'create';

  const existingTopic = isEditing || isViewing ? mockTopics.find((t) => t.id === id) : null;

  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: { name: '', displayName: '', position: mockTopics.length, chapterId: '', isActive: true },
  });

  useEffect(() => {
    if (existingTopic) {
      form.reset({ name: existingTopic.name, displayName: existingTopic.displayName, position: existingTopic.position, chapterId: existingTopic.chapterId, isActive: existingTopic.isActive });
    }
  }, [existingTopic, form]);

  const onSubmit = (data: TopicFormData) => {
    if (isEditing) toast.success('Topic updated successfully');
    else toast.success('Topic created successfully');
    navigate('/admin/topics');
  };

  const handleGenerateSlug = () => {
    const displayName = form.watch('displayName');
    if (displayName) form.setValue('name', displayName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/topics')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">{isViewing ? 'View Topic' : isEditing ? 'Edit Topic' : 'Create Topic'}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{isViewing ? 'View topic details' : isEditing ? 'Update topic information' : 'Add a new topic'}</p>
              </div>
            </div>
            {!isViewing && <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}{isEditing ? 'Update' : 'Create'}</Button>}
            {isViewing && <Button onClick={() => navigate(`/admin/topics/${id}/edit`)}>Edit Topic</Button>}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Parent Chapter</CardTitle><CardDescription>Select the chapter this topic belongs to</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="chapterId">Chapter *</Label>
                <Select value={form.watch('chapterId')} onValueChange={(value) => form.setValue('chapterId', value)} disabled={isViewing}>
                  <SelectTrigger><SelectValue placeholder="Select a chapter" /></SelectTrigger>
                  <SelectContent>{mockChapters.map((chapter) => (<SelectItem key={chapter.id} value={chapter.id}>{chapter.displayName}</SelectItem>))}</SelectContent>
                </Select>
                {form.formState.errors.chapterId && <p className="text-xs text-destructive">{form.formState.errors.chapterId.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Enter the basic details for this topic</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input id="displayName" {...form.register('displayName')} placeholder="Distance and Displacement" disabled={isViewing} />
                {form.formState.errors.displayName && <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Slug *</Label>
                  <div className="flex gap-2">
                    <Input id="name" {...form.register('name')} placeholder="distance-displacement" disabled={isViewing} className="flex-1" />
                    {!isViewing && <Button type="button" variant="outline" size="sm" onClick={handleGenerateSlug}>Generate</Button>}
                  </div>
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" type="number" {...form.register('position', { valueAsNumber: true })} disabled={isViewing} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Status & Visibility</CardTitle><CardDescription>Control the visibility of this topic</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><Label htmlFor="isActive" className="text-base">Active Status</Label><p className="text-sm text-muted-foreground">Inactive topics won't be visible to users</p></div>
                <Switch id="isActive" checked={form.watch('isActive')} onCheckedChange={(checked) => form.setValue('isActive', checked)} disabled={isViewing} />
              </div>
            </CardContent>
          </Card>

          {isViewing && existingTopic && (
            <Card>
              <CardHeader><CardTitle>Metadata</CardTitle><CardDescription>System information about this topic</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Chapter</p><p className="font-medium">{getChapterById(existingTopic.chapterId)?.displayName || 'N/A'}</p></div>
                  <div><p className="text-muted-foreground">Created At</p><p className="font-medium">{existingTopic.createdAt.toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Last Updated</p><p className="font-medium">{existingTopic.updatedAt.toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Topic ID</p><p className="font-mono text-xs">{existingTopic.id}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isViewing && (
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/topics')}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}{isEditing ? 'Update Topic' : 'Create Topic'}</Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TopicForm;
