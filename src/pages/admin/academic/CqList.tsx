import React, { useState, useMemo } from 'react';
import { Plus, Search, FileQuestion, Filter, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AcademicDataTable, { Column, StatusBadge } from '@/components/academic/AcademicDataTable';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import StatsCard from '@/components/academic/StatsCard';
import Pagination from '@/components/academic/Pagination';
import BulkActions from '@/components/academic/BulkActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Cq } from '@/types';
import { mockCqs, mockSubjects, getSubjectById, getChapterById } from '@/lib/academic-mock-data';

const CqList: React.FC = () => {
  const navigate = useNavigate();
  const [cqs, setCqs] = useState<Cq[]>(mockCqs);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCq, setDeletingCq] = useState<Cq | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCqs = useMemo(() => {
    return cqs.filter((cq) => {
      const matchesSearch =
        cq.questionA.toLowerCase().includes(search.toLowerCase()) ||
        (cq.context?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesSubject = filterSubject === 'all' || cq.subjectId === filterSubject;
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && cq.isActive) || (filterStatus === 'inactive' && !cq.isActive);
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [cqs, search, filterSubject, filterStatus]);

  const paginatedCqs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCqs.slice(start, start + itemsPerPage);
  }, [filteredCqs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCqs.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = cqs.filter((c) => c.isActive).length;
    const totalMarks = cqs.reduce((acc, c) => acc + c.marks, 0);
    return { total: cqs.length, active: activeCount, inactive: cqs.length - activeCount, totalMarks };
  }, [cqs]);

  const handleDelete = () => {
    if (deletingCq) {
      setCqs(cqs.filter((c) => c.id !== deletingCq.id));
      toast.success('CQ deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingCq(null);
    }
  };

  const handleToggleStatus = (cq: Cq) => {
    setCqs(cqs.map((c) => (c.id === cq.id ? { ...c, isActive: !c.isActive, updatedAt: new Date() } : c)));
    toast.success(`CQ ${cq.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleDuplicate = (cq: Cq) => {
    const newCq: Cq = {
      ...cq,
      id: `cq-${Date.now()}`,
      questionA: `${cq.questionA} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCqs([...cqs, newCq]);
    toast.success('CQ duplicated successfully');
  };

  const columns: Column<Cq>[] = [
    {
      key: 'context',
      header: 'Context / Question',
      render: (cq) => (
        <div className="max-w-xs lg:max-w-md">
          {cq.context && <p className="text-sm text-foreground line-clamp-2 mb-1">{cq.context}</p>}
          <p className="text-xs text-muted-foreground line-clamp-1">(a) {cq.questionA}</p>
        </div>
      ),
    },
    {
      key: 'subjectId',
      header: 'Subject',
      hideOnMobile: true,
      render: (cq) => {
        const subject = getSubjectById(cq.subjectId);
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{subject?.displayName || 'N/A'}</span>;
      },
    },
    {
      key: 'chapterId',
      header: 'Chapter',
      hideOnMobile: true,
      render: (cq) => {
        const chapter = getChapterById(cq.chapterId);
        return <span className="text-sm">{chapter?.displayName || 'N/A'}</span>;
      },
    },
    {
      key: 'marks',
      header: 'Marks',
    },
    {
      key: 'isActive',
      header: 'Status',
      hideOnMobile: true,
      render: (cq) => <StatusBadge active={cq.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Creative Questions" subtitle="Manage creative questions (CQs)" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total CQs" value={stats.total} icon={<FileQuestion className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<FileQuestion className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<FileQuestion className="h-5 w-5" />} />
          <StatsCard title="Total Marks" value={stats.totalMarks} icon={<FileQuestion className="h-5 w-5" />} />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hidden sm:flex"><Download className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="hidden sm:flex"><Upload className="h-4 w-4" /></Button>
              <Button onClick={() => navigate('/admin/cqs/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add CQ
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterSubject} onValueChange={(v) => { setFilterSubject(v); setCurrentPage(1); }}>
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

          <BulkActions
            selectedCount={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onDelete={() => { setCqs(cqs.filter((c) => !selectedIds.includes(c.id))); setSelectedIds([]); toast.success(`${selectedIds.length} CQs deleted`); }}
            onActivate={() => { setCqs(cqs.map((c) => (selectedIds.includes(c.id) ? { ...c, isActive: true } : c))); setSelectedIds([]); toast.success('Selected CQs activated'); }}
            onDeactivate={() => { setCqs(cqs.map((c) => (selectedIds.includes(c.id) ? { ...c, isActive: false } : c))); setSelectedIds([]); toast.success('Selected CQs deactivated'); }}
          />
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={paginatedCqs}
          onView={(cq) => navigate(`/admin/cqs/${cq.id}`)}
          onEdit={(cq) => navigate(`/admin/cqs/${cq.id}/edit`)}
          onDelete={(cq) => { setDeletingCq(cq); setDeleteDialogOpen(true); }}
          onToggleStatus={handleToggleStatus}
          onDuplicate={handleDuplicate}
          emptyMessage="No CQs found"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemStatus={(cq) => cq.isActive}
        />

        {filteredCqs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCqs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
          />
        )}
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete CQ"
        description="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CqList;
