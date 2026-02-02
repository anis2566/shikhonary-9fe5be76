import React from 'react';
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
  ClipboardList,
  TrendingUp,
  BookOpen,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: 'Main',
    items: [
      { title: 'Dashboard', url: '/tenant', icon: LayoutDashboard },
    ],
  },
  {
    label: 'People',
    items: [
      { title: 'Students', url: '/tenant/students', icon: GraduationCap },
      { title: 'Teachers', url: '/tenant/teachers', icon: UserCheck },
      { title: 'Batches', url: '/tenant/batches', icon: Users },
    ],
  },
  {
    label: 'Examinations',
    items: [
      { title: 'All Exams', url: '/tenant/exams', icon: ClipboardList },
      { title: 'Create Exam', url: '/tenant/exams/create', icon: FileText },
      { title: 'Results', url: '/tenant/results', icon: TrendingUp },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { title: 'Overview', url: '/tenant/analytics', icon: BarChart3 },
      { title: 'Attendance', url: '/tenant/attendance', icon: CalendarDays },
    ],
  },
  {
    label: 'Communication',
    items: [
      { title: 'Announcements', url: '/tenant/announcements', icon: Megaphone },
      { title: 'Notifications', url: '/tenant/notifications', icon: Bell },
    ],
  },
  {
    label: 'Settings',
    items: [
      { title: 'Settings', url: '/tenant/settings', icon: Settings },
    ],
  },
];

interface TenantMobileMenuProps {
  onClose: () => void;
}

const TenantMobileMenu: React.FC<TenantMobileMenuProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
    onClose();
  };

  const isActive = (url: string) => {
    if (url === '/tenant') {
      return location.pathname === url;
    }
    return location.pathname.startsWith(url);
  };

  const handleNavClick = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Shikhonary
            </h2>
            <p className="text-xs text-muted-foreground">Tenant Portal</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              TA
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">Tenant Admin</p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email || 'admin@tenant.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-2">
        {navSections.map((section, sectionIdx) => (
          <div key={section.label} className="mb-4">
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavClick(item.url)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-3 rounded-xl text-base font-medium transition-colors',
                    isActive(item.url)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className={cn(
                    'w-4 h-4',
                    isActive(item.url) ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )} />
                </button>
              ))}
            </div>
            {sectionIdx < navSections.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </ScrollArea>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TenantMobileMenu;
