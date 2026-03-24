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
import { mockStaff } from '@/lib/tenant-mock-data';
import { toast } from 'sonner';

const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(6, 'Phone number is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  joiningDate: z.string().min(1, 'Joining date is required'),
  salary: z.coerce.number().min(0).optional(),
  address: z.string().optional(),
  isActive: z.boolean(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

const StaffEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const staff = mockStaff.find((s) => s.id === id);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: staff?.name ?? '',
      employeeId: staff?.employeeId ?? '',
      email: staff?.email ?? '',
      phone: staff?.phone ?? '',
      designation: staff?.designation ?? '',
      department: staff?.department ?? '',
      gender: staff?.gender ?? '',
      dateOfBirth: staff?.dateOfBirth ?? '',
      joiningDate: staff?.joiningDate ?? '',
      salary: staff?.salary ?? 0,
      address: staff?.address ?? '',
      isActive: staff?.isActive ?? true,
    },
  });

  if (!staff) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Staff member not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/tenant/staff')}>Back to Staff</Button>
      </div>
    );
  }

  const onSubmit = (data: StaffFormValues) => {
    console.log('Updated staff:', data);
    toast.success('Staff member updated successfully');
    navigate(`/tenant/staff/${id}`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Edit Staff</h1>
          <p className="text-sm text-muted-foreground">Update {staff.name}'s information</p>
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
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
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
            <CardHeader><CardTitle className="text-base">Employment Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="employeeId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID *</FormLabel>
                  <FormControl><Input placeholder="EMP-001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="designation" render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation *</FormLabel>
                  <FormControl><Input placeholder="Designation" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem>
                  <FormLabel>Department *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Library">Library</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="joiningDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Joining Date *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="salary" render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary (BDT)</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
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
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl><Input placeholder="Phone number" {...field} /></FormControl>
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
                      {field.value ? 'Staff member is currently active' : 'Staff member is currently inactive'}
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

export default StaffEdit;
