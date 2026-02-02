import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockBatches } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import BatchCard from '@/components/tenant/BatchCard';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import { toast } from 'sonner';

const BatchList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const isMobile = useIsMobile();

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Batches refreshed');
  }, []);

  const filteredBatches = mockBatches.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.className.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear = selectedYear === 'all' || batch.academicYear === selectedYear;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && batch.isActive) ||
      (selectedStatus === 'inactive' && !batch.isActive);

    return matchesSearch && matchesYear && matchesStatus;
  });

  const years = [...new Set(mockBatches.map((b) => b.academicYear))];

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

      {/* Stats - Horizontal scroll on mobile */}
      {isMobile ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {[
            { value: mockBatches.length, label: 'Total Batches' },
            { value: mockBatches.filter((b) => b.isActive).length, label: 'Active' },
            { value: mockBatches.reduce((acc, b) => acc + b.currentSize, 0), label: 'Students' },
            {
              value: `${Math.round(
                (mockBatches.reduce((acc, b) => acc + b.currentSize, 0) /
                  mockBatches.reduce((acc, b) => acc + (b.capacity || 30), 0)) *
                  100
              )}%`,
              label: 'Capacity',
            },
          ].map((stat) => (
            <Card key={stat.label} className="shrink-0 w-28 snap-start">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{mockBatches.length}</p>
              <p className="text-xs text-muted-foreground">Total Batches</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {mockBatches.filter((b) => b.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {mockBatches.reduce((acc, b) => acc + b.currentSize, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {Math.round(
                  (mockBatches.reduce((acc, b) => acc + b.currentSize, 0) /
                    mockBatches.reduce((acc, b) => acc + (b.capacity || 30), 0)) *
                    100
                )}
                %
              </p>
              <p className="text-xs text-muted-foreground">Capacity Used</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search batches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-36">
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
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card List with Pull to Refresh */}
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="space-y-3 pb-20">
            {filteredBatches.map((batch) => (
              <BatchCard key={batch.id} batch={batch} enableSwipe={true} />
            ))}
            {filteredBatches.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No batches found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </PullToRefresh>
      ) : (
        /* Desktop Batch Cards Grid */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatches.map((batch) => {
              const capacityPercent = batch.capacity
                ? Math.round((batch.currentSize / batch.capacity) * 100)
                : 0;

              return (
                <Card key={batch.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{batch.name}</h3>
                        <p className="text-sm text-muted-foreground">{batch.className}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/tenant/batches/${batch.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/tenant/batches/${batch.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{batch.academicYear}</span>
                        </div>
                        <Badge variant={batch.isActive ? 'default' : 'secondary'}>
                          {batch.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>Capacity</span>
                          </div>
                          <span className="font-medium">
                            {batch.currentSize}/{batch.capacity || '∞'}
                          </span>
                        </div>
                        <Progress
                          value={capacityPercent}
                          className={cn(
                            'h-2',
                            capacityPercent > 90 && '[&>div]:bg-destructive'
                          )}
                        />
                      </div>

                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to={`/tenant/batches/${batch.id}`}>
                          <GraduationCap className="w-4 h-4 mr-2" />
                          View Students
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredBatches.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No batches found</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default BatchList;
