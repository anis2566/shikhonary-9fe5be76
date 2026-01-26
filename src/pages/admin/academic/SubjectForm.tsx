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
import { AcademicSubject } from '@/types';
import { mockSubjects, mockClasses, getClassById } from '@/lib/academic-mock-data';

const subjectSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-]+$/, 'Name must be lowercase with hyphens only'),
  code: z.string().optional(),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  classId: z.string().min(1, 'Class is required'),
  isActive: z.boolean(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

const SubjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id) && id !== 'create';
  const isViewing = Boolean(id) && !window.location.pathname.includes('edit') && id !== 'create';

  const existingSubject = isEditing || isViewing ? mockSubjects.find((s) => s.id === id) : null;

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      displayName: '',
      position: mockSubjects.length,
      classId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (existingSubject) {
      form.reset({
        name: existingSubject.name,
        code: existingSubject.code || '',
        displayName: existingSubject.displayName,
        position: existingSubject.position,
        classId: existingSubject.classId,
        isActive: existingSubject.isActive,
      });
    }
  }, [existingSubject, form]);

  const onSubmit = (data: SubjectFormData) => {
    if (isEditing) {
      toast.success('Subject updated successfully');
    } else {
      toast.success('Subject created successfully');
    }
    navigate('/admin/subjects');
  };

  const handleGenerateSlug = () => {
    const displayName = form.watch('displayName');
    if (displayName) {
      const slug = displayName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
      form.setValue('name', slug);
    }
  };

  const handleGenerateCode = () => {
    const displayName = form.watch('displayName');
    if (displayName) {
      const words = displayName.split(' ');
      const code = words.map((word) => word.charAt(0).toUpperCase()).join('').slice(0, 10);
      form.setValue('code', code);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/subjects')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                  {isViewing ? 'View Subject' : isEditing ? 'Edit Subject' : 'Create Subject'}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isViewing ? 'View subject details' : isEditing ? 'Update subject information' : 'Add a new subject'}
                </p>
              </div>
            </div>
            {!isViewing && (
              <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            )}
            {isViewing && <Button onClick={() => navigate(`/admin/subjects/${id}/edit`)}>Edit Subject</Button>}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parent Class</CardTitle>
              <CardDescription>Select the class this subject belongs to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="classId">Class *</Label>
                <Select value={form.watch('classId')} onValueChange={(value) => form.setValue('classId', value)} disabled={isViewing}>
                  <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                  <SelectContent>
                    {mockClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.displayName} ({cls.level})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.classId && <p className="text-xs text-destructive">{form.formState.errors.classId.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for this subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input id="displayName" {...form.register('displayName')} placeholder="Physics" disabled={isViewing} />
                {form.formState.errors.displayName && <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Slug *</Label>
                  <div className="flex gap-2">
                    <Input id="name" {...form.register('name')} placeholder="physics" disabled={isViewing} className="flex-1" />
                    {!isViewing && <Button type="button" variant="outline" size="sm" onClick={handleGenerateSlug}>Generate</Button>}
                  </div>
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code (Optional)</Label>
                  <div className="flex gap-2">
                    <Input id="code" {...form.register('code')} placeholder="PHY" disabled={isViewing} className="flex-1" />
                    {!isViewing && <Button type="button" variant="outline" size="sm" onClick={handleGenerateCode}>Generate</Button>}
                  </div>
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
              <CardDescription>Control the visibility of this subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive" className="text-base">Active Status</Label>
                  <p className="text-sm text-muted-foreground">Inactive subjects won't be visible to users</p>
                </div>
                <Switch id="isActive" checked={form.watch('isActive')} onCheckedChange={(checked) => form.setValue('isActive', checked)} disabled={isViewing} />
              </div>
            </CardContent>
          </Card>

          {isViewing && existingSubject && (
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>System information about this subject</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Class</p><p className="font-medium">{getClassById(existingSubject.classId)?.displayName || 'N/A'}</p></div>
                  <div><p className="text-muted-foreground">Created At</p><p className="font-medium">{existingSubject.createdAt.toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Last Updated</p><p className="font-medium">{existingSubject.updatedAt.toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Subject ID</p><p className="font-mono text-xs">{existingSubject.id}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isViewing && (
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/subjects')}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isEditing ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
