import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Users,
  GraduationCap,
  Droplets,
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
  DropdownMenuLabel,
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
  variant?: 'default' | 'compact';
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isSelected = false,
  onSelect,
  showCheckbox = false,
  enableSwipe = true,
  variant = 'default',
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const cardContent = (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary bg-primary/5',
        'overflow-hidden'
      )}
    >
      {/* Status Bar */}
      <div
        className={cn(
          'h-1 w-full',
          student.isActive ? 'bg-green-500' : 'bg-muted'
        )}
      />

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

          <div className="relative">
            <Avatar className="h-14 w-14 shrink-0 border-2 border-background shadow-sm">
              <AvatarImage src={student.imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            {student.isActive && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-base truncate">{student.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">ID: {student.studentId}</span>
                  {student.roll && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">Roll: {student.roll}</span>
                    </>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/tenant/students/${student.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/tenant/students/${student.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Student
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Academic Info Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs font-normal">
            <GraduationCap className="w-3 h-3 mr-1" />
            {student.className}
          </Badge>
          {student.batchName && (
            <Badge variant="outline" className="text-xs font-normal">
              <Users className="w-3 h-3 mr-1" />
              {student.batchName}
            </Badge>
          )}
          {student.group && (
            <Badge variant="outline" className="text-xs font-normal">
              {student.group}
            </Badge>
          )}
          {student.section && (
            <Badge variant="outline" className="text-xs font-normal">
              Sec: {student.section}
            </Badge>
          )}
        </div>

        {/* Info Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {student.fatherName && (
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <User className="w-3 h-3 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Father
                </p>
              </div>
              <p className="text-xs font-medium truncate">{student.fatherName}</p>
            </div>
          )}
          {student.motherName && (
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <User className="w-3 h-3 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Mother
                </p>
              </div>
              <p className="text-xs font-medium truncate">{student.motherName}</p>
            </div>
          )}
          {student.dateOfBirth && (
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  DOB
                </p>
              </div>
              <p className="text-xs font-medium">{formatDate(student.dateOfBirth)}</p>
            </div>
          )}
          {student.bloodGroup && (
            <div className="bg-muted/50 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Droplets className="w-3 h-3 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Blood
                </p>
              </div>
              <p className="text-xs font-medium">{student.bloodGroup}</p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-3 space-y-2">
          {student.email && (
            <div className="flex items-center gap-2 text-xs">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Mail className="w-3 h-3" />
              </div>
              <span className="truncate text-muted-foreground">{student.email}</span>
            </div>
          )}
          {student.primaryPhone && (
            <div className="flex items-center gap-2 text-xs">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Phone className="w-3 h-3" />
              </div>
              <span className="text-muted-foreground">{student.primaryPhone}</span>
              {student.secondaryPhone && (
                <span className="text-muted-foreground/70">
                  / {student.secondaryPhone}
                </span>
              )}
            </div>
          )}
          {student.presentAddress && (
            <div className="flex items-start gap-2 text-xs">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                <MapPin className="w-3 h-3" />
              </div>
              <span className="text-muted-foreground line-clamp-2">
                {student.presentAddress}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-9" asChild>
            <Link to={`/tenant/students/${student.id}`}>
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-9" asChild>
            <Link to={`/tenant/students/${student.id}/edit`}>
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Link>
          </Button>
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
