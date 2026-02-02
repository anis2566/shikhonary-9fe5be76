import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  FileText, 
  Hash, 
  Calendar, 
  Link2, 
  Image as ImageIcon,
  Calculator,
  Tag,
  Layers,
  MessageSquare,
  ExternalLink,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Power
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface McqCardData {
  id: string;
  question: string;
  options: string[];
  statements: string[];
  answer: string;
  type: string;
  reference: string[];
  explanation?: string;
  isMath: boolean;
  session: number;
  source?: string;
  questionUrl?: string;
  context?: string;
  contextUrl?: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  subTopicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Resolved names for display
  subjectName?: string;
  chapterName?: string;
  topicName?: string;
  subTopicName?: string;
}

interface McqCardProps {
  mcq: McqCardData;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onToggleStatus?: () => void;
}

function TypeBadge({ type }: { type: string }) {
  const typeColors: Record<string, string> = {
    'single': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'multiple': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'assertion': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'statement': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  };
  
  return (
    <Badge className={cn('text-xs capitalize', typeColors[type.toLowerCase()] || 'bg-muted text-muted-foreground')}>
      {type}
    </Badge>
  );
}

function OptionItem({ option, index, isCorrect }: { option: string; index: number; isCorrect: boolean }) {
  const letter = String.fromCharCode(65 + index); // A, B, C, D...
  
  return (
    <div
      className={cn(
        'flex items-start gap-2 p-2 rounded-md text-sm transition-colors',
        isCorrect 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
          : 'bg-muted/50'
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
          isCorrect 
            ? 'bg-green-500 text-white' 
            : 'bg-muted-foreground/20 text-muted-foreground'
        )}
      >
        {letter}
      </span>
      <span className={cn('flex-1', isCorrect && 'font-medium text-green-700 dark:text-green-400')}>
        {option}
      </span>
      {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
    </div>
  );
}

const McqCard: React.FC<McqCardProps> = ({
  mcq,
  selected = false,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
}) => {
  const hasActions = onView || onEdit || onDelete || onDuplicate || onToggleStatus;

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all hover:shadow-md',
      selected && 'ring-2 ring-primary',
      !mcq.isActive && 'opacity-60'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {onSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onSelect(mcq.id)}
              className="mt-1"
              aria-label={`Select MCQ ${mcq.id}`}
            />
          )}
          <div className="flex-1 min-w-0">
            {/* Top badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <TypeBadge type={mcq.type} />
              <Badge variant={mcq.isActive ? 'default' : 'secondary'} className={cn(
                'text-xs',
                mcq.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' : ''
              )}>
                {mcq.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {mcq.isMath && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Calculator className="w-3 h-3" />
                  Math
                </Badge>
              )}
              <Badge variant="outline" className="text-xs gap-1">
                <Hash className="w-3 h-3" />
                Session {mcq.session}
              </Badge>
            </div>
            
            {/* Question */}
            <p className="font-medium text-foreground leading-relaxed">{mcq.question}</p>
          </div>
          
          {hasActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={onView}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                {onToggleStatus && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onToggleStatus}>
                      <Power className="w-4 h-4 mr-2" />
                      {mcq.isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                  </>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Context (if available) */}
        {mcq.context && (
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1 text-xs font-medium text-muted-foreground">
              <FileText className="w-3 h-3" />
              Context
              {mcq.contextUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={mcq.contextUrl} target="_blank" rel="noopener noreferrer" className="ml-auto hover:text-primary">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>View context image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{mcq.context}</p>
          </div>
        )}

        {/* Statements (if available) */}
        {mcq.statements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <MessageSquare className="w-3 h-3" />
              Statements
            </div>
            <div className="space-y-1">
              {mcq.statements.map((statement, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm p-2 bg-muted/30 rounded-md">
                  <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                  <span>{statement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Layers className="w-3 h-3" />
            Options
            {mcq.questionUrl && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={mcq.questionUrl} target="_blank" rel="noopener noreferrer" className="ml-auto hover:text-primary">
                      <ImageIcon className="w-3 h-3" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>View question image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="grid gap-2">
            {mcq.options.map((option, idx) => (
              <OptionItem 
                key={idx} 
                option={option} 
                index={idx} 
                isCorrect={option === mcq.answer || String.fromCharCode(65 + idx) === mcq.answer}
              />
            ))}
          </div>
        </div>

        {/* Explanation (if available) */}
        {mcq.explanation && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1 text-xs font-medium text-blue-700 dark:text-blue-400">
              <BookOpen className="w-3 h-3" />
              Explanation
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300">{mcq.explanation}</p>
          </div>
        )}

        {/* Reference (if available) */}
        {mcq.reference.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              References:
            </span>
            {mcq.reference.map((ref, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {ref}
              </Badge>
            ))}
          </div>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          {mcq.subjectName && (
            <Badge variant="secondary" className="text-xs">
              {mcq.subjectName}
            </Badge>
          )}
          {mcq.chapterName && (
            <Badge variant="outline" className="text-xs">
              {mcq.chapterName}
            </Badge>
          )}
          {mcq.topicName && (
            <Badge variant="outline" className="text-xs bg-muted/50">
              {mcq.topicName}
            </Badge>
          )}
          {mcq.subTopicName && (
            <Badge variant="outline" className="text-xs bg-muted/30">
              {mcq.subTopicName}
            </Badge>
          )}
        </div>

        {/* Footer metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {mcq.source && (
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {mcq.source}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(mcq.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default McqCard;
