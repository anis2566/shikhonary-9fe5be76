import React, { useState } from 'react';
import { Plus, Megaphone, Pin, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAnnouncements } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';

const AnnouncementsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-destructive text-destructive-foreground';
      case 'HIGH':
        return 'bg-amber-500 text-white';
      case 'NORMAL':
        return 'bg-secondary text-secondary-foreground';
      case 'LOW':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage announcements for students and staff
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Create a new announcement to share with your students and staff.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter announcement title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your announcement content here..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select defaultValue="ALL">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Everyone</SelectItem>
                      <SelectItem value="CLASS">Specific Class</SelectItem>
                      <SelectItem value="BATCH">Specific Batch</SelectItem>
                      <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue="NORMAL">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateOpen(false)}>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{mockAnnouncements.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {mockAnnouncements.filter((a) => a.isPublished).length}
            </p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {mockAnnouncements.filter((a) => a.isPinned).length}
            </p>
            <p className="text-xs text-muted-foreground">Pinned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {
                mockAnnouncements.filter(
                  (a) => a.priority === 'HIGH' || a.priority === 'URGENT'
                ).length
              }
            </p>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <Card
            key={announcement.id}
            className={cn(
              'transition-shadow hover:shadow-md',
              announcement.isPinned && 'border-primary/50 bg-primary/5'
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {announcement.isPinned && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </Badge>
                    )}
                    <Badge className={cn('text-xs', getPriorityColor(announcement.priority))}>
                      {announcement.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {announcement.targetType}
                    </Badge>
                    {!announcement.isPublished && (
                      <Badge variant="secondary" className="text-xs">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {announcement.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Posted on{' '}
                    {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin className="w-4 h-4 mr-2" />
                      {announcement.isPinned ? 'Unpin' : 'Pin'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockAnnouncements.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No announcements yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first announcement to share news with your students
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnnouncementsPage;
