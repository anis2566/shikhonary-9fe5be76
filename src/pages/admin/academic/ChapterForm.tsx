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
import { AcademicChapter } from '@/types';
import { mockChapters, mockSubjects, getSubjectById } from '@/lib/academic-mock-data';

const chapterSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Name must be lowercase with hyphens only'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  subjectId: z.string().min(1, 'Subject is required'),
  isActive: z.boolean(),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

const ChapterForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';
  const isViewing = Boolean(id) && !window.location.pathname.includes('edit') && id !== 'create';

  const existingChapter = isEditing || isViewing ? mockChapters.find((c) => c.id === id) : null;

  const form = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: { name: '', displayName: '', position: mockChapters.length, subjectId: '', isActive: true },
  });

  useEffect(() => {
    if (existingChapter) {
      form.reset({
        name: existingChapter.name,
        displayName: existingChapter.displayName,
        position: existingChapter.position,
        subjectId: existingChapter.subjectId,
        isActive: existingChapter.isActive,
      });
    }
  }, [existingChapter, form]);

  const onSubmit = (data: ChapterFormData) => {
    if (isEditing) toast.success('Chapter updated successfully');
    else toast.success('Chapter created successfully');
    navigate('/admin/chapters');
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
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/chapters')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">{isViewing ? 'View Chapter' : isEditing ? 'Edit Chapter' : 'Create Chapter'}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{isViewing ? 'View chapter details' : isEditing ? 'Update chapter information' : 'Add a new chapter'}</p>
              </div>
            </div>
            {!isViewing && (
              <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
                <Label htmlFor="subjectId">Subject *</Label>
                <Select value={form.watch('subjectId')} onValueChange={(value) => form.setValue('subjectId', value)} disabled={isViewing}>
                  <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                  <SelectContent>
                    {mockSubjects.map((subject) => (<SelectItem key={subject.id} value={subject.id}>{subject.displayName}</SelectItem>))}
                  </SelectContent>
                </Select>
                {form.formState.errors.subjectId && <p className="text-xs text-destructive">{form.formState.errors.subjectId.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Enter the basic details for this chapter</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input id="displayName" {...form.register('displayName')} placeholder="Motion" disabled={isViewing} />
                {form.formState.errors.displayName && <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Status & Visibility</CardTitle><CardDescription>Control the visibility of this chapter</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><Label htmlFor="isActive" className="text-base">Active Status</Label><p className="text-sm text-muted-foreground">Inactive chapters won't be visible to users</p></div>
                <Switch id="isActive" checked={form.watch('isActive')} onCheckedChange={(checked) => form.setValue('isActive', checked)} disabled={isViewing} />
              </div>
            </CardContent>
          </Card>

          {isViewing && existingChapter && (
            <Card>
              <CardHeader><CardTitle>Metadata</CardTitle><CardDescription>System information about this chapter</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Subject</p><p className="font-medium">{getSubjectById(existingChapter.subjectId)?.displayName || 'N/A'}</p></div>
                  <div><p className="text-muted-foreground">Created At</p><p className="font-medium">{existingChapter.createdAt.toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Last Updated</p><p className="font-medium">{existingChapter.updatedAt.toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Chapter ID</p><p className="font-mono text-xs">{existingChapter.id}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isViewing && (
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/chapters')}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
