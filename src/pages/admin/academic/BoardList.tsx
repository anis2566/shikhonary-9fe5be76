import React, { useState, useMemo } from 'react';
import { Plus, Search, BookOpen, Filter, Download, Upload, GripVertical, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DraggableDataTable, { Column, StatusBadge } from '@/components/academic/DraggableDataTable';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import StatsCard from '@/components/academic/StatsCard';
import Pagination from '@/components/academic/Pagination';
import BulkActions from '@/components/academic/BulkActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useBoards, useBoardMutations, useClasses, Board } from '@/hooks/useAcademicData';

const BoardList: React.FC = () => {
  const navigate = useNavigate();
  const { data: boards = [], isLoading } = useBoards();
  const { data: classes = [] } = useClasses();
  const { remove, update, reorder } = useBoardMutations();
  
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reorderMode, setReorderMode] = useState(false);

  const filteredBoards = useMemo(() => {
    return boards.filter((board) => {
      const matchesSearch =
        board.name.toLowerCase().includes(search.toLowerCase()) ||
        board.display_name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && board.is_active) ||
        (filterStatus === 'inactive' && !board.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [boards, search, filterStatus]);

  const paginatedBoards = useMemo(() => {
    if (reorderMode) return filteredBoards;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBoards.slice(start, start + itemsPerPage);
  }, [filteredBoards, currentPage, itemsPerPage, reorderMode]);

  const totalPages = Math.ceil(filteredBoards.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = boards.filter((b) => b.is_active).length;
    return { total: boards.length, active: activeCount, inactive: boards.length - activeCount, classes: classes.length };
  }, [boards, classes]);

  const handleDelete = () => {
    if (deletingBoard) {
      remove.mutate(deletingBoard.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingBoard(null);
        },
      });
    }
  };

  const handleToggleStatus = (board: Board) => {
    update.mutate({ id: board.id, data: { is_active: !board.is_active } });
  };

  const handleReorder = (newData: Board[]) => {
    const updates = newData.map((item, index) => ({ id: item.id, position: index }));
    reorder.mutate(updates);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => remove.mutate(id));
    setSelectedIds([]);
  };

  const handleBulkActivate = () => {
    selectedIds.forEach((id) => update.mutate({ id, data: { is_active: true } }));
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    selectedIds.forEach((id) => update.mutate({ id, data: { is_active: false } }));
    setSelectedIds([]);
  };

  const columns: Column<Board>[] = [
    {
      key: 'display_name',
      header: 'Board',
      render: (board) => (
        <div>
          <p className="font-medium text-foreground">{board.display_name}</p>
          <p className="text-xs text-muted-foreground">{board.name}</p>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Slug',
      hideOnMobile: true,
      render: (board) => <code className="text-xs bg-muted px-2 py-1 rounded">{board.name}</code>,
    },
    {
      key: 'position',
      header: 'Position',
      hideOnMobile: true,
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      hideOnMobile: true,
      render: (board) => (
        <span className="text-sm text-muted-foreground">
          {new Date(board.updated_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (board) => <StatusBadge active={board.is_active} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Academic Boards" subtitle="Manage curriculum boards and their hierarchy" />

      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Boards" value={stats.total} icon={<BookOpen className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<BookOpen className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<BookOpen className="h-5 w-5" />} />
          <StatsCard title="Total Classes" value={stats.classes} icon={<BookOpen className="h-5 w-5" />} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search boards..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="reorder-mode" className="text-sm cursor-pointer">Reorder</Label>
                <Switch id="reorder-mode" checked={reorderMode} onCheckedChange={setReorderMode} />
              </div>
              <Button variant="outline" size="icon" className="hidden sm:flex"><Download className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="hidden sm:flex"><Upload className="h-4 w-4" /></Button>
              <Button onClick={() => navigate('/admin/boards/create')}>
                <Plus className="h-4 w-4 mr-2" />Add Board
              </Button>
            </div>
          </div>

          <BulkActions
            selectedCount={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onDelete={handleBulkDelete}
            onActivate={handleBulkActivate}
            onDeactivate={handleBulkDeactivate}
          />

          {reorderMode && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <GripVertical className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Drag and drop rows to reorder. Changes are saved automatically.</span>
            </div>
          )}
        </div>

        <DraggableDataTable
          columns={columns}
          data={paginatedBoards}
          onReorder={handleReorder}
          onView={(board) => navigate(`/admin/boards/${board.id}`)}
          onEdit={(board) => navigate(`/admin/boards/${board.id}/edit`)}
          onDelete={(board) => { setDeletingBoard(board); setDeleteDialogOpen(true); }}
          onToggleStatus={handleToggleStatus}
          emptyMessage="No boards found"
          selectable={!reorderMode}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemStatus={(board) => board.is_active}
          reorderDisabled={!reorderMode}
        />

        {filteredBoards.length > 0 && !reorderMode && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBoards.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
          />
        )}
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Board"
        description={`Are you sure you want to delete "${deletingBoard?.display_name}"? This will also remove all associated classes, subjects, and content. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BoardList;
