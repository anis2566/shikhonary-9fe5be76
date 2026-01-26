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
import { AcademicClass } from '@/types';
import { mockClasses, mockBoards, getBoardById } from '@/lib/academic-mock-data';

const classSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Name must be lowercase with hyphens only'),
  level: z.string().min(1, 'Level is required'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  boardId: z.string().min(1, 'Board is required'),
  isActive: z.boolean(),
});

type ClassFormData = z.infer<typeof classSchema>;

const ClassForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';
  const isViewing = Boolean(id) && !window.location.pathname.includes('edit') && id !== 'create';

  const existingClass = isEditing || isViewing ? mockClasses.find((c) => c.id === id) : null;

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      level: '',
      displayName: '',
      position: mockClasses.length,
      boardId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (existingClass) {
      form.reset({
        name: existingClass.name,
        level: existingClass.level,
        displayName: existingClass.displayName,
        position: existingClass.position,
        boardId: existingClass.boardId,
        isActive: existingClass.isActive,
      });
    }
  }, [existingClass, form]);

  const onSubmit = (data: ClassFormData) => {
    if (isEditing) {
      toast.success('Class updated successfully');
    } else {
      toast.success('Class created successfully');
    }
    navigate('/admin/classes');
  };

  const handleGenerateSlug = () => {
    const displayName = form.watch('displayName');
    if (displayName) {
      const slug = displayName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
      form.setValue('name', slug);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/classes')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                  {isViewing ? 'View Class' : isEditing ? 'Edit Class' : 'Create Class'}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isViewing ? 'View class details' : isEditing ? 'Update class information' : 'Add a new academic class'}
                </p>
              </div>
            </div>
            {!isViewing && (
              <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            )}
            {isViewing && (
              <Button onClick={() => navigate(`/admin/classes/${id}/edit`)}>Edit Class</Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parent Board</CardTitle>
              <CardDescription>Select the academic board this class belongs to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="boardId">Board *</Label>
                <Select
                  value={form.watch('boardId')}
                  onValueChange={(value) => form.setValue('boardId', value)}
                  disabled={isViewing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a board" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBoards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.displayName} ({board.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.boardId && (
                  <p className="text-xs text-destructive">{form.formState.errors.boardId.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for this class</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input id="displayName" {...form.register('displayName')} placeholder="Class 9" disabled={isViewing} />
                {form.formState.errors.displayName && (
                  <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Slug *</Label>
                  <div className="flex gap-2">
                    <Input id="name" {...form.register('name')} placeholder="class-9" disabled={isViewing} className="flex-1" />
                    {!isViewing && (
                      <Button type="button" variant="outline" size="sm" onClick={handleGenerateSlug}>Generate</Button>
                    )}
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={form.watch('level')}
                    onValueChange={(value) => form.setValue('level', value)}
                    disabled={isViewing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="Middle">Middle School</SelectItem>
                      <SelectItem value="SSC">SSC</SelectItem>
                      <SelectItem value="HSC">HSC</SelectItem>
                      <SelectItem value="O-Level">O-Level</SelectItem>
                      <SelectItem value="A-Level">A-Level</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.level && (
                    <p className="text-xs text-destructive">{form.formState.errors.level.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" type="number" {...form.register('position', { valueAsNumber: true })} disabled={isViewing} />
                <p className="text-xs text-muted-foreground">Controls the display order. Lower numbers appear first.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
              <CardDescription>Control the visibility of this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive" className="text-base">Active Status</Label>
                  <p className="text-sm text-muted-foreground">Inactive classes won't be visible to users</p>
                </div>
                <Switch
                  id="isActive"
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', checked)}
                  disabled={isViewing}
                />
              </div>
            </CardContent>
          </Card>

          {isViewing && existingClass && (
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>System information about this class</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Board</p>
                    <p className="font-medium">{getBoardById(existingClass.boardId)?.displayName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p className="font-medium">{existingClass.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{existingClass.updatedAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Class ID</p>
                    <p className="font-mono text-xs">{existingClass.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isViewing && (
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/classes')}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
