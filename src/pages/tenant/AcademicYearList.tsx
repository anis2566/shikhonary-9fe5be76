import React, { useState, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, Calendar, Users, Layers, Star,
  MoreHorizontal, Eye, Edit, Trash2, LayoutGrid, List, SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import AcademicYearTimeline from '@/components/tenant/academic-year/AcademicYearTimeline';
import AcademicYearCard from '@/components/tenant/academic-year/AcademicYearCard';
import Sparkline from '@/components/tenant/stats/Sparkline';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { mockAcademicYears, type AcademicYear } from '@/lib/tenant-mock-data';

type ViewMode = 'table' | 'cards';
type StatusFilter = 'all' | 'active' | 'inactive' | 'current';
type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

// Animated stat card sub-component
const AnimatedStatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  displayValue?: string;
  sparkData?: number[];
  sparkColor?: string;
}> = ({ icon, label, value, displayValue, sparkData, sparkColor }) => {
  const { count, ref } = useAnimatedCounter(value, { duration: 1200 });
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3" ref={ref}>
        {icon}
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-foreground">{displayValue ?? count}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
        {sparkData && (
          <Sparkline data={sparkData} width={64} height={24} color={sparkColor} />
        )}
      </CardContent>
    </Card>
  );
};

const AcademicYearList: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const effectiveView = isMobile ? 'cards' : viewMode;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [deleteTarget, setDeleteTarget] = useState<AcademicYear | null>(null);

  const filtered = useMemo(() => {
    let result = mockAcademicYears.filter((ay) =>
      ay.name.toLowerCase().includes(search.toLowerCase())
    );

    // Status filter
    if (statusFilter === 'active') result = result.filter((ay) => ay.isActive);
    else if (statusFilter === 'inactive') result = result.filter((ay) => !ay.isActive);
    else if (statusFilter === 'current') result = result.filter((ay) => ay.isCurrent);

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'oldest': return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

    return result;
  }, [search, statusFilter, sortBy]);

  const currentYear = mockAcademicYears.find((ay) => ay.isCurrent);
  const activeCount = mockAcademicYears.filter((ay) => ay.isActive).length;

  // Mock sparkline data
  const studentTrend = [120, 135, 128, 142, 150, 148, 155];
  const batchTrend = [4, 5, 5, 6, 6, 7, 8];

  const handleDelete = () => {
    if (deleteTarget) {
      toast.success(`Academic year "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academic Years</h1>
          <p className="text-muted-foreground text-sm">Manage academic year sessions</p>
        </div>
        <Button onClick={() => navigate('/tenant/academic-years/create')} className="gap-2">
          <Plus className="w-4 h-4" /> Add Year
        </Button>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="py-4 px-2">
          <AcademicYearTimeline years={mockAcademicYears} />
        </CardContent>
      </Card>

      {/* Animated Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedStatCard
          icon={<div className="p-2 rounded-lg bg-primary/10"><Calendar className="w-5 h-5 text-primary" /></div>}
          label="Total Years"
          value={mockAcademicYears.length}
        />
        <AnimatedStatCard
          icon={<div className="p-2 rounded-lg bg-green-500/10"><Star className="w-5 h-5 text-green-500" /></div>}
          label="Current Year"
          value={0}
          displayValue={currentYear?.name || '-'}
        />
        <AnimatedStatCard
          icon={<div className="p-2 rounded-lg bg-blue-500/10"><Users className="w-5 h-5 text-blue-500" /></div>}
          label="Students (Current)"
          value={currentYear?.totalStudents || 0}
          sparkData={studentTrend}
          sparkColor="hsl(217, 91%, 60%)"
        />
        <AnimatedStatCard
          icon={<div className="p-2 rounded-lg bg-orange-500/10"><Layers className="w-5 h-5 text-orange-500" /></div>}
          label="Batches (Current)"
          value={currentYear?.totalBatches || 0}
          sparkData={batchTrend}
          sparkColor="hsl(25, 95%, 53%)"
        />
      </div>

      {/* Toolbar: Search, Filters, View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search year..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="current">Current</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[140px] h-9">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A–Z</SelectItem>
              <SelectItem value="name-desc">Name Z–A</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle - hidden on mobile (forced card view) */}
          {!isMobile && (
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none h-9 px-3"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none h-9 px-3"
                onClick={() => setViewMode('cards')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {(statusFilter !== 'all' || search) && (
        <div className="flex gap-2 flex-wrap">
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setStatusFilter('all')}>
              {statusFilter} ✕
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSearch('')}>
              "{search}" ✕
            </Badge>
          )}
        </div>
      )}

      {/* Content: Table or Cards */}
      {effectiveView === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Batches</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ay, i) => (
                  <motion.tr
                    key={ay.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/tenant/academic-years/${ay.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {ay.name}
                        {ay.isCurrent && (
                          <Badge className="text-[10px] gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
                            <Star className="w-2.5 h-2.5" /> Current
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(ay.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – {new Date(ay.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell>{ay.totalStudents}</TableCell>
                    <TableCell>{ay.totalBatches}</TableCell>
                    <TableCell>
                      <Badge variant={ay.isActive ? 'default' : 'secondary'}>
                        {ay.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/tenant/academic-years/${ay.id}`); }}>
                            <Eye className="w-4 h-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/tenant/academic-years/${ay.id}/edit`); }}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(ay); }}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No academic years found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ay, i) => (
            <AcademicYearCard key={ay.id} year={ay} index={i} onDelete={setDeleteTarget} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No academic years found.
            </div>
          )}
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Academic Year"
        description={`Are you sure you want to delete academic year "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AcademicYearList;
