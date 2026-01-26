import React, { useState, useMemo } from 'react';
import { Plus, Search, GraduationCap, Filter, Download, Upload, GripVertical } from 'lucide-react';
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
import { AcademicClass } from '@/types';
import { mockClasses, mockBoards, getBoardById, mockSubjects } from '@/lib/academic-mock-data';

const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<AcademicClass[]>(mockClasses);
  const [search, setSearch] = useState('');
  const [filterBoard, setFilterBoard] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingClass, setDeletingClass] = useState<AcademicClass | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reorderMode, setReorderMode] = useState(false);

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(search.toLowerCase()) ||
        cls.displayName.toLowerCase().includes(search.toLowerCase()) ||
        cls.level.toLowerCase().includes(search.toLowerCase());
      const matchesBoard = filterBoard === 'all' || cls.boardId === filterBoard;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && cls.isActive) ||
        (filterStatus === 'inactive' && !cls.isActive);
      return matchesSearch && matchesBoard && matchesStatus;
    });
  }, [classes, search, filterBoard, filterStatus]);

  const paginatedClasses = useMemo(() => {
    if (reorderMode) return filteredClasses;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClasses.slice(start, start + itemsPerPage);
  }, [filteredClasses, currentPage, itemsPerPage, reorderMode]);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = classes.filter((c) => c.isActive).length;
    const subjectCount = mockSubjects.length;
    return { total: classes.length, active: activeCount, inactive: classes.length - activeCount, subjects: subjectCount };
  }, [classes]);

  const handleDelete = () => {
    if (deletingClass) {
      setClasses(classes.filter((c) => c.id !== deletingClass.id));
      toast.success('Class deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingClass(null);
    }
  };

  const handleToggleStatus = (cls: AcademicClass) => {
    setClasses(classes.map((c) => (c.id === cls.id ? { ...c, isActive: !c.isActive, updatedAt: new Date() } : c)));
    toast.success(`Class ${cls.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleReorder = (newData: AcademicClass[]) => {
    setClasses(newData);
    toast.success('Order updated successfully');
  };

  const handleBulkDelete = () => {
    setClasses(classes.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    toast.success(`${selectedIds.length} classes deleted`);
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
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">
            {board?.code || 'N/A'}
          </span>
        );
      },
    },
    {
      key: 'name',
      header: 'Slug',
      hideOnMobile: true,
      render: (cls) => <code className="text-xs bg-muted px-2 py-1 rounded">{cls.name}</code>,
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
      <DashboardHeader title="Classes" subtitle="Manage academic classes for each board" />

      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Classes" value={stats.total} icon={<GraduationCap className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<GraduationCap className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<GraduationCap className="h-5 w-5" />} />
          <StatsCard title="Total Subjects" value={stats.subjects} icon={<GraduationCap className="h-5 w-5" />} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="pl-9"
                />
              </div>
              <Select value={filterBoard} onValueChange={(v) => { setFilterBoard(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Boards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Boards</SelectItem>
                  {mockBoards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>{board.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-32">
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
              <Button onClick={() => navigate('/admin/classes/create')}><Plus className="h-4 w-4 mr-2" />Add Class</Button>
            </div>
          </div>

          <BulkActions
            selectedCount={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onDelete={handleBulkDelete}
            onActivate={() => { setClasses(classes.map((c) => (selectedIds.includes(c.id) ? { ...c, isActive: true } : c))); setSelectedIds([]); toast.success('Selected classes activated'); }}
            onDeactivate={() => { setClasses(classes.map((c) => (selectedIds.includes(c.id) ? { ...c, isActive: false } : c))); setSelectedIds([]); toast.success('Selected classes deactivated'); }}
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
          data={paginatedClasses}
          onReorder={handleReorder}
          onView={(cls) => navigate(`/admin/classes/${cls.id}`)}
          onEdit={(cls) => navigate(`/admin/classes/${cls.id}/edit`)}
          onDelete={(cls) => { setDeletingClass(cls); setDeleteDialogOpen(true); }}
          onToggleStatus={handleToggleStatus}
          emptyMessage="No classes found"
          selectable={!reorderMode}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemStatus={(cls) => cls.isActive}
          reorderDisabled={!reorderMode}
        />

        {filteredClasses.length > 0 && !reorderMode && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredClasses.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />
        )}
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Class" description={`Are you sure you want to delete "${deletingClass?.displayName}"? This will also remove all associated subjects and content.`} onConfirm={handleDelete} />
    </div>
  );
};

export default ClassList;
