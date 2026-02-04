import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ListPageHeader from '@/components/academic/ListPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const planSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  display_name: z.string().min(1, 'Display name is required').max(100),
  description: z.string().optional(),
  monthly_price_bdt: z.coerce.number().min(0),
  yearly_price_bdt: z.coerce.number().min(0),
  monthly_price_usd: z.coerce.number().min(0),
  yearly_price_usd: z.coerce.number().min(0),
  student_limit: z.coerce.number().min(1),
  teacher_limit: z.coerce.number().min(1),
  storage_limit: z.coerce.number().min(1),
  exam_limit: z.coerce.number().min(1),
  is_active: z.boolean(),
  is_popular: z.boolean(),
  position: z.coerce.number().min(0),
  features: z.object({
    smsNotifications: z.boolean(),
    parentPortal: z.boolean(),
    customBranding: z.boolean(),
    analytics: z.boolean(),
    apiAccess: z.boolean(),
    prioritySupport: z.boolean(),
  }),
});

type PlanFormData = z.infer<typeof planSchema>;

const defaultValues: PlanFormData = {
  name: '',
  display_name: '',
  description: '',
  monthly_price_bdt: 0,
  yearly_price_bdt: 0,
  monthly_price_usd: 0,
  yearly_price_usd: 0,
  student_limit: 10,
  teacher_limit: 2,
  storage_limit: 100,
  exam_limit: 20,
  is_active: true,
  is_popular: false,
  position: 0,
  features: {
    smsNotifications: false,
    parentPortal: false,
    customBranding: false,
    analytics: false,
    apiAccess: false,
    prioritySupport: false,
  },
};

const SubscriptionPlanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues,
  });

  const { data: existingPlan, isLoading } = useQuery({
    queryKey: ['subscription-plan', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPlan) {
      const features = existingPlan.features as Record<string, boolean> || {};
      form.reset({
        name: existingPlan.name,
        display_name: existingPlan.display_name,
        description: existingPlan.description || '',
        monthly_price_bdt: existingPlan.monthly_price_bdt,
        yearly_price_bdt: existingPlan.yearly_price_bdt,
        monthly_price_usd: existingPlan.monthly_price_usd,
        yearly_price_usd: existingPlan.yearly_price_usd,
        student_limit: existingPlan.student_limit,
        teacher_limit: existingPlan.teacher_limit,
        storage_limit: existingPlan.storage_limit,
        exam_limit: existingPlan.exam_limit,
        is_active: existingPlan.is_active,
        is_popular: existingPlan.is_popular,
        position: existingPlan.position,
        features: {
          smsNotifications: features.smsNotifications ?? false,
          parentPortal: features.parentPortal ?? false,
          customBranding: features.customBranding ?? false,
          analytics: features.analytics ?? false,
          apiAccess: features.apiAccess ?? false,
          prioritySupport: features.prioritySupport ?? false,
        },
      });
    }
  }, [existingPlan, form]);

  const mutation = useMutation({
    mutationFn: async (data: PlanFormData) => {
      const payload = {
        name: data.name.toUpperCase(),
        display_name: data.display_name,
        description: data.description || null,
        monthly_price_bdt: data.monthly_price_bdt,
        yearly_price_bdt: data.yearly_price_bdt,
        monthly_price_usd: data.monthly_price_usd,
        yearly_price_usd: data.yearly_price_usd,
        student_limit: data.student_limit,
        teacher_limit: data.teacher_limit,
        storage_limit: data.storage_limit,
        exam_limit: data.exam_limit,
        is_active: data.is_active,
        is_popular: data.is_popular,
        position: data.position,
        features: data.features,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('subscription_plans')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscription_plans')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success(isEditing ? 'Plan updated successfully' : 'Plan created successfully');
      navigate('/admin/subscription-plans');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: PlanFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <ListPageHeader title="Loading..." backUrl="/admin/subscription-plans" />
        <div className="p-4 lg:p-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ListPageHeader 
        title={isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan'} 
        subtitle={isEditing ? `Editing ${existingPlan?.display_name}` : 'Add a new pricing tier'}
        backUrl="/admin/subscription-plans" 
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 lg:p-6 space-y-6 max-w-4xl">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Plan name and description</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Internal)</FormLabel>
                    <FormControl>
                      <Input placeholder="PRO" {...field} className="uppercase" />
                    </FormControl>
                    <FormDescription>Unique identifier (e.g., FREE, PRO)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Professional Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Best for growing institutions..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Position</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
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
              <CardDescription>Monthly and yearly pricing in multiple currencies</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="monthly_price_bdt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearly_price_bdt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthly_price_usd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearly_price_usd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Limits</CardTitle>
              <CardDescription>Maximum allowed resources per tenant</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="student_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Students</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacher_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teachers</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storage_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage (MB)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exam_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exams</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Toggle plan features</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'smsNotifications', label: 'SMS Notifications' },
                { key: 'parentPortal', label: 'Parent Portal' },
                { key: 'customBranding', label: 'Custom Branding' },
                { key: 'analytics', label: 'Analytics Dashboard' },
                { key: 'apiAccess', label: 'API Access' },
                { key: 'prioritySupport', label: 'Priority Support' },
              ].map(({ key, label }) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`features.${key}` as keyof PlanFormData}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel className="font-normal">{label}</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Active</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_popular"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Mark as Popular</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/subscription-plans')}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SubscriptionPlanForm;
