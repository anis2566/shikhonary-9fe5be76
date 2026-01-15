import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    toast.info('Google Sign In will be available once authentication is set up');
    setIsLoading(false);
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    console.log('Sign up:', { name, email, password });
    toast.info('Sign Up will be available once authentication is set up');
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
            Create your account
          </h1>
          <p className="text-muted-foreground">
            Start your learning journey today
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth-card rounded-2xl p-6 sm:p-8">
          <SignUpForm 
            onGoogleSignIn={handleGoogleSignIn}
            onSubmit={handleSignUp}
            isLoading={isLoading}
          />
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="link-primary font-medium">
            Sign in
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

export default SignUp;
