import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import TenantMobileMenu from './TenantMobileMenu';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const bottomNavItems: NavItem[] = [
  { title: 'Home', url: '/tenant', icon: LayoutDashboard },
  { title: 'Students', url: '/tenant/students', icon: GraduationCap },
  { title: 'Exams', url: '/tenant/exams', icon: ClipboardList },
  { title: 'Analytics', url: '/tenant/analytics', icon: BarChart3 },
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (url: string) => {
    if (url === '/tenant') {
      return location.pathname === url;
    }
    return location.pathname.startsWith(url);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {bottomNavItems.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-lg transition-colors min-w-0',
              isActive(item.url)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon className={cn(
              'w-5 h-5 transition-transform',
              isActive(item.url) && 'scale-110'
            )} />
            <span className={cn(
              'text-[10px] font-medium truncate',
              isActive(item.url) && 'font-semibold'
            )}>
              {item.title}
            </span>
          </Link>
        ))}
        
        {/* More Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
            <TenantMobileMenu onClose={() => setIsMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
