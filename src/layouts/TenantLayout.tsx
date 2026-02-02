import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import TenantHeader from '@/components/tenant/TenantHeader';
import MobileHeader from '@/components/tenant/MobileHeader';
import MobileBottomNav from '@/components/tenant/MobileBottomNav';
import QuickActionsFab from '@/components/tenant/QuickActionsFab';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

const TenantLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <MobileHeader />
        <main className="flex-1 overflow-auto pb-20">
          <Outlet />
        </main>
        <QuickActionsFab />
        <MobileBottomNav />
      </div>
    );
  }

  // Desktop Layout
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
