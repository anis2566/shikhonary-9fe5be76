import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import SwipeableCard from '@/components/ui/swipeable-card';
import { toast } from 'sonner';
import type { Staff } from '@/lib/tenant-mock-data';

interface StaffCardProps {
  staff: Staff;
  enableSwipe?: boolean;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, enableSwipe = true }) => {
  const navigate = useNavigate();
  const initials = staff.name.split(' ').map((n) => n[0]).join('');

  const handleEdit = () => navigate(`/tenant/staff/${staff.id}/edit`);
  const handleDelete = () => {
    toast.error(`Delete ${staff.name}?`, {
      description: 'This action cannot be undone.',
      action: { label: 'Delete', onClick: () => toast.success('Staff member deleted') },
    });
  };

  const cardContent = (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start gap-3 p-4 pb-3">
          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
            <AvatarImage src={staff.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">{staff.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{staff.designation}</p>
              </div>
              <Badge variant={staff.isActive ? 'default' : 'secondary'} className="shrink-0 text-[10px] px-1.5">
                {staff.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="px-4 pb-3 space-y-1.5">
          {staff.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{staff.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{staff.phone}</span>
          </div>
        </div>

        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs">
            <Briefcase className="w-3 h-3 mr-1" />{staff.department}
          </Badge>
          <Badge variant="secondary" className="text-xs">ID: {staff.employeeId}</Badge>
        </div>

        <div className="flex items-center gap-2 p-3 pt-0 border-t mt-2">
          <Button variant="outline" size="sm" className="flex-1 h-8" asChild>
            <Link to={`/tenant/staff/${staff.id}`}><Eye className="w-3.5 h-3.5 mr-1.5" />View</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8" asChild>
            <Link to={`/tenant/staff/${staff.id}/edit`}><Edit className="w-3.5 h-3.5 mr-1.5" />Edit</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreHorizontal className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {staff.email && (
                <DropdownMenuItem asChild>
                  <a href={`mailto:${staff.email}`}><Mail className="w-4 h-4 mr-2" />Send Email</a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <a href={`tel:${staff.phone}`}><Phone className="w-4 h-4 mr-2" />Call</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  if (enableSwipe) {
    return <SwipeableCard onEdit={handleEdit} onDelete={handleDelete}>{cardContent}</SwipeableCard>;
  }
  return cardContent;
};

export default StaffCard;
