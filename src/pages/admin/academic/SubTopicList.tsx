import React, { useState, useMemo } from 'react';
import { Plus, Search, Layers, Filter, Download, Upload, GripVertical } from 'lucide-react';
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
import { AcademicSubTopic } from '@/types';
import { mockSubTopics, mockTopics, getTopicById } from '@/lib/academic-mock-data';

const SubTopicList: React.FC = () => {
  const navigate = useNavigate();
  const [subTopics, setSubTopics] = useState<AcademicSubTopic[]>(mockSubTopics);
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSubTopic, setDeletingSubTopic] = useState<AcademicSubTopic | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reorderMode, setReorderMode] = useState(false);

  const filteredSubTopics = useMemo(() => {
    return subTopics.filter((subTopic) => {
      const matchesSearch = subTopic.name.toLowerCase().includes(search.toLowerCase()) || subTopic.displayName.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = filterTopic === 'all' || subTopic.topicId === filterTopic;
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && subTopic.isActive) || (filterStatus === 'inactive' && !subTopic.isActive);
      return matchesSearch && matchesTopic && matchesStatus;
    });
  }, [subTopics, search, filterTopic, filterStatus]);

  const paginatedSubTopics = useMemo(() => {
    if (reorderMode) return filteredSubTopics;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubTopics.slice(start, start + itemsPerPage);
  }, [filteredSubTopics, currentPage, itemsPerPage, reorderMode]);

  const totalPages = Math.ceil(filteredSubTopics.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = subTopics.filter((s) => s.isActive).length;
    return { total: subTopics.length, active: activeCount, inactive: subTopics.length - activeCount };
  }, [subTopics]);

  const handleDelete = () => {
    if (deletingSubTopic) { setSubTopics(subTopics.filter((s) => s.id !== deletingSubTopic.id)); toast.success('Sub-topic deleted successfully'); setDeleteDialogOpen(false); setDeletingSubTopic(null); }
  };

  const handleToggleStatus = (subTopic: AcademicSubTopic) => {
    setSubTopics(subTopics.map((s) => (s.id === subTopic.id ? { ...s, isActive: !s.isActive, updatedAt: new Date() } : s)));
    toast.success(`Sub-topic ${subTopic.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleReorder = (newData: AcademicSubTopic[]) => {
    setSubTopics(newData);
    toast.success('Order updated successfully');
  };

  const columns: Column<AcademicSubTopic>[] = [
    { key: 'displayName', header: 'Sub-Topic', render: (subTopic) => (<div><p className="font-medium text-foreground">{subTopic.displayName}</p><p className="text-xs text-muted-foreground">{subTopic.name}</p></div>) },
    { key: 'topicId', header: 'Topic', hideOnMobile: true, render: (subTopic) => { const topic = getTopicById(subTopic.topicId); return <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{topic?.displayName || 'N/A'}</span>; } },
    { key: 'position', header: 'Position', hideOnMobile: true },
    { key: 'isActive', header: 'Status', render: (subTopic) => <StatusBadge active={subTopic.isActive} /> },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Sub-Topics" subtitle="Manage topic sub-topics" />
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="Total Sub-Topics" value={stats.total} icon={<Layers className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<Layers className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<Layers className="h-5 w-5" />} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search sub-topics..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" /></div>
              <Select value={filterTopic} onValueChange={(v) => { setFilterTopic(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Topics" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Topics</SelectItem>{mockTopics.map((topic) => (<SelectItem key={topic.id} value={topic.id}>{topic.displayName}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-32"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
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
              <Button onClick={() => navigate('/admin/subtopics/create')}><Plus className="h-4 w-4 mr-2" />Add Sub-Topic</Button>
            </div>
          </div>
          <BulkActions selectedCount={selectedIds.length} onClear={() => setSelectedIds([])} onDelete={() => { setSubTopics(subTopics.filter((s) => !selectedIds.includes(s.id))); setSelectedIds([]); toast.success(`${selectedIds.length} sub-topics deleted`); }} onActivate={() => { setSubTopics(subTopics.map((s) => (selectedIds.includes(s.id) ? { ...s, isActive: true } : s))); setSelectedIds([]); toast.success('Selected sub-topics activated'); }} onDeactivate={() => { setSubTopics(subTopics.map((s) => (selectedIds.includes(s.id) ? { ...s, isActive: false } : s))); setSelectedIds([]); toast.success('Selected sub-topics deactivated'); }} />
          {reorderMode && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <GripVertical className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Drag and drop rows to reorder. Changes are saved automatically.</span>
            </div>
          )}
        </div>

        <DraggableDataTable columns={columns} data={paginatedSubTopics} onReorder={handleReorder} onView={(subTopic) => navigate(`/admin/subtopics/${subTopic.id}`)} onEdit={(subTopic) => navigate(`/admin/subtopics/${subTopic.id}/edit`)} onDelete={(subTopic) => { setDeletingSubTopic(subTopic); setDeleteDialogOpen(true); }} onToggleStatus={handleToggleStatus} emptyMessage="No sub-topics found" selectable={!reorderMode} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getItemStatus={(subTopic) => subTopic.isActive} reorderDisabled={!reorderMode} />
        {filteredSubTopics.length > 0 && !reorderMode && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredSubTopics.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />}
      </div>
      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Sub-Topic" description={`Are you sure you want to delete "${deletingSubTopic?.displayName}"?`} onConfirm={handleDelete} />
    </div>
  );
};

export default SubTopicList;
