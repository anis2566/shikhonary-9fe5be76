import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  FileText,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
  CreditCard,
  Megaphone,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface Notification {
  id: string;
  type: 'exam' | 'student' | 'attendance' | 'result' | 'payment' | 'announcement' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'all' | 'exams' | 'students' | 'alerts';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'exam',
    title: 'Exam completed',
    message: 'Physics Weekly Test has been completed by 23 students',
    time: '5 min ago',
    read: false,
    category: 'exams',
  },
  {
    id: '2',
    type: 'student',
    title: 'New enrollment',
    message: 'Ayesha Khan has joined Class 10 - Morning Batch',
    time: '1 hour ago',
    read: false,
    category: 'students',
  },
  {
    id: '3',
    type: 'alert',
    title: 'Low attendance alert',
    message: '5 students have been absent for 3+ consecutive days',
    time: '2 hours ago',
    read: false,
    category: 'alerts',
  },
  {
    id: '4',
    type: 'result',
    title: 'Results published',
    message: 'Math Quiz results are now available for review',
    time: '3 hours ago',
    read: true,
    category: 'exams',
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment received',
    message: 'Monthly fee received from 15 students',
    time: '5 hours ago',
    read: true,
    category: 'students',
  },
  {
    id: '6',
    type: 'attendance',
    title: 'Attendance marked',
    message: 'Morning batch attendance has been recorded',
    time: '6 hours ago',
    read: true,
    category: 'students',
  },
  {
    id: '7',
    type: 'announcement',
    title: 'Holiday notice',
    message: 'Institution will remain closed on Feb 5th',
    time: '1 day ago',
    read: true,
    category: 'all',
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'exam':
      return FileText;
    case 'student':
      return GraduationCap;
    case 'attendance':
      return CalendarDays;
    case 'result':
      return TrendingUp;
    case 'payment':
      return CreditCard;
    case 'announcement':
      return Megaphone;
    case 'alert':
      return AlertTriangle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'exam':
      return 'bg-primary/10 text-primary';
    case 'student':
      return 'bg-accent/10 text-accent';
    case 'alert':
      return 'bg-destructive/10 text-destructive';
    case 'result':
      return 'bg-emerald-500/10 text-emerald-600';
    case 'payment':
      return 'bg-amber-500/10 text-amber-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onDismiss,
}) => {
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer group',
        notification.read ? 'bg-background' : 'bg-muted/30',
        'hover:bg-muted/50'
      )}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      <div className={cn('p-2 rounded-lg shrink-0', colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm truncate',
              notification.read ? 'font-normal' : 'font-medium'
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {notification.time}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkRead,
  onDismiss,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Bell className="w-10 h-10 mb-3 opacity-50" />
        <p className="text-sm">No notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filterByCategory = (category: string) => {
    if (category === 'all') return notifications;
    return notifications.filter((n) => n.category === category);
  };

  const NotificationContent = () => (
    <div className="flex flex-col h-full">
      {/* Header with actions */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="h-5 px-1.5">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" />
            Mark all read
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col mt-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="exams" className="text-xs">Exams</TabsTrigger>
          <TabsTrigger value="students" className="text-xs">Students</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 -mx-4 px-4 mt-4">
          <TabsContent value="all" className="m-0">
            <NotificationList
              notifications={filterByCategory('all')}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          </TabsContent>
          <TabsContent value="exams" className="m-0">
            <NotificationList
              notifications={filterByCategory('exams')}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          </TabsContent>
          <TabsContent value="students" className="m-0">
            <NotificationList
              notifications={filterByCategory('students')}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          </TabsContent>
          <TabsContent value="alerts" className="m-0">
            <NotificationList
              notifications={filterByCategory('alerts')}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Footer */}
      <div className="pt-4 border-t border-border mt-4">
        <Button variant="outline" className="w-full" size="sm">
          View all notifications
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  // Mobile: Use Sheet (bottom drawer)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <NotificationContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Dropdown
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-4">
        <NotificationContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
