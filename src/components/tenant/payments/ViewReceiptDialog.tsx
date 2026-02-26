import React from 'react';
import { Receipt, Download, CheckCircle2, Clock, CreditCard, ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
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

export interface TransactionEntry {
  id: string;
  amount: number;
  method: string;
  date: string;
  receiptNo: string;
  note?: string;
}

interface ViewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  transactionHistory?: TransactionEntry[];
}

const methodIcon: Record<string, React.ReactNode> = {
  bkash: <CreditCard className="w-3.5 h-3.5" />,
  nagad: <CreditCard className="w-3.5 h-3.5" />,
  bank: <ArrowDownCircle className="w-3.5 h-3.5" />,
  card: <CreditCard className="w-3.5 h-3.5" />,
  cash: <CheckCircle2 className="w-3.5 h-3.5" />,
};

const ViewReceiptDialog: React.FC<ViewReceiptDialogProps> = ({ open, onOpenChange, payment, transactionHistory = [] }) => {
  const { toast } = useToast();

  if (!payment) return null;

  const statusColor = {
    paid: 'bg-green-500/10 text-green-600 border-green-200',
    partial: 'bg-amber-500/10 text-amber-600 border-amber-200',
    pending: 'bg-blue-500/10 text-blue-600 border-blue-200',
    overdue: 'bg-destructive/10 text-destructive border-destructive/20',
  }[payment.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />Payment Receipt
          </DialogTitle>
          <DialogDescription>Receipt #{payment.receiptNo}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Receipt details */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Receipt No</span>
              <span className="font-mono font-medium text-sm">{payment.receiptNo}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Student</span>
              <span className="font-medium text-sm">{payment.studentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Class</span>
              <span className="text-sm">{payment.studentClass}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Month</span>
              <span className="text-sm">{payment.month}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Fee</span>
              <span className="text-sm">৳{payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Paid</span>
              <span className="text-sm font-medium text-green-600">৳{payment.paidAmount.toLocaleString()}</span>
            </div>
            {payment.dueAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Due</span>
                <span className="text-sm font-medium text-destructive">৳{payment.dueAmount.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Method</span>
              <Badge variant="outline" className="capitalize text-xs">{payment.method}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm">{payment.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline" className={cn('text-xs capitalize', statusColor)}>{payment.status}</Badge>
            </div>
          </div>

          {/* Transaction History Timeline */}
          {transactionHistory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold text-foreground">Payment History</h4>
                <Badge variant="secondary" className="text-xs">{transactionHistory.length}</Badge>
              </div>
              <div className="relative pl-5 space-y-0">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {transactionHistory.map((tx, i) => (
                  <div key={tx.id} className="relative flex gap-3 pb-4 last:pb-0">
                    {/* Timeline dot */}
                    <div className={cn(
                      'absolute left-[-13px] top-1.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center',
                      i === 0
                        ? 'bg-primary border-primary'
                        : 'bg-background border-muted-foreground/30'
                    )}>
                      {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                    {/* Content */}
                    <div className="flex-1 rounded-lg border bg-card p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">৳{tx.amount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">{tx.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize gap-1">
                          {methodIcon[tx.method] || <CreditCard className="w-3 h-3" />}
                          {tx.method}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">{tx.receiptNo}</span>
                      </div>
                      {tx.note && <p className="text-xs text-muted-foreground">{tx.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => toast({ title: 'Download started', description: 'Receipt PDF is being generated.' })}>
            <Download className="w-4 h-4 mr-2" />Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReceiptDialog;
