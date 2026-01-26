import React, { useState, useMemo } from 'react';
import { Plus, Search, FileText, Filter, Download, Upload } from 'lucide-react';
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
import { AcademicChapter } from '@/types';
import { mockChapters, mockSubjects, getSubjectById, mockTopics } from '@/lib/academic-mock-data';

const ChapterList: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<AcademicChapter[]>(mockChapters);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingChapter, setDeletingChapter] = useState<AcademicChapter | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredChapters = useMemo(() => {
    return chapters.filter((chapter) => {
      const matchesSearch =
        chapter.name.toLowerCase().includes(search.toLowerCase()) ||
        chapter.displayName.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = filterSubject === 'all' || chapter.subjectId === filterSubject;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && chapter.isActive) ||
        (filterStatus === 'inactive' && !chapter.isActive);
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [chapters, search, filterSubject, filterStatus]);

  const paginatedChapters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChapters.slice(start, start + itemsPerPage);
  }, [filteredChapters, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = chapters.filter((c) => c.isActive).length;
    const topicCount = mockTopics.length;
    return { total: chapters.length, active: activeCount, inactive: chapters.length - activeCount, topics: topicCount };
  }, [chapters]);

  const handleDelete = () => {
    if (deletingChapter) {
      setChapters(chapters.filter((c) => c.id !== deletingChapter.id));
      toast.success('Chapter deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingChapter(null);
    }
  };

  const handleToggleStatus = (chapter: AcademicChapter) => {
    setChapters(chapters.map((c) => (c.id === chapter.id ? { ...c, isActive: !c.isActive, updatedAt: new Date() } : c)));
    toast.success(`Chapter ${chapter.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const columns: Column<AcademicChapter>[] = [
    {
      key: 'displayName',
      header: 'Chapter',
      render: (chapter) => (
        <div>
          <p className="font-medium text-foreground">{chapter.displayName}</p>
          <p className="text-xs text-muted-foreground">{chapter.name}</p>
        </div>
      ),
    },
    {
      key: 'subjectId',
      header: 'Subject',
      hideOnMobile: true,
      render: (chapter) => {
        const subject = getSubjectById(chapter.subjectId);
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{subject?.displayName || 'N/A'}</span>;
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
      render: (chapter) => <StatusBadge active={chapter.isActive} />,
    },
  ];

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
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {mockSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.displayName}</SelectItem>
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
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hidden sm:flex"><Download className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="hidden sm:flex"><Upload className="h-4 w-4" /></Button>
              <Button onClick={() => navigate('/admin/chapters/create')}><Plus className="h-4 w-4 mr-2" />Add Chapter</Button>
            </div>
          </div>
          <BulkActions
            selectedCount={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onDelete={() => { setChapters(chapters.filter((c) => !selectedIds.includes(c.id))); setSelectedIds([]); toast.success(`${selectedIds.length} chapters deleted`); }}
            onActivate={() => { setChapters(chapters.map((c) => (selectedIds.includes(c.id) ? { ...c, isActive: true } : c))); setSelectedIds([]); toast.success('Selected chapters activated'); }}
            onDeactivate={() => { setChapters(chapters.map((c) => (selectedIds.includes(c.id) ? { ...c, isActive: false } : c))); setSelectedIds([]); toast.success('Selected chapters deactivated'); }}
          />
        </div>

        <AcademicDataTable
          columns={columns}
          data={paginatedChapters}
          onView={(chapter) => navigate(`/admin/chapters/${chapter.id}`)}
          onEdit={(chapter) => navigate(`/admin/chapters/${chapter.id}/edit`)}
          onDelete={(chapter) => { setDeletingChapter(chapter); setDeleteDialogOpen(true); }}
          onToggleStatus={handleToggleStatus}
          emptyMessage="No chapters found"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemStatus={(chapter) => chapter.isActive}
        />

        {filteredChapters.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredChapters.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />
        )}
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Chapter" description={`Are you sure you want to delete "${deletingChapter?.displayName}"? This will also remove all associated topics and questions.`} onConfirm={handleDelete} />
    </div>
  );
};

export default ChapterList;
