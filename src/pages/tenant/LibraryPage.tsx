import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Users,
  BookCopy,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
  Eye,
  Edit,
  ArrowLeftRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  issuedCount: number;
  status: 'available' | 'low-stock' | 'out-of-stock';
}

const mockBooks: Book[] = [
  { id: 'b-1', title: 'Physics for Class XI', author: 'Dr. Shahjahan Tapan', isbn: '978-984-111', category: 'Science', totalCopies: 50, availableCopies: 35, issuedCount: 15, status: 'available' },
  { id: 'b-2', title: 'Higher Mathematics', author: 'Dr. Afroza Begum', isbn: '978-984-222', category: 'Mathematics', totalCopies: 40, availableCopies: 5, issuedCount: 35, status: 'low-stock' },
  { id: 'b-3', title: 'Organic Chemistry', author: 'Hajari & Nag', isbn: '978-984-333', category: 'Science', totalCopies: 30, availableCopies: 0, issuedCount: 30, status: 'out-of-stock' },
  { id: 'b-4', title: 'English Grammar & Composition', author: 'Wren & Martin', isbn: '978-984-444', category: 'Language', totalCopies: 60, availableCopies: 42, issuedCount: 18, status: 'available' },
  { id: 'b-5', title: 'Biology XII', author: 'Gazi Azmal', isbn: '978-984-555', category: 'Science', totalCopies: 45, availableCopies: 28, issuedCount: 17, status: 'available' },
  { id: 'b-6', title: 'Bangladesh & Global Studies', author: 'NCTB', isbn: '978-984-666', category: 'Social Studies', totalCopies: 35, availableCopies: 3, issuedCount: 32, status: 'low-stock' },
];

const LibraryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = mockBooks.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalBooks = mockBooks.reduce((a, b) => a + b.totalCopies, 0);
  const totalIssued = mockBooks.reduce((a, b) => a + b.issuedCount, 0);
  const lowStock = mockBooks.filter((b) => b.status === 'low-stock').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/10 text-green-600';
      case 'low-stock': return 'bg-amber-500/10 text-amber-600';
      case 'out-of-stock': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Library</h1>
          <p className="text-muted-foreground mt-1">Manage books and track issues/returns</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Book</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10 text-primary"><BookOpen className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{totalBooks}</p><p className="text-xs text-muted-foreground">Total Books</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><BookCopy className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockBooks.length}</p><p className="text-xs text-muted-foreground">Titles</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10 text-green-600"><ArrowLeftRight className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{totalIssued}</p><p className="text-xs text-muted-foreground">Issued</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><AlertTriangle className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{lowStock}</p><p className="text-xs text-muted-foreground">Low Stock</p></div></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Language">Language</SelectItem>
            <SelectItem value="Social Studies">Social Studies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Book</TableHead><TableHead className="hidden md:table-cell">Category</TableHead><TableHead className="hidden lg:table-cell">ISBN</TableHead><TableHead>Available</TableHead><TableHead className="hidden sm:table-cell">Issued</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((book) => (
                <TableRow key={book.id}>
                  <TableCell><div><p className="font-medium text-sm">{book.title}</p><p className="text-xs text-muted-foreground">{book.author}</p></div></TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline" className="text-xs">{book.category}</Badge></TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{book.isbn}</TableCell>
                  <TableCell><span className="text-sm font-medium">{book.availableCopies}/{book.totalCopies}</span></TableCell>
                  <TableCell className="hidden sm:table-cell">{book.issuedCount}</TableCell>
                  <TableCell><Badge className={cn('text-xs', getStatusColor(book.status))}>{book.status.replace('-', ' ')}</Badge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end"><DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem><DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem><DropdownMenuItem><ArrowLeftRight className="w-4 h-4 mr-2" />Issue/Return</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryPage;
