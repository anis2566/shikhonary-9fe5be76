import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthTabs from '@/components/auth/AuthTabs';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import AuthIllustration from '@/components/auth/AuthIllustration';

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Placeholder for Google OAuth - will be implemented with Supabase
    toast.info('Google Sign In will be available once authentication is set up');
    setIsLoading(false);
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    // Placeholder for email sign in - will be implemented with Supabase
    console.log('Sign in:', { email, password });
    toast.info('Email Sign In will be available once authentication is set up');
    setIsLoading(false);
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Placeholder for email sign up - will be implemented with Supabase
    console.log('Sign up:', { name, email, password });
    toast.info('Sign Up will be available once authentication is set up');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <AuthIllustration />
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="font-display text-xl text-primary-foreground font-bold">S</span>
              </div>
              <span className="font-display text-2xl font-bold text-foreground">Shikhonary</span>
            </div>
            
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {activeTab === 'signin' ? 'Welcome back!' : 'Create your account'}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'signin' 
                ? 'Enter your credentials to access your account' 
                : 'Start your learning journey today'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="auth-card rounded-2xl p-6 sm:p-8">
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'signin' ? (
              <SignInForm 
                onGoogleSignIn={handleGoogleSignIn}
                onSubmit={handleSignIn}
                isLoading={isLoading}
              />
            ) : (
              <SignUpForm 
                onGoogleSignIn={handleGoogleSignIn}
                onSubmit={handleSignUp}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Need help?{' '}
            <button type="button" className="link-primary">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
