import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  CreditCard, Edit, Trash2, Users, Database, FileText, Check, X, Star, 
  TrendingUp, Building2, Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ListPageHeader from '@/components/academic/ListPageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  monthly_price_bdt: number;
  yearly_price_bdt: number;
  monthly_price_usd: number;
  yearly_price_usd: number;
  student_limit: number;
  teacher_limit: number;
  storage_limit: number;
  exam_limit: number;
  features: Record<string, boolean>;
  is_active: boolean;
  is_popular: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

const SubscriptionPlanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: plan, isLoading } = useQuery({
    queryKey: ['subscription-plan', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as SubscriptionPlan | null;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <ListPageHeader title="Loading..." backUrl="/admin/subscription-plans" />
        <div className="p-4 lg:p-6">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen">
        <ListPageHeader title="Plan Not Found" backUrl="/admin/subscription-plans" />
        <div className="p-4 lg:p-6 text-center py-12 text-muted-foreground">
          <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>The subscription plan you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const FeatureRow: React.FC<{ label: string; enabled: boolean }> = ({ label, enabled }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span>{label}</span>
      {enabled ? (
        <Badge variant="default" className="bg-primary/10 text-primary">
          <Check className="w-3 h-3 mr-1" /> Enabled
        </Badge>
      ) : (
        <Badge variant="secondary">
          <X className="w-3 h-3 mr-1" /> Disabled
        </Badge>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <ListPageHeader 
        title={plan.display_name} 
        subtitle={plan.description || undefined}
        backUrl="/admin/subscription-plans" 
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-16 h-16 rounded-xl flex items-center justify-center',
                  plan.is_popular ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <CreditCard className={cn('w-8 h-8', plan.is_popular ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{plan.display_name}</h2>
                    {plan.is_popular && (
                      <Badge className="bg-primary/10 text-primary">
                        <Star className="w-3 h-3 mr-1" /> Popular
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                      {plan.name}
                    </Badge>
                    <Badge variant={plan.is_active ? 'outline' : 'destructive'}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/admin/subscription-plans/${id}/edit`)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Monthly Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">৳{plan.monthly_price_bdt.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">${plan.monthly_price_usd} USD</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Student Limit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{plan.student_limit.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">students per tenant</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {plan.storage_limit >= 1000 ? `${plan.storage_limit / 1000} GB` : `${plan.storage_limit} MB`}
                  </div>
                  <p className="text-xs text-muted-foreground">per tenant</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">#{plan.position + 1}</div>
                  <p className="text-xs text-muted-foreground">in display order</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2">{format(new Date(plan.created_at), 'PPpp')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="ml-2">{format(new Date(plan.updated_at), 'PPpp')}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Monthly Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>BDT (Taka)</span>
                    <span className="text-xl font-bold">৳{plan.monthly_price_bdt.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>USD (Dollar)</span>
                    <span className="text-xl font-bold">${plan.monthly_price_usd}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Yearly Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>BDT (Taka)</span>
                    <span className="text-xl font-bold">৳{plan.yearly_price_bdt.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>USD (Dollar)</span>
                    <span className="text-xl font-bold">${plan.yearly_price_usd}</span>
                  </div>
                  {plan.monthly_price_bdt > 0 && (
                    <div className="text-sm text-primary bg-primary/10 p-2 rounded">
                      Save {Math.round((1 - plan.yearly_price_bdt / (plan.monthly_price_bdt * 12)) * 100)}% with yearly billing
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span>Students</span>
                      </div>
                      <span className="font-bold">{plan.student_limit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span>Teachers</span>
                      </div>
                      <span className="font-bold">{plan.teacher_limit.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-muted-foreground" />
                        <span>Storage</span>
                      </div>
                      <span className="font-bold">
                        {plan.storage_limit >= 1000 ? `${plan.storage_limit / 1000} GB` : `${plan.storage_limit} MB`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span>Exams</span>
                      </div>
                      <span className="font-bold">{plan.exam_limit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <FeatureRow label="SMS Notifications" enabled={plan.features.smsNotifications ?? false} />
                  <FeatureRow label="Parent Portal" enabled={plan.features.parentPortal ?? false} />
                  <FeatureRow label="Custom Branding" enabled={plan.features.customBranding ?? false} />
                  <FeatureRow label="Analytics Dashboard" enabled={plan.features.analytics ?? false} />
                  <FeatureRow label="API Access" enabled={plan.features.apiAccess ?? false} />
                  <FeatureRow label="Priority Support" enabled={plan.features.prioritySupport ?? false} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubscriptionPlanDetails;
