import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  XCircle,
  Clock,
  User,
  Mail,
  Lock,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getInvitationByToken } from '@/lib/invitation-mock-data';
import { TenantInvitation } from '@/types/invitation';

const acceptFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type AcceptFormValues = z.infer<typeof acceptFormSchema>;

type InvitationState = 'loading' | 'invalid' | 'expired' | 'valid';

const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [state, setState] = useState<InvitationState>('loading');
  const [invitation, setInvitation] = useState<TenantInvitation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = searchParams.get('token');

  const form = useForm<AcceptFormValues>({
    resolver: zodResolver(acceptFormSchema),
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!token) {
        setState('invalid');
        return;
      }

      const foundInvitation = getInvitationByToken(token);

      if (!foundInvitation) {
        setState('invalid');
        return;
      }

      if (foundInvitation.status === 'EXPIRED' || new Date(foundInvitation.expiresAt) < new Date()) {
        setState('expired');
        setInvitation(foundInvitation);
        return;
      }

      if (foundInvitation.status !== 'PENDING') {
        setState('invalid');
        return;
      }

      setInvitation(foundInvitation);
      if (foundInvitation.name) {
        form.setValue('name', foundInvitation.name);
      }
      setState('valid');
    };

    validateToken();
  }, [token, form]);

  const onSubmit = async (data: AcceptFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: 'Account created!',
      description: 'Redirecting to login...',
    });
    
    setIsSubmitting(false);
    
    // Redirect to login
    setTimeout(() => {
      navigate('/auth?message=account-created');
    }, 1500);
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground mb-6">
              This invitation link is invalid or has already been used.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Invitation Expired</h2>
            <p className="text-muted-foreground mb-6">
              This invitation has expired. Please contact the administrator for a new invitation.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Join {invitation?.tenantName}</CardTitle>
            <CardDescription className="mt-2">
              You've been invited by {invitation?.invitedByName}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="John Doe"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={invitation?.email || ''}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Create a strong password"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert className="bg-muted/50">
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Your role:</span>
                    <Badge variant="secondary" className="capitalize">
                      {invitation?.role.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    You'll have full access to manage {invitation?.tenantName}
                  </p>
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Accept Invitation & Create Account
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => navigate('/auth')}
            >
              Already have an account? Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
