import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Download, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, Users, LayoutGrid, List, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { mockGuardians } from '@/lib/tenant-mock-data';
import { useIsMobile } from '@/hooks/use-mobile';
import GuardianCard from '@/components/tenant/GuardianCard';
import GuardianAnimatedStatCards from '@/components/tenant/guardian/GuardianAnimatedStatCards';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import { toast } from 'sonner';

type ViewMode = 'table' | 'cards';
type SortOption = 'name-asc' | 'name-desc' | 'students-desc' | 'newest' | 'oldest';

const sortLabels: Record<SortOption, string> = {
  'name-asc': 'Name A-Z',
  'name-desc': 'Name Z-A',
  'students-desc': 'Most Students',
  'newest': 'Newest First',
  'oldest': 'Oldest First',
};

const GuardianList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();
  const effectiveView = isMobile ? 'cards' : viewMode;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Guardians refreshed');
  }, []);

  const relationships = useMemo(
    () => [...new Set(mockGuardians.map((g) => g.relationship))],
    []
  );

  const statusCounts = useMemo(() => ({
    all: mockGuardians.length,
    active: mockGuardians.filter((g) => g.isActive).length,
    inactive: mockGuardians.filter((g) => !g.isActive).length,
  }), []);

  const filteredGuardians = useMemo(() => {
    let result = mockGuardians.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        g.studentNames.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && g.isActive) ||
        (selectedStatus === 'inactive' && !g.isActive);
      const matchesRelationship =
        selectedRelationship === 'all' || g.relationship === selectedRelationship;
      return matchesSearch && matchesStatus && matchesRelationship;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'students-desc': return b.studentIds.length - a.studentIds.length;
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: return 0;
      }
    });

    return result;
  }, [searchQuery, selectedStatus, selectedRelationship, sortBy]);

  const activeFilters = [
    ...(selectedStatus !== 'all' ? [{ key: 'status', label: `Status: ${selectedStatus}`, clear: () => setSelectedStatus('all') }] : []),
    ...(selectedRelationship !== 'all' ? [{ key: 'relationship', label: `Relationship: ${selectedRelationship}`, clear: () => setSelectedRelationship('all') }] : []),
    ...(searchQuery ? [{ key: 'search', label: `Search: "${searchQuery}"`, clear: () => setSearchQuery('') }] : []),
  ];

  const MobileFilterSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[70vh]">
        <SheetHeader><SheetTitle>Filters & Sort</SheetTitle></SheetHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Relationship</label>
            <Select value={selectedRelationship} onValueChange={setSelectedRelationship}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Relationships</SelectItem>
                {relationships.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(sortLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Guardians</h1>
          <p className="text-muted-foreground mt-1">Manage parent and guardian profiles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button size="sm" asChild>
            <Link to="/tenant/guardians/create"><Plus className="w-4 h-4 mr-2" />Add Guardian</Link>
          </Button>
        </div>
      </div>

      {/* Animated Stat Cards */}
      <GuardianAnimatedStatCards guardians={mockGuardians} />

      {/* Status Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['all', 'active', 'inactive'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              selectedStatus === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedStatus === status ? 'bg-primary-foreground/20' : 'bg-background'
            }`}>
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, or student..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            {isMobile ? (
              <MobileFilterSheet />
            ) : (
              <>
                <Select value={selectedRelationship} onValueChange={setSelectedRelationship}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Relationship" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Relationships</SelectItem>
                    {relationships.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-40">
                    <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center border rounded-md">
                  <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setViewMode('table')}>
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === 'cards' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setViewMode('cards')}>
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Filter Tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <Badge key={f.key} variant="secondary" className="gap-1 pr-1">
              {f.label}
              <button onClick={f.clear} className="ml-1 rounded-full hover:bg-foreground/10 p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setSelectedRelationship('all'); }}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredGuardians.length} of {mockGuardians.length} guardians
      </p>

      {/* List */}
      {effectiveView === 'cards' ? (
        isMobile ? (
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="space-y-3 pb-20">
              {filteredGuardians.map((g) => (
                <GuardianCard key={g.id} guardian={g} enableSwipe={true} />
              ))}
              {filteredGuardians.length === 0 && (
                <Card><CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No guardians found</p>
                </CardContent></Card>
              )}
            </div>
          </PullToRefresh>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuardians.map((g) => (
              <GuardianCard key={g.id} guardian={g} enableSwipe={false} />
            ))}
            {filteredGuardians.length === 0 && (
              <Card className="col-span-full"><CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No guardians found</p>
              </CardContent></Card>
            )}
          </div>
        )
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guardian</TableHead>
                  <TableHead className="hidden md:table-cell">Relationship</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="hidden sm:table-cell">Students</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuardians.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={g.imageUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {g.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{g.name}</p>
                          <p className="text-xs text-muted-foreground">{g.occupation || 'N/A'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">{g.relationship}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-0.5">
                        {g.email && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="w-3 h-3" /><span className="truncate max-w-32">{g.email}</span></div>}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="w-3 h-3" />{g.phonePrimary}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {g.studentNames.map((name) => (
                          <Badge key={name} variant="secondary" className="text-xs">{name}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={g.isActive ? 'default' : 'secondary'}>{g.isActive ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to={`/tenant/guardians/${g.id}`}><Eye className="w-4 h-4 mr-2" />View</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to={`/tenant/guardians/${g.id}/edit`}><Edit className="w-4 h-4 mr-2" />Edit</Link></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredGuardians.length === 0 && (
              <div className="text-center py-12"><Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" /><p className="text-muted-foreground">No guardians found</p></div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuardianList;
