import React, { useState, useMemo } from 'react';
import { Search, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

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

interface CollectPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: Payment[];
  onStudentSelect: (payment: Payment) => void;
}

const CollectPaymentDialog: React.FC<CollectPaymentDialogProps> = ({
  open, onOpenChange, payments, onStudentSelect,
}) => {
  const [query, setQuery] = useState('');

  const studentsWithDue = useMemo(
    () => payments.filter((p) => p.dueAmount > 0),
    [payments]
  );

  const filtered = useMemo(
    () =>
      studentsWithDue.filter(
        (p) =>
          p.studentName.toLowerCase().includes(query.toLowerCase()) ||
          p.studentClass.toLowerCase().includes(query.toLowerCase())
      ),
    [studentsWithDue, query]
  );

  const handleSelect = (payment: Payment) => {
    setQuery('');
    onOpenChange(false);
    onStudentSelect(payment);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setQuery(''); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />Collect Payment
          </DialogTitle>
          <DialogDescription>Select a student with outstanding dues</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or class..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>
        <div className="max-h-64 overflow-y-auto -mx-1 px-1 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No students with outstanding dues found.</p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className="w-full flex items-center gap-3 rounded-lg p-3 text-left hover:bg-accent transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {p.studentName.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.studentName}</p>
                  <p className="text-xs text-muted-foreground">{p.studentClass} · {p.month}</p>
                </div>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs shrink-0">
                  ৳{p.dueAmount.toLocaleString()}
                </Badge>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectPaymentDialog;
