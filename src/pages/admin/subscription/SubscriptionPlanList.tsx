import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, MoreHorizontal, CreditCard, Users, Database, FileText, Check, X, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ListPageHeader from '@/components/academic/ListPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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
}

const SubscriptionPlanList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  const filteredPlans = plans?.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (bdt: number, usd: number, period: 'month' | 'year') => {
    if (bdt === 0) return 'Free';
    return (
      <div className="space-y-1">
        <div className="text-2xl font-bold">৳{bdt.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/{period}</span></div>
        <div className="text-xs text-muted-foreground">${usd}/{period}</div>
      </div>
    );
  };

  const FeatureItem: React.FC<{ enabled: boolean; label: string }> = ({ enabled, label }) => (
    <div className="flex items-center gap-2 text-sm">
      {enabled ? (
        <Check className="w-4 h-4 text-primary" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={cn(!enabled && 'text-muted-foreground')}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen">
      <ListPageHeader 
        title="Subscription Plans" 
        subtitle="Manage pricing tiers and features for tenants"
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button size="sm" className="gap-2" onClick={() => navigate('/admin/subscription-plans/create')}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Plan</span>
          </Button>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPlans?.map((plan) => (
              <Card 
                key={plan.id} 
                className={cn(
                  'relative overflow-hidden transition-all hover:shadow-md cursor-pointer',
                  plan.is_popular && 'ring-2 ring-primary',
                  !plan.is_active && 'opacity-60'
                )}
                onClick={() => navigate(`/admin/subscription-plans/${plan.id}`)}
              >
                {plan.is_popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.display_name}</CardTitle>
                      <Badge variant={plan.is_active ? 'default' : 'secondary'} className="mt-1">
                        {plan.name}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/admin/subscription-plans/${plan.id}`); }}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/admin/subscription-plans/${plan.id}/edit`); }}>
                          Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                          {plan.is_active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {plan.description && (
                    <CardDescription className="mt-2 line-clamp-2">{plan.description}</CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {formatPrice(plan.monthly_price_bdt, plan.monthly_price_usd, 'month')}
                  
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{plan.student_limit.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{plan.teacher_limit.toLocaleString()} teachers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <span>{plan.storage_limit >= 1000 ? `${plan.storage_limit / 1000}GB` : `${plan.storage_limit}MB`} storage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{plan.exam_limit.toLocaleString()} exams</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <FeatureItem enabled={plan.features.smsNotifications ?? false} label="SMS Notifications" />
                    <FeatureItem enabled={plan.features.parentPortal ?? false} label="Parent Portal" />
                    <FeatureItem enabled={plan.features.customBranding ?? false} label="Custom Branding" />
                    <FeatureItem enabled={plan.features.analytics ?? false} label="Analytics" />
                  </div>
                </CardContent>

                <CardFooter className="text-xs text-muted-foreground">
                  Yearly: ৳{plan.yearly_price_bdt.toLocaleString()} (${plan.yearly_price_usd})
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {filteredPlans?.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No subscription plans found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlanList;
