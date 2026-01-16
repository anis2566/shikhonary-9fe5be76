import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Monitor, Smartphone, Globe } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SessionWithUser {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
}

// Mock data
const mockSessions: SessionWithUser[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Rahim Ahmed',
    userEmail: 'rahim@abc-school.edu',
    ipAddress: '103.145.32.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23), // 23 hours
    isActive: true,
    device: 'desktop',
    browser: 'Chrome 120',
    location: 'Dhaka, BD',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Fatima Khan',
    userEmail: 'fatima@xyz-coaching.com',
    ipAddress: '103.145.32.89',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2) Safari/604.1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22),
    isActive: true,
    device: 'mobile',
    browser: 'Safari iOS',
    location: 'Chittagong, BD',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Karim Hossain',
    userEmail: 'karim@student.edu',
    ipAddress: '103.145.32.120',
    userAgent: 'Mozilla/5.0 (Linux; Android 14) Chrome/120.0',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 19),
    isActive: true,
    device: 'mobile',
    browser: 'Chrome Android',
    location: 'Sylhet, BD',
  },
  {
    id: '4',
    userId: '5',
    userName: 'Admin User',
    userEmail: 'admin@shikhonary.com',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.2',
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 min ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    isActive: true,
    device: 'desktop',
    browser: 'Safari 17',
    location: 'Dhaka, BD',
  },
  {
    id: '5',
    userId: '4',
    userName: 'Nasreen Begum',
    userEmail: 'nasreen@parent.com',
    ipAddress: '103.145.32.200',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0) Edge/120.0',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60), // expired
    isActive: false,
    device: 'desktop',
    browser: 'Edge 120',
    location: 'Rajshahi, BD',
  },
];

const DeviceIcon: React.FC<{ device: string }> = ({ device }) => {
  if (device === 'mobile') return <Smartphone className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const sessionColumns: Column<SessionWithUser>[] = [
  {
    key: 'user',
    header: 'User',
    render: (session) => (
      <div className="min-w-0">
        <p className="font-medium text-foreground truncate">{session.userName}</p>
        <p className="text-xs text-muted-foreground truncate">{session.userEmail}</p>
      </div>
    ),
  },
  {
    key: 'device',
    header: 'Device',
    hideOnMobile: true,
    render: (session) => (
      <div className="flex items-center gap-2">
        <DeviceIcon device={session.device} />
        <span className="text-sm">{session.browser}</span>
      </div>
    ),
  },
  {
    key: 'location',
    header: 'Location',
    hideOnMobile: true,
    render: (session) => (
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-sm">{session.location}</p>
          <p className="text-xs text-muted-foreground">{session.ipAddress}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'createdAt',
    header: 'Started',
    hideOnMobile: true,
    render: (session) => (
      <span className="text-sm text-muted-foreground">{formatTimeAgo(session.createdAt)}</span>
    ),
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (session) => (
      <Badge
        className={cn(
          'hover:opacity-90',
          session.isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {session.isActive ? 'Active' : 'Expired'}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: '',
    className: 'w-10',
    render: (session) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          {session.isActive && (
            <DropdownMenuItem className="text-destructive">Revoke Session</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Sessions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = mockSessions.filter(
    (session) =>
      session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ipAddress.includes(searchQuery)
  );

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Sessions" subtitle="Monitor active user sessions" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 w-fit">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-xl sm:text-2xl font-bold">{mockSessions.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Active Now</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {mockSessions.filter((s) => s.isActive).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Desktop</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {mockSessions.filter((s) => s.device === 'desktop').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Mobile</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">
              {mockSessions.filter((s) => s.device === 'mobile').length}
            </p>
          </div>
        </div>

        {/* Sessions Table */}
        <DataTable columns={sessionColumns} data={filteredSessions} />
      </div>
    </div>
  );
};

export default Sessions;
