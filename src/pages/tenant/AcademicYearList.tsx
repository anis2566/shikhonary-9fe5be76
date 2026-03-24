import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, Calendar, Users, Layers, CheckCircle2,
  MoreHorizontal, Eye, Edit, Trash2, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { mockAcademicYears, type AcademicYear } from '@/lib/tenant-mock-data';

const AcademicYearList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AcademicYear | null>(null);

  const filtered = useMemo(
    () => mockAcademicYears.filter((ay) => ay.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const currentYear = mockAcademicYears.find((ay) => ay.isCurrent);

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Calendar className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{mockAcademicYears.length}</p>
              <p className="text-xs text-muted-foreground">Total Years</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10"><Star className="w-5 h-5 text-green-500" /></div>
            <div>
              <p className="text-2xl font-bold">{currentYear?.name || '-'}</p>
              <p className="text-xs text-muted-foreground">Current Year</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><Users className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-2xl font-bold">{currentYear?.totalStudents || 0}</p>
              <p className="text-xs text-muted-foreground">Students (Current)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10"><Layers className="w-5 h-5 text-orange-500" /></div>
            <div>
              <p className="text-2xl font-bold">{currentYear?.totalBatches || 0}</p>
              <p className="text-xs text-muted-foreground">Batches (Current)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search year..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Table */}
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
                      {ay.isCurrent && <Badge variant="default" className="text-xs">Current</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(ay.startDate).toLocaleDateString()} – {new Date(ay.endDate).toLocaleDateString()}
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
