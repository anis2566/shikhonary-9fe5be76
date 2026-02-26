import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
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

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  onPaymentRecorded: (paymentId: string, amount: number, method: string) => void;
}

const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({
  open, onOpenChange, payment, onPaymentRecorded,
}) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [note, setNote] = useState('');
  const { toast } = useToast();

  if (!payment) return null;

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid payment amount.', variant: 'destructive' });
      return;
    }
    if (numAmount > payment.dueAmount) {
      toast({ title: 'Amount exceeds due', description: `Maximum payable is ৳${payment.dueAmount.toLocaleString()}.`, variant: 'destructive' });
      return;
    }
    if (!method) {
      toast({ title: 'Select method', description: 'Please select a payment method.', variant: 'destructive' });
      return;
    }
    onPaymentRecorded(payment.id, numAmount, method);
    setAmount('');
    setMethod('');
    setNote('');
    onOpenChange(false);
    toast({ title: 'Payment recorded', description: `৳${numAmount.toLocaleString()} received from ${payment.studentName}.` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />Record Payment
          </DialogTitle>
          <DialogDescription>Record a payment for {payment.studentName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Student:</span><p className="font-medium">{payment.studentName}</p></div>
            <div><span className="text-muted-foreground">Class:</span><p className="font-medium">{payment.studentClass}</p></div>
            <div><span className="text-muted-foreground">Total Fee:</span><p className="font-medium">৳{payment.amount.toLocaleString()}</p></div>
            <div><span className="text-muted-foreground">Due Amount:</span><p className="font-medium text-destructive">৳{payment.dueAmount.toLocaleString()}</p></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay-amount">Amount (৳)</Label>
            <Input id="pay-amount" type="number" placeholder={`Max ৳${payment.dueAmount.toLocaleString()}`} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bkash">bKash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay-note">Note (optional)</Label>
            <Input id="pay-note" placeholder="e.g. January installment" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentDialog;
