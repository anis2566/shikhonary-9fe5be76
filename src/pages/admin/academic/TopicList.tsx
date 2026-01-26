import React, { useState, useMemo } from 'react';
import { Plus, Search, Hash, Filter, Download, Upload } from 'lucide-react';
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
import { AcademicTopic } from '@/types';
import { mockTopics, mockChapters, getChapterById, mockSubTopics } from '@/lib/academic-mock-data';

const TopicList: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<AcademicTopic[]>(mockTopics);
  const [search, setSearch] = useState('');
  const [filterChapter, setFilterChapter] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState<AcademicTopic | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch = topic.name.toLowerCase().includes(search.toLowerCase()) || topic.displayName.toLowerCase().includes(search.toLowerCase());
      const matchesChapter = filterChapter === 'all' || topic.chapterId === filterChapter;
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && topic.isActive) || (filterStatus === 'inactive' && !topic.isActive);
      return matchesSearch && matchesChapter && matchesStatus;
    });
  }, [topics, search, filterChapter, filterStatus]);

  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTopics.slice(start, start + itemsPerPage);
  }, [filteredTopics, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = topics.filter((t) => t.isActive).length;
    return { total: topics.length, active: activeCount, inactive: topics.length - activeCount, subtopics: mockSubTopics.length };
  }, [topics]);

  const handleDelete = () => {
    if (deletingTopic) { setTopics(topics.filter((t) => t.id !== deletingTopic.id)); toast.success('Topic deleted successfully'); setDeleteDialogOpen(false); setDeletingTopic(null); }
  };

  const handleToggleStatus = (topic: AcademicTopic) => {
    setTopics(topics.map((t) => (t.id === topic.id ? { ...t, isActive: !t.isActive, updatedAt: new Date() } : t)));
    toast.success(`Topic ${topic.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const columns: Column<AcademicTopic>[] = [
    { key: 'displayName', header: 'Topic', render: (topic) => (<div><p className="font-medium text-foreground">{topic.displayName}</p><p className="text-xs text-muted-foreground">{topic.name}</p></div>) },
    { key: 'chapterId', header: 'Chapter', hideOnMobile: true, render: (topic) => { const chapter = getChapterById(topic.chapterId); return <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{chapter?.displayName || 'N/A'}</span>; } },
    { key: 'position', header: 'Position', hideOnMobile: true },
    { key: 'isActive', header: 'Status', render: (topic) => <StatusBadge active={topic.isActive} /> },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Topics" subtitle="Manage chapter topics" />
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Topics" value={stats.total} icon={<Hash className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<Hash className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<Hash className="h-5 w-5" />} />
          <StatsCard title="Total Sub-Topics" value={stats.subtopics} icon={<Hash className="h-5 w-5" />} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search topics..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" /></div>
              <Select value={filterChapter} onValueChange={(v) => { setFilterChapter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Chapters" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Chapters</SelectItem>{mockChapters.map((chapter) => (<SelectItem key={chapter.id} value={chapter.id}>{chapter.displayName}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-32"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hidden sm:flex"><Download className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="hidden sm:flex"><Upload className="h-4 w-4" /></Button>
              <Button onClick={() => navigate('/admin/topics/create')}><Plus className="h-4 w-4 mr-2" />Add Topic</Button>
            </div>
          </div>
          <BulkActions selectedCount={selectedIds.length} onClear={() => setSelectedIds([])} onDelete={() => { setTopics(topics.filter((t) => !selectedIds.includes(t.id))); setSelectedIds([]); toast.success(`${selectedIds.length} topics deleted`); }} onActivate={() => { setTopics(topics.map((t) => (selectedIds.includes(t.id) ? { ...t, isActive: true } : t))); setSelectedIds([]); toast.success('Selected topics activated'); }} onDeactivate={() => { setTopics(topics.map((t) => (selectedIds.includes(t.id) ? { ...t, isActive: false } : t))); setSelectedIds([]); toast.success('Selected topics deactivated'); }} />
        </div>

        <AcademicDataTable columns={columns} data={paginatedTopics} onView={(topic) => navigate(`/admin/topics/${topic.id}`)} onEdit={(topic) => navigate(`/admin/topics/${topic.id}/edit`)} onDelete={(topic) => { setDeletingTopic(topic); setDeleteDialogOpen(true); }} onToggleStatus={handleToggleStatus} emptyMessage="No topics found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} getItemStatus={(topic) => topic.isActive} />
        {filteredTopics.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredTopics.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />}
      </div>
      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Topic" description={`Are you sure you want to delete "${deletingTopic?.displayName}"? This will also remove all associated sub-topics.`} onConfirm={handleDelete} />
    </div>
  );
};

export default TopicList;
