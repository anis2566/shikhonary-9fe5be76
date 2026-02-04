import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { addMonths, addYears } from 'date-fns';

const subscriptionSchema = z.object({
  tenant_id: z.string().uuid('Please enter a valid tenant ID'),
  tier: z.string().min(1, 'Tier is required'),
  status: z.enum(['trial', 'active', 'past_due', 'canceled', 'expired']),
  price_per_month: z.number().min(0, 'Price must be non-negative'),
  price_per_year: z.number().min(0, 'Price must be non-negative').nullable(),
  currency: z.string().min(1, 'Currency is required'),
  billing_cycle: z.enum(['monthly', 'yearly']),
  payment_provider: z.string().nullable(),
  external_id: z.string().nullable(),
  cancel_at_period_end: z.boolean(),
  cancel_reason: z.string().nullable(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

const SubscriptionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('position');
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      tenant_id: '',
      tier: 'FREE',
      status: 'trial',
      price_per_month: 0,
      price_per_year: null,
      currency: 'BDT',
      billing_cycle: 'monthly',
      payment_provider: null,
      external_id: null,
      cancel_at_period_end: false,
      cancel_reason: null,
    },
  });

  React.useEffect(() => {
    if (subscription) {
      form.reset({
        tenant_id: subscription.tenant_id,
        tier: subscription.tier,
        status: subscription.status,
        price_per_month: subscription.price_per_month,
        price_per_year: subscription.price_per_year,
        currency: subscription.currency,
        billing_cycle: subscription.billing_cycle as 'monthly' | 'yearly',
        payment_provider: subscription.payment_provider,
        external_id: subscription.external_id,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_reason: subscription.cancel_reason,
      });
    }
  }, [subscription, form]);

  // Auto-fill pricing when tier changes
  const watchTier = form.watch('tier');
  const watchBillingCycle = form.watch('billing_cycle');

  React.useEffect(() => {
    if (plans && watchTier && !isEditing) {
      const selectedPlan = plans.find((p) => p.name === watchTier);
      if (selectedPlan) {
        form.setValue('price_per_month', selectedPlan.monthly_price_bdt);
        form.setValue('price_per_year', selectedPlan.yearly_price_bdt);
      }
    }
  }, [watchTier, plans, form, isEditing]);

  const createMutation = useMutation({
    mutationFn: async (data: SubscriptionFormData) => {
      const now = new Date();
      const periodEnd = data.billing_cycle === 'yearly' 
        ? addYears(now, 1) 
        : addMonths(now, 1);

      const { data: result, error } = await supabase
        .from('subscriptions')
        .insert([{
          tenant_id: data.tenant_id,
          tier: data.tier,
          status: data.status,
          price_per_month: data.price_per_month,
          price_per_year: data.price_per_year,
          currency: data.currency,
          billing_cycle: data.billing_cycle,
          payment_provider: data.payment_provider,
          external_id: data.external_id,
          cancel_at_period_end: data.cancel_at_period_end,
          cancel_reason: data.cancel_reason,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        }])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription created successfully');
      navigate(`/admin/subscriptions/${data.id}`);
    },
    onError: (error) => {
      toast.error('Failed to create subscription: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SubscriptionFormData) => {
      const { error } = await supabase
        .from('subscriptions')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
      toast.success('Subscription updated successfully');
      navigate(`/admin/subscriptions/${id}`);
    },
    onError: (error) => {
      toast.error('Failed to update subscription: ' + error.message);
    },
  });

  const onSubmit = (data: SubscriptionFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/admin/subscriptions" className="hover:text-foreground transition-colors">
          Subscriptions
        </Link>
        <span>/</span>
        <span className="text-foreground">{isEditing ? 'Edit' : 'New'}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/subscriptions')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Edit Subscription' : 'New Subscription'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update subscription details' : 'Create a new tenant subscription'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Tenant & Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Basic subscription information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="tenant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter tenant UUID" 
                        {...field} 
                        disabled={isEditing}
                      />
                    </FormControl>
                    <FormDescription>
                      The UUID of the tenant for this subscription
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tier</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {plans?.map((plan) => (
                            <SelectItem key={plan.id} value={plan.name}>
                              {plan.display_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="past_due">Past Due</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="billing_cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Subscription pricing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price_per_month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_per_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BDT">BDT</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Provider */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Provider</CardTitle>
              <CardDescription>Optional payment integration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
                          <SelectItem value="bkash">bKash</SelectItem>
                          <SelectItem value="nagad">Nagad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="external_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Provider subscription ID"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cancellation */}
          <Card>
            <CardHeader>
              <CardTitle>Cancellation</CardTitle>
              <CardDescription>Manage subscription cancellation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="cancel_at_period_end"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Cancel at Period End</FormLabel>
                      <FormDescription>
                        Subscription will be canceled at the end of the current period
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cancel_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancel Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Reason for cancellation..."
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/subscriptions')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update' : 'Create'} Subscription
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SubscriptionForm;