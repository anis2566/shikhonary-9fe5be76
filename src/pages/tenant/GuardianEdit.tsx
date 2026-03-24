import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { mockGuardians } from '@/lib/tenant-mock-data';
import { toast } from 'sonner';

const guardianSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  relationship: z.string().min(1, 'Relationship is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phonePrimary: z.string().min(6, 'Phone number is required'),
  phoneSecondary: z.string().optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
  nidNumber: z.string().optional(),
  isActive: z.boolean(),
});

type GuardianFormValues = z.infer<typeof guardianSchema>;

const GuardianEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const guardian = mockGuardians.find((g) => g.id === id);

  const form = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      name: guardian?.name ?? '',
      relationship: guardian?.relationship ?? '',
      email: guardian?.email ?? '',
      phonePrimary: guardian?.phonePrimary ?? '',
      phoneSecondary: guardian?.phoneSecondary ?? '',
      occupation: guardian?.occupation ?? '',
      address: guardian?.address ?? '',
      nidNumber: guardian?.nidNumber ?? '',
      isActive: guardian?.isActive ?? true,
    },
  });

  if (!guardian) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Guardian not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/tenant/guardians')}>Back to Guardians</Button>
      </div>
    );
  }

  const onSubmit = (data: GuardianFormValues) => {
    console.log('Updated guardian:', data);
    toast.success('Guardian updated successfully');
    navigate(`/tenant/guardians/${id}`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Edit Guardian</h1>
          <p className="text-sm text-muted-foreground">Update {guardian.name}'s information</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="relationship" render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="occupation" render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl><Input placeholder="Occupation" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nidNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>NID Number</FormLabel>
                  <FormControl><Input placeholder="National ID" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="Email address" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phonePrimary" render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Phone *</FormLabel>
                  <FormControl><Input placeholder="Primary phone" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phoneSecondary" render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Phone</FormLabel>
                  <FormControl><Input placeholder="Secondary phone" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl><Textarea placeholder="Full address" className="resize-none" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Status</CardTitle></CardHeader>
            <CardContent>
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? 'Guardian is currently active' : 'Guardian is currently inactive'}
                    </p>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GuardianEdit;
