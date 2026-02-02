import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  X,
  GraduationCap,
  FileText,
  Users,
  UserCheck,
  CalendarCheck,
  Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Add Student',
    icon: GraduationCap,
    route: '/tenant/students/create',
    color: 'bg-primary text-primary-foreground',
  },
  {
    label: 'Create Exam',
    icon: FileText,
    route: '/tenant/exams/create',
    color: 'bg-accent text-accent-foreground',
  },
  {
    label: 'Add Teacher',
    icon: UserCheck,
    route: '/tenant/teachers/create',
    color: 'bg-secondary text-secondary-foreground',
  },
  {
    label: 'Create Batch',
    icon: Users,
    route: '/tenant/batches/create',
    color: 'bg-muted text-foreground',
  },
  {
    label: 'Mark Attendance',
    icon: CalendarCheck,
    route: '/tenant/attendance',
    color: 'bg-primary/80 text-primary-foreground',
  },
  {
    label: 'Announcement',
    icon: Megaphone,
    route: '/tenant/announcements/create',
    color: 'bg-accent/80 text-accent-foreground',
  },
];

const QuickActionsFab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleActionClick = (route: string) => {
    setIsOpen(false);
    navigate(route);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <div className="fixed bottom-20 right-4 z-50 lg:hidden flex flex-col items-end gap-3">
        {/* Action Items */}
        <div
          className={cn(
            'flex flex-col gap-2 transition-all duration-300 ease-out',
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          )}
        >
          {quickActions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => handleActionClick(action.route)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-all duration-200',
                'hover:scale-105 active:scale-95',
                action.color
              )}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium whitespace-nowrap pr-1">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Main FAB Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className={cn(
            'w-14 h-14 rounded-full shadow-lg transition-all duration-300',
            'hover:scale-110 active:scale-95',
            isOpen
              ? 'bg-destructive hover:bg-destructive/90 rotate-45'
              : 'gradient-primary hover:opacity-90'
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </Button>
      </div>
    </>
  );
};

export default QuickActionsFab;
