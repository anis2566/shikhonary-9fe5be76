import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Mail, 
  CreditCard, 
  Settings2, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Globe,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  UserCog
} from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { cn } from "@/lib/utils";
import { validateStep1, validateStep3, type Step1ValidationResult, type Step3ValidationResult } from "@/lib/mock-api";
import UserSearchSelect, { NewUserData } from "@/components/admin/UserSearchSelect";
import { User } from "@/types";

const tenantFormSchema = z.object({
  // Basic Info
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  type: z.enum(["SCHOOL", "COACHING_CENTER", "INDIVIDUAL", "TRAINING_CENTER", "UNIVERSITY", "OTHER"]),
  
  // Contact Info
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  address: z.string().max(500, "Address must be less than 500 characters").optional(),
  city: z.string().max(50, "City must be less than 50 characters").optional(),
  state: z.string().max(50, "State must be less than 50 characters").optional(),
  country: z.string().min(2, "Country is required").max(50, "Country must be less than 50 characters"),
  postalCode: z.string().max(20, "Postal code must be less than 20 characters").optional(),
  
  // Domain Configuration
  subdomain: z.string().min(2, "Subdomain must be at least 2 characters").max(50, "Subdomain must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Subdomain can only contain lowercase letters, numbers, and hyphens"),
  customDomain: z.string().max(100, "Custom domain must be less than 100 characters").optional().or(z.literal("")),
  
  // Subscription & Billing
  subscriptionTier: z.enum(["FREE", "STARTER", "PRO", "ENTERPRISE"]),
  subscriptionStatus: z.enum(["TRIAL", "ACTIVE", "PAST_DUE", "CANCELED", "EXPIRED"]),
  trialEndsAt: z.string().optional(),
  subscriptionEndsAt: z.string().optional(),
  monthlyPriceBDT: z.coerce.number().min(0, "Price cannot be negative"),
  yearlyPriceBDT: z.coerce.number().min(0, "Price cannot be negative"),
  
  // Usage Limits
  studentLimit: z.coerce.number().min(1, "Must allow at least 1 student"),
  teacherLimit: z.coerce.number().min(1, "Must allow at least 1 teacher"),
  examLimit: z.coerce.number().min(1, "Must allow at least 1 exam"),
  storageLimit: z.coerce.number().min(10, "Must allow at least 10 MB"),
  
  // Academic
  currentAcademicYear: z.string().max(20, "Academic year must be less than 20 characters").optional(),
  
  // Status
  isActive: z.boolean(),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

const tenantTypeOptions = [
  { value: "SCHOOL", label: "School", description: "Traditional K-12 school" },
  { value: "COACHING_CENTER", label: "Coaching Center", description: "Tutoring & coaching classes" },
  { value: "INDIVIDUAL", label: "Individual Teacher", description: "Solo educator" },
  { value: "TRAINING_CENTER", label: "Training Center", description: "Professional training" },
  { value: "UNIVERSITY", label: "University", description: "Higher education" },
  { value: "OTHER", label: "Other", description: "Other institution type" },
];

const subscriptionTierOptions = [
  { value: "FREE", label: "Free", description: "Basic features, limited usage" },
  { value: "STARTER", label: "Starter", description: "For small institutions" },
  { value: "PRO", label: "Pro", description: "Full features, higher limits" },
  { value: "ENTERPRISE", label: "Enterprise", description: "Unlimited, priority support" },
];

const subscriptionStatusOptions = [
  { value: "TRIAL", label: "Trial" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAST_DUE", label: "Past Due" },
  { value: "CANCELED", label: "Canceled" },
  { value: "EXPIRED", label: "Expired" },
];

const steps = [
  { id: 1, title: "Basic Info", icon: Building2, description: "Tenant details" },
  { id: 2, title: "Contact", icon: Mail, description: "Contact information" },
  { id: 3, title: "Domain", icon: Globe, description: "Domain configuration" },
  { id: 4, title: "Subscription", icon: CreditCard, description: "Plan & billing" },
  { id: 5, title: "Limits", icon: Settings2, description: "Usage limits" },
  { id: 6, title: "Admin User", icon: UserCog, description: "Assign or create admin" },
];

const CreateTenant = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidating, setIsValidating] = useState(false);
  const [step1Validation, setStep1Validation] = useState<Step1ValidationResult | null>(null);
  const [step3Validation, setStep3Validation] = useState<Step3ValidationResult | null>(null);
  
  // Admin user state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserData, setNewUserData] = useState<NewUserData | null>(null);
  const [userMode, setUserMode] = useState<"existing" | "new">("existing");

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logo: "",
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
      subscriptionStatus: "TRIAL",
      trialEndsAt: "",
      subscriptionEndsAt: "",
      monthlyPriceBDT: 0,
      yearlyPriceBDT: 0,
      studentLimit: 10,
      teacherLimit: 2,
      examLimit: 10,
      storageLimit: 100,
      currentAcademicYear: "",
      isActive: true,
    },
  });

  const onSubmit = (data: TenantFormValues) => {
    // Validate admin user selection
    if (userMode === "existing" && !selectedUser) {
      toast.error("Please select an admin user for this tenant");
      return;
    }
    if (userMode === "new" && (!newUserData?.name || !newUserData?.email)) {
      toast.error("Please fill in all required fields for the new user");
      return;
    }

    const adminData = userMode === "existing" 
      ? { existingUserId: selectedUser?.id }
      : { newUser: newUserData };

    console.log("Tenant data:", data);
    console.log("Admin user data:", adminData);
    toast.success("Tenant created successfully!");
    navigate("/admin/tenants");
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    form.setValue("slug", slug);
    form.setValue("subdomain", slug);
  };

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof TenantFormValues)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ["name", "slug", "type"];
        break;
      case 2:
        fieldsToValidate = ["country"];
        break;
      case 3:
        fieldsToValidate = ["subdomain"];
        break;
      case 4:
        fieldsToValidate = ["subscriptionTier", "subscriptionStatus"];
        break;
      case 5:
        fieldsToValidate = ["studentLimit", "teacherLimit", "examLimit", "storageLimit"];
        break;
      case 6:
        // Validate admin user step
        if (userMode === "existing" && !selectedUser) {
          toast.error("Please select an existing user");
          return false;
        }
        if (userMode === "new") {
          if (!newUserData?.name || newUserData.name.trim() === "") {
            toast.error("Please enter the user's name");
            return false;
          }
          if (!newUserData?.email || newUserData.email.trim() === "") {
            toast.error("Please enter the user's email");
            return false;
          }
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(newUserData.email)) {
            toast.error("Please enter a valid email address");
            return false;
          }
        }
        return true;
    }

    const result = await form.trigger(fieldsToValidate);
    if (!result) return false;

    // Backend validation for Step 1
    if (step === 1) {
      setIsValidating(true);
      try {
        const name = form.getValues("name");
        const slug = form.getValues("slug");
        const backendResult = await validateStep1(name, slug);
        setStep1Validation(backendResult);

        if (!backendResult.name.isValid) {
          form.setError("name", { type: "manual", message: backendResult.name.message });
        }
        if (!backendResult.slug.isValid) {
          form.setError("slug", { type: "manual", message: backendResult.slug.message });
        }

        if (!backendResult.name.isValid || !backendResult.slug.isValid) {
          setIsValidating(false);
          return false;
        }
      } catch (error) {
        toast.error("Failed to validate. Please try again.");
        setIsValidating(false);
        return false;
      }
      setIsValidating(false);
    }

    // Backend validation for Step 3
    if (step === 3) {
      setIsValidating(true);
      try {
        const subdomain = form.getValues("subdomain");
        const customDomain = form.getValues("customDomain");
        const backendResult = await validateStep3(subdomain, customDomain);
        setStep3Validation(backendResult);

        if (!backendResult.subdomain.isValid) {
          form.setError("subdomain", { type: "manual", message: backendResult.subdomain.message });
        }
        if (!backendResult.customDomain.isValid) {
          form.setError("customDomain", { type: "manual", message: backendResult.customDomain.message });
        }

        if (!backendResult.subdomain.isValid || !backendResult.customDomain.isValid) {
          setIsValidating(false);
          return false;
        }
      } catch (error) {
        toast.error("Failed to validate domain. Please try again.");
        setIsValidating(false);
        return false;
      }
      setIsValidating(false);
    }

    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === currentStep + 1) {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setCurrentStep(step);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Create Tenant" subtitle="Add a new school, coaching center, or institution" />

      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 gap-2"
          onClick={() => navigate("/admin/tenants")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tenants
        </Button>

        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 cursor-pointer transition-colors",
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground hidden lg:block">{step.description}</p>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Step Indicator */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {steps[currentStep - 1].title}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return <StepIcon className="h-5 w-5" />;
              })()}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tenant Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="ABC High School" 
                                {...field}
                                onChange={(e) => {
                                  handleNameChange(e.target.value);
                                  setStep1Validation(null); // Clear validation on change
                                }}
                              />
                              {step1Validation?.name && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  {step1Validation.name.isValid ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  )}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          {step1Validation?.name?.isValid && (
                            <p className="text-xs text-green-600">Name is available</p>
                          )}
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
                              <div className="relative">
                                <Input 
                                  placeholder="abc-high-school" 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setStep1Validation(null); // Clear validation on change
                                  }}
                                />
                                {step1Validation?.slug && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {step1Validation.slug.isValid ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-destructive" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs">
                              URL-friendly identifier (auto-generated)
                            </FormDescription>
                            {step1Validation?.slug?.isValid && (
                              <p className="text-xs text-green-600">Slug is available</p>
                            )}
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
                                    <div>
                                      <span>{option.label}</span>
                                    </div>
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

                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/logo.png" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Optional logo image URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentAcademicYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Academic Year</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="2024-2025" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Contact Info */}
                {currentStep === 2 && (
                  <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                  </div>
                )}

                {/* Step 3: Domain Configuration */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="subdomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subdomain *</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <div className="relative flex-1">
                                <Input 
                                  placeholder="abc-school" 
                                  {...field} 
                                  className="rounded-r-none"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setStep3Validation(null); // Clear validation on change
                                  }}
                                />
                                {step3Validation?.subdomain && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {step3Validation.subdomain.isValid ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-destructive" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground whitespace-nowrap">
                                .shikhonary.com
                              </span>
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            This will be the tenant's primary access URL
                          </FormDescription>
                          {step3Validation?.subdomain?.isValid && (
                            <p className="text-xs text-green-600">Subdomain is available</p>
                          )}
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
                            <div className="relative">
                              <Input 
                                placeholder="school.example.com" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  setStep3Validation(null); // Clear validation on change
                                }}
                              />
                              {step3Validation?.customDomain && field.value && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  {step3Validation.customDomain.isValid ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  )}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            Optional custom domain (verification required)
                          </FormDescription>
                          {step3Validation?.customDomain?.isValid && field.value && (
                            <p className="text-xs text-green-600">Domain format is valid</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      <p className="font-medium mb-2">Domain Information</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Subdomain will be automatically active after creation</li>
                        <li>Custom domains require DNS verification</li>
                        <li>SSL certificates are provisioned automatically</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 4: Subscription */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <FormDescription className="text-xs">
                              {subscriptionTierOptions.find(o => o.value === field.value)?.description}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriptionStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subscription Status *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subscriptionStatusOptions.map((option) => (
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="trialEndsAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trial Ends At</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriptionEndsAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subscription Ends At</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="monthlyPriceBDT"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Price (BDT)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                                <Input type="number" className="pl-8" {...field} />
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
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                                <Input type="number" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Limits */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="studentLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student Limit *</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Maximum number of students
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
                            <FormLabel>Teacher Limit *</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Maximum number of teachers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="examLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exam Limit *</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Maximum number of exams
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
                            <FormLabel>Storage Limit (MB) *</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Maximum storage in megabytes
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Status</FormLabel>
                            <FormDescription>
                              Enable or disable this tenant immediately after creation
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-5 w-5 rounded border-input accent-primary"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                  </div>
                )}

                {/* Step 6: Admin User */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <UserSearchSelect
                      selectedUser={selectedUser}
                      onUserSelect={setSelectedUser}
                      newUserData={newUserData}
                      onNewUserDataChange={setNewUserData}
                      mode={userMode}
                      onModeChange={setUserMode}
                    />

                    {/* Summary */}
                    <div className="bg-muted/50 rounded-lg p-4 mt-6">
                      <p className="font-medium mb-3">Tenant Summary</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{form.watch("name") || "-"}</span>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{tenantTypeOptions.find(t => t.value === form.watch("type"))?.label || "-"}</span>
                        <span className="text-muted-foreground">Subdomain:</span>
                        <span className="font-medium">{form.watch("subdomain") || "-"}.shikhonary.com</span>
                        <span className="text-muted-foreground">Tier:</span>
                        <span className="font-medium">{form.watch("subscriptionTier")}</span>
                        <span className="text-muted-foreground">Admin:</span>
                        <span className="font-medium">
                          {userMode === "existing" 
                            ? selectedUser?.name || "Not selected"
                            : newUserData?.name || "Not configured"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < steps.length ? (
                    <Button 
                      type="button" 
                      onClick={handleNext} 
                      className="gap-2"
                      disabled={isValidating}
                    >
                      {isValidating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Validating...
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button type="submit" className="gap-2">
                      <Check className="h-4 w-4" />
                      Create Tenant
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTenant;
