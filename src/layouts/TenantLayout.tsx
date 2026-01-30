import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import TenantHeader from '@/components/tenant/TenantHeader';
import { useAuth } from '@/hooks/useAuth';

const TenantLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated (for now, we'll use mock data so skip this)
  // In production, uncomment this:
  // if (!user) {
  //   navigate('/auth');
  //   return null;
  // }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <TenantSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TenantHeader />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TenantLayout;
