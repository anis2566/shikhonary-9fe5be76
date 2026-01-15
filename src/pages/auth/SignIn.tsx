import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SignInForm from '@/components/auth/SignInForm';

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    toast.info('Google Sign In will be available once authentication is set up');
    setIsLoading(false);
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Sign in:', { email, password });
    toast.info('Email Sign In will be available once authentication is set up');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="font-display text-xl text-primary-foreground font-bold">S</span>
            </div>
            <span className="font-display text-2xl font-bold text-foreground">Shikhonary</span>
          </Link>
          
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth-card rounded-2xl p-6 sm:p-8">
          <SignInForm 
            onGoogleSignIn={handleGoogleSignIn}
            onSubmit={handleSignIn}
            isLoading={isLoading}
          />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link to="/auth/sign-up" className="link-primary font-medium">
            Sign up
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Need help?{' '}
          <button type="button" className="link-primary">
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
