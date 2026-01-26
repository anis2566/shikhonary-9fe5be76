import React, { useState, useMemo } from 'react';
import { Plus, Search, CircleHelp, Filter, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AcademicDataTable, { Column, StatusBadge, DifficultyBadge } from '@/components/academic/AcademicDataTable';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import StatsCard from '@/components/academic/StatsCard';
import Pagination from '@/components/academic/Pagination';
import BulkActions from '@/components/academic/BulkActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Mcq } from '@/types';
import { mockMcqs, mockSubjects, getSubjectById, getChapterById } from '@/lib/academic-mock-data';

const McqList: React.FC = () => {
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState<Mcq[]>(mockMcqs);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMcq, setDeletingMcq] = useState<Mcq | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredMcqs = useMemo(() => {
    return mcqs.filter((mcq) => {
      const matchesSearch = mcq.question.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = filterSubject === 'all' || mcq.subjectId === filterSubject;
      const matchesDifficulty = filterDifficulty === 'all' || mcq.difficulty === filterDifficulty;
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && mcq.isActive) || (filterStatus === 'inactive' && !mcq.isActive);
      return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus;
    });
  }, [mcqs, search, filterSubject, filterDifficulty, filterStatus]);

  const paginatedMcqs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMcqs.slice(start, start + itemsPerPage);
  }, [filteredMcqs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMcqs.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = mcqs.filter((m) => m.isActive).length;
    const easyCount = mcqs.filter((m) => m.difficulty === 'EASY').length;
    const mediumCount = mcqs.filter((m) => m.difficulty === 'MEDIUM').length;
    const hardCount = mcqs.filter((m) => m.difficulty === 'HARD').length;
    return { total: mcqs.length, active: activeCount, easy: easyCount, medium: mediumCount, hard: hardCount };
  }, [mcqs]);

  const handleDelete = () => {
    if (deletingMcq) {
      setMcqs(mcqs.filter((m) => m.id !== deletingMcq.id));
      toast.success('MCQ deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingMcq(null);
    }
  };

  const handleToggleStatus = (mcq: Mcq) => {
    setMcqs(mcqs.map((m) => (m.id === mcq.id ? { ...m, isActive: !m.isActive, updatedAt: new Date() } : m)));
    toast.success(`MCQ ${mcq.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleDuplicate = (mcq: Mcq) => {
    const newMcq: Mcq = {
      ...mcq,
      id: `mcq-${Date.now()}`,
      question: `${mcq.question} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMcqs([...mcqs, newMcq]);
    toast.success('MCQ duplicated successfully');
  };

  const columns: Column<Mcq>[] = [
    {
      key: 'question',
      header: 'Question',
      render: (mcq) => (
        <div className="max-w-xs lg:max-w-md">
          <p className="font-medium text-foreground line-clamp-2">{mcq.question}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {getChapterById(mcq.chapterId)?.displayName || 'N/A'}
          </p>
        </div>
      ),
    },
    {
      key: 'subjectId',
      header: 'Subject',
      hideOnMobile: true,
      render: (mcq) => {
        const subject = getSubjectById(mcq.subjectId);
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{subject?.displayName || 'N/A'}</span>;
      },
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (mcq) => <DifficultyBadge difficulty={mcq.difficulty} />,
    },
    {
      key: 'marks',
      header: 'Marks',
      hideOnMobile: true,
    },
    {
      key: 'isActive',
      header: 'Status',
      hideOnMobile: true,
      render: (mcq) => <StatusBadge active={mcq.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="MCQs" subtitle="Manage multiple choice questions" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total MCQs" value={stats.total} icon={<CircleHelp className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<CircleHelp className="h-5 w-5" />} />
          <StatsCard title="Easy" value={stats.easy} icon={<CircleHelp className="h-5 w-5" />} />
          <StatsCard title="Medium" value={stats.medium} icon={<CircleHelp className="h-5 w-5" />} />
          <StatsCard title="Hard" value={stats.hard} icon={<CircleHelp className="h-5 w-5" />} />
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
              <Button onClick={() => navigate('/admin/mcqs/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add MCQ
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
                  <SelectItem key={subject.id} value={subject.id}>{subject.displayName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={(v) => { setFilterDifficulty(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
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
            onDelete={() => { setMcqs(mcqs.filter((m) => !selectedIds.includes(m.id))); setSelectedIds([]); toast.success(`${selectedIds.length} MCQs deleted`); }}
            onActivate={() => { setMcqs(mcqs.map((m) => (selectedIds.includes(m.id) ? { ...m, isActive: true } : m))); setSelectedIds([]); toast.success('Selected MCQs activated'); }}
            onDeactivate={() => { setMcqs(mcqs.map((m) => (selectedIds.includes(m.id) ? { ...m, isActive: false } : m))); setSelectedIds([]); toast.success('Selected MCQs deactivated'); }}
          />
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={paginatedMcqs}
          onView={(mcq) => navigate(`/admin/mcqs/${mcq.id}`)}
          onEdit={(mcq) => navigate(`/admin/mcqs/${mcq.id}/edit`)}
          onDelete={(mcq) => { setDeletingMcq(mcq); setDeleteDialogOpen(true); }}
          onToggleStatus={handleToggleStatus}
          onDuplicate={handleDuplicate}
          emptyMessage="No MCQs found"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemStatus={(mcq) => mcq.isActive}
        />

        {filteredMcqs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredMcqs.length}
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
        title="Delete MCQ"
        description="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default McqList;
