import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, Users } from 'lucide-react';
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
import type { Guardian } from '@/lib/tenant-mock-data';

interface GuardianCardProps {
  guardian: Guardian;
  enableSwipe?: boolean;
}

const GuardianCard: React.FC<GuardianCardProps> = ({ guardian, enableSwipe = true }) => {
  const navigate = useNavigate();
  const initials = guardian.name.split(' ').map((n) => n[0]).join('');

  const handleEdit = () => navigate(`/tenant/guardians/${guardian.id}/edit`);
  const handleDelete = () => {
    toast.error(`Delete ${guardian.name}?`, {
      description: 'This action cannot be undone.',
      action: { label: 'Delete', onClick: () => toast.success('Guardian deleted') },
    });
  };

  const cardContent = (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start gap-3 p-4 pb-3">
          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
            <AvatarImage src={guardian.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">{guardian.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{guardian.relationship}</p>
              </div>
              <Badge variant={guardian.isActive ? 'default' : 'secondary'} className="shrink-0 text-[10px] px-1.5">
                {guardian.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="px-4 pb-3 space-y-1.5">
          {guardian.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{guardian.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{guardian.phonePrimary}</span>
          </div>
        </div>

        {guardian.occupation && (
          <div className="px-4 pb-3">
            <Badge variant="outline" className="text-xs">{guardian.occupation}</Badge>
          </div>
        )}

        <div className="px-4 pb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Students ({guardian.studentNames.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {guardian.studentNames.map((name) => (
              <Badge key={name} variant="secondary" className="text-[10px] px-1.5 py-0">{name}</Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 pt-0 border-t mt-2">
          <Button variant="outline" size="sm" className="flex-1 h-8" asChild>
            <Link to={`/tenant/guardians/${guardian.id}`}><Eye className="w-3.5 h-3.5 mr-1.5" />View</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8" asChild>
            <Link to={`/tenant/guardians/${guardian.id}/edit`}><Edit className="w-3.5 h-3.5 mr-1.5" />Edit</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreHorizontal className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {guardian.email && (
                <DropdownMenuItem asChild>
                  <a href={`mailto:${guardian.email}`}><Mail className="w-4 h-4 mr-2" />Send Email</a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <a href={`tel:${guardian.phonePrimary}`}><Phone className="w-4 h-4 mr-2" />Call</a>
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

export default GuardianCard;
