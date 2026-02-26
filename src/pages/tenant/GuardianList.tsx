import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Download, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, Users, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockGuardians } from '@/lib/tenant-mock-data';
import { useIsMobile } from '@/hooks/use-mobile';
import GuardianCard from '@/components/tenant/GuardianCard';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import { toast } from 'sonner';

const GuardianList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Guardians refreshed');
  }, []);

  const filteredGuardians = mockGuardians.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      g.studentNames.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && g.isActive) ||
      (selectedStatus === 'inactive' && !g.isActive);
    return matchesSearch && matchesStatus;
  });

  const statCards = [
    { value: mockGuardians.length, label: 'Total Guardians' },
    { value: mockGuardians.filter((g) => g.isActive).length, label: 'Active' },
    { value: new Set(mockGuardians.flatMap((g) => g.studentIds)).size, label: 'Students Linked' },
    { value: mockGuardians.filter((g) => !g.isActive).length, label: 'Inactive' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
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
              <Input placeholder="Search by name, email, or student..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
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
