import React, { useState } from 'react';
import {
  Bell,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Users,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FeeReminder {
  id: string;
  studentName: string;
  studentClass: string;
  guardianPhone: string;
  dueAmount: number;
  dueDate: string;
  reminderType: 'sms' | 'whatsapp' | 'email' | 'all';
  status: 'sent' | 'pending' | 'failed' | 'scheduled';
  sentAt?: string;
  message: string;
}

const mockReminders: FeeReminder[] = [
  { id: 'r-1', studentName: 'Karim Hossain', studentClass: 'Class 9-B', guardianPhone: '+8801712345678', dueAmount: 10800, dueDate: '2024-01-31', reminderType: 'sms', status: 'sent', sentAt: '2024-01-20 10:30 AM', message: 'Fee payment of ৳10,800 is due by Jan 31.' },
  { id: 'r-2', studentName: 'Tanvir Islam', studentClass: 'Class 12-A', guardianPhone: '+8801798765432', dueAmount: 16800, dueDate: '2024-01-15', reminderType: 'whatsapp', status: 'sent', sentAt: '2024-01-10 09:00 AM', message: 'Overdue fee of ৳16,800 requires immediate attention.' },
  { id: 'r-3', studentName: 'Sakib Hasan', studentClass: 'Class 9-A', guardianPhone: '+8801655443322', dueAmount: 7000, dueDate: '2024-02-05', reminderType: 'all', status: 'scheduled', message: 'Remaining fee of ৳7,000 is due by Feb 5.' },
  { id: 'r-4', studentName: 'Riya Das', studentClass: 'Class 10-A', guardianPhone: '+8801899887766', dueAmount: 14000, dueDate: '2024-01-25', reminderType: 'email', status: 'failed', message: 'Fee payment of ৳14,000 is due by Jan 25.' },
  { id: 'r-5', studentName: 'Arif Mian', studentClass: 'Class 11-B', guardianPhone: '+8801733445566', dueAmount: 8050, dueDate: '2024-02-10', reminderType: 'sms', status: 'pending', message: 'Partial fee of ৳8,050 due by Feb 10.' },
];

const FeeRemindersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [autoReminder, setAutoReminder] = useState(true);

  const filtered = mockReminders.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sentCount = mockReminders.filter((r) => r.status === 'sent').length;
  const scheduledCount = mockReminders.filter((r) => r.status === 'scheduled').length;
  const totalDue = mockReminders.reduce((a, r) => a + r.dueAmount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500/10 text-green-600';
      case 'scheduled': return 'bg-blue-500/10 text-blue-600';
      case 'pending': return 'bg-amber-500/10 text-amber-600';
      case 'failed': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'scheduled': return <Clock className="w-3.5 h-3.5" />;
      case 'pending': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'failed': return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Fee Reminders</h1>
          <p className="text-muted-foreground mt-1">Send and manage payment reminders to guardians</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
            <span className="text-xs text-muted-foreground">Auto-remind</span>
            <Switch checked={autoReminder} onCheckedChange={setAutoReminder} />
          </div>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Send className="w-4 h-4 mr-2" />
            Send Reminder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10 text-primary"><MessageSquare className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockReminders.length}</p><p className="text-xs text-muted-foreground">Total Reminders</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10 text-green-600"><CheckCircle2 className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{sentCount}</p><p className="text-xs text-muted-foreground">Sent</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><Clock className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{scheduledCount}</p><p className="text-xs text-muted-foreground">Scheduled</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><AlertTriangle className="w-5 h-5" /></div><div><p className="text-2xl font-bold">৳{(totalDue / 1000).toFixed(0)}K</p><p className="text-xs text-muted-foreground">Total Due</p></div></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reminder Cards */}
      <div className="space-y-3">
        {filtered.map((reminder) => (
          <Card key={reminder.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{reminder.studentName.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{reminder.studentName}</p>
                      <Badge variant="outline" className="text-xs">{reminder.studentClass}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{reminder.message}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Due: ৳{reminder.dueAmount.toLocaleString()}</span>
                      <span>•</span>
                      <span>By: {new Date(reminder.dueDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{reminder.reminderType}</span>
                      {reminder.sentAt && <><span>•</span><span>Sent: {reminder.sentAt}</span></>}
                    </div>
                  </div>
                </div>
                <Badge className={cn('text-xs gap-1', getStatusColor(reminder.status))}>
                  {getStatusIcon(reminder.status)}
                  {reminder.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card><CardContent className="p-8 text-center"><Bell className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" /><p className="text-muted-foreground">No reminders found.</p></CardContent></Card>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Fee Reminder</DialogTitle>
            <DialogDescription>Send payment reminders to guardians</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Target</Label>
              <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select students" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-due">All with pending dues</SelectItem>
                  <SelectItem value="overdue">Overdue only</SelectItem>
                  <SelectItem value="specific">Specific student</SelectItem>
                </SelectContent></Select>
            </div>
            <div><Label>Channel</Label>
              <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select channel" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="all">All Channels</SelectItem>
                </SelectContent></Select>
            </div>
            <div><Label>Message</Label><Textarea placeholder="Enter reminder message..." className="mt-1.5" rows={3} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => { setIsCreateOpen(false); toast({ title: 'Reminders Sent', description: 'Payment reminders have been sent to guardians.' }); }}>
                <Send className="w-4 h-4 mr-2" />Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeeRemindersPage;
