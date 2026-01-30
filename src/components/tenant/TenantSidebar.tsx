import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  CalendarDays,
  BarChart3,
  Bell,
  Megaphone,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Menu,
  ClipboardList,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', url: '/tenant', icon: LayoutDashboard },
];

const peopleGroup: NavGroup = {
  title: 'People',
  icon: Users,
  items: [
    { title: 'Students', url: '/tenant/students', icon: GraduationCap },
    { title: 'Teachers', url: '/tenant/teachers', icon: UserCheck },
    { title: 'Batches', url: '/tenant/batches', icon: Users },
  ],
};

const examGroup: NavGroup = {
  title: 'Examinations',
  icon: FileText,
  items: [
    { title: 'All Exams', url: '/tenant/exams', icon: ClipboardList },
    { title: 'Create Exam', url: '/tenant/exams/create', icon: FileText },
    { title: 'Results', url: '/tenant/results', icon: TrendingUp },
  ],
};

const analyticsGroup: NavGroup = {
  title: 'Analytics',
  icon: BarChart3,
  items: [
    { title: 'Overview', url: '/tenant/analytics', icon: BarChart3 },
    { title: 'Attendance', url: '/tenant/attendance', icon: CalendarDays },
    { title: 'Performance', url: '/tenant/performance', icon: TrendingUp },
  ],
};

const communicationGroup: NavGroup = {
  title: 'Communication',
  icon: Bell,
  items: [
    { title: 'Announcements', url: '/tenant/announcements', icon: Megaphone },
    { title: 'Notifications', url: '/tenant/notifications', icon: Bell },
  ],
};

const bottomItems: NavItem[] = [
  { title: 'Settings', url: '/tenant/settings', icon: Settings },
];

interface SidebarContentProps {
  collapsed: boolean;
  onToggle?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [peopleOpen, setPeopleOpen] = useState(true);
  const [examOpen, setExamOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [communicationOpen, setCommunicationOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (url: string) => {
    if (url === '/tenant') {
      return location.pathname === url;
    }
    return location.pathname.startsWith(url);
  };

  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.title}
      to={item.url}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive(item.url)
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  );

  const renderNavGroup = (
    group: NavGroup,
    open: boolean,
    setOpen: (val: boolean) => void
  ) => {
    if (collapsed) {
      return (
        <div className="space-y-1">
          {group.items.map(renderNavItem)}
        </div>
      );
    }

    const isGroupActive = group.items.some((item) => isActive(item.url));

    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isGroupActive
              ? 'text-foreground bg-muted/50'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <div className="flex items-center gap-3">
            <group.icon className="w-4 h-4 flex-shrink-0" />
            <span>{group.title}</span>
          </div>
          <ChevronDown
            className={cn('w-4 h-4 transition-transform', open && 'rotate-180')}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 mt-1 space-y-1">
          {group.items.map(renderNavItem)}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link to="/tenant" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground">
                Shikhonary
              </span>
              <span className="text-xs text-muted-foreground -mt-0.5">
                Tenant Portal
              </span>
            </div>
          )}
        </Link>
        {onToggle && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map(renderNavItem)}

        <div className="pt-2">
          {renderNavGroup(peopleGroup, peopleOpen, setPeopleOpen)}
        </div>

        <div className="pt-1">
          {renderNavGroup(examGroup, examOpen, setExamOpen)}
        </div>

        <div className="pt-1">
          {renderNavGroup(analyticsGroup, analyticsOpen, setAnalyticsOpen)}
        </div>

        <div className="pt-1">
          {renderNavGroup(communicationGroup, communicationOpen, setCommunicationOpen)}
        </div>

        <div className="pt-2">{bottomItems.map(renderNavItem)}</div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                TA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Tenant Admin
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'admin@tenant.com'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

interface TenantSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const TenantSidebar: React.FC<TenantSidebarProps> = ({ collapsed, onToggle }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute top-4 -right-3 w-6 h-6 rounded-full bg-card border border-border shadow-sm"
        >
          <ChevronLeft className="w-3 h-3 rotate-180" />
        </Button>
      )}
    </aside>
  );
};

export default TenantSidebar;
