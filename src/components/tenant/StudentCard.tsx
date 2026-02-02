import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import SwipeableCard from '@/components/ui/swipeable-card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Student } from '@/lib/tenant-mock-data';

interface StudentCardProps {
  student: Student;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showCheckbox?: boolean;
  enableSwipe?: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isSelected = false,
  onSelect,
  showCheckbox = false,
  enableSwipe = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/tenant/students/${student.id}/edit`);
  };

  const handleDelete = () => {
    toast.error(`Delete ${student.name}?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => toast.success('Student deleted'),
      },
    });
  };

  const cardContent = (
    <Card className={cn(
      'transition-all',
      isSelected && 'ring-2 ring-primary'
    )}>
      <CardContent className="p-4">
        {/* Header with Avatar and Actions */}
        <div className="flex items-start gap-3">
          {showCheckbox && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect?.(student.id)}
              className="mt-1"
            />
          )}
          
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={student.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{student.name}</h3>
                <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
              </div>
              <Badge 
                variant={student.isActive ? 'default' : 'secondary'}
                className="shrink-0 text-[10px] px-1.5"
              >
                {student.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Class</p>
            <p className="text-xs font-medium mt-0.5">{student.className}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Batch</p>
            <p className="text-xs font-medium mt-0.5 truncate">{student.batchName || 'N/A'}</p>
          </div>
          {student.group && (
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Group</p>
              <p className="text-xs font-medium mt-0.5">{student.group}</p>
            </div>
          )}
          {student.roll && (
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Roll</p>
              <p className="text-xs font-medium mt-0.5">{student.roll}</p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-3 space-y-1.5">
          {student.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{student.email}</span>
            </div>
          )}
          {student.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{student.phone}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            asChild
          >
            <Link to={`/tenant/students/${student.id}`}>
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            asChild
          >
            <Link to={`/tenant/students/${student.id}/edit`}>
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="w-4 h-4 mr-2" />
                Call
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
  );

  if (enableSwipe) {
    return (
      <SwipeableCard onEdit={handleEdit} onDelete={handleDelete}>
        {cardContent}
      </SwipeableCard>
    );
  }

  return cardContent;
};

export default StudentCard;
