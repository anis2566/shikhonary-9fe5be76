import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, CreditCard, Settings2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const tenantFormSchema = z.object({
  // Basic Info
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  type: z.enum(["SCHOOL", "COACHING_CENTER", "INDIVIDUAL", "TRAINING_CENTER", "UNIVERSITY", "OTHER"]),
  
  // Contact Info
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  address: z.string().max(200, "Address must be less than 200 characters").optional(),
  city: z.string().max(50, "City must be less than 50 characters").optional(),
  state: z.string().max(50, "State must be less than 50 characters").optional(),
  country: z.string().min(2, "Country is required").max(50, "Country must be less than 50 characters"),
  postalCode: z.string().max(20, "Postal code must be less than 20 characters").optional(),
  
  // Domain
  subdomain: z.string().min(2, "Subdomain must be at least 2 characters").max(50, "Subdomain must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Subdomain can only contain lowercase letters, numbers, and hyphens"),
  customDomain: z.string().max(100, "Custom domain must be less than 100 characters").optional(),
  
  // Subscription
  subscriptionTier: z.enum(["FREE", "BASIC", "PRO", "ENTERPRISE"]),
  monthlyPriceBDT: z.coerce.number().min(0, "Price cannot be negative"),
  yearlyPriceBDT: z.coerce.number().min(0, "Price cannot be negative"),
  
  // Limits
  studentLimit: z.coerce.number().min(1, "Must allow at least 1 student"),
  teacherLimit: z.coerce.number().min(1, "Must allow at least 1 teacher"),
  examLimit: z.coerce.number().min(1, "Must allow at least 1 exam"),
  storageLimit: z.coerce.number().min(10, "Must allow at least 10 MB"),
  
  // Academic
  currentAcademicYear: z.string().max(20, "Academic year must be less than 20 characters").optional(),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

const tenantTypeOptions = [
  { value: "SCHOOL", label: "School" },
  { value: "COACHING_CENTER", label: "Coaching Center" },
  { value: "INDIVIDUAL", label: "Individual Teacher" },
  { value: "TRAINING_CENTER", label: "Training Center" },
  { value: "UNIVERSITY", label: "University" },
  { value: "OTHER", label: "Other" },
];

const subscriptionTierOptions = [
  { value: "FREE", label: "Free" },
  { value: "BASIC", label: "Basic" },
  { value: "PRO", label: "Pro" },
  { value: "ENTERPRISE", label: "Enterprise" },
];

const CreateTenant = () => {
  const navigate = useNavigate();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      type: "SCHOOL",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "BD",
      postalCode: "",
      subdomain: "",
      customDomain: "",
      subscriptionTier: "FREE",
      monthlyPriceBDT: 0,
      yearlyPriceBDT: 0,
      studentLimit: 10,
      teacherLimit: 2,
      examLimit: 10,
      storageLimit: 100,
      currentAcademicYear: "",
    },
  });

  const onSubmit = (data: TenantFormValues) => {
    console.log("Tenant data:", data);
    toast.success("Tenant created successfully!");
    navigate("/admin/tenants");
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    form.setValue("slug", slug);
    form.setValue("subdomain", slug);
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Create Tenant" subtitle="Add a new school, coaching center, or institution" />

      <div className="p-4 lg:p-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-2"
          onClick={() => navigate("/admin/tenants")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tenants
        </Button>

        <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="basic" className="gap-1 text-xs sm:text-sm">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Basic</span>
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="gap-1 text-xs sm:text-sm">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Contact</span>
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="gap-1 text-xs sm:text-sm">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Plan</span>
                  </TabsTrigger>
                  <TabsTrigger value="limits" className="gap-1 text-xs sm:text-sm">
                    <Settings2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Limits</span>
                  </TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ABC High School" 
                            {...field}
                            onChange={(e) => handleNameChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug *</FormLabel>
                          <FormControl>
                            <Input placeholder="abc-high-school" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            URL-friendly identifier
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tenantTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the tenant..." 
                            className="resize-none"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subdomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subdomain *</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input placeholder="abc-school" {...field} className="rounded-r-none" />
                              <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground whitespace-nowrap">
                                .shikhonary.com
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Domain</FormLabel>
                          <FormControl>
                            <Input placeholder="school.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="currentAcademicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Academic Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2024-2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="admin@school.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+880 1XXX-XXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Street address..." 
                            className="resize-none"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Dhaka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Division</FormLabel>
                          <FormControl>
                            <Input placeholder="Dhaka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <FormControl>
                            <Input placeholder="BD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="1205" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Subscription Tab */}
                <TabsContent value="subscription" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subscriptionTier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Tier *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subscriptionTierOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="monthlyPriceBDT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Price (BDT)</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">
                                ৳
                              </span>
                              <Input type="number" min="0" {...field} className="rounded-l-none" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearlyPriceBDT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yearly Price (BDT)</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">
                                ৳
                              </span>
                              <Input type="number" min="0" {...field} className="rounded-l-none" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Limits Tab */}
                <TabsContent value="limits" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="studentLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Limit</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Max students allowed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teacherLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teacher Limit</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Max teachers allowed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="examLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Limit</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Max exams per month
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="storageLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Limit (MB)</FormLabel>
                          <FormControl>
                            <Input type="number" min="10" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Max storage in megabytes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/tenants")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Tenant</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateTenant;
