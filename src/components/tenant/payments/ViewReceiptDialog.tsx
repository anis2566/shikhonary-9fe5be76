import React from 'react';
import { Receipt, Download } from 'lucide-react';
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

interface ViewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

const ViewReceiptDialog: React.FC<ViewReceiptDialogProps> = ({ open, onOpenChange, payment }) => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />Payment Receipt
          </DialogTitle>
          <DialogDescription>Receipt #{payment.receiptNo}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
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
