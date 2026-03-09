import React, { useState, useMemo } from 'react';
import { Plus, Search, Tag, Filter, Download, Upload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { AcademicDataTable, StatusBadge } from '@/components/academic/AcademicDataTable';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import StatsCard from '@/components/academic/StatsCard';
import Pagination from '@/components/academic/Pagination';
import BulkActions from '@/components/academic/BulkActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestionTypes, useQuestionTypeMutations, useSubjects, useChapters, QuestionType } from '@/hooks/useAcademicData';

const QuestionTypeList: React.FC = () => {
  const navigate = useNavigate();
  const { data: questionTypes = [], isLoading } = useQuestionTypes();
  const { data: subjects = [] } = useSubjects();
  const { data: chapters = [] } = useChapters();
  const { remove, update } = useQuestionTypeMutations();

  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<QuestionType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredItems = useMemo(() => {
    return questionTypes.filter((qt) => {
      const matchesSearch = qt.name.toLowerCase().includes(search.toLowerCase()) || qt.display_name.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = filterSubject === 'all' || qt.subject_id === filterSubject;
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && qt.is_active) || (filterStatus === 'inactive' && !qt.is_active);
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [questionTypes, search, filterSubject, filterStatus]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const stats = useMemo(() => {
    const active = questionTypes.filter((qt) => qt.is_active).length;
    return { total: questionTypes.length, active, inactive: questionTypes.length - active };
  }, [questionTypes]);

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.display_name || 'N/A';
  const getChapterName = (id: string | null) => id ? chapters.find((c) => c.id === id)?.display_name || 'N/A' : '—';

  const handleDelete = () => {
    if (deletingItem) {
      remove.mutate(deletingItem.id, { onSuccess: () => { setDeleteDialogOpen(false); setDeletingItem(null); } });
    }
  };

  const handleToggleStatus = (qt: QuestionType) => {
    update.mutate({ id: qt.id, data: { is_active: !qt.is_active } });
  };

  const columns = [
    {
      key: 'display_name' as keyof QuestionType,
      header: 'Question Type',
      render: (qt: QuestionType) => (
        <div>
          <p className="font-medium text-foreground">{qt.display_name}</p>
          <p className="text-xs text-muted-foreground">{qt.name}</p>
        </div>
      ),
    },
    {
      key: 'subject_id' as keyof QuestionType,
      header: 'Subject',
      hideOnMobile: true,
      render: (qt: QuestionType) => <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{getSubjectName(qt.subject_id)}</span>,
    },
    {
      key: 'chapter_id' as keyof QuestionType,
      header: 'Chapter',
      hideOnMobile: true,
      render: (qt: QuestionType) => <span className="text-sm text-muted-foreground">{getChapterName(qt.chapter_id)}</span>,
    },
    {
      key: 'is_active' as keyof QuestionType,
      header: 'Status',
      render: (qt: QuestionType) => <StatusBadge active={qt.is_active} />,
    },
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Question Types" subtitle="Manage question types for subjects" />
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="Total" value={stats.total} icon={<Tag className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<Tag className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<Tag className="h-5 w-5" />} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search question types..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
              </div>
              <Select value={filterSubject} onValueChange={(v) => { setFilterSubject(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Subjects" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.display_name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-32"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hidden sm:flex"><Download className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="hidden sm:flex"><Upload className="h-4 w-4" /></Button>
              <Button onClick={() => navigate('/admin/question-types/create')}><Plus className="h-4 w-4 mr-2" />Add Type</Button>
            </div>
          </div>
          <BulkActions
            selectedCount={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onDelete={() => { selectedIds.forEach((id) => remove.mutate(id)); setSelectedIds([]); }}
            onActivate={() => { selectedIds.forEach((id) => update.mutate({ id, data: { is_active: true } })); setSelectedIds([]); }}
            onDeactivate={() => { selectedIds.forEach((id) => update.mutate({ id, data: { is_active: false } })); setSelectedIds([]); }}
          />
        </div>

        <AcademicDataTable
          columns={columns}
          data={paginatedItems}
          onView={(qt) => navigate(`/admin/question-types/${qt.id}`)}
          onEdit={(qt) => navigate(`/admin/question-types/${qt.id}/edit`)}
          onDelete={(qt) => { setDeletingItem(qt); setDeleteDialogOpen(true); }}
          onToggleStatus={handleToggleStatus}
          emptyMessage="No question types found"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />

        {filteredItems.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredItems.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />
        )}
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Question Type" description={`Are you sure you want to delete "${deletingItem?.display_name}"? This action cannot be undone.`} onConfirm={handleDelete} />
    </div>
  );
};

export default QuestionTypeList;
