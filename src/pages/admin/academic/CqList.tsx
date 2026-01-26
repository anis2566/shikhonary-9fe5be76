import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AcademicDataTable, { Column, StatusBadge } from '@/components/academic/AcademicDataTable';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCq, setDeletingCq] = useState<Cq | null>(null);

  const filteredCqs = cqs.filter((cq) => {
    const matchesSearch =
      cq.questionA.toLowerCase().includes(search.toLowerCase()) ||
      (cq.context?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesSubject = filterSubject === 'all' || cq.subjectId === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const openDeleteDialog = (cq: Cq) => {
    setDeletingCq(cq);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingCq) {
      setCqs(cqs.filter((c) => c.id !== deletingCq.id));
      toast.success('CQ deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingCq(null);
    }
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
        return <span className="text-sm">{subject?.displayName || 'N/A'}</span>;
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

      <div className="p-4 lg:p-6 space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => navigate('/admin/cqs/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add CQ
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
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
          </div>
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={filteredCqs}
          onView={(cq) => navigate(`/admin/cqs/${cq.id}`)}
          onEdit={(cq) => navigate(`/admin/cqs/${cq.id}/edit`)}
          onDelete={openDeleteDialog}
          emptyMessage="No CQs found"
        />
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
