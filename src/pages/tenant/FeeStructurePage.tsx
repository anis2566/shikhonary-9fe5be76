import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FeeStructure {
  id: string;
  name: string;
  className: string;
  academicYear: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  labFee: number;
  libraryFee: number;
  transportFee: number;
  totalFee: number;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  studentsApplied: number;
  isActive: boolean;
}

const mockFeeStructures: FeeStructure[] = [
  { id: 'fs-1', name: 'Class 9 - Science', className: 'Class 9', academicYear: '2024', tuitionFee: 5000, admissionFee: 2000, examFee: 1000, labFee: 1500, libraryFee: 500, transportFee: 2000, totalFee: 12000, frequency: 'monthly', studentsApplied: 45, isActive: true },
  { id: 'fs-2', name: 'Class 10 - Science', className: 'Class 10', academicYear: '2024', tuitionFee: 6000, admissionFee: 2500, examFee: 1200, labFee: 1800, libraryFee: 500, transportFee: 2000, totalFee: 14000, frequency: 'monthly', studentsApplied: 38, isActive: true },
  { id: 'fs-3', name: 'Class 9 - Commerce', className: 'Class 9', academicYear: '2024', tuitionFee: 4500, admissionFee: 2000, examFee: 1000, labFee: 800, libraryFee: 500, transportFee: 2000, totalFee: 10800, frequency: 'monthly', studentsApplied: 30, isActive: true },
  { id: 'fs-4', name: 'Class 11 - Science', className: 'Class 11', academicYear: '2024', tuitionFee: 7000, admissionFee: 3000, examFee: 1500, labFee: 2000, libraryFee: 600, transportFee: 2000, totalFee: 16100, frequency: 'monthly', studentsApplied: 52, isActive: true },
  { id: 'fs-5', name: 'Class 12 - Science', className: 'Class 12', academicYear: '2024', tuitionFee: 7500, admissionFee: 3000, examFee: 1500, labFee: 2200, libraryFee: 600, transportFee: 2000, totalFee: 16800, frequency: 'monthly', studentsApplied: 48, isActive: false },
];

const FeeStructurePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = mockFeeStructures.filter((fs) => {
    const matchesSearch = fs.name.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'all' || fs.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const totalRevenue = mockFeeStructures.reduce((a, fs) => a + fs.totalFee * fs.studentsApplied, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Fee Structure</h1>
          <p className="text-muted-foreground mt-1">Define and manage fee structures for each class</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Fee Structure
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10 text-primary"><DollarSign className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockFeeStructures.length}</p><p className="text-xs text-muted-foreground">Fee Plans</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10 text-green-600"><TrendingUp className="w-5 h-5" /></div><div><p className="text-2xl font-bold">৳{(totalRevenue / 1000).toFixed(0)}K</p><p className="text-xs text-muted-foreground">Est. Revenue</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><Users className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockFeeStructures.reduce((a, fs) => a + fs.studentsApplied, 0)}</p><p className="text-xs text-muted-foreground">Students</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><GraduationCap className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockFeeStructures.filter((fs) => fs.isActive).length}</p><p className="text-xs text-muted-foreground">Active Plans</p></div></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search fee structures..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="Class 9">Class 9</SelectItem>
            <SelectItem value="Class 10">Class 10</SelectItem>
            <SelectItem value="Class 11">Class 11</SelectItem>
            <SelectItem value="Class 12">Class 12</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Plan</TableHead>
                <TableHead className="hidden md:table-cell">Frequency</TableHead>
                <TableHead className="hidden lg:table-cell">Breakdown</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="hidden sm:table-cell">Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((fs) => (
                <TableRow key={fs.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{fs.name}</p>
                      <p className="text-xs text-muted-foreground">{fs.academicYear}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs capitalize">{fs.frequency}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <span>Tuition: ৳{fs.tuitionFee}</span> • <span>Exam: ৳{fs.examFee}</span> • <span>Lab: ৳{fs.labFee}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="font-semibold text-sm">৳{fs.totalFee.toLocaleString()}</span></TableCell>
                  <TableCell className="hidden sm:table-cell">{fs.studentsApplied}</TableCell>
                  <TableCell>
                    <Badge variant={fs.isActive ? 'default' : 'secondary'} className="text-xs">
                      {fs.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Fee Structure</DialogTitle>
            <DialogDescription>Define a new fee structure for a class</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Plan Name</Label><Input placeholder="e.g. Class 9 - Science" className="mt-1.5" /></div>
              <div><Label>Class</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent><SelectItem value="9">Class 9</SelectItem><SelectItem value="10">Class 10</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Tuition Fee</Label><Input type="number" placeholder="0" className="mt-1.5" /></div>
              <div><Label>Exam Fee</Label><Input type="number" placeholder="0" className="mt-1.5" /></div>
              <div><Label>Lab Fee</Label><Input type="number" placeholder="0" className="mt-1.5" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Library Fee</Label><Input type="number" placeholder="0" className="mt-1.5" /></div>
              <div><Label>Transport Fee</Label><Input type="number" placeholder="0" className="mt-1.5" /></div>
              <div><Label>Admission Fee</Label><Input type="number" placeholder="0" className="mt-1.5" /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => { setIsCreateOpen(false); toast({ title: 'Fee Structure Created', description: 'New fee plan saved successfully.' }); }}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeeStructurePage;
