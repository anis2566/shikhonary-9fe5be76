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
import { useChapter, useChapterMutations, useChapters, useSubjects } from '@/hooks/useAcademicData';

const chapterSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Name must be lowercase with hyphens only'),
  display_name: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  position: z.number().min(0, 'Position must be 0 or greater'),
  subject_id: z.string().min(1, 'Subject is required'),
  is_active: z.boolean(),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

const ChapterForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';
  const isViewing = Boolean(id) && !window.location.pathname.includes('edit') && id !== 'create';

  const { data: existingChapter, isLoading: loadingChapter } = useChapter(id || '');
  const { data: chapters = [] } = useChapters();
  const { data: subjects = [] } = useSubjects();
  const { create, update } = useChapterMutations();

  const form = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: { name: '', display_name: '', description: '', position: 0, subject_id: '', is_active: true },
  });

  useEffect(() => {
    if (!isEditing && !isViewing) form.setValue('position', chapters.length);
  }, [chapters.length, isEditing, isViewing, form]);

  useEffect(() => {
    if (existingChapter) {
      form.reset({
        name: existingChapter.name,
        display_name: existingChapter.display_name,
        description: existingChapter.description || '',
        position: existingChapter.position,
        subject_id: existingChapter.subject_id,
        is_active: existingChapter.is_active,
      });
    }
  }, [existingChapter, form]);

  const onSubmit = (data: ChapterFormData) => {
    const payload = {
      name: data.name,
      display_name: data.display_name,
      description: data.description || null,
      position: data.position,
      subject_id: data.subject_id,
      is_active: data.is_active,
    };
    if (isEditing && id) {
      update.mutate({ id, data: payload }, { onSuccess: () => navigate('/admin/chapters') });
    } else {
      create.mutate(payload, { onSuccess: () => navigate('/admin/chapters') });
    }
  };

  const handleGenerateSlug = () => {
    const displayName = form.watch('display_name');
    if (displayName) form.setValue('name', displayName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim());
  };

  const getSubjectName = (subjectId: string) => subjects.find((s) => s.id === subjectId)?.display_name || 'N/A';

  if (loadingChapter && (isEditing || isViewing)) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/chapters')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">{isViewing ? 'View Chapter' : isEditing ? 'Edit Chapter' : 'Create Chapter'}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{isViewing ? 'View chapter details' : isEditing ? 'Update chapter information' : 'Add a new chapter'}</p>
              </div>
            </div>
            {!isViewing && (
              <Button onClick={form.handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
                {(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            )}
            {isViewing && <Button onClick={() => navigate(`/admin/chapters/${id}/edit`)}>Edit Chapter</Button>}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Parent Subject</CardTitle><CardDescription>Select the subject this chapter belongs to</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="subject_id">Subject *</Label>
                <Select value={form.watch('subject_id')} onValueChange={(value) => form.setValue('subject_id', value)} disabled={isViewing}>
                  <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                  <SelectContent>{subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.display_name}</SelectItem>)}</SelectContent>
                </Select>
                {form.formState.errors.subject_id && <p className="text-xs text-destructive">{form.formState.errors.subject_id.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Enter the basic details for this chapter</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name *</Label>
                <Input id="display_name" {...form.register('display_name')} placeholder="Motion" disabled={isViewing} />
                {form.formState.errors.display_name && <p className="text-xs text-destructive">{form.formState.errors.display_name.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Slug *</Label>
                  <div className="flex gap-2">
                    <Input id="name" {...form.register('name')} placeholder="motion" disabled={isViewing} className="flex-1" />
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
            <CardHeader><CardTitle>Status & Visibility</CardTitle><CardDescription>Control the visibility of this chapter</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><Label htmlFor="is_active" className="text-base">Active Status</Label><p className="text-sm text-muted-foreground">Inactive chapters won't be visible to users</p></div>
                <Switch id="is_active" checked={form.watch('is_active')} onCheckedChange={(checked) => form.setValue('is_active', checked)} disabled={isViewing} />
              </div>
            </CardContent>
          </Card>

          {isViewing && existingChapter && (
            <Card>
              <CardHeader><CardTitle>Metadata</CardTitle><CardDescription>System information about this chapter</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Subject</p><p className="font-medium">{getSubjectName(existingChapter.subject_id)}</p></div>
                  <div><p className="text-muted-foreground">Created At</p><p className="font-medium">{new Date(existingChapter.created_at).toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Last Updated</p><p className="font-medium">{new Date(existingChapter.updated_at).toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Chapter ID</p><p className="font-mono text-xs">{existingChapter.id}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isViewing && (
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/chapters')}>Cancel</Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isEditing ? 'Update Chapter' : 'Create Chapter'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChapterForm;
