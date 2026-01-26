import React, { useState, useMemo } from 'react';
import { Plus, Search, FileText, Filter, Download, Upload, GripVertical, Loader2 } from 'lucide-react';
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
import { useChapters, useChapterMutations, useSubjects, useTopics, Chapter } from '@/hooks/useAcademicData';

const ChapterList: React.FC = () => {
  const navigate = useNavigate();
  const { data: chapters = [], isLoading } = useChapters();
  const { data: subjects = [] } = useSubjects();
  const { data: topics = [] } = useTopics();
  const { remove, update, reorder } = useChapterMutations();

  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingChapter, setDeletingChapter] = useState<Chapter | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reorderMode, setReorderMode] = useState(false);

  const filteredChapters = useMemo(() => {
    return chapters.filter((chapter) => {
      const matchesSearch = chapter.name.toLowerCase().includes(search.toLowerCase()) || chapter.display_name.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = filterSubject === 'all' || chapter.subject_id === filterSubject;
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && chapter.is_active) || (filterStatus === 'inactive' && !chapter.is_active);
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [chapters, search, filterSubject, filterStatus]);

  const paginatedChapters = useMemo(() => {
    if (reorderMode) return filteredChapters;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChapters.slice(start, start + itemsPerPage);
  }, [filteredChapters, currentPage, itemsPerPage, reorderMode]);

  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = chapters.filter((c) => c.is_active).length;
    return { total: chapters.length, active: activeCount, inactive: chapters.length - activeCount, topics: topics.length };
  }, [chapters, topics]);

  const getSubjectName = (subjectId: string) => subjects.find((s) => s.id === subjectId)?.display_name || 'N/A';

  const handleDelete = () => {
    if (deletingChapter) {
      remove.mutate(deletingChapter.id, { onSuccess: () => { setDeleteDialogOpen(false); setDeletingChapter(null); } });
    }
  };

  const handleToggleStatus = (chapter: Chapter) => {
    update.mutate({ id: chapter.id, data: { is_active: !chapter.is_active } });
  };

  const handleReorder = (newData: Chapter[]) => {
    const updates = newData.map((item, index) => ({ id: item.id, position: index }));
    reorder.mutate(updates);
  };

  const columns: Column<Chapter>[] = [
    {
      key: 'display_name',
      header: 'Chapter',
      render: (chapter) => (<div><p className="font-medium text-foreground">{chapter.display_name}</p><p className="text-xs text-muted-foreground">{chapter.name}</p></div>),
    },
    {
      key: 'subject_id',
      header: 'Subject',
      hideOnMobile: true,
      render: (chapter) => <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{getSubjectName(chapter.subject_id)}</span>,
    },
    { key: 'position', header: 'Position', hideOnMobile: true },
    { key: 'is_active', header: 'Status', render: (chapter) => <StatusBadge active={chapter.is_active} /> },
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Chapters" subtitle="Manage subject chapters" />
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Chapters" value={stats.total} icon={<FileText className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<FileText className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<FileText className="h-5 w-5" />} />
          <StatsCard title="Total Topics" value={stats.topics} icon={<FileText className="h-5 w-5" />} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chapters..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
              </div>
              <Select value={filterSubject} onValueChange={(v) => { setFilterSubject(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Subjects" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.display_name}</SelectItem>)}
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
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="reorder-mode" className="text-sm cursor-pointer">Reorder</Label>
                <Switch id="reorder-mode" checked={reorderMode} onCheckedChange={setReorderMode} />
              </div>
              <Button variant="outline" size="icon" className="hidden sm:flex"><Download className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="hidden sm:flex"><Upload className="h-4 w-4" /></Button>
              <Button onClick={() => navigate('/admin/chapters/create')}><Plus className="h-4 w-4 mr-2" />Add Chapter</Button>
            </div>
          </div>
          {reorderMode && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <GripVertical className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Drag and drop rows to reorder. Changes are saved automatically.</span>
            </div>
          )}
          <BulkActions
            selectedCount={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onDelete={() => { selectedIds.forEach((id) => remove.mutate(id)); setSelectedIds([]); }}
            onActivate={() => { selectedIds.forEach((id) => update.mutate({ id, data: { is_active: true } })); setSelectedIds([]); }}
            onDeactivate={() => { selectedIds.forEach((id) => update.mutate({ id, data: { is_active: false } })); setSelectedIds([]); }}
          />
        </div>

        <DraggableDataTable
          columns={columns}
          data={paginatedChapters}
          onReorder={handleReorder}
          onView={(chapter) => navigate(`/admin/chapters/${chapter.id}`)}
          onEdit={(chapter) => navigate(`/admin/chapters/${chapter.id}/edit`)}
          onDelete={(chapter) => { setDeletingChapter(chapter); setDeleteDialogOpen(true); }}
          onToggleStatus={handleToggleStatus}
          emptyMessage="No chapters found"
          selectable={!reorderMode}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemStatus={(chapter) => chapter.is_active}
          reorderDisabled={!reorderMode}
        />

        {filteredChapters.length > 0 && !reorderMode && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredChapters.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />
        )}
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Chapter" description={`Are you sure you want to delete "${deletingChapter?.display_name}"? This will also remove all associated topics and questions.`} onConfirm={handleDelete} />
    </div>
  );
};

export default ChapterList;
