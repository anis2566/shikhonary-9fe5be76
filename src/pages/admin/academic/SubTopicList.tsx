import React, { useState, useMemo } from 'react';
import { Plus, Search, Layers, Filter, Download, Upload, GripVertical, Loader2 } from 'lucide-react';
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
import { useSubTopics, useSubTopicMutations, useTopics, SubTopic } from '@/hooks/useAcademicData';

const SubTopicList: React.FC = () => {
  const navigate = useNavigate();
  const { data: subTopics = [], isLoading } = useSubTopics();
  const { data: topics = [] } = useTopics();
  const { remove, update, reorder } = useSubTopicMutations();

  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSubTopic, setDeletingSubTopic] = useState<SubTopic | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reorderMode, setReorderMode] = useState(false);

  const filteredSubTopics = useMemo(() => {
    return subTopics.filter((subTopic) => {
      const matchesSearch = subTopic.name.toLowerCase().includes(search.toLowerCase()) || subTopic.display_name.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = filterTopic === 'all' || subTopic.topic_id === filterTopic;
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && subTopic.is_active) || (filterStatus === 'inactive' && !subTopic.is_active);
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
    const activeCount = subTopics.filter((s) => s.is_active).length;
    return { total: subTopics.length, active: activeCount, inactive: subTopics.length - activeCount };
  }, [subTopics]);

  const getTopicName = (topicId: string) => topics.find((t) => t.id === topicId)?.display_name || 'N/A';

  const handleDelete = () => {
    if (deletingSubTopic) {
      remove.mutate(deletingSubTopic.id, { onSuccess: () => { setDeleteDialogOpen(false); setDeletingSubTopic(null); } });
    }
  };

  const handleToggleStatus = (subTopic: SubTopic) => {
    update.mutate({ id: subTopic.id, data: { is_active: !subTopic.is_active } });
  };

  const handleReorder = (newData: SubTopic[]) => {
    const updates = newData.map((item, index) => ({ id: item.id, position: index }));
    reorder.mutate(updates);
  };

  const columns: Column<SubTopic>[] = [
    { key: 'display_name', header: 'Sub-Topic', render: (subTopic) => (<div><p className="font-medium text-foreground">{subTopic.display_name}</p><p className="text-xs text-muted-foreground">{subTopic.name}</p></div>) },
    { key: 'topic_id', header: 'Topic', hideOnMobile: true, render: (subTopic) => <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{getTopicName(subTopic.topic_id)}</span> },
    { key: 'position', header: 'Position', hideOnMobile: true },
    { key: 'is_active', header: 'Status', render: (subTopic) => <StatusBadge active={subTopic.is_active} /> },
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

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
                <SelectContent><SelectItem value="all">All Topics</SelectItem>{topics.map((topic) => <SelectItem key={topic.id} value={topic.id}>{topic.display_name}</SelectItem>)}</SelectContent>
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
          <BulkActions selectedCount={selectedIds.length} onClear={() => setSelectedIds([])} onDelete={() => { selectedIds.forEach((id) => remove.mutate(id)); setSelectedIds([]); }} onActivate={() => { selectedIds.forEach((id) => update.mutate({ id, data: { is_active: true } })); setSelectedIds([]); }} onDeactivate={() => { selectedIds.forEach((id) => update.mutate({ id, data: { is_active: false } })); setSelectedIds([]); }} />
          {reorderMode && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <GripVertical className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Drag and drop rows to reorder. Changes are saved automatically.</span>
            </div>
          )}
        </div>

        <DraggableDataTable columns={columns} data={paginatedSubTopics} onReorder={handleReorder} onView={(subTopic) => navigate(`/admin/subtopics/${subTopic.id}`)} onEdit={(subTopic) => navigate(`/admin/subtopics/${subTopic.id}/edit`)} onDelete={(subTopic) => { setDeletingSubTopic(subTopic); setDeleteDialogOpen(true); }} onToggleStatus={handleToggleStatus} emptyMessage="No sub-topics found" selectable={!reorderMode} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getItemStatus={(subTopic) => subTopic.is_active} reorderDisabled={!reorderMode} />
        {filteredSubTopics.length > 0 && !reorderMode && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredSubTopics.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />}
      </div>
      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Sub-Topic" description={`Are you sure you want to delete "${deletingSubTopic?.display_name}"?`} onConfirm={handleDelete} />
    </div>
  );
};

export default SubTopicList;
