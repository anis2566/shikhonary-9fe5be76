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
import { toast } from 'sonner';
import { AcademicBoard } from '@/types';
import { mockBoards } from '@/lib/academic-mock-data';

const boardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
  displayName: z.string().min(1, 'Display name is required'),
  position: z.number().min(0, 'Position must be 0 or greater'),
  isActive: z.boolean(),
});

type BoardFormData = z.infer<typeof boardSchema>;

const Boards: React.FC = () => {
  const [boards, setBoards] = useState<AcademicBoard[]>(mockBoards);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<AcademicBoard | null>(null);
  const [deletingBoard, setDeletingBoard] = useState<AcademicBoard | null>(null);

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: '',
      code: '',
      displayName: '',
      position: 0,
      isActive: true,
    },
  });

  const filteredBoards = boards.filter(
    (board) =>
      board.name.toLowerCase().includes(search.toLowerCase()) ||
      board.displayName.toLowerCase().includes(search.toLowerCase()) ||
      board.code.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateDialog = () => {
    setEditingBoard(null);
    form.reset({
      name: '',
      code: '',
      displayName: '',
      position: boards.length,
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (board: AcademicBoard) => {
    setEditingBoard(board);
    form.reset({
      name: board.name,
      code: board.code,
      displayName: board.displayName,
      position: board.position,
      isActive: board.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (board: AcademicBoard) => {
    setDeletingBoard(board);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: BoardFormData) => {
    if (editingBoard) {
      const updated: AcademicBoard = { ...editingBoard, ...data, updatedAt: new Date() };
      setBoards(boards.map((b) => (b.id === editingBoard.id ? updated : b)));
      toast.success('Board updated successfully');
    } else {
      const newBoard: AcademicBoard = {
        id: `board-${Date.now()}`,
        name: data.name,
        code: data.code,
        displayName: data.displayName,
        position: data.position,
        isActive: data.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setBoards([...boards, newBoard]);
      toast.success('Board created successfully');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingBoard) {
      setBoards(boards.filter((b) => b.id !== deletingBoard.id));
      toast.success('Board deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingBoard(null);
    }
  };

  const columns: Column<AcademicBoard>[] = [
    {
      key: 'displayName',
      header: 'Name',
      render: (board) => (
        <div>
          <p className="font-medium text-foreground">{board.displayName}</p>
          <p className="text-xs text-muted-foreground">{board.code}</p>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Position',
      hideOnMobile: true,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (board) => <StatusBadge active={board.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Academic Boards" subtitle="Manage curriculum boards" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Board
          </Button>
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={filteredBoards}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          emptyMessage="No boards found"
        />
      </div>

      {/* Create/Edit Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingBoard ? 'Edit Board' : 'Create Board'}
        description={editingBoard ? 'Update board details' : 'Add a new academic board'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (slug)</Label>
            <Input id="name" {...form.register('name')} placeholder="nctb" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" {...form.register('code')} placeholder="NCTB" />
            {form.formState.errors.code && (
              <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" {...form.register('displayName')} placeholder="National Curriculum and Textbook Board" />
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
            {form.formState.errors.position && (
              <p className="text-xs text-destructive">{form.formState.errors.position.message}</p>
            )}
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
            <Button type="submit">{editingBoard ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormDialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Board"
        description={`Are you sure you want to delete "${deletingBoard?.displayName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Boards;
