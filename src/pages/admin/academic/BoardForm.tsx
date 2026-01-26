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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AcademicBoard } from '@/types';
import { mockBoards } from '@/lib/academic-mock-data';

const boardSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Name must be lowercase with hyphens only'),
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  isActive: z.boolean(),
});

type BoardFormData = z.infer<typeof boardSchema>;

const BoardForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';
  const isViewing = Boolean(id) && !window.location.pathname.includes('edit') && id !== 'create';

  const existingBoard = isEditing || isViewing ? mockBoards.find((b) => b.id === id) : null;

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: '',
      code: '',
      displayName: '',
      position: mockBoards.length,
      isActive: true,
    },
  });

  useEffect(() => {
    if (existingBoard) {
      form.reset({
        name: existingBoard.name,
        code: existingBoard.code,
        displayName: existingBoard.displayName,
        position: existingBoard.position,
        isActive: existingBoard.isActive,
      });
    }
  }, [existingBoard, form]);

  const onSubmit = (data: BoardFormData) => {
    if (isEditing) {
      toast.success('Board updated successfully');
    } else {
      toast.success('Board created successfully');
    }
    navigate('/admin/boards');
  };

  const handleGenerateSlug = () => {
    const displayName = form.watch('displayName');
    if (displayName) {
      const slug = displayName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('name', slug);
    }
  };

  const handleGenerateCode = () => {
    const displayName = form.watch('displayName');
    if (displayName) {
      const words = displayName.split(' ');
      const code = words
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 10);
      form.setValue('code', code);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/boards')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                  {isViewing ? 'View Board' : isEditing ? 'Edit Board' : 'Create Board'}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isViewing
                    ? 'View board details'
                    : isEditing
                    ? 'Update board information'
                    : 'Add a new academic board'}
                </p>
              </div>
            </div>
            {!isViewing && (
              <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            )}
            {isViewing && (
              <Button onClick={() => navigate(`/admin/boards/${id}/edit`)}>
                Edit Board
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for this academic board</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  {...form.register('displayName')}
                  placeholder="National Curriculum and Textbook Board"
                  disabled={isViewing}
                />
                {form.formState.errors.displayName && (
                  <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Slug (URL-friendly name) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      {...form.register('name')}
                      placeholder="nctb"
                      disabled={isViewing}
                      className="flex-1"
                    />
                    {!isViewing && (
                      <Button type="button" variant="outline" size="sm" onClick={handleGenerateSlug}>
                        Generate
                      </Button>
                    )}
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      {...form.register('code')}
                      placeholder="NCTB"
                      disabled={isViewing}
                      className="flex-1"
                    />
                    {!isViewing && (
                      <Button type="button" variant="outline" size="sm" onClick={handleGenerateCode}>
                        Generate
                      </Button>
                    )}
                  </div>
                  {form.formState.errors.code && (
                    <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  {...form.register('position', { valueAsNumber: true })}
                  disabled={isViewing}
                />
                <p className="text-xs text-muted-foreground">
                  Controls the display order of boards. Lower numbers appear first.
                </p>
                {form.formState.errors.position && (
                  <p className="text-xs text-destructive">{form.formState.errors.position.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
              <CardDescription>Control the visibility of this board</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive" className="text-base">Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Inactive boards won't be visible to users
                  </p>
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

          {/* Metadata (for viewing) */}
          {isViewing && existingBoard && (
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>System information about this board</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p className="font-medium">{existingBoard.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{existingBoard.updatedAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Board ID</p>
                    <p className="font-mono text-xs">{existingBoard.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {!isViewing && (
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/boards')}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditing ? 'Update Board' : 'Create Board'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BoardForm;
