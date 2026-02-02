import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import NotificationCenter from './NotificationCenter';

const MobileHeader: React.FC = () => {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 lg:hidden bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Tenant Info */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 -ml-2 h-auto py-1.5">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">D</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">Demo Academy</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  Pro
                </Badge>
              </div>
              <ChevronDown className="w-4 h-4 opacity-50 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Current Tenant</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Subscription</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Usage & Limits</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right: Search, Notifications */}
        <div className="flex items-center gap-1">
          {/* Search Dialog */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md top-4 translate-y-0">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students, exams, batches..."
                  className="pl-9"
                  autoFocus
                />
              </div>
              <div className="py-6 text-center text-sm text-muted-foreground">
                Start typing to search...
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <NotificationCenter />

          {/* Profile Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    TA
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Tenant Admin</p>
                  <p className="text-xs text-muted-foreground">
                    admin@demoacademy.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
