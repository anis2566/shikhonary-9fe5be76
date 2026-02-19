import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  TrendingUp,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { mockSubscriptions } from '@/lib/mock-data';

type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType; color: string }
> = {
  trial:    { label: 'Trial',    variant: 'secondary',    icon: Clock,         color: 'text-blue-600' },
  active:   { label: 'Active',   variant: 'default',      icon: CheckCircle2,  color: 'text-green-600' },
  past_due: { label: 'Past Due', variant: 'destructive',  icon: AlertCircle,   color: 'text-destructive' },
  canceled: { label: 'Canceled', variant: 'outline',      icon: XCircle,       color: 'text-muted-foreground' },
  expired:  { label: 'Expired',  variant: 'outline',      icon: Pause,         color: 'text-muted-foreground' },
};

const tierColors: Record<string, string> = {
  FREE:       'bg-muted text-muted-foreground',
  STARTER:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PRO:        'bg-primary/10 text-primary',
  ENTERPRISE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const tierOrder = ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'];

const SubscriptionList: React.FC = () => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter]     = useState<string>('all');

  const filteredSubscriptions = useMemo(() =>
    mockSubscriptions.filter((sub) => {
      const matchesSearch =
        sub.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.tier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchesTier   = tierFilter   === 'all' || sub.tier   === tierFilter;
      return matchesSearch && matchesStatus && matchesTier;
    }),
  [searchQuery, statusFilter, tierFilter]);

  const stats = useMemo(() => ({
    total:   mockSubscriptions.length,
    active:  mockSubscriptions.filter((s) => s.status === 'active').length,
    trial:   mockSubscriptions.filter((s) => s.status === 'trial').length,
    pastDue: mockSubscriptions.filter((s) => s.status === 'past_due').length,
    mrr:     mockSubscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.price_per_month, 0),
  }), []);

  const formatCurrency = (amount: number, currency: string) =>
    `${currency} ${amount.toLocaleString()}`;

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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
        <Card className="md:col-span-1 col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> MRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.mrr, 'BDT')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            {tierOrder.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Result count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSubscriptions.length} of {mockSubscriptions.length} subscriptions
      </div>

      {/* Subscription List */}
      {filteredSubscriptions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subscriptions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' || tierFilter !== 'all'
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
        <div className="grid gap-3">
          {filteredSubscriptions.map((subscription) => {
            const statusInfo = statusConfig[subscription.status];
            const StatusIcon = statusInfo.icon;

            return (
              <Link
                key={subscription.id}
                to={`/admin/subscriptions/${subscription.id}`}
                className="block group"
              >
                <Card className="hover:border-primary/50 hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: tenant + tier info */}
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground truncate">
                              {subscription.tenant_name}
                            </span>
                            <Badge className={tierColors[subscription.tier] || 'bg-muted'}>
                              {subscription.tier}
                            </Badge>
                            <span className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              <Badge variant={statusInfo.variant} className="text-xs">
                                {statusInfo.label}
                              </Badge>
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5" />
                              {formatCurrency(subscription.price_per_month, subscription.currency)}/mo
                              {subscription.billing_cycle === 'yearly' && (
                                <span className="text-xs text-primary ml-1">(yearly billing)</span>
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Ends {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                            </span>
                            {subscription.payment_provider && (
                              <span className="capitalize text-xs bg-muted px-2 py-0.5 rounded-full">
                                {subscription.payment_provider}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: badges + arrow */}
                      <div className="flex items-center gap-3 ml-auto">
                        {subscription.cancel_at_period_end && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                            Cancels at period end
                          </Badge>
                        )}
                        {subscription.status === 'past_due' && (
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            Action Required
                          </Badge>
                        )}
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
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
