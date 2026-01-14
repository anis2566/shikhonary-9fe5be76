import React from 'react';
import { cn } from '@/lib/utils';

interface AuthTabsProps {
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex rounded-lg bg-secondary p-1 mb-8">
      <button
        type="button"
        onClick={() => onTabChange('signin')}
        className={cn(
          "flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200",
          activeTab === 'signin'
            ? "bg-card text-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => onTabChange('signup')}
        className={cn(
          "flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200",
          activeTab === 'signup'
            ? "bg-card text-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;
