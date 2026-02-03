import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users,
  Calendar,
  Play,
  Copy,
  FileText,
  TrendingUp,
  FileQuestion,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import SwipeableCard from '@/components/ui/swipeable-card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Exam } from '@/lib/tenant-mock-data';

interface ExamCardProps {
  exam: Exam;
  enableSwipe?: boolean;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, enableSwipe = true }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Ongoing':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Published':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'WEEKLY':
        return 'bg-primary/10 text-primary';
      case 'MONTHLY':
        return 'bg-purple-500/10 text-purple-600';
      case 'TERM':
        return 'bg-orange-500/10 text-orange-600';
      case 'MOCK':
        return 'bg-cyan-500/10 text-cyan-600';
      case 'PRACTICE':
        return 'bg-emerald-500/10 text-emerald-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return <Play className="w-3 h-3" />;
      case 'Completed':
        return <TrendingUp className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleEdit = () => {
    navigate(`/tenant/exams/${exam.id}/edit`);
  };

  const handleDelete = () => {
    toast.error(`Delete "${exam.title}"?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => toast.success('Exam deleted'),
      },
    });
  };

  const cardContent = (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header with type color accent */}
        <div className={cn('px-4 py-2 flex items-center justify-between', getTypeColor(exam.type))}>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">{exam.type}</span>
          </div>
          <Badge 
            variant="outline" 
            className={cn('text-[10px] gap-1', getStatusColor(exam.status))}
          >
            {getStatusIcon(exam.status)}
            {exam.status}
          </Badge>
        </div>

        <div className="p-4">
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="font-semibold text-sm line-clamp-1">{exam.title}</h3>
            {exam.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {exam.description}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">{exam.totalMarks}</p>
              <p className="text-[10px] text-muted-foreground">Marks</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">{exam.duration}</p>
              <p className="text-[10px] text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">{exam.attemptCount}</p>
              <p className="text-[10px] text-muted-foreground">Attempts</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </div>
              <span className="font-medium">
                {new Date(exam.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            
            {exam.batchName && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>Batch</span>
                </div>
                <span className="font-medium truncate max-w-[120px]">{exam.batchName}</span>
              </div>
            )}

            {exam.avgScore > 0 && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Avg Score</span>
                </div>
                <span className="font-medium text-primary">{exam.avgScore.toFixed(1)}%</span>
              </div>
            )}
          </div>

          {/* Question breakdown */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            {exam.mcq && (
              <Badge variant="secondary" className="text-[10px] px-1.5">
                {exam.mcq} MCQ
              </Badge>
            )}
            {exam.cq && (
              <Badge variant="secondary" className="text-[10px] px-1.5">
                {exam.cq} CQ
              </Badge>
            )}
            {exam.hasNegativeMark && (
              <Badge variant="outline" className="text-[10px] px-1.5 text-amber-600 border-amber-200">
                -{exam.negativeMark} neg
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-xs"
              asChild
            >
              <Link to={`/tenant/exams/${exam.id}`}>
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                View
              </Link>
            </Button>
            {exam.status === 'Pending' && (
              <Button 
                size="sm" 
                className="flex-1 h-8 text-xs"
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Publish
              </Button>
            )}
            {exam.status !== 'Pending' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-xs"
                asChild
              >
                <Link to={`/tenant/exams/${exam.id}/edit`}>
                  <Edit className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Link>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/tenant/exams/${exam.id}/questions`}>
                    <FileQuestion className="w-4 h-4 mr-2" />
                    Select Questions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  View Attempts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

export default ExamCard;
