import React from 'react';
import { Users, Building2, GraduationCap, TrendingUp, Shield, Clock } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import DataTable, { Column, StatusBadge, TenantTypeBadge } from '@/components/dashboard/DataTable';
import { Tenant } from '@/types';

// Mock data
const stats = [
  {
    title: 'Total Users',
    value: '12,450',
    change: '+12% from last month',
    changeType: 'positive' as const,
    icon: Users,
    iconColor: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Active Tenants',
    value: '248',
    change: '+8 this week',
    changeType: 'positive' as const,
    icon: Building2,
    iconColor: 'bg-green-100 text-green-600',
  },
  {
    title: 'Students Enrolled',
    value: '45,230',
    change: '+2,340 this month',
    changeType: 'positive' as const,
    icon: GraduationCap,
    iconColor: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Active Sessions',
    value: '1,847',
    change: 'Live now',
    changeType: 'neutral' as const,
    icon: Shield,
    iconColor: 'bg-amber-100 text-amber-600',
  },
];

const recentTenants: Tenant[] = [
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
    country: 'BD',
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
];

const tenantColumns: Column<Tenant>[] = [
  {
    key: 'name',
    header: 'Tenant',
    render: (tenant) => (
      <div>
        <p className="font-medium text-foreground">{tenant.name}</p>
        <p className="text-xs text-muted-foreground">{tenant.subdomain}.shikhonary.com</p>
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
    key: 'studentCount',
    header: 'Students',
    hideOnMobile: true,
    render: (tenant) => (
      <span className="text-sm">
        {tenant.studentCount.toLocaleString()}
        <span className="text-muted-foreground">/{tenant.studentLimit.toLocaleString()}</span>
      </span>
    ),
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (tenant) => <StatusBadge active={tenant.isActive} />,
  },
];

const Overview: React.FC = () => {
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" subtitle="Welcome back, Super Admin" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tenants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Recent Tenants
              </h2>
              <a href="/admin/tenants" className="text-sm text-primary hover:underline">
                View all
              </a>
            </div>
            <DataTable columns={tenantColumns} data={recentTenants} />
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Quick Stats
            </h2>
            <div className="bg-card rounded-xl border border-border p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Monthly Revenue</span>
                </div>
                <span className="font-bold">৳2,45,000</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">New Signups (Today)</span>
                </div>
                <span className="font-bold">124</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Exams Conducted</span>
                </div>
                <span className="font-bold">1,245</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Avg. Session Time</span>
                </div>
                <span className="font-bold">42 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
