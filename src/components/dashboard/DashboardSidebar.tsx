import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Menu,
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  ListTree,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
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

const navItems: NavItem[] = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Tenants', url: '/admin/tenants', icon: Building2 },
  { title: 'Sessions', url: '/admin/sessions', icon: Shield },
];

const academicGroup: NavGroup = {
  title: 'Academic',
  icon: BookOpen,
  items: [
    { title: 'Hierarchy View', url: '/admin/academic-tree', icon: ListTree },
    { title: 'Boards', url: '/admin/boards', icon: Layers },
    { title: 'Classes', url: '/admin/classes', icon: GraduationCap },
    { title: 'Subjects', url: '/admin/subjects', icon: BookOpen },
    { title: 'Chapters', url: '/admin/chapters', icon: FileText },
    { title: 'Topics', url: '/admin/topics', icon: ListTree },
    { title: 'Sub-Topics', url: '/admin/subtopics', icon: ListTree },
  ],
};

const questionBankGroup: NavGroup = {
  title: 'Question Bank',
  icon: HelpCircle,
  items: [
    { title: 'MCQs', url: '/admin/mcqs', icon: HelpCircle },
    { title: 'CQs', url: '/admin/cqs', icon: FileText },
  ],
};

const bottomItems: NavItem[] = [
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

interface SidebarContentProps {
  collapsed: boolean;
  onToggle?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [academicOpen, setAcademicOpen] = useState(true);
  const [questionBankOpen, setQuestionBankOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (url: string) => location.pathname === url;
  const isGroupActive = (group: NavGroup) => group.items.some((item) => isActive(item.url));

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

  const renderNavGroup = (group: NavGroup, open: boolean, setOpen: (val: boolean) => void) => {
    if (collapsed) {
      return (
        <div className="space-y-1">
          {group.items.map(renderNavItem)}
        </div>
      );
    }

    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <div className="flex items-center gap-3">
            <group.icon className="w-4 h-4 flex-shrink-0" />
            <span>{group.title}</span>
          </div>
          <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
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
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold text-foreground">
              Shikhonary
            </span>
          )}
        </Link>
        {onToggle && !collapsed && (
          <Button variant="ghost" size="icon" onClick={onToggle} className="hidden lg:flex">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(renderNavItem)}
        
        <div className="pt-2">
          {renderNavGroup(academicGroup, academicOpen, setAcademicOpen)}
        </div>
        
        <div className="pt-1">
          {renderNavGroup(questionBankGroup, questionBankOpen, setQuestionBankOpen)}
        </div>

        <div className="pt-2">
          {bottomItems.map(renderNavItem)}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        {user && !collapsed && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
            {user.email}
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

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ collapsed, onToggle }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden">
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

export default DashboardSidebar;
