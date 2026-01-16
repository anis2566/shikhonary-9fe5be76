import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Calendar } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DataTable, { Column, StatusBadge, RoleBadge } from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rahim Ahmed',
    email: 'rahim@abc-school.edu',
    emailVerified: true,
    role: 'TENANT_ADMIN',
    isActive: true,
    tenantId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Fatima Khan',
    email: 'fatima@xyz-coaching.com',
    emailVerified: true,
    role: 'TEACHER',
    isActive: true,
    tenantId: '2',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '3',
    name: 'Karim Hossain',
    email: 'karim@student.edu',
    emailVerified: false,
    role: 'STUDENT',
    isActive: true,
    tenantId: '1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    name: 'Nasreen Begum',
    email: 'nasreen@parent.com',
    emailVerified: true,
    role: 'PARENT',
    isActive: false,
    tenantId: '1',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@shikhonary.com',
    emailVerified: true,
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const userColumns: Column<User>[] = [
  {
    key: 'name',
    header: 'User',
    render: (user) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.image} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    hideOnMobile: true,
    render: (user) => <RoleBadge role={user.role} />,
  },
  {
    key: 'emailVerified',
    header: 'Verified',
    hideOnMobile: true,
    render: (user) => (
      <span className={user.emailVerified ? 'text-green-600' : 'text-amber-600'}>
        {user.emailVerified ? '✓ Verified' : '○ Pending'}
      </span>
    ),
  },
  {
    key: 'createdAt',
    header: 'Joined',
    hideOnMobile: true,
    render: (user) => (
      <span className="text-sm text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (user) => <StatusBadge active={user.isActive} />,
  },
  {
    key: 'actions',
    header: '',
    className: 'w-10',
    render: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit User</DropdownMenuItem>
          <DropdownMenuItem>Reset Password</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Users" subtitle="Manage all platform users" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add User</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
            <p className="text-xl sm:text-2xl font-bold">{mockUsers.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {mockUsers.filter((u) => u.isActive).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Verified</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {mockUsers.filter((u) => u.emailVerified).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Admins</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">
              {mockUsers.filter((u) => u.role.includes('ADMIN')).length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <DataTable columns={userColumns} data={filteredUsers} />
      </div>
    </div>
  );
};

export default Users;
