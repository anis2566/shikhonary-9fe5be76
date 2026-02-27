import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, DollarSign, CheckCircle2, Clock, AlertTriangle, XCircle,
  CreditCard, ArrowDownCircle, Download, User, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import RecordPaymentDialog from '@/components/tenant/payments/RecordPaymentDialog';
import { useToast } from '@/hooks/use-toast';

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

interface TransactionEntry {
  id: string;
  amount: number;
  method: string;
  date: string;
  receiptNo: string;
  note?: string;
  month: string;
}

// Mock data for a single student's multi-month fee history
const generateStudentData = (studentId: string) => {
  const students: Record<string, { name: string; class: string; roll: string; phone: string }> = {
    'rahim-ahmed': { name: 'Rahim Ahmed', class: 'Class 9-A', roll: '09A-12', phone: '01712345678' },
    'fatima-khan': { name: 'Fatima Khan', class: 'Class 10-B', roll: '10B-05', phone: '01812345678' },
    'karim-hossain': { name: 'Karim Hossain', class: 'Class 9-B', roll: '09B-08', phone: '01912345678' },
    'nusrat-jahan': { name: 'Nusrat Jahan', class: 'Class 11-A', roll: '11A-03', phone: '01612345678' },
    'tanvir-islam': { name: 'Tanvir Islam', class: 'Class 12-A', roll: '12A-15', phone: '01512345678' },
  };

  const student = students[studentId] || { name: 'Unknown Student', class: 'N/A', roll: 'N/A', phone: 'N/A' };

  const months: Payment[] = [
    { id: `${studentId}-jan`, studentName: student.name, studentClass: student.class, amount: 12000, paidAmount: 12000, dueAmount: 0, method: 'bkash', status: 'paid', date: '2024-01-15', receiptNo: 'RCP-101', month: 'January 2024' },
    { id: `${studentId}-feb`, studentName: student.name, studentClass: student.class, amount: 12000, paidAmount: 12000, dueAmount: 0, method: 'bank', status: 'paid', date: '2024-02-12', receiptNo: 'RCP-145', month: 'February 2024' },
    { id: `${studentId}-mar`, studentName: student.name, studentClass: student.class, amount: 12000, paidAmount: 12000, dueAmount: 0, method: 'cash', status: 'paid', date: '2024-03-10', receiptNo: 'RCP-198', month: 'March 2024' },
    { id: `${studentId}-apr`, studentName: student.name, studentClass: student.class, amount: 12000, paidAmount: 8000, dueAmount: 4000, method: 'bkash', status: 'partial', date: '2024-04-14', receiptNo: 'RCP-230', month: 'April 2024' },
    { id: `${studentId}-may`, studentName: student.name, studentClass: student.class, amount: 12000, paidAmount: 0, dueAmount: 12000, method: 'cash', status: 'pending', date: '-', receiptNo: '-', month: 'May 2024' },
    { id: `${studentId}-jun`, studentName: student.name, studentClass: student.class, amount: 12000, paidAmount: 0, dueAmount: 12000, method: 'cash', status: 'overdue', date: '-', receiptNo: '-', month: 'June 2024' },
  ];

  const transactions: TransactionEntry[] = [
    { id: 'tx-1', amount: 12000, method: 'bkash', date: '2024-01-15', receiptNo: 'RCP-101', month: 'January 2024' },
    { id: 'tx-2', amount: 12000, method: 'bank', date: '2024-02-12', receiptNo: 'RCP-145', month: 'February 2024' },
    { id: 'tx-3', amount: 12000, method: 'cash', date: '2024-03-10', receiptNo: 'RCP-198', month: 'March 2024' },
    { id: 'tx-4', amount: 8000, method: 'bkash', date: '2024-04-14', receiptNo: 'RCP-230', note: 'Partial — remaining ৳4,000 due', month: 'April 2024' },
  ];

  return { student, months, transactions };
};

const methodIcon: Record<string, React.ReactNode> = {
  bkash: <CreditCard className="w-3.5 h-3.5" />,
  nagad: <CreditCard className="w-3.5 h-3.5" />,
  bank: <ArrowDownCircle className="w-3.5 h-3.5" />,
  card: <CreditCard className="w-3.5 h-3.5" />,
  cash: <CheckCircle2 className="w-3.5 h-3.5" />,
};

const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  paid: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'bg-green-500/10 text-green-600 border-green-200' },
  partial: { icon: <Clock className="w-3.5 h-3.5" />, color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  pending: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  overdue: { icon: <XCircle className="w-3.5 h-3.5" />, color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const StudentPaymentDetails: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { student, months: initialMonths, transactions: initialTx } = useMemo(
    () => generateStudentData(studentId || ''),
    [studentId]
  );

  const [months, setMonths] = useState<Payment[]>(initialMonths);
  const [transactions, setTransactions] = useState<TransactionEntry[]>(initialTx);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Payment | null>(null);

  const totalFee = months.reduce((s, m) => s + m.amount, 0);
  const totalPaid = months.reduce((s, m) => s + m.paidAmount, 0);
  const totalDue = months.reduce((s, m) => s + m.dueAmount, 0);
  const paidPercentage = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0;

  const handleRecordPayment = useCallback((paymentId: string, amount: number, method: string) => {
    const today = new Date().toISOString().split('T')[0];
    const receiptNo = `RCP-${Date.now().toString().slice(-4)}`;
    const monthEntry = months.find((m) => m.id === paymentId);

    setTransactions((prev) => [
      { id: `tx-${Date.now()}`, amount, method, date: today, receiptNo, month: monthEntry?.month || '', note: amount < (monthEntry?.dueAmount || 0) ? `Partial payment` : undefined },
      ...prev,
    ]);

    setMonths((prev) =>
      prev.map((m) => {
        if (m.id !== paymentId) return m;
        const newPaid = m.paidAmount + amount;
        const newDue = m.amount - newPaid;
        return { ...m, paidAmount: newPaid, dueAmount: newDue, method: method as Payment['method'], status: newDue <= 0 ? 'paid' : 'partial', date: today, receiptNo: m.receiptNo === '-' ? receiptNo : m.receiptNo };
      })
    );

    toast({ title: 'Payment recorded', description: `৳${amount.toLocaleString()} received for ${monthEntry?.month}` });
  }, [months, toast]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/payments')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payment Details</h1>
          <p className="text-muted-foreground mt-0.5">Full fee history & balance</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast({ title: 'Export started', description: 'Generating payment report...' })}>
          <Download className="w-4 h-4 mr-2" />Export
        </Button>
      </div>

      {/* Student Info + Balance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {student.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-foreground">{student.name}</h2>
                <p className="text-sm text-muted-foreground">{student.class} · Roll {student.roll}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{student.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Months Covered</span><span>{months.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Months Paid</span><span className="text-green-600 font-medium">{months.filter(m => m.status === 'paid').length}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Balance summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Balance Summary</CardTitle>
            <CardDescription>Overall payment progress across all months</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">৳{totalFee.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Fee</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-500/5">
                <p className="text-2xl font-bold text-green-600">৳{totalPaid.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Paid</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-destructive/5">
                <p className="text-2xl font-bold text-destructive">৳{totalDue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Outstanding</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collection Progress</span>
                <span className="font-medium">{paidPercentage}%</span>
              </div>
              <Progress value={paidPercentage} className="h-2.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Fee Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Monthly Fee Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {months.map((m) => {
            const cfg = statusConfig[m.status];
            const pct = m.amount > 0 ? Math.round((m.paidAmount / m.amount) * 100) : 0;
            return (
              <div key={m.id} className="flex items-center gap-4 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{m.month}</span>
                    <Badge variant="outline" className={cn('text-xs gap-1 capitalize', cfg.color)}>
                      {cfg.icon}{m.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <Progress value={pct} className="h-1.5 flex-1 max-w-[200px]" />
                    <span className="text-xs text-muted-foreground">
                      ৳{m.paidAmount.toLocaleString()} / ৳{m.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                {m.dueAmount > 0 ? (
                  <Button size="sm" variant="outline" onClick={() => { setSelectedMonth(m); setRecordDialogOpen(true); }}>
                    <CreditCard className="w-3.5 h-3.5 mr-1.5" />Pay ৳{m.dueAmount.toLocaleString()}
                  </Button>
                ) : (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />Cleared
                  </span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Payment Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Payment Timeline</CardTitle>
            <Badge variant="secondary" className="text-xs">{transactions.length} transactions</Badge>
          </div>
          <CardDescription>Chronological log of all payments</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No payments recorded yet.</p>
          ) : (
            <div className="relative pl-6 space-y-0">
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
              {transactions.map((tx, i) => (
                <div key={tx.id} className="relative flex gap-3 pb-4 last:pb-0">
                  <div className={cn(
                    'absolute left-[-15px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    i === 0 ? 'bg-primary border-primary' : 'bg-background border-muted-foreground/30'
                  )}>
                    {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                  </div>
                  <div className="flex-1 rounded-lg border bg-card p-3 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">৳{tx.amount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{tx.date}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs capitalize gap-1">
                        {methodIcon[tx.method] || <CreditCard className="w-3 h-3" />}
                        {tx.method}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">{tx.receiptNo}</span>
                      <Badge variant="secondary" className="text-xs">{tx.month}</Badge>
                    </div>
                    {tx.note && <p className="text-xs text-muted-foreground">{tx.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Payment Dialog */}
      <RecordPaymentDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        payment={selectedMonth}
        onPaymentRecorded={handleRecordPayment}
      />
    </div>
  );
};

export default StudentPaymentDetails;
