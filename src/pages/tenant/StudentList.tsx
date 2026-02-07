import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  Users,
  LayoutGrid,
  List,
  Filter,
  SlidersHorizontal,
  UserCheck,
  UserX,
  Calendar,
  ChevronDown,
  X,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { mockStudents, mockBatches } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import StudentCard from '@/components/tenant/StudentCard';
import { StudentCardSkeleton } from '@/components/tenant/skeletons';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import Pagination from '@/components/academic/Pagination';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'studentId' | 'className' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const StudentList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const isMobile = useIsMobile();

  // Get unique classes and groups
  const uniqueClasses = useMemo(() => 
    [...new Set(mockStudents.map(s => s.className))],
    []
  );
  
  const uniqueGroups = useMemo(() => 
    [...new Set(mockStudents.map(s => s.group).filter(Boolean))],
    []
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Students refreshed');
  }, []);

  const clearFilters = () => {
    setSelectedBatch('all');
    setSelectedStatus('all');
    setSelectedClass('all');
    setSelectedGroup('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBatch, selectedStatus, selectedClass, selectedGroup]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBatch !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (selectedClass !== 'all') count++;
    if (selectedGroup !== 'all') count++;
    return count;
  }, [selectedBatch, selectedStatus, selectedClass, selectedGroup]);

  const filteredStudents = useMemo(() => {
    let result = mockStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.includes(searchQuery) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.primaryPhone?.includes(searchQuery);

      const matchesBatch = selectedBatch === 'all' || student.batchId === selectedBatch;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && student.isActive) ||
        (selectedStatus === 'inactive' && !student.isActive);
      const matchesClass = selectedClass === 'all' || student.className === selectedClass;
      const matchesGroup = selectedGroup === 'all' || student.group === selectedGroup;

      return matchesSearch && matchesBatch && matchesStatus && matchesClass && matchesGroup;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'studentId':
          comparison = a.studentId.localeCompare(b.studentId);
          break;
        case 'className':
          comparison = a.className.localeCompare(b.className);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, selectedBatch, selectedStatus, selectedClass, selectedGroup, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  const stats = useMemo(() => ({
    total: mockStudents.length,
    active: mockStudents.filter((s) => s.isActive).length,
    inactive: mockStudents.filter((s) => !s.isActive).length,
    thisMonth: mockStudents.filter(s => {
      const date = new Date(s.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
  }), []);

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredStudents.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    toast.error(`Delete ${selectedRows.length} students?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => {
          toast.success(`${selectedRows.length} students deleted`);
          setSelectedRows([]);
        },
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Filter Sheet Content
  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Class</label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger>
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {uniqueClasses.map((cls) => (
              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Batch</label>
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger>
            <SelectValue placeholder="All Batches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {mockBatches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name} - {batch.className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Group</label>
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger>
            <SelectValue placeholder="All Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {uniqueGroups.map((group) => (
              <SelectItem key={group} value={group!}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="studentId">Student ID</SelectItem>
            <SelectItem value="className">Class</SelectItem>
            <SelectItem value="createdAt">Date Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Order</label>
        <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-foreground">Students</h1>
              <p className="text-xs text-muted-foreground">
                {filteredStudents.length} of {stats.total} students
              </p>
            </div>
            <Button size="sm" asChild>
              <Link to="/tenant/students/create">
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">
              Manage student registrations and information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button size="sm" asChild>
              <Link to="/tenant/students/create">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Mobile Stats - Horizontal Scroll */}
        <div className="lg:hidden -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            <Card className="min-w-[110px] snap-start shrink-0 border-l-4 border-l-primary">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stats.total}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-w-[110px] snap-start shrink-0 border-l-4 border-l-green-500">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-500/10 text-green-600">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stats.active}</p>
                    <p className="text-[10px] text-muted-foreground">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-w-[110px] snap-start shrink-0 border-l-4 border-l-destructive">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive">
                    <UserX className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stats.inactive}</p>
                    <p className="text-[10px] text-muted-foreground">Inactive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-w-[110px] snap-start shrink-0 border-l-4 border-l-blue-500">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stats.thisMonth}</p>
                    <p className="text-[10px] text-muted-foreground">This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Desktop Stats */}
        <div className="hidden lg:grid grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10 text-green-600">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                  <UserX className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.inactive}</p>
                  <p className="text-sm text-muted-foreground">Inactive Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.thisMonth}</p>
                  <p className="text-sm text-muted-foreground">Added This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Mobile Search & Filter Bar */}
        <div className="lg:hidden space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters & Sort
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
                <SheetFooter className="mt-6">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Pills */}
          {activeFiltersCount > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
              {selectedClass !== 'all' && (
                <Badge variant="secondary" className="shrink-0 gap-1">
                  {selectedClass}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedClass('all')} />
                </Badge>
              )}
              {selectedBatch !== 'all' && (
                <Badge variant="secondary" className="shrink-0 gap-1">
                  {mockBatches.find(b => b.id === selectedBatch)?.name}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBatch('all')} />
                </Badge>
              )}
              {selectedGroup !== 'all' && (
                <Badge variant="secondary" className="shrink-0 gap-1">
                  {selectedGroup}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGroup('all')} />
                </Badge>
              )}
              {selectedStatus !== 'all' && (
                <Badge variant="secondary" className="shrink-0 gap-1">
                  {selectedStatus}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatus('all')} />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Desktop Filters */}
        <Card className="hidden lg:block">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {mockBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {uniqueGroups.map((group) => (
                    <SelectItem key={group} value={group!}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2 ml-auto">
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-primary bg-primary/5">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedRows.length === filteredStudents.length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      {selectedRows.length} of {filteredStudents.length} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <Mail className="w-3.5 h-3.5 mr-1.5" />
                      <span className="hidden sm:inline">Email</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button variant="destructive" size="sm" className="h-8" onClick={handleBulkDelete}>
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8" onClick={() => setSelectedRows([])}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredStudents.length} of {stats.total} students
        </span>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("w-4 h-4 mr-1", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Mobile Card Grid with Pull to Refresh */}
      {isMobile && (
        <PullToRefresh onRefresh={handleRefresh} className="lg:hidden -mx-4 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3 pb-4"
          >
            {isRefreshing ? (
              [...Array(4)].map((_, i) => <StudentCardSkeleton key={i} />)
            ) : (
              <>
                {paginatedStudents.map((student) => (
                  <motion.div key={student.id} variants={itemVariants}>
                    <StudentCard
                      student={student}
                      isSelected={selectedRows.includes(student.id)}
                      onSelect={toggleSelectRow}
                      showCheckbox={selectedRows.length > 0}
                      enableSwipe={true}
                    />
                  </motion.div>
                ))}
                
                {filteredStudents.length === 0 && (
                  <motion.div variants={itemVariants} className="text-center py-12">
                    <GraduationCap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No students found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search or filters
                    </p>
                    {activeFiltersCount > 0 && (
                      <Button variant="link" onClick={clearFilters} className="mt-2">
                        Clear all filters
                      </Button>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </motion.div>

          {/* Mobile Pagination */}
          {filteredStudents.length > 0 && (
            <div className="pb-20">
              <Card>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredStudents.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </Card>
            </div>
          )}
        </PullToRefresh>
      )}

      {/* Desktop View - Grid or Table */}
      <div className="hidden lg:block space-y-4">
        {viewMode === 'grid' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
          >
            {paginatedStudents.map((student) => (
              <motion.div key={student.id} variants={itemVariants}>
                <StudentCard
                  student={student}
                  isSelected={selectedRows.includes(student.id)}
                  onSelect={toggleSelectRow}
                  showCheckbox={selectedRows.length > 0}
                  enableSwipe={false}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedRows.length === filteredStudents.length &&
                          filteredStudents.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class / Batch</TableHead>
                    <TableHead>Group / Section</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(student.id)}
                          onCheckedChange={() => toggleSelectRow(student.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.imageUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {student.studentId} {student.roll && `• Roll: ${student.roll}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{student.className}</p>
                          <p className="text-xs text-muted-foreground">{student.batchName || 'No batch'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.group && (
                            <Badge variant="outline" className="text-xs">
                              {student.group}
                            </Badge>
                          )}
                          {student.section && (
                            <Badge variant="outline" className="text-xs">
                              Sec: {student.section}
                            </Badge>
                          )}
                          {student.shift && (
                            <Badge variant="outline" className="text-xs">
                              {student.shift}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {student.email && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="truncate max-w-32">{student.email}</span>
                            </div>
                          )}
                          {student.primaryPhone && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="w-3.5 h-3.5" />
                              {student.primaryPhone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={student.isActive ? 'default' : 'secondary'}
                          className={cn(
                            student.isActive 
                              ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20' 
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {student.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link to={`/tenant/students/${student.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/tenant/students/${student.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Student
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <GraduationCap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No students found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filters
                  </p>
                  {activeFiltersCount > 0 && (
                    <Button variant="link" onClick={clearFilters} className="mt-2">
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
            
            {/* Table Pagination */}
            {filteredStudents.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredStudents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </Card>
        )}

        {/* Grid Pagination */}
        {viewMode === 'grid' && filteredStudents.length > 0 && (
          <Card>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredStudents.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentList;
