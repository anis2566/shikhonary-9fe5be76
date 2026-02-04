import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pause,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Ban,
  DollarSign,
  Receipt,
  Edit,
  History,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow } from 'date-fns';

type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';
type EventType = 'created' | 'upgraded' | 'downgraded' | 'renewed' | 'canceled' | 'expired' | 'payment_failed' | 'payment_succeeded';

interface Subscription {
  id: string;
  tenant_id: string;
  tier: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  price_per_month: number;
  price_per_year: number | null;
  currency: string;
  billing_cycle: string;
  payment_provider: string | null;
  external_id: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
}

interface SubscriptionHistoryEvent {
  id: string;
  created_at: string;
  subscription_id: string;
  tenant_id: string;
  event_type: EventType;
  previous_tier: string | null;
  new_tier: string | null;
  previous_status: string | null;
  new_status: string | null;
  previous_billing_cycle: string | null;
  new_billing_cycle: string | null;
  previous_period_end: string | null;
  new_period_end: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  triggered_by: string | null;
  triggered_by_ip: string | null;
}

const statusConfig: Record<SubscriptionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType; color: string }> = {
  trial: { label: 'Trial', variant: 'secondary', icon: Clock, color: 'text-blue-600' },
  active: { label: 'Active', variant: 'default', icon: CheckCircle2, color: 'text-green-600' },
  past_due: { label: 'Past Due', variant: 'destructive', icon: AlertCircle, color: 'text-red-600' },
  canceled: { label: 'Canceled', variant: 'outline', icon: XCircle, color: 'text-muted-foreground' },
  expired: { label: 'Expired', variant: 'outline', icon: Pause, color: 'text-muted-foreground' },
};

const eventConfig: Record<EventType, { label: string; icon: React.ElementType; color: string }> = {
  created: { label: 'Created', icon: CheckCircle2, color: 'text-green-600' },
  upgraded: { label: 'Upgraded', icon: ArrowUpCircle, color: 'text-blue-600' },
  downgraded: { label: 'Downgraded', icon: ArrowDownCircle, color: 'text-amber-600' },
  renewed: { label: 'Renewed', icon: RefreshCw, color: 'text-green-600' },
  canceled: { label: 'Canceled', icon: Ban, color: 'text-red-600' },
  expired: { label: 'Expired', icon: Clock, color: 'text-muted-foreground' },
  payment_failed: { label: 'Payment Failed', icon: XCircle, color: 'text-red-600' },
  payment_succeeded: { label: 'Payment Succeeded', icon: DollarSign, color: 'text-green-600' },
};

const tierColors: Record<string, string> = {
  FREE: 'bg-muted text-muted-foreground',
  STARTER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PRO: 'bg-primary/10 text-primary',
  ENTERPRISE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const SubscriptionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Subscription;
    },
    enabled: !!id,
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['subscription-history', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('subscription_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SubscriptionHistoryEvent[];
    },
    enabled: !!id,
  });

  if (subscriptionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Subscription not found</h2>
        <Button variant="outline" onClick={() => navigate('/admin/subscriptions')}>
          Back to Subscriptions
        </Button>
      </div>
    );
  }

  const statusInfo = statusConfig[subscription.status];
  const StatusIcon = statusInfo.icon;

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/admin/subscriptions" className="hover:text-foreground transition-colors">
          Subscriptions
        </Link>
        <span>/</span>
        <span className="text-foreground">{subscription.id.slice(0, 8)}...</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/subscriptions')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
              <Badge className={tierColors[subscription.tier] || 'bg-muted'}>
                {subscription.tier}
              </Badge>
              <Badge variant={statusInfo.variant}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Tenant ID: {subscription.tenant_id}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/admin/subscriptions/${id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Subscription Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tier</span>
                  <Badge className={tierColors[subscription.tier] || 'bg-muted'}>
                    {subscription.tier}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={statusInfo.variant}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <span className="capitalize">{subscription.billing_cycle}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(new Date(subscription.created_at), 'MMM d, yyyy')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Period Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Current Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period Start</span>
                  <span>{format(new Date(subscription.current_period_start), 'MMM d, yyyy')}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period End</span>
                  <span>{format(new Date(subscription.current_period_end), 'MMM d, yyyy')}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Remaining</span>
                  <span className={statusInfo.color}>
                    {formatDistanceToNow(new Date(subscription.current_period_end), { addSuffix: true })}
                  </span>
                </div>
                {subscription.cancel_at_period_end && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between text-amber-600">
                      <span>Cancels at Period End</span>
                      <Ban className="w-4 h-4" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cancellation Info */}
          {subscription.canceled_at && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Ban className="w-5 h-5" />
                  Cancellation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Canceled At</span>
                  <span>{format(new Date(subscription.canceled_at), 'MMM d, yyyy HH:mm')}</span>
                </div>
                {subscription.cancel_reason && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-muted-foreground block mb-2">Reason</span>
                      <p className="text-foreground">{subscription.cancel_reason}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Price</span>
                  <span className="font-semibold">
                    {formatCurrency(subscription.price_per_month, subscription.currency)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yearly Price</span>
                  <span className="font-semibold">
                    {subscription.price_per_year
                      ? formatCurrency(subscription.price_per_year, subscription.currency)
                      : 'N/A'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span>{subscription.currency}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Provider */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Payment Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="capitalize">{subscription.payment_provider || 'Not set'}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">External ID</span>
                  <span className="font-mono text-sm">
                    {subscription.external_id || 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Subscription History
              </CardTitle>
              <CardDescription>Timeline of all subscription events</CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : history?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No history events yet</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                  
                  <div className="space-y-6">
                    {history?.map((event, index) => {
                      const eventInfo = eventConfig[event.event_type];
                      const EventIcon = eventInfo.icon;
                      
                      return (
                        <div key={event.id} className="relative flex gap-4 pl-2">
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center z-10 ${eventInfo.color}`}>
                            <EventIcon className="w-4 h-4" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 bg-muted/50 rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <span className={`font-semibold ${eventInfo.color}`}>
                                {eventInfo.label}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(event.created_at), 'MMM d, yyyy HH:mm')}
                              </span>
                            </div>
                            
                            {event.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {event.description}
                              </p>
                            )}
                            
                            {/* Changes */}
                            <div className="flex flex-wrap gap-4 text-sm">
                              {event.previous_tier && event.new_tier && (
                                <div>
                                  <span className="text-muted-foreground">Tier: </span>
                                  <span className="line-through">{event.previous_tier}</span>
                                  <span className="mx-1">→</span>
                                  <span className="font-medium">{event.new_tier}</span>
                                </div>
                              )}
                              {event.previous_status && event.new_status && (
                                <div>
                                  <span className="text-muted-foreground">Status: </span>
                                  <span className="line-through">{event.previous_status}</span>
                                  <span className="mx-1">→</span>
                                  <span className="font-medium">{event.new_status}</span>
                                </div>
                              )}
                              {event.triggered_by && (
                                <div className="text-muted-foreground">
                                  By: {event.triggered_by}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionDetails;