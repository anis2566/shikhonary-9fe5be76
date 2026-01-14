import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import GoogleButton from './GoogleButton';
import { Button } from '@/components/ui/button';

interface SignUpFormProps {
  onGoogleSignIn: () => void;
  onSubmit: (name: string, email: string, password: string) => void;
  isLoading?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ 
  onGoogleSignIn, 
  onSubmit,
  isLoading = false 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, password);
  };

  return (
    <div className="animate-fade-in">
      <GoogleButton 
        onClick={onGoogleSignIn} 
        isLoading={isLoading}
        label="Sign up with Google" 
      />
      
      <div className="divider-text my-6">
        <span>or sign up with email</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-auth pl-12"
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-auth pl-12"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-auth pl-12 pr-12"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters
        </p>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3 gradient-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By signing up, you agree to our{' '}
          <button type="button" className="link-primary">Terms of Service</button>
          {' '}and{' '}
          <button type="button" className="link-primary">Privacy Policy</button>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
