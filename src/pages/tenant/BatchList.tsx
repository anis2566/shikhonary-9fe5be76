import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Users,
  Calendar,
  LayoutGrid,
  List,
  Download,
  Trash2,
  Filter,
  X,
  GraduationCap,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Pagination from '@/components/academic/Pagination';
import { mockBatches } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import BatchCard from '@/components/tenant/BatchCard';
import { BatchCardSkeleton } from '@/components/tenant/skeletons';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import { toast } from 'sonner';

const BatchList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isMobile = useIsMobile();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Batches refreshed');
  }, []);

  // Filter logic
  const filteredBatches = useMemo(() => {
    return mockBatches.filter((batch) => {
      const matchesSearch =
        batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.className.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear = selectedYear === 'all' || batch.academicYear === selectedYear;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && batch.isActive) ||
        (selectedStatus === 'inactive' && !batch.isActive);
      const matchesClass = selectedClass === 'all' || batch.className === selectedClass;

      return matchesSearch && matchesYear && matchesStatus && matchesClass;
    });
  }, [searchQuery, selectedYear, selectedStatus, selectedClass]);

  // Pagination
  const paginatedBatches = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBatches.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBatches, currentPage, itemsPerPage]);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear, selectedStatus, selectedClass]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalStudents = mockBatches.reduce((acc, b) => acc + b.currentSize, 0);
    const totalCapacity = mockBatches.reduce((acc, b) => acc + (b.capacity || 30), 0);
    const activeBatches = mockBatches.filter((b) => b.isActive).length;
    const nearFullBatches = mockBatches.filter(
      (b) => b.capacity && (b.currentSize / b.capacity) >= 0.9
    ).length;

    return {
      total: mockBatches.length,
      active: activeBatches,
      inactive: mockBatches.length - activeBatches,
      totalStudents,
      capacityPercent: Math.round((totalStudents / totalCapacity) * 100),
      nearFull: nearFullBatches,
    };
  }, []);

  const years = [...new Set(mockBatches.map((b) => b.academicYear))];
  const classes = [...new Set(mockBatches.map((b) => b.className))];

  // Bulk selection
  const toggleSelectAll = () => {
    if (selectedBatches.length === paginatedBatches.length) {
      setSelectedBatches([]);
    } else {
      setSelectedBatches(paginatedBatches.map((b) => b.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedBatches((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    toast.error(`Delete ${selectedBatches.length} batches?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => {
          toast.success(`${selectedBatches.length} batches deleted`);
          setSelectedBatches([]);
        },
      },
    });
  };

  const handleBulkExport = () => {
    toast.success(`Exporting ${selectedBatches.length} batches...`);
    setSelectedBatches([]);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedStatus('all');
    setSelectedClass('all');
  };

  const hasActiveFilters =
    searchQuery || selectedYear !== 'all' || selectedStatus !== 'all' || selectedClass !== 'all';

  // Filter Sheet for Mobile
  const FilterSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[70vh]">
        <SheetHeader>
          <SheetTitle>Filter Batches</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Academic Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
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
          {hasActiveFilters && (
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  // Bulk Actions Bar
  const BulkActionsBar = () => (
    <AnimatePresence>
      {selectedBatches.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-3 flex items-center gap-3">
              <Badge variant="secondary" className="font-medium">
                {selectedBatches.length} selected
              </Badge>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkExport}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedBatches([])}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Batches</h1>
          <p className="text-muted-foreground mt-1">
            Manage class batches and student groups
          </p>
        </div>
        <Button size="sm" asChild>
          <Link to="/tenant/batches/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </Link>
        </Button>
      </div>

      {/* Stats Dashboard */}
      {isMobile ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {[
            { value: stats.total, label: 'Total Batches', icon: Users, trend: null },
            { value: stats.active, label: 'Active', icon: GraduationCap, trend: 'up' },
            { value: stats.totalStudents, label: 'Students', icon: Users, trend: null },
            { value: `${stats.capacityPercent}%`, label: 'Capacity', icon: TrendingUp, trend: null },
          ].map((stat) => (
            <Card key={stat.label} className="shrink-0 w-28 snap-start">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.trend === 'up' && (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  )}
                  {stat.trend === 'down' && (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Batches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                  <p className="text-xs text-muted-foreground">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.capacityPercent}%</p>
                  <p className="text-xs text-muted-foreground">Capacity Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.nearFull}</p>
                  <p className="text-xs text-muted-foreground">Near Full</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search batches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {isMobile && <FilterSheet />}
            </div>

            {!isMobile && (
              <>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
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
              </>
            )}

            {/* View Toggle */}
            {!isMobile && (
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setViewMode('table')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && !isMobile && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {selectedClass !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedClass}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedClass('all')}
                  />
                </Badge>
              )}
              {selectedYear !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedYear}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedYear('all')}
                  />
                </Badge>
              )}
              {selectedStatus !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedStatus}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedStatus('all')}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedBatches.length} of {filteredBatches.length} batches
        </p>
        {!isMobile && (
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(v) => setItemsPerPage(Number(v))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Mobile Card List */}
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="space-y-3 pb-20">
            {isRefreshing ? (
              [...Array(3)].map((_, i) => <BatchCardSkeleton key={i} />)
            ) : (
              <>
                {paginatedBatches.map((batch) => (
                  <BatchCard key={batch.id} batch={batch} enableSwipe={true} />
                ))}
                {paginatedBatches.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No batches found</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
            {/* Mobile Pagination */}
            {filteredBatches.length > itemsPerPage && (
              <div className="pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredBatches.length / itemsPerPage)}
                  totalItems={filteredBatches.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
          </div>
        </PullToRefresh>
      ) : viewMode === 'grid' ? (
        /* Desktop Grid View */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedBatches.map((batch) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <BatchCard batch={batch} enableSwipe={false} />
              </motion.div>
            ))}
          </div>

          {paginatedBatches.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No batches found</p>
              </CardContent>
            </Card>
          )}

          {/* Grid Pagination */}
          {filteredBatches.length > itemsPerPage && (
            <Card>
              <CardContent className="py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredBatches.length / itemsPerPage)}
                  totalItems={filteredBatches.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Desktop Table View */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        paginatedBatches.length > 0 &&
                        selectedBatches.length === paginatedBatches.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBatches.map((batch) => {
                  const capacityPercent = batch.capacity
                    ? Math.round((batch.currentSize / batch.capacity) * 100)
                    : 0;

                  return (
                    <TableRow key={batch.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedBatches.includes(batch.id)}
                          onCheckedChange={() => toggleSelect(batch.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/tenant/batches/${batch.id}`}
                          className="font-medium hover:underline"
                        >
                          {batch.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{batch.className}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {batch.academicYear}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {batch.currentSize}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress
                            value={capacityPercent}
                            className={cn(
                              'h-2 flex-1',
                              capacityPercent >= 90 && '[&>div]:bg-destructive',
                              capacityPercent >= 70 &&
                                capacityPercent < 90 &&
                                '[&>div]:bg-amber-500'
                            )}
                          />
                          <span className="text-xs text-muted-foreground w-10">
                            {capacityPercent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={batch.isActive ? 'default' : 'secondary'}>
                          {batch.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/tenant/batches/${batch.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedBatches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No batches found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Table Pagination */}
            {filteredBatches.length > itemsPerPage && (
              <div className="border-t p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredBatches.length / itemsPerPage)}
                  totalItems={filteredBatches.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar />
    </div>
  );
};

export default BatchList;
