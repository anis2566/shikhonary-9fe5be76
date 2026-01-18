import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Users,
  GraduationCap,
  FileText,
  Database,
  Calendar,
  Edit,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getTenantById } from '@/lib/mock-data';
import { TenantDatabaseStatus, SubscriptionStatus, SubscriptionTier, TenantType } from '@/types';

const TenantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const tenant = getTenantById(id || '');

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Tenant not found</h2>
          <Button onClick={() => navigate('/admin/tenants')}>Back to Tenants</Button>
        </div>
      </div>
    );
  }

  const tierColors: Record<SubscriptionTier, string> = {
    FREE: 'bg-muted text-muted-foreground',
    STARTER: 'bg-blue-100 text-blue-700',
    PRO: 'bg-purple-100 text-purple-700',
    ENTERPRISE: 'bg-amber-100 text-amber-700',
  };

  const statusColors: Record<SubscriptionStatus, { bg: string; text: string; icon: React.ReactNode }> = {
    TRIAL: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <AlertCircle className="w-4 h-4" /> },
    ACTIVE: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 className="w-4 h-4" /> },
    PAST_DUE: { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle className="w-4 h-4" /> },
    CANCELED: { bg: 'bg-muted', text: 'text-muted-foreground', icon: <XCircle className="w-4 h-4" /> },
    EXPIRED: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-4 h-4" /> },
  };

  const dbStatusConfig: Record<TenantDatabaseStatus, { color: string; icon: React.ReactNode }> = {
    PROVISIONING: { color: 'text-amber-600', icon: <Loader2 className="w-4 h-4 animate-spin" /> },
    ACTIVE: { color: 'text-green-600', icon: <CheckCircle2 className="w-4 h-4" /> },
    MIGRATING: { color: 'text-blue-600', icon: <Loader2 className="w-4 h-4 animate-spin" /> },
    DELETING: { color: 'text-red-600', icon: <Loader2 className="w-4 h-4 animate-spin" /> },
    DELETED: { color: 'text-muted-foreground', icon: <XCircle className="w-4 h-4" /> },
    FAILED: { color: 'text-red-600', icon: <XCircle className="w-4 h-4" /> },
  };

  const typeLabels: Record<TenantType, string> = {
    SCHOOL: 'School',
    COACHING_CENTER: 'Coaching Center',
    INDIVIDUAL: 'Individual',
    TRAINING_CENTER: 'Training Center',
    UNIVERSITY: 'University',
    OTHER: 'Other',
  };

  const studentPercent = Math.round((tenant.studentCount / tenant.studentLimit) * 100);
  const teacherPercent = Math.round((tenant.teacherCount / tenant.teacherLimit) * 100);
  const examPercent = Math.round((tenant.examCount / tenant.examLimit) * 100);
  const storagePercent = Math.round((tenant.storageUsedMB / tenant.storageLimit) * 100);

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Tenant Details" subtitle={tenant.name} />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/admin/tenants')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tenants
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/admin/tenants/${tenant.id}/edit`)}>
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                <DropdownMenuItem>View Users</DropdownMenuItem>
                <DropdownMenuItem>Database Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  {tenant.isSuspended ? 'Unsuspend Tenant' : 'Suspend Tenant'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  {tenant.logo ? (
                    <img src={tenant.logo} alt={tenant.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold">{tenant.name}</h1>
                    <Badge variant="outline">{typeLabels[tenant.type]}</Badge>
                    {!tenant.isActive || tenant.isSuspended ? (
                      <Badge variant="destructive">Inactive</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tenant.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {tenant.subdomain}.shikhonary.com
                    </span>
                    {tenant.customDomain && tenant.customDomainVerified && (
                      <a
                        href={`https://${tenant.customDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {tenant.customDomain}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge className={cn('text-sm', tierColors[tenant.subscriptionTier])}>
                  {tenant.subscriptionTier}
                </Badge>
                <Badge className={cn('text-sm flex items-center gap-1', statusColors[tenant.subscriptionStatus].bg, statusColors[tenant.subscriptionStatus].text)}>
                  {statusColors[tenant.subscriptionStatus].icon}
                  {tenant.subscriptionStatus.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tenant.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${tenant.email}`} className="text-primary hover:underline">
                        {tenant.email}
                      </a>
                    </div>
                  )}
                  {tenant.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{tenant.phone}</span>
                    </div>
                  )}
                  {(tenant.address || tenant.city) && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        {tenant.address && <p>{tenant.address}</p>}
                        <p>
                          {[tenant.city, tenant.state, tenant.country, tenant.postalCode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{tenant.studentCount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{tenant.teacherCount}</p>
                        <p className="text-xs text-muted-foreground">Teachers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{tenant.examCount}</p>
                        <p className="text-xs text-muted-foreground">Exams</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Database className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{(tenant.storageUsedMB / 1000).toFixed(1)}GB</p>
                        <p className="text-xs text-muted-foreground">Storage</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metadata */}
              {tenant.metadata && Object.keys(tenant.metadata).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      {tenant.currentAcademicYear && (
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Academic Year</dt>
                          <dd className="font-medium">{tenant.currentAcademicYear}</dd>
                        </div>
                      )}
                      {Object.entries(tenant.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <dt className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                          <dd className="font-medium">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              {tenant.features && Object.keys(tenant.features).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Enabled Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(tenant.features).map(([key, enabled]) => (
                        <Badge
                          key={key}
                          variant={enabled ? 'default' : 'outline'}
                          className={cn(!enabled && 'text-muted-foreground')}
                        >
                          {enabled ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Students
                  </CardTitle>
                  <CardDescription>
                    {tenant.studentCount.toLocaleString()} of {tenant.studentLimit.toLocaleString()} students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={studentPercent} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">{studentPercent}% used</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Teachers
                  </CardTitle>
                  <CardDescription>
                    {tenant.teacherCount} of {tenant.teacherLimit} teachers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={teacherPercent} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">{teacherPercent}% used</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Exams
                  </CardTitle>
                  <CardDescription>
                    {tenant.examCount} of {tenant.examLimit} exams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={examPercent} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">{examPercent}% used</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Storage
                  </CardTitle>
                  <CardDescription>
                    {tenant.storageUsedMB} MB of {tenant.storageLimit} MB
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={storagePercent} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">{storagePercent}% used</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tier</p>
                    <Badge className={cn('mt-1', tierColors[tenant.subscriptionTier])}>
                      {tenant.subscriptionTier}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={cn('mt-1 flex items-center gap-1 w-fit', statusColors[tenant.subscriptionStatus].bg, statusColors[tenant.subscriptionStatus].text)}>
                      {statusColors[tenant.subscriptionStatus].icon}
                      {tenant.subscriptionStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Price</p>
                    <p className="text-lg font-semibold mt-1">৳{tenant.monthlyPriceBDT.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Yearly Price</p>
                    <p className="text-lg font-semibold mt-1">৳{tenant.yearlyPriceBDT.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tenant.trialEndsAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Trial Ends</p>
                        <p className="font-medium">{format(new Date(tenant.trialEndsAt), 'PPP')}</p>
                      </div>
                    </div>
                  )}
                  {tenant.subscriptionEndsAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Subscription Ends</p>
                        <p className="font-medium">{format(new Date(tenant.subscriptionEndsAt), 'PPP')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Database Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Database Name</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded mt-1 inline-block">
                      {tenant.tenantDatabaseName}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className={cn('flex items-center gap-2 mt-1', dbStatusConfig[tenant.tenantDatabaseStatus].color)}>
                      {dbStatusConfig[tenant.tenantDatabaseStatus].icon}
                      <span className="font-medium">{tenant.tenantDatabaseStatus}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{format(new Date(tenant.createdAt), 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{format(new Date(tenant.updatedAt), 'PPP')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TenantDetails;
