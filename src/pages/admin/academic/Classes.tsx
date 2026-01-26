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
import { AcademicClass } from '@/types';
import { mockClasses, mockBoards, getBoardById } from '@/lib/academic-mock-data';

const classSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  level: z.string().min(1, 'Level is required'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  boardId: z.string().min(1, 'Board is required'),
  isActive: z.boolean(),
});

type ClassFormData = z.infer<typeof classSchema>;

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<AcademicClass[]>(mockClasses);
  const [search, setSearch] = useState('');
  const [filterBoard, setFilterBoard] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AcademicClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<AcademicClass | null>(null);

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      level: '',
      displayName: '',
      position: 0,
      boardId: '',
      isActive: true,
    },
  });

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(search.toLowerCase()) ||
      cls.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesBoard = filterBoard === 'all' || cls.boardId === filterBoard;
    return matchesSearch && matchesBoard;
  });

  const openCreateDialog = () => {
    setEditingClass(null);
    form.reset({
      name: '',
      level: '',
      displayName: '',
      position: classes.length,
      boardId: '',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (cls: AcademicClass) => {
    setEditingClass(cls);
    form.reset({
      name: cls.name,
      level: cls.level,
      displayName: cls.displayName,
      position: cls.position,
      boardId: cls.boardId,
      isActive: cls.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (cls: AcademicClass) => {
    setDeletingClass(cls);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: ClassFormData) => {
    if (editingClass) {
      const updated: AcademicClass = { ...editingClass, ...data, updatedAt: new Date() };
      setClasses(classes.map((c) => (c.id === editingClass.id ? updated : c)));
      toast.success('Class updated successfully');
    } else {
      const newClass: AcademicClass = {
        id: `class-${Date.now()}`,
        name: data.name,
        level: data.level,
        displayName: data.displayName,
        position: data.position,
        boardId: data.boardId,
        isActive: data.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setClasses([...classes, newClass]);
      toast.success('Class created successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingClass) {
      setClasses(classes.filter((c) => c.id !== deletingClass.id));
      toast.success('Class deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingClass(null);
    }
  };

  const columns: Column<AcademicClass>[] = [
    {
      key: 'displayName',
      header: 'Class',
      render: (cls) => (
        <div>
          <p className="font-medium text-foreground">{cls.displayName}</p>
          <p className="text-xs text-muted-foreground">{cls.level}</p>
        </div>
      ),
    },
    {
      key: 'boardId',
      header: 'Board',
      hideOnMobile: true,
      render: (cls) => {
        const board = getBoardById(cls.boardId);
        return <span className="text-sm">{board?.code || 'N/A'}</span>;
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
      render: (cls) => <StatusBadge active={cls.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Classes" subtitle="Manage academic classes" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterBoard} onValueChange={setFilterBoard}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boards</SelectItem>
                {mockBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={filteredClasses}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          emptyMessage="No classes found"
        />
      </div>

      {/* Create/Edit Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingClass ? 'Edit Class' : 'Create Class'}
        description={editingClass ? 'Update class details' : 'Add a new class'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="boardId">Board</Label>
            <Select value={form.watch('boardId')} onValueChange={(value) => form.setValue('boardId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                {mockBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.boardId && (
              <p className="text-xs text-destructive">{form.formState.errors.boardId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (slug)</Label>
            <Input id="name" {...form.register('name')} placeholder="class-9" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" {...form.register('displayName')} placeholder="Class 9" />
            {form.formState.errors.displayName && (
              <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Input id="level" {...form.register('level')} placeholder="SSC, HSC, O-Level" />
            {form.formState.errors.level && (
              <p className="text-xs text-destructive">{form.formState.errors.level.message}</p>
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
            <Button type="submit">{editingClass ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormDialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Class"
        description={`Are you sure you want to delete "${deletingClass?.displayName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Classes;
