import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Plus,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Pause,
  ArrowUpRight,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';

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
  cancel_at_period_end: boolean;
  created_at: string;
}

const statusConfig: Record<SubscriptionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  trial: { label: 'Trial', variant: 'secondary', icon: Clock },
  active: { label: 'Active', variant: 'default', icon: CheckCircle2 },
  past_due: { label: 'Past Due', variant: 'destructive', icon: AlertCircle },
  canceled: { label: 'Canceled', variant: 'outline', icon: XCircle },
  expired: { label: 'Expired', variant: 'outline', icon: Pause },
};

const tierColors: Record<string, string> = {
  FREE: 'bg-muted text-muted-foreground',
  STARTER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PRO: 'bg-primary/10 text-primary',
  ENTERPRISE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const SubscriptionList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Subscription[];
    },
  });

  const filteredSubscriptions = subscriptions?.filter((sub) => {
    const matchesSearch = sub.tenant_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.tier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: subscriptions?.length || 0,
    active: subscriptions?.filter((s) => s.status === 'active').length || 0,
    trial: subscriptions?.filter((s) => s.status === 'trial').length || 0,
    pastDue: subscriptions?.filter((s) => s.status === 'past_due').length || 0,
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">Manage tenant subscriptions and billing</p>
        </div>
        <Button asChild>
          <Link to="/admin/subscriptions/create">
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.trial}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Past Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.pastDue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by tenant or tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="past_due">Past Due</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscription List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : filteredSubscriptions?.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subscriptions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create a subscription to get started'}
            </p>
            <Button asChild>
              <Link to="/admin/subscriptions/create">
                <Plus className="w-4 h-4 mr-2" />
                New Subscription
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSubscriptions?.map((subscription) => {
            const statusInfo = statusConfig[subscription.status];
            const StatusIcon = statusInfo.icon;
            
            return (
              <Link
                key={subscription.id}
                to={`/admin/subscriptions/${subscription.id}`}
                className="block group"
              >
                <Card className="hover:border-primary/50 hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">
                              Tenant: {subscription.tenant_id.slice(0, 8)}...
                            </span>
                            <Badge className={tierColors[subscription.tier] || 'bg-muted'}>
                              {subscription.tier}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <StatusIcon className="w-3.5 h-3.5" />
                              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5" />
                              {formatCurrency(subscription.price_per_month, subscription.currency)}/mo
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Ends {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {subscription.cancel_at_period_end && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            Cancels at period end
                          </Badge>
                        )}
                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;