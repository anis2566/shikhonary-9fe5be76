import React, { useState, useMemo } from 'react';
import { Plus, Search, BookOpen, Filter, Download, Upload, GripVertical } from 'lucide-react';
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
import { toast } from 'sonner';
import { AcademicBoard } from '@/types';
import { mockBoards, mockClasses } from '@/lib/academic-mock-data';

const BoardList: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<AcademicBoard[]>(mockBoards);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBoard, setDeletingBoard] = useState<AcademicBoard | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reorderMode, setReorderMode] = useState(false);

  const filteredBoards = useMemo(() => {
    return boards.filter((board) => {
      const matchesSearch =
        board.name.toLowerCase().includes(search.toLowerCase()) ||
        board.displayName.toLowerCase().includes(search.toLowerCase()) ||
        board.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && board.isActive) ||
        (filterStatus === 'inactive' && !board.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [boards, search, filterStatus]);

  const paginatedBoards = useMemo(() => {
    if (reorderMode) return filteredBoards; // Show all in reorder mode
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBoards.slice(start, start + itemsPerPage);
  }, [filteredBoards, currentPage, itemsPerPage, reorderMode]);

  const totalPages = Math.ceil(filteredBoards.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = boards.filter((b) => b.isActive).length;
    const classCount = mockClasses.length;
    return { total: boards.length, active: activeCount, inactive: boards.length - activeCount, classes: classCount };
  }, [boards]);

  const handleDelete = () => {
    if (deletingBoard) {
      setBoards(boards.filter((b) => b.id !== deletingBoard.id));
      toast.success('Board deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingBoard(null);
    }
  };

  const handleToggleStatus = (board: AcademicBoard) => {
    setBoards(boards.map((b) => (b.id === board.id ? { ...b, isActive: !b.isActive, updatedAt: new Date() } : b)));
    toast.success(`Board ${board.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleReorder = (newData: AcademicBoard[]) => {
    setBoards(newData);
    toast.success('Order updated successfully');
  };

  const handleBulkDelete = () => {
    setBoards(boards.filter((b) => !selectedIds.includes(b.id)));
    setSelectedIds([]);
    toast.success(`${selectedIds.length} boards deleted`);
  };

  const handleBulkActivate = () => {
    setBoards(boards.map((b) => (selectedIds.includes(b.id) ? { ...b, isActive: true } : b)));
    setSelectedIds([]);
    toast.success('Selected boards activated');
  };

  const handleBulkDeactivate = () => {
    setBoards(boards.map((b) => (selectedIds.includes(b.id) ? { ...b, isActive: false } : b)));
    setSelectedIds([]);
    toast.success('Selected boards deactivated');
  };

  const columns: Column<AcademicBoard>[] = [
    {
      key: 'displayName',
      header: 'Board',
      render: (board) => (
        <div>
          <p className="font-medium text-foreground">{board.displayName}</p>
          <p className="text-xs text-muted-foreground">{board.code}</p>
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
      key: 'updatedAt',
      header: 'Last Updated',
      hideOnMobile: true,
      render: (board) => (
        <span className="text-sm text-muted-foreground">
          {board.updatedAt.toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (board) => <StatusBadge active={board.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Academic Boards" subtitle="Manage curriculum boards and their hierarchy" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Boards" value={stats.total} icon={<BookOpen className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<BookOpen className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<BookOpen className="h-5 w-5" />} />
          <StatsCard title="Total Classes" value={stats.classes} icon={<BookOpen className="h-5 w-5" />} />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search boards..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
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
                <Switch
                  id="reorder-mode"
                  checked={reorderMode}
                  onCheckedChange={setReorderMode}
                />
              </div>
              <Button variant="outline" size="icon" className="hidden sm:flex">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hidden sm:flex">
                <Upload className="h-4 w-4" />
              </Button>
              <Button onClick={() => navigate('/admin/boards/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Board
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
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
              <span className="text-sm text-primary font-medium">
                Drag and drop rows to reorder. Changes are saved automatically.
              </span>
            </div>
          )}
        </div>

        {/* Table */}
        <DraggableDataTable
          columns={columns}
          data={paginatedBoards}
          onReorder={handleReorder}
          onView={(board) => navigate(`/admin/boards/${board.id}`)}
          onEdit={(board) => navigate(`/admin/boards/${board.id}/edit`)}
          onDelete={(board) => {
            setDeletingBoard(board);
            setDeleteDialogOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          emptyMessage="No boards found"
          selectable={!reorderMode}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemStatus={(board) => board.isActive}
          reorderDisabled={!reorderMode}
        />

        {/* Pagination */}
        {filteredBoards.length > 0 && !reorderMode && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBoards.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Board"
        description={`Are you sure you want to delete "${deletingBoard?.displayName}"? This will also remove all associated classes, subjects, and content. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BoardList;
