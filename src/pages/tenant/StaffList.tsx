import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Download, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockStaff } from '@/lib/tenant-mock-data';
import { useIsMobile } from '@/hooks/use-mobile';
import StaffCard from '@/components/tenant/StaffCard';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import { toast } from 'sonner';

const StaffList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();

  const departments = Array.from(new Set(mockStaff.map((s) => s.department)));

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Staff refreshed');
  }, []);

  const filteredStaff = mockStaff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && s.isActive) ||
      (selectedStatus === 'inactive' && !s.isActive);
    const matchesDept = selectedDept === 'all' || s.department === selectedDept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const statCards = [
    { value: mockStaff.length, label: 'Total Staff' },
    { value: mockStaff.filter((s) => s.isActive).length, label: 'Active' },
    { value: departments.length, label: 'Departments' },
    { value: mockStaff.filter((s) => !s.isActive).length, label: 'Inactive' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Staff</h1>
          <p className="text-muted-foreground mt-1">Manage non-teaching staff members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button size="sm" asChild>
            <Link to="/tenant/staff/create"><Plus className="w-4 h-4 mr-2" />Add Staff</Link>
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {statCards.map((stat) => (
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
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, or designation..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="space-y-3 pb-20">
            {filteredStaff.map((s) => (
              <StaffCard key={s.id} staff={s} enableSwipe={true} />
            ))}
            {filteredStaff.length === 0 && (
              <Card><CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No staff found</p>
              </CardContent></Card>
            )}
          </div>
        </PullToRefresh>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="hidden sm:table-cell">Employee ID</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={s.imageUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {s.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.designation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">{s.department}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-0.5">
                        {s.email && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="w-3 h-3" /><span className="truncate max-w-32">{s.email}</span></div>}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="w-3 h-3" />{s.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm font-mono">{s.employeeId}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={s.isActive ? 'default' : 'secondary'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to={`/tenant/staff/${s.id}`}><Eye className="w-4 h-4 mr-2" />View</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to={`/tenant/staff/${s.id}/edit`}><Edit className="w-4 h-4 mr-2" />Edit</Link></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStaff.length === 0 && (
              <div className="text-center py-12"><Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" /><p className="text-muted-foreground">No staff found</p></div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffList;
