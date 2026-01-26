import React, { useState, useMemo } from 'react';
import { Plus, Search, BookText, Filter, Download, Upload } from 'lucide-react';
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
import { AcademicSubject } from '@/types';
import { mockSubjects, mockClasses, getClassById, mockChapters } from '@/lib/academic-mock-data';

const SubjectList: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<AcademicSubject[]>(mockSubjects);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<AcademicSubject | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(search.toLowerCase()) ||
        subject.displayName.toLowerCase().includes(search.toLowerCase()) ||
        (subject.code?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesClass = filterClass === 'all' || subject.classId === filterClass;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && subject.isActive) ||
        (filterStatus === 'inactive' && !subject.isActive);
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [subjects, search, filterClass, filterStatus]);

  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(start, start + itemsPerPage);
  }, [filteredSubjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeCount = subjects.filter((s) => s.isActive).length;
    const chapterCount = mockChapters.length;
    return { total: subjects.length, active: activeCount, inactive: subjects.length - activeCount, chapters: chapterCount };
  }, [subjects]);

  const handleDelete = () => {
    if (deletingSubject) {
      setSubjects(subjects.filter((s) => s.id !== deletingSubject.id));
      toast.success('Subject deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingSubject(null);
    }
  };

  const handleToggleStatus = (subject: AcademicSubject) => {
    setSubjects(subjects.map((s) => (s.id === subject.id ? { ...s, isActive: !s.isActive, updatedAt: new Date() } : s)));
    toast.success(`Subject ${subject.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const columns: Column<AcademicSubject>[] = [
    {
      key: 'displayName',
      header: 'Subject',
      render: (subject) => (
        <div>
          <p className="font-medium text-foreground">{subject.displayName}</p>
          {subject.code && <p className="text-xs text-muted-foreground">{subject.code}</p>}
        </div>
      ),
    },
    {
      key: 'classId',
      header: 'Class',
      hideOnMobile: true,
      render: (subject) => {
        const cls = getClassById(subject.classId);
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">{cls?.displayName || 'N/A'}</span>;
      },
    },
    {
      key: 'name',
      header: 'Slug',
      hideOnMobile: true,
      render: (subject) => <code className="text-xs bg-muted px-2 py-1 rounded">{subject.name}</code>,
    },
    {
      key: 'position',
      header: 'Position',
      hideOnMobile: true,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (subject) => <StatusBadge active={subject.isActive} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Subjects" subtitle="Manage academic subjects for each class" />

      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Subjects" value={stats.total} icon={<BookText className="h-5 w-5" />} />
          <StatsCard title="Active" value={stats.active} icon={<BookText className="h-5 w-5" />} />
          <StatsCard title="Inactive" value={stats.inactive} icon={<BookText className="h-5 w-5" />} />
          <StatsCard title="Total Chapters" value={stats.chapters} icon={<BookText className="h-5 w-5" />} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search subjects..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
              </div>
              <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.displayName}</SelectItem>
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
              <Button onClick={() => navigate('/admin/subjects/create')}><Plus className="h-4 w-4 mr-2" />Add Subject</Button>
            </div>
          </div>
          <BulkActions
            selectedCount={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onDelete={() => { setSubjects(subjects.filter((s) => !selectedIds.includes(s.id))); setSelectedIds([]); toast.success(`${selectedIds.length} subjects deleted`); }}
            onActivate={() => { setSubjects(subjects.map((s) => (selectedIds.includes(s.id) ? { ...s, isActive: true } : s))); setSelectedIds([]); toast.success('Selected subjects activated'); }}
            onDeactivate={() => { setSubjects(subjects.map((s) => (selectedIds.includes(s.id) ? { ...s, isActive: false } : s))); setSelectedIds([]); toast.success('Selected subjects deactivated'); }}
          />
        </div>

        <AcademicDataTable
          columns={columns}
          data={paginatedSubjects}
          onView={(subject) => navigate(`/admin/subjects/${subject.id}`)}
          onEdit={(subject) => navigate(`/admin/subjects/${subject.id}/edit`)}
          onDelete={(subject) => { setDeletingSubject(subject); setDeleteDialogOpen(true); }}
          onToggleStatus={handleToggleStatus}
          emptyMessage="No subjects found"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemStatus={(subject) => subject.isActive}
        />

        {filteredSubjects.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredSubjects.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />
        )}
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Subject" description={`Are you sure you want to delete "${deletingSubject?.displayName}"? This will also remove all associated chapters and content.`} onConfirm={handleDelete} />
    </div>
  );
};

export default SubjectList;
