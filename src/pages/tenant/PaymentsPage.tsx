import React, { useState } from 'react';
import {
  DollarSign, Search, Download, CheckCircle2, Clock, AlertTriangle, XCircle, Eye, MoreHorizontal, CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import RecordPaymentDialog from '@/components/tenant/payments/RecordPaymentDialog';
import ViewReceiptDialog from '@/components/tenant/payments/ViewReceiptDialog';

interface Payment {
  id: string;
  studentName: string;
  studentClass: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  method: 'cash' | 'bank' | 'bkash' | 'nagad' | 'card';
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  date: string;
  receiptNo: string;
  month: string;
}

const initialPayments: Payment[] = [
  { id: 'p-1', studentName: 'Rahim Ahmed', studentClass: 'Class 9-A', amount: 12000, paidAmount: 12000, dueAmount: 0, method: 'bkash', status: 'paid', date: '2024-01-15', receiptNo: 'RCP-001', month: 'January' },
  { id: 'p-2', studentName: 'Fatima Khan', studentClass: 'Class 10-B', amount: 14000, paidAmount: 7000, dueAmount: 7000, method: 'bank', status: 'partial', date: '2024-01-12', receiptNo: 'RCP-002', month: 'January' },
  { id: 'p-3', studentName: 'Karim Hossain', studentClass: 'Class 9-B', amount: 10800, paidAmount: 0, dueAmount: 10800, method: 'cash', status: 'pending', date: '-', receiptNo: '-', month: 'January' },
  { id: 'p-4', studentName: 'Nusrat Jahan', studentClass: 'Class 11-A', amount: 16100, paidAmount: 16100, dueAmount: 0, method: 'nagad', status: 'paid', date: '2024-01-10', receiptNo: 'RCP-003', month: 'January' },
  { id: 'p-5', studentName: 'Tanvir Islam', studentClass: 'Class 12-A', amount: 16800, paidAmount: 0, dueAmount: 16800, method: 'cash', status: 'overdue', date: '-', receiptNo: '-', month: 'December' },
  { id: 'p-6', studentName: 'Aisha Rahman', studentClass: 'Class 10-A', amount: 14000, paidAmount: 14000, dueAmount: 0, method: 'card', status: 'paid', date: '2024-01-14', receiptNo: 'RCP-004', month: 'January' },
  { id: 'p-7', studentName: 'Sakib Hasan', studentClass: 'Class 9-A', amount: 12000, paidAmount: 5000, dueAmount: 7000, method: 'bkash', status: 'partial', date: '2024-01-08', receiptNo: 'RCP-005', month: 'January' },
  { id: 'p-8', studentName: 'Maliha Chowdhury', studentClass: 'Class 11-B', amount: 16100, paidAmount: 16100, dueAmount: 0, method: 'bank', status: 'paid', date: '2024-01-05', receiptNo: 'RCP-006', month: 'January' },
];

const monthlyCollection = [
  { month: 'Aug', collected: 450000, target: 520000 },
  { month: 'Sep', collected: 480000, target: 520000 },
  { month: 'Oct', collected: 510000, target: 520000 },
  { month: 'Nov', collected: 460000, target: 520000 },
  { month: 'Dec', collected: 390000, target: 520000 },
  { month: 'Jan', collected: 420000, target: 520000 },
];

let receiptCounter = 7;

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filtered = payments.filter((p) => {
    const matchesSearch = p.studentName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments.reduce((a, p) => a + p.paidAmount, 0);
  const totalDue = payments.reduce((a, p) => a + p.dueAmount, 0);
  const paidCount = payments.filter((p) => p.status === 'paid').length;
  const overdueCount = payments.filter((p) => p.status === 'overdue').length;

  const handleRecordPayment = (paymentId: string, amount: number, method: string) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id !== paymentId) return p;
        const newPaid = p.paidAmount + amount;
        const newDue = p.amount - newPaid;
        receiptCounter++;
        return {
          ...p,
          paidAmount: newPaid,
          dueAmount: newDue,
          method: method as Payment['method'],
          status: newDue <= 0 ? 'paid' : 'partial',
          date: new Date().toISOString().split('T')[0],
          receiptNo: p.receiptNo === '-' ? `RCP-${String(receiptCounter).padStart(3, '0')}` : p.receiptNo,
        };
      })
    );
  };

  const openRecordDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setRecordDialogOpen(true);
  };

  const openReceiptDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setReceiptDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'partial': return <Clock className="w-3.5 h-3.5" />;
      case 'pending': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'overdue': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'partial': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'pending': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'overdue': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Track and manage student fee payments</p>
        </div>
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10 text-green-600"><DollarSign className="w-5 h-5" /></div><div><p className="text-2xl font-bold">৳{(totalCollected / 1000).toFixed(0)}K</p><p className="text-xs text-muted-foreground">Collected</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-destructive/10 text-destructive"><AlertTriangle className="w-5 h-5" /></div><div><p className="text-2xl font-bold">৳{(totalDue / 1000).toFixed(0)}K</p><p className="text-xs text-muted-foreground">Outstanding</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10 text-primary"><CheckCircle2 className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{paidCount}</p><p className="text-xs text-muted-foreground">Fully Paid</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><XCircle className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{overdueCount}</p><p className="text-xs text-muted-foreground">Overdue</p></div></div></CardContent></Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Monthly Collection</CardTitle>
          <CardDescription>Fee collection vs target over months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCollection}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => `৳${v.toLocaleString()}`} />
                <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by student..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell">Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Paid</TableHead>
                <TableHead className="hidden lg:table-cell">Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{p.studentName.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                      <div><p className="font-medium text-sm">{p.studentName}</p><p className="text-xs text-muted-foreground">{p.studentClass}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{p.month}</TableCell>
                  <TableCell><span className="text-sm font-medium">৳{p.amount.toLocaleString()}</span></TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div>
                      <span className="text-sm font-medium">৳{p.paidAmount.toLocaleString()}</span>
                      {p.dueAmount > 0 && <p className="text-xs text-destructive">Due: ৳{p.dueAmount.toLocaleString()}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline" className="text-xs capitalize">{p.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs gap-1', getStatusColor(p.status))}>
                      {getStatusIcon(p.status)}{p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openReceiptDialog(p)}><Eye className="w-4 h-4 mr-2" />View Receipt</DropdownMenuItem>
                        {p.dueAmount > 0 && (
                          <DropdownMenuItem onClick={() => openRecordDialog(p)}><CreditCard className="w-4 h-4 mr-2" />Record Payment</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <RecordPaymentDialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen} payment={selectedPayment} onPaymentRecorded={handleRecordPayment} />
      <ViewReceiptDialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen} payment={selectedPayment} />
    </div>
  );
};

export default PaymentsPage;
