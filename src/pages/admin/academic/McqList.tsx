import React, { useState, useMemo } from 'react';
import { Plus, Search, CircleHelp, Filter, Download, Upload, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import StatsCard from '@/components/academic/StatsCard';
import Pagination from '@/components/academic/Pagination';
import BulkActions from '@/components/academic/BulkActions';
import McqCard, { McqCardData } from '@/components/academic/McqCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { mockMcqs, mockSubjects, getSubjectById, getChapterById, getTopicById, getSubTopicById, McqData } from '@/lib/academic-mock-data';

const McqList: React.FC = () => {
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState<McqData[]>(mockMcqs);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMcq, setDeletingMcq] = useState<McqData | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredMcqs = useMemo(() => {
    return mcqs.filter((mcq) => {
      const matchesSearch = mcq.question.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = filterSubject === 'all' || mcq.subjectId === filterSubject;
      const matchesType = filterType === 'all' || mcq.type.toLowerCase() === filterType.toLowerCase();
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && mcq.isActive) || (filterStatus === 'inactive' && !mcq.isActive);
      return matchesSearch && matchesSubject && matchesType && matchesStatus;
    });
  }, [mcqs, search, filterSubject, filterType, filterStatus]);

  const paginatedMcqs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMcqs.slice(start, start + itemsPerPage);
  }, [filteredMcqs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMcqs.length / itemsPerPage);

  // Get unique types from data
  const uniqueTypes = useMemo(() => {
    return [...new Set(mcqs.map(m => m.type))];
  }, [mcqs]);

  const stats = useMemo(() => {
    const activeCount = mcqs.filter((m) => m.isActive).length;
    const singleCount = mcqs.filter((m) => m.type === 'single').length;
    const assertionCount = mcqs.filter((m) => m.type === 'assertion').length;
    const statementCount = mcqs.filter((m) => m.type === 'statement').length;
    return { total: mcqs.length, active: activeCount, single: singleCount, assertion: assertionCount, statement: statementCount };
  }, [mcqs]);

  // Convert McqData to McqCardData with resolved names
  const mcqCards: McqCardData[] = useMemo(() => {
    return paginatedMcqs.map(mcq => ({
      ...mcq,
      subjectName: getSubjectById(mcq.subjectId)?.displayName,
      chapterName: getChapterById(mcq.chapterId)?.displayName,
      topicName: mcq.topicId ? getTopicById(mcq.topicId)?.displayName : undefined,
      subTopicName: mcq.subTopicId ? getSubTopicById(mcq.subTopicId)?.displayName : undefined,
    }));
  }, [paginatedMcqs]);

  const handleDelete = () => {
    if (deletingMcq) {
      setMcqs(mcqs.filter((m) => m.id !== deletingMcq.id));
      toast.success('MCQ deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingMcq(null);
    }
  };

  const handleToggleStatus = (mcq: McqData) => {
    setMcqs(mcqs.map((m) => (m.id === mcq.id ? { ...m, isActive: !m.isActive, updatedAt: new Date() } : m)));
    toast.success(`MCQ ${mcq.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleDuplicate = (mcq: McqData) => {
    const newMcq: McqData = {
      ...mcq,
      id: `mcq-${Date.now()}`,
      question: `${mcq.question} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMcqs([...mcqs, newMcq]);
    toast.success('MCQ duplicated successfully');
  };

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader title="MCQs" subtitle="Manage multiple choice questions" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total MCQs" value={stats.total} icon={<CircleHelp className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<CircleHelp className="h-5 w-5" />} />
          <StatsCard title="Single Choice" value={stats.single} icon={<CircleHelp className="h-5 w-5" />} />
          <StatsCard title="Assertion" value={stats.assertion} icon={<CircleHelp className="h-5 w-5" />} />
          <StatsCard title="Statement" value={stats.statement} icon={<CircleHelp className="h-5 w-5" />} />
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
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
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
            onDelete={() => { setMcqs(mcqs.filter((m) => !selectedIds.includes(m.id))); setSelectedIds([]); toast.success(`${selectedIds.length} MCQs deleted`); }}
            onActivate={() => { setMcqs(mcqs.map((m) => (selectedIds.includes(m.id) ? { ...m, isActive: true } : m))); setSelectedIds([]); toast.success('Selected MCQs activated'); }}
            onDeactivate={() => { setMcqs(mcqs.map((m) => (selectedIds.includes(m.id) ? { ...m, isActive: false } : m))); setSelectedIds([]); toast.success('Selected MCQs deactivated'); }}
          />
        </div>

        {/* Cards Grid */}
        {mcqCards.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground">No MCQs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mcqCards.map((mcq) => (
              <McqCard
                key={mcq.id}
                mcq={mcq}
                selected={selectedIds.includes(mcq.id)}
                onSelect={handleSelectItem}
                onView={() => navigate(`/admin/mcqs/${mcq.id}`)}
                onEdit={() => navigate(`/admin/mcqs/${mcq.id}/edit`)}
                onDelete={() => { 
                  const original = mcqs.find(m => m.id === mcq.id);
                  if (original) {
                    setDeletingMcq(original); 
                    setDeleteDialogOpen(true); 
                  }
                }}
                onToggleStatus={() => {
                  const original = mcqs.find(m => m.id === mcq.id);
                  if (original) handleToggleStatus(original);
                }}
                onDuplicate={() => {
                  const original = mcqs.find(m => m.id === mcq.id);
                  if (original) handleDuplicate(original);
                }}
              />
            ))}
          </div>
        )}

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
