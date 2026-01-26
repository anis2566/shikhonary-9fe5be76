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
import { useClass, useClassMutations, useClasses, useBoards } from '@/hooks/useAcademicData';

const classSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Name must be lowercase with hyphens only'),
  display_name: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  position: z.number().min(0, 'Position must be 0 or greater'),
  board_id: z.string().min(1, 'Board is required'),
  is_active: z.boolean(),
});

type ClassFormData = z.infer<typeof classSchema>;

const ClassForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';
  const isViewing = Boolean(id) && !window.location.pathname.includes('edit') && id !== 'create';

  const { data: existingClass, isLoading: loadingClass } = useClass(id || '');
  const { data: classes = [] } = useClasses();
  const { data: boards = [] } = useBoards();
  const { create, update } = useClassMutations();

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: { name: '', display_name: '', description: '', position: 0, board_id: '', is_active: true },
  });

  useEffect(() => {
    if (!isEditing && !isViewing) form.setValue('position', classes.length);
  }, [classes.length, isEditing, isViewing, form]);

  useEffect(() => {
    if (existingClass) {
      form.reset({
        name: existingClass.name,
        display_name: existingClass.display_name,
        description: existingClass.description || '',
        position: existingClass.position,
        board_id: existingClass.board_id,
        is_active: existingClass.is_active,
      });
    }
  }, [existingClass, form]);

  const onSubmit = (data: ClassFormData) => {
    const payload = {
      name: data.name,
      display_name: data.display_name,
      description: data.description || null,
      position: data.position,
      board_id: data.board_id,
      is_active: data.is_active,
    };
    if (isEditing && id) {
      update.mutate({ id, data: payload }, { onSuccess: () => navigate('/admin/classes') });
    } else {
      create.mutate(payload, { onSuccess: () => navigate('/admin/classes') });
    }
  };

  const handleGenerateSlug = () => {
    const displayName = form.watch('display_name');
    if (displayName) form.setValue('name', displayName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim());
  };

  const getBoardName = (boardId: string) => boards.find((b) => b.id === boardId)?.display_name || 'N/A';

  if (loadingClass && (isEditing || isViewing)) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/classes')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">{isViewing ? 'View Class' : isEditing ? 'Edit Class' : 'Create Class'}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{isViewing ? 'View class details' : isEditing ? 'Update class information' : 'Add a new academic class'}</p>
              </div>
            </div>
            {!isViewing && (
              <Button onClick={form.handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
                {(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            )}
            {isViewing && <Button onClick={() => navigate(`/admin/classes/${id}/edit`)}>Edit Class</Button>}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Parent Board</CardTitle><CardDescription>Select the academic board this class belongs to</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="board_id">Board *</Label>
                <Select value={form.watch('board_id')} onValueChange={(value) => form.setValue('board_id', value)} disabled={isViewing}>
                  <SelectTrigger><SelectValue placeholder="Select a board" /></SelectTrigger>
                  <SelectContent>{boards.map((board) => <SelectItem key={board.id} value={board.id}>{board.display_name}</SelectItem>)}</SelectContent>
                </Select>
                {form.formState.errors.board_id && <p className="text-xs text-destructive">{form.formState.errors.board_id.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Enter the basic details for this class</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name *</Label>
                <Input id="display_name" {...form.register('display_name')} placeholder="Class 9" disabled={isViewing} />
                {form.formState.errors.display_name && <p className="text-xs text-destructive">{form.formState.errors.display_name.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Slug *</Label>
                  <div className="flex gap-2">
                    <Input id="name" {...form.register('name')} placeholder="class-9" disabled={isViewing} className="flex-1" />
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
            <CardHeader><CardTitle>Status & Visibility</CardTitle><CardDescription>Control the visibility of this class</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><Label htmlFor="is_active" className="text-base">Active Status</Label><p className="text-sm text-muted-foreground">Inactive classes won't be visible to users</p></div>
                <Switch id="is_active" checked={form.watch('is_active')} onCheckedChange={(checked) => form.setValue('is_active', checked)} disabled={isViewing} />
              </div>
            </CardContent>
          </Card>

          {isViewing && existingClass && (
            <Card>
              <CardHeader><CardTitle>Metadata</CardTitle><CardDescription>System information about this class</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Board</p><p className="font-medium">{getBoardName(existingClass.board_id)}</p></div>
                  <div><p className="text-muted-foreground">Created At</p><p className="font-medium">{new Date(existingClass.created_at).toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Last Updated</p><p className="font-medium">{new Date(existingClass.updated_at).toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Class ID</p><p className="font-mono text-xs">{existingClass.id}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isViewing && (
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/classes')}>Cancel</Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isEditing ? 'Update Class' : 'Create Class'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
