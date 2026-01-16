import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, ExternalLink } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DataTable, { Column, StatusBadge, TenantTypeBadge } from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateTenantDialog } from '@/components/admin/CreateTenantDialog';
import { Tenant } from '@/types';
import { cn } from '@/lib/utils';

// Mock data
const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'ABC High School',
    slug: 'abc-high-school',
    type: 'SCHOOL',
    subdomain: 'abc-high',
    tenantDatabaseName: 'db_abc',
    tenantDatabaseStatus: 'ACTIVE',
    subscriptionTier: 'PRO',
    subscriptionStatus: 'ACTIVE',
    country: 'BD',
    city: 'Dhaka',
    studentCount: 1250,
    teacherCount: 45,
    examCount: 120,
    storageUsedMB: 450,
    studentLimit: 2000,
    teacherLimit: 100,
    examLimit: 500,
    storageLimit: 1000,
    monthlyPriceBDT: 5000,
    yearlyPriceBDT: 50000,
    customDomainVerified: false,
    isActive: true,
    isSuspended: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'XYZ Coaching Center',
    slug: 'xyz-coaching',
    type: 'COACHING_CENTER',
    subdomain: 'xyz-coaching',
    tenantDatabaseName: 'db_xyz',
    tenantDatabaseStatus: 'ACTIVE',
    subscriptionTier: 'BASIC',
    subscriptionStatus: 'TRIAL',
    trialEndsAt: new Date('2024-03-01'),
    country: 'BD',
    city: 'Chittagong',
    studentCount: 320,
    teacherCount: 12,
    examCount: 45,
    storageUsedMB: 120,
    studentLimit: 500,
    teacherLimit: 20,
    examLimit: 100,
    storageLimit: 500,
    monthlyPriceBDT: 2000,
    yearlyPriceBDT: 20000,
    customDomainVerified: false,
    isActive: true,
    isSuspended: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '3',
    name: "John's Math Academy",
    slug: 'johns-math',
    type: 'INDIVIDUAL',
    subdomain: 'johns-math',
    tenantDatabaseName: 'db_johns',
    tenantDatabaseStatus: 'PROVISIONING',
    subscriptionTier: 'FREE',
    subscriptionStatus: 'TRIAL',
    country: 'BD',
    city: 'Sylhet',
    studentCount: 45,
    teacherCount: 1,
    examCount: 10,
    storageUsedMB: 25,
    studentLimit: 50,
    teacherLimit: 2,
    examLimit: 20,
    storageLimit: 100,
    monthlyPriceBDT: 0,
    yearlyPriceBDT: 0,
    customDomainVerified: false,
    isActive: true,
    isSuspended: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '4',
    name: 'National University',
    slug: 'national-uni',
    type: 'UNIVERSITY',
    subdomain: 'national-uni',
    tenantDatabaseName: 'db_natuni',
    tenantDatabaseStatus: 'ACTIVE',
    subscriptionTier: 'ENTERPRISE',
    subscriptionStatus: 'ACTIVE',
    country: 'BD',
    city: 'Dhaka',
    studentCount: 15000,
    teacherCount: 450,
    examCount: 2500,
    storageUsedMB: 8500,
    studentLimit: 20000,
    teacherLimit: 1000,
    examLimit: 5000,
    storageLimit: 10000,
    monthlyPriceBDT: 25000,
    yearlyPriceBDT: 250000,
    customDomainVerified: true,
    customDomain: 'exams.nationaluni.edu.bd',
    isActive: true,
    isSuspended: false,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

const SubscriptionBadge: React.FC<{ tier: string; status: string }> = ({ tier, status }) => {
  const tierColors: Record<string, string> = {
    FREE: 'bg-muted text-muted-foreground',
    BASIC: 'bg-blue-100 text-blue-700',
    PRO: 'bg-purple-100 text-purple-700',
    ENTERPRISE: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge className={cn('hover:opacity-90 text-xs', tierColors[tier])}>{tier}</Badge>
      {status === 'TRIAL' && (
        <span className="text-xs text-amber-600">Trial</span>
      )}
    </div>
  );
};

const tenantColumns: Column<Tenant>[] = [
  {
    key: 'name',
    header: 'Tenant',
    render: (tenant) => (
      <div className="min-w-0">
        <p className="font-medium text-foreground truncate">{tenant.name}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">{tenant.subdomain}.shikhonary.com</span>
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </div>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    hideOnMobile: true,
    render: (tenant) => <TenantTypeBadge type={tenant.type} />,
  },
  {
    key: 'subscriptionTier',
    header: 'Plan',
    hideOnMobile: true,
    render: (tenant) => (
      <SubscriptionBadge tier={tenant.subscriptionTier} status={tenant.subscriptionStatus} />
    ),
  },
  {
    key: 'usage',
    header: 'Usage',
    hideOnMobile: true,
    render: (tenant) => {
      const usagePercent = Math.round((tenant.studentCount / tenant.studentLimit) * 100);
      return (
        <div className="w-24">
          <div className="flex justify-between text-xs mb-1">
            <span>{tenant.studentCount}</span>
            <span className="text-muted-foreground">/ {tenant.studentLimit}</span>
          </div>
          <Progress value={usagePercent} className="h-1.5" />
        </div>
      );
    },
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (tenant) => <StatusBadge active={tenant.isActive && !tenant.isSuspended} />,
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
          <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
          <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Tenants: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = mockTenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Tenants" subtitle="Manage schools, coaching centers, and more" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
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
            <CreateTenantDialog />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Tenants</p>
            <p className="text-xl sm:text-2xl font-bold">{mockTenants.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {mockTenants.filter((t) => t.isActive).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">On Trial</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-600">
              {mockTenants.filter((t) => t.subscriptionStatus === 'TRIAL').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Enterprise</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">
              {mockTenants.filter((t) => t.subscriptionTier === 'ENTERPRISE').length}
            </p>
          </div>
        </div>

        {/* Tenants Table */}
        <DataTable columns={tenantColumns} data={filteredTenants} />
      </div>
    </div>
  );
};

export default Tenants;
