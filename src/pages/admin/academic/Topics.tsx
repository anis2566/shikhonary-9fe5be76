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
import { AcademicTopic } from '@/types';
import { mockTopics, mockChapters, getChapterById } from '@/lib/academic-mock-data';

const topicSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  chapterId: z.string().min(1, 'Chapter is required'),
  isActive: z.boolean(),
});

type TopicFormData = z.infer<typeof topicSchema>;

const Topics: React.FC = () => {
  const [topics, setTopics] = useState<AcademicTopic[]>(mockTopics);
  const [search, setSearch] = useState('');
  const [filterChapter, setFilterChapter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<AcademicTopic | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<AcademicTopic | null>(null);

  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: '',
      displayName: '',
      position: 0,
      chapterId: '',
      isActive: true,
    },
  });

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(search.toLowerCase()) ||
      topic.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesChapter = filterChapter === 'all' || topic.chapterId === filterChapter;
    return matchesSearch && matchesChapter;
  });

  const openCreateDialog = () => {
    setEditingTopic(null);
    form.reset({
      name: '',
      displayName: '',
      position: topics.length,
      chapterId: '',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (topic: AcademicTopic) => {
    setEditingTopic(topic);
    form.reset({
      name: topic.name,
      displayName: topic.displayName,
      position: topic.position,
      chapterId: topic.chapterId,
      isActive: topic.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (topic: AcademicTopic) => {
    setDeletingTopic(topic);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: TopicFormData) => {
    if (editingTopic) {
      const updated: AcademicTopic = { ...editingTopic, ...data, updatedAt: new Date() };
      setTopics(topics.map((t) => (t.id === editingTopic.id ? updated : t)));
      toast.success('Topic updated successfully');
    } else {
      const newTopic: AcademicTopic = {
        id: `topic-${Date.now()}`,
        name: data.name,
        displayName: data.displayName,
        position: data.position,
        chapterId: data.chapterId,
        isActive: data.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTopics([...topics, newTopic]);
      toast.success('Topic created successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingTopic) {
      setTopics(topics.filter((t) => t.id !== deletingTopic.id));
      toast.success('Topic deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingTopic(null);
    }
  };

  const columns: Column<AcademicTopic>[] = [
    {
      key: 'displayName',
      header: 'Topic',
      render: (topic) => (
        <div>
          <p className="font-medium text-foreground">{topic.displayName}</p>
          <p className="text-xs text-muted-foreground">{topic.name}</p>
        </div>
      ),
    },
    {
      key: 'chapterId',
      header: 'Chapter',
      hideOnMobile: true,
      render: (topic) => {
        const chapter = getChapterById(topic.chapterId);
        return <span className="text-sm">{chapter?.displayName || 'N/A'}</span>;
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
      render: (topic) => <StatusBadge active={topic.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Topics" subtitle="Manage chapter topics" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterChapter} onValueChange={setFilterChapter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {mockChapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Topic
          </Button>
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={filteredTopics}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          emptyMessage="No topics found"
        />
      </div>

      {/* Create/Edit Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingTopic ? 'Edit Topic' : 'Create Topic'}
        description={editingTopic ? 'Update topic details' : 'Add a new topic'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chapterId">Chapter</Label>
            <Select value={form.watch('chapterId')} onValueChange={(value) => form.setValue('chapterId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {mockChapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.chapterId && (
              <p className="text-xs text-destructive">{form.formState.errors.chapterId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (slug)</Label>
            <Input id="name" {...form.register('name')} placeholder="distance-displacement" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" {...form.register('displayName')} placeholder="Distance and Displacement" />
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
            <Button type="submit">{editingTopic ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormDialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Topic"
        description={`Are you sure you want to delete "${deletingTopic?.displayName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Topics;
