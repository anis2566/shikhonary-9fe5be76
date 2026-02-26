import React, { useState } from 'react';
import {
  Activity,
  Search,
  Download,
  Filter,
  User,
  Settings,
  FileText,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  action: string;
  category: 'auth' | 'data' | 'settings' | 'user' | 'exam' | 'payment';
  user: string;
  userRole: string;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: 'al-1', action: 'Login', category: 'auth', user: 'Admin User', userRole: 'Tenant Admin', target: 'System', details: 'Successful login', ipAddress: '192.168.1.100', timestamp: '2024-01-20 10:30:00' },
  { id: 'al-2', action: 'Create Student', category: 'data', user: 'Admin User', userRole: 'Tenant Admin', target: 'Rahim Ahmed', details: 'New student enrolled in Class 9-A', ipAddress: '192.168.1.100', timestamp: '2024-01-20 10:45:00' },
  { id: 'al-3', action: 'Update Settings', category: 'settings', user: 'Admin User', userRole: 'Tenant Admin', target: 'Notification Settings', details: 'Enabled SMS notifications', ipAddress: '192.168.1.100', timestamp: '2024-01-20 11:00:00' },
  { id: 'al-4', action: 'Delete Exam', category: 'exam', user: 'Teacher A', userRole: 'Teacher', target: 'Weekly Test - Physics', details: 'Deleted draft exam', ipAddress: '192.168.1.105', timestamp: '2024-01-19 16:30:00' },
  { id: 'al-5', action: 'Record Payment', category: 'payment', user: 'Admin User', userRole: 'Tenant Admin', target: 'Fatima Khan', details: 'Recorded ৳7,000 payment via bKash', ipAddress: '192.168.1.100', timestamp: '2024-01-19 14:20:00' },
  { id: 'al-6', action: 'Update Role', category: 'user', user: 'Admin User', userRole: 'Tenant Admin', target: 'Teacher B', details: 'Changed role from Teacher to Head of Dept', ipAddress: '192.168.1.100', timestamp: '2024-01-19 12:00:00' },
  { id: 'al-7', action: 'Logout', category: 'auth', user: 'Teacher A', userRole: 'Teacher', target: 'System', details: 'Session ended', ipAddress: '192.168.1.105', timestamp: '2024-01-19 17:00:00' },
  { id: 'al-8', action: 'Export Data', category: 'data', user: 'Admin User', userRole: 'Tenant Admin', target: 'Student List', details: 'Exported 156 student records to CSV', ipAddress: '192.168.1.100', timestamp: '2024-01-18 15:45:00' },
  { id: 'al-9', action: 'Create Exam', category: 'exam', user: 'Teacher A', userRole: 'Teacher', target: 'Monthly Test - Chemistry', details: 'Created new exam with 30 MCQs', ipAddress: '192.168.1.105', timestamp: '2024-01-18 10:30:00' },
  { id: 'al-10', action: 'Login Failed', category: 'auth', user: 'Unknown', userRole: 'N/A', target: 'System', details: 'Invalid credentials for admin@school.com', ipAddress: '203.45.67.89', timestamp: '2024-01-18 03:15:00' },
];

const getActionIcon = (category: string) => {
  switch (category) {
    case 'auth': return <LogIn className="w-4 h-4" />;
    case 'data': return <FileText className="w-4 h-4" />;
    case 'settings': return <Settings className="w-4 h-4" />;
    case 'user': return <User className="w-4 h-4" />;
    case 'exam': return <Edit className="w-4 h-4" />;
    case 'payment': return <Activity className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'auth': return 'bg-blue-500/10 text-blue-600';
    case 'data': return 'bg-green-500/10 text-green-600';
    case 'settings': return 'bg-purple-500/10 text-purple-600';
    case 'user': return 'bg-amber-500/10 text-amber-600';
    case 'exam': return 'bg-primary/10 text-primary';
    case 'payment': return 'bg-emerald-500/10 text-emerald-600';
    default: return 'bg-muted text-muted-foreground';
  }
};

const AuditLogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = mockAuditLogs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground mt-1">Track all system activities and changes</p>
        </div>
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export Logs</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Activity className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockAuditLogs.length}</p><p className="text-xs text-muted-foreground">Total Events</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><LogIn className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockAuditLogs.filter((l) => l.category === 'auth').length}</p><p className="text-xs text-muted-foreground">Auth Events</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10 text-green-600"><FileText className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockAuditLogs.filter((l) => l.category === 'data').length}</p><p className="text-xs text-muted-foreground">Data Changes</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><Shield className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockAuditLogs.filter((l) => l.action.includes('Failed')).length}</p><p className="text-xs text-muted-foreground">Suspicious</p></div></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="auth">Authentication</SelectItem>
            <SelectItem value="data">Data</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="exam">Exam</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg', getCategoryColor(log.category))}>
                  {getActionIcon(log.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{log.action}</p>
                      <Badge variant="outline" className="text-xs capitalize">{log.category}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{log.details}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{log.user} ({log.userRole})</span>
                    <span>→ {log.target}</span>
                    <span className="ml-auto">IP: {log.ipAddress}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuditLogPage;
