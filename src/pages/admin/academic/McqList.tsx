import React, { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AcademicDataTable, { Column, StatusBadge, DifficultyBadge } from '@/components/academic/AcademicDataTable';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Mcq } from '@/types';
import { mockMcqs, mockSubjects, mockChapters, getSubjectById, getChapterById } from '@/lib/academic-mock-data';

const McqList: React.FC = () => {
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState<Mcq[]>(mockMcqs);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMcq, setDeletingMcq] = useState<Mcq | null>(null);

  const filteredMcqs = mcqs.filter((mcq) => {
    const matchesSearch = mcq.question.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'all' || mcq.subjectId === filterSubject;
    const matchesDifficulty = filterDifficulty === 'all' || mcq.difficulty === filterDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const openDeleteDialog = (mcq: Mcq) => {
    setDeletingMcq(mcq);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingMcq) {
      setMcqs(mcqs.filter((m) => m.id !== deletingMcq.id));
      toast.success('MCQ deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingMcq(null);
    }
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
        return <span className="text-sm">{subject?.displayName || 'N/A'}</span>;
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
            <Button onClick={() => navigate('/admin/mcqs/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add MCQ
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
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
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
          </div>
        </div>

        {/* Table */}
        <AcademicDataTable
          columns={columns}
          data={filteredMcqs}
          onView={(mcq) => navigate(`/admin/mcqs/${mcq.id}`)}
          onEdit={(mcq) => navigate(`/admin/mcqs/${mcq.id}/edit`)}
          onDelete={openDeleteDialog}
          emptyMessage="No MCQs found"
        />
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
