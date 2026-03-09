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
import { useQuestionType, useQuestionTypeMutations, useSubjects, useChapters } from '@/hooks/useAcademicData';

const schema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Lowercase with hyphens only'),
  display_name: z.string().min(1, 'Display name is required'),
  subject_id: z.string().min(1, 'Subject is required'),
  chapter_id: z.string().optional(),
  is_active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const QuestionTypeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';

  const { data: existing, isLoading: loading } = useQuestionType(id || '');
  const { data: subjects = [] } = useSubjects();
  const { data: allChapters = [] } = useChapters();
  const { create, update } = useQuestionTypeMutations();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', display_name: '', subject_id: '', chapter_id: '', is_active: true },
  });

  const selectedSubjectId = form.watch('subject_id');
  const chapters = allChapters.filter((c) => c.subject_id === selectedSubjectId);

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        display_name: existing.display_name,
        subject_id: existing.subject_id,
        chapter_id: existing.chapter_id || '',
        is_active: existing.is_active,
      });
    }
  }, [existing, form]);

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      display_name: data.display_name,
      subject_id: data.subject_id,
      chapter_id: data.chapter_id || null,
      is_active: data.is_active,
    };
    if (isEditing && id) {
      update.mutate({ id, data: payload }, { onSuccess: () => navigate('/admin/question-types') });
    } else {
      create.mutate(payload as any, { onSuccess: () => navigate('/admin/question-types') });
    }
  };

  const handleGenerateSlug = () => {
    const displayName = form.watch('display_name');
    if (displayName) form.setValue('name', displayName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim());
  };

  if (loading && isEditing) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/question-types')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">{isEditing ? 'Edit Question Type' : 'Create Question Type'}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{isEditing ? 'Update question type information' : 'Add a new question type'}</p>
              </div>
            </div>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
              {(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Classification</CardTitle><CardDescription>Link this question type to a subject and optionally a chapter</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={form.watch('subject_id')} onValueChange={(v) => { form.setValue('subject_id', v); form.setValue('chapter_id', ''); }}>
                  <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                  <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.display_name}</SelectItem>)}</SelectContent>
                </Select>
                {form.formState.errors.subject_id && <p className="text-xs text-destructive">{form.formState.errors.subject_id.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Chapter (optional)</Label>
                <Select value={form.watch('chapter_id') || ''} onValueChange={(v) => form.setValue('chapter_id', v)} disabled={!selectedSubjectId}>
                  <SelectTrigger><SelectValue placeholder="Select a chapter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No chapter</SelectItem>
                    {chapters.map((c) => <SelectItem key={c.id} value={c.id}>{c.display_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Enter the details for this question type</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name *</Label>
                <Input {...form.register('display_name')} placeholder="e.g. Multiple Choice" />
                {form.formState.errors.display_name && <p className="text-xs text-destructive">{form.formState.errors.display_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <div className="flex gap-2">
                  <Input {...form.register('name')} placeholder="e.g. multiple-choice" className="flex-1" />
                  <Button type="button" variant="outline" size="sm" onClick={handleGenerateSlug}>Generate</Button>
                </div>
                {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><Label className="text-base">Active</Label><p className="text-sm text-muted-foreground">Inactive types won't be visible</p></div>
                <Switch checked={form.watch('is_active')} onCheckedChange={(c) => form.setValue('is_active', c)} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/question-types')}>Cancel</Button>
            <Button type="submit" disabled={create.isPending || update.isPending}>
              {(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionTypeForm;
