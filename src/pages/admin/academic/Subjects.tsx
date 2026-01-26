import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AcademicDataTable, { Column, StatusBadge } from '@/components/academic/AcademicDataTable';
import FormDialog from '@/components/academic/FormDialog';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AcademicSubject } from '@/types';
import { mockSubjects, mockClasses, getClassById } from '@/lib/academic-mock-data';

const subjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  classId: z.string().min(1, 'Class is required'),
  isActive: z.boolean(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<AcademicSubject[]>(mockSubjects);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<AcademicSubject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<AcademicSubject | null>(null);

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      displayName: '',
      position: 0,
      classId: '',
      isActive: true,
    },
  });

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(search.toLowerCase()) ||
      subject.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesClass = filterClass === 'all' || subject.classId === filterClass;
    return matchesSearch && matchesClass;
  });

  const openCreateDialog = () => {
    setEditingSubject(null);
    form.reset({
      name: '',
      code: '',
      displayName: '',
      position: subjects.length,
      classId: '',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (subject: AcademicSubject) => {
    setEditingSubject(subject);
    form.reset({
      name: subject.name,
      code: subject.code || '',
      displayName: subject.displayName,
      position: subject.position,
      classId: subject.classId,
      isActive: subject.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (subject: AcademicSubject) => {
    setDeletingSubject(subject);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: SubjectFormData) => {
    if (editingSubject) {
      const updated: AcademicSubject = { ...editingSubject, ...data, updatedAt: new Date() };
      setSubjects(subjects.map((s) => (s.id === editingSubject.id ? updated : s)));
      toast.success('Subject updated successfully');
    } else {
      const newSubject: AcademicSubject = {
        id: `subject-${Date.now()}`,
        name: data.name,
        code: data.code,
        displayName: data.displayName,
        position: data.position,
        classId: data.classId,
        isActive: data.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSubjects([...subjects, newSubject]);
      toast.success('Subject created successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingSubject) {
      setSubjects(subjects.filter((s) => s.id !== deletingSubject.id));
      toast.success('Subject deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingSubject(null);
    }
  };

  const columns: Column<AcademicSubject>[] = [
    {
      key: 'displayName',
      header: 'Subject',
      render: (subject) => (
        <div>
          <p className="font-medium text-foreground">{subject.displayName}</p>
          {subject.code && <p className="text-xs text-muted-foreground">{subject.code}</p>}
        </div>
      ),
    },
    {
      key: 'classId',
      header: 'Class',
      hideOnMobile: true,
      render: (subject) => {
        const cls = getClassById(subject.classId);
        return <span className="text-sm">{cls?.displayName || 'N/A'}</span>;
      },
    },
    {
      key: 'position',
      header: 'Position',
      hideOnMobile: true,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (subject) => <StatusBadge active={subject.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Subjects" subtitle="Manage academic subjects" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {mockClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={filteredSubjects}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          emptyMessage="No subjects found"
        />
      </div>

      {/* Create/Edit Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingSubject ? 'Edit Subject' : 'Create Subject'}
        description={editingSubject ? 'Update subject details' : 'Add a new subject'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classId">Class</Label>
            <Select value={form.watch('classId')} onValueChange={(value) => form.setValue('classId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {mockClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.classId && (
              <p className="text-xs text-destructive">{form.formState.errors.classId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (slug)</Label>
            <Input id="name" {...form.register('name')} placeholder="physics" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" {...form.register('displayName')} placeholder="Physics" />
            {form.formState.errors.displayName && (
              <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code (optional)</Label>
            <Input id="code" {...form.register('code')} placeholder="PHY" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              type="number"
              {...form.register('position', { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={form.watch('isActive')}
              onCheckedChange={(checked) => form.setValue('isActive', checked)}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingSubject ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormDialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Subject"
        description={`Are you sure you want to delete "${deletingSubject?.displayName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Subjects;
