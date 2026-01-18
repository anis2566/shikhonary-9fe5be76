import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, ExternalLink, Plus, Building2, Users, GraduationCap, Database } from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tenant, TenantDatabaseStatus, SubscriptionStatus, SubscriptionTier } from '@/types';
import { cn } from '@/lib/utils';
import { mockTenants } from '@/lib/mock-data';

const SubscriptionBadge: React.FC<{ tier: SubscriptionTier; status: SubscriptionStatus }> = ({ tier, status }) => {
  const tierColors: Record<SubscriptionTier, string> = {
    FREE: 'bg-muted text-muted-foreground',
    STARTER: 'bg-blue-100 text-blue-700',
    PRO: 'bg-purple-100 text-purple-700',
    ENTERPRISE: 'bg-amber-100 text-amber-700',
  };

  const statusColors: Record<SubscriptionStatus, string> = {
    TRIAL: 'text-amber-600',
    ACTIVE: 'text-green-600',
    PAST_DUE: 'text-red-600',
    CANCELED: 'text-muted-foreground',
    EXPIRED: 'text-red-600',
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge className={cn('hover:opacity-90 text-xs', tierColors[tier])}>{tier}</Badge>
      <span className={cn('text-xs', statusColors[status])}>{status.replace('_', ' ')}</span>
    </div>
  );
};

const DatabaseStatusBadge: React.FC<{ status: TenantDatabaseStatus }> = ({ status }) => {
  const statusConfig: Record<TenantDatabaseStatus, { color: string; label: string }> = {
    PROVISIONING: { color: 'bg-amber-100 text-amber-700', label: 'Provisioning' },
    ACTIVE: { color: 'bg-green-100 text-green-700', label: 'Active' },
    MIGRATING: { color: 'bg-blue-100 text-blue-700', label: 'Migrating' },
    DELETING: { color: 'bg-red-100 text-red-700', label: 'Deleting' },
    DELETED: { color: 'bg-muted text-muted-foreground', label: 'Deleted' },
    FAILED: { color: 'bg-red-100 text-red-700', label: 'Failed' },
  };

  const config = statusConfig[status];
  return (
    <Badge className={cn('hover:opacity-90 text-xs', config.color)}>{config.label}</Badge>
  );
};

const Tenants: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredTenants = mockTenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tenantColumns: Column<Tenant>[] = [
    {
      key: 'name',
      header: 'Tenant',
      render: (tenant) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{tenant.name}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="truncate">{tenant.subdomain}.shikhonary.com</span>
            {tenant.customDomainVerified && tenant.customDomain && (
              <>
                <span className="mx-1">•</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </>
            )}
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
      key: 'tenantDatabaseStatus',
      header: 'Database',
      hideOnMobile: true,
      render: (tenant) => <DatabaseStatusBadge status={tenant.tenantDatabaseStatus} />,
    },
    {
      key: 'usage',
      header: 'Usage',
      hideOnMobile: true,
      render: (tenant) => {
        const studentPercent = Math.round((tenant.studentCount / tenant.studentLimit) * 100);
        const storagePercent = Math.round((tenant.storageUsedMB / tenant.storageLimit) * 100);
        return (
          <div className="w-28 space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {tenant.studentCount}
                </span>
                <span className="text-muted-foreground">/ {tenant.studentLimit}</span>
              </div>
              <Progress value={studentPercent} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {tenant.storageUsedMB}MB
                </span>
                <span className="text-muted-foreground">/ {tenant.storageLimit}MB</span>
              </div>
              <Progress value={storagePercent} className="h-1" />
            </div>
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
      render: (tenant) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/admin/tenants/${tenant.id}`)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/tenants/${tenant.id}/edit`)}>
              Edit Tenant
            </DropdownMenuItem>
            <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              {tenant.isSuspended ? 'Unsuspend' : 'Suspend'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate stats
  const totalTenants = mockTenants.length;
  const activeTenants = mockTenants.filter((t) => t.isActive && !t.isSuspended).length;
  const trialTenants = mockTenants.filter((t) => t.subscriptionStatus === 'TRIAL').length;
  const enterpriseTenants = mockTenants.filter((t) => t.subscriptionTier === 'ENTERPRISE').length;
  const totalStudents = mockTenants.reduce((sum, t) => sum + t.studentCount, 0);
  const totalTeachers = mockTenants.reduce((sum, t) => sum + t.teacherCount, 0);

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Tenants" subtitle="Manage schools, coaching centers, and more" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants by name, subdomain, or email..."
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
            <Button size="sm" className="gap-2" onClick={() => navigate('/admin/tenants/create')}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Tenant</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{totalTenants}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{activeTenants}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-xs sm:text-sm text-muted-foreground">Trial</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-600">{trialTenants}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <p className="text-xs sm:text-sm text-muted-foreground">Enterprise</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{enterpriseTenants}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs sm:text-sm text-muted-foreground">Students</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{totalStudents.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs sm:text-sm text-muted-foreground">Teachers</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{totalTeachers.toLocaleString()}</p>
          </div>
        </div>

        {/* Tenants Table */}
        <DataTable 
          columns={tenantColumns} 
          data={filteredTenants} 
          onRowClick={(tenant) => navigate(`/admin/tenants/${tenant.id}`)}
        />
      </div>
    </div>
  );
};

export default Tenants;
