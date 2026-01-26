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
import { AcademicSubTopic } from '@/types';
import { mockSubTopics, mockTopics, getTopicById } from '@/lib/academic-mock-data';

const subTopicSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  topicId: z.string().min(1, 'Topic is required'),
  isActive: z.boolean(),
});

type SubTopicFormData = z.infer<typeof subTopicSchema>;

const SubTopics: React.FC = () => {
  const [subTopics, setSubTopics] = useState<AcademicSubTopic[]>(mockSubTopics);
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSubTopic, setEditingSubTopic] = useState<AcademicSubTopic | null>(null);
  const [deletingSubTopic, setDeletingSubTopic] = useState<AcademicSubTopic | null>(null);

  const form = useForm<SubTopicFormData>({
    resolver: zodResolver(subTopicSchema),
    defaultValues: {
      name: '',
      displayName: '',
      position: 0,
      topicId: '',
      isActive: true,
    },
  });

  const filteredSubTopics = subTopics.filter((subTopic) => {
    const matchesSearch =
      subTopic.name.toLowerCase().includes(search.toLowerCase()) ||
      subTopic.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = filterTopic === 'all' || subTopic.topicId === filterTopic;
    return matchesSearch && matchesTopic;
  });

  const openCreateDialog = () => {
    setEditingSubTopic(null);
    form.reset({
      name: '',
      displayName: '',
      position: subTopics.length,
      topicId: '',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (subTopic: AcademicSubTopic) => {
    setEditingSubTopic(subTopic);
    form.reset({
      name: subTopic.name,
      displayName: subTopic.displayName,
      position: subTopic.position,
      topicId: subTopic.topicId,
      isActive: subTopic.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (subTopic: AcademicSubTopic) => {
    setDeletingSubTopic(subTopic);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: SubTopicFormData) => {
    if (editingSubTopic) {
      const updated: AcademicSubTopic = { ...editingSubTopic, ...data, updatedAt: new Date() };
      setSubTopics(subTopics.map((s) => (s.id === editingSubTopic.id ? updated : s)));
      toast.success('Sub-topic updated successfully');
    } else {
      const newSubTopic: AcademicSubTopic = {
        id: `subtopic-${Date.now()}`,
        name: data.name,
        displayName: data.displayName,
        position: data.position,
        topicId: data.topicId,
        isActive: data.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSubTopics([...subTopics, newSubTopic]);
      toast.success('Sub-topic created successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingSubTopic) {
      setSubTopics(subTopics.filter((s) => s.id !== deletingSubTopic.id));
      toast.success('Sub-topic deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingSubTopic(null);
    }
  };

  const columns: Column<AcademicSubTopic>[] = [
    {
      key: 'displayName',
      header: 'Sub-Topic',
      render: (subTopic) => (
        <div>
          <p className="font-medium text-foreground">{subTopic.displayName}</p>
          <p className="text-xs text-muted-foreground">{subTopic.name}</p>
        </div>
      ),
    },
    {
      key: 'topicId',
      header: 'Topic',
      hideOnMobile: true,
      render: (subTopic) => {
        const topic = getTopicById(subTopic.topicId);
        return <span className="text-sm">{topic?.displayName || 'N/A'}</span>;
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
      render: (subTopic) => <StatusBadge active={subTopic.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Sub-Topics" subtitle="Manage topic sub-topics" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sub-topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterTopic} onValueChange={setFilterTopic}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {mockTopics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sub-Topic
          </Button>
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={filteredSubTopics}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          emptyMessage="No sub-topics found"
        />
      </div>

      {/* Create/Edit Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingSubTopic ? 'Edit Sub-Topic' : 'Create Sub-Topic'}
        description={editingSubTopic ? 'Update sub-topic details' : 'Add a new sub-topic'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topicId">Topic</Label>
            <Select value={form.watch('topicId')} onValueChange={(value) => form.setValue('topicId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {mockTopics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.topicId && (
              <p className="text-xs text-destructive">{form.formState.errors.topicId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (slug)</Label>
            <Input id="name" {...form.register('name')} placeholder="scalar-quantities" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" {...form.register('displayName')} placeholder="Scalar Quantities" />
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
            <Button type="submit">{editingSubTopic ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormDialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Sub-Topic"
        description={`Are you sure you want to delete "${deletingSubTopic?.displayName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SubTopics;
