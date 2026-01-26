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
import { AcademicChapter } from '@/types';
import { mockChapters, mockSubjects, getSubjectById } from '@/lib/academic-mock-data';

const chapterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  subjectId: z.string().min(1, 'Subject is required'),
  isActive: z.boolean(),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

const Chapters: React.FC = () => {
  const [chapters, setChapters] = useState<AcademicChapter[]>(mockChapters);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<AcademicChapter | null>(null);
  const [deletingChapter, setDeletingChapter] = useState<AcademicChapter | null>(null);

  const form = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: '',
      displayName: '',
      position: 0,
      subjectId: '',
      isActive: true,
    },
  });

  const filteredChapters = chapters.filter((chapter) => {
    const matchesSearch =
      chapter.name.toLowerCase().includes(search.toLowerCase()) ||
      chapter.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'all' || chapter.subjectId === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const openCreateDialog = () => {
    setEditingChapter(null);
    form.reset({
      name: '',
      displayName: '',
      position: chapters.length,
      subjectId: '',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (chapter: AcademicChapter) => {
    setEditingChapter(chapter);
    form.reset({
      name: chapter.name,
      displayName: chapter.displayName,
      position: chapter.position,
      subjectId: chapter.subjectId,
      isActive: chapter.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (chapter: AcademicChapter) => {
    setDeletingChapter(chapter);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: ChapterFormData) => {
    if (editingChapter) {
      const updated: AcademicChapter = { ...editingChapter, ...data, updatedAt: new Date() };
      setChapters(chapters.map((c) => (c.id === editingChapter.id ? updated : c)));
      toast.success('Chapter updated successfully');
    } else {
      const newChapter: AcademicChapter = {
        id: `chapter-${Date.now()}`,
        name: data.name,
        displayName: data.displayName,
        position: data.position,
        subjectId: data.subjectId,
        isActive: data.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setChapters([...chapters, newChapter]);
      toast.success('Chapter created successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingChapter) {
      setChapters(chapters.filter((c) => c.id !== deletingChapter.id));
      toast.success('Chapter deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingChapter(null);
    }
  };

  const columns: Column<AcademicChapter>[] = [
    {
      key: 'displayName',
      header: 'Chapter',
      render: (chapter) => (
        <div>
          <p className="font-medium text-foreground">{chapter.displayName}</p>
          <p className="text-xs text-muted-foreground">{chapter.name}</p>
        </div>
      ),
    },
    {
      key: 'subjectId',
      header: 'Subject',
      hideOnMobile: true,
      render: (chapter) => {
        const subject = getSubjectById(chapter.subjectId);
        return <span className="text-sm">{subject?.displayName || 'N/A'}</span>;
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
      render: (chapter) => <StatusBadge active={chapter.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Chapters" subtitle="Manage subject chapters" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chapters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {mockSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={filteredChapters}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          emptyMessage="No chapters found"
        />
      </div>

      {/* Create/Edit Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingChapter ? 'Edit Chapter' : 'Create Chapter'}
        description={editingChapter ? 'Update chapter details' : 'Add a new chapter'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjectId">Subject</Label>
            <Select value={form.watch('subjectId')} onValueChange={(value) => form.setValue('subjectId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {mockSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.subjectId && (
              <p className="text-xs text-destructive">{form.formState.errors.subjectId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (slug)</Label>
            <Input id="name" {...form.register('name')} placeholder="motion" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" {...form.register('displayName')} placeholder="Motion" />
            {form.formState.errors.displayName && (
              <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
            )}
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
            <Button type="submit">{editingChapter ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormDialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Chapter"
        description={`Are you sure you want to delete "${deletingChapter?.displayName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Chapters;
