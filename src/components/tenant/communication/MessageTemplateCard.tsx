import React from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Copy,
  Edit,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageTemplate, getCategoryDisplayName } from '@/lib/message-templates';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface MessageTemplateCardProps {
  template: MessageTemplate;
  onSelect?: (template: MessageTemplate) => void;
  onEdit?: (template: MessageTemplate) => void;
  isSelected?: boolean;
}

const channelIcons = {
  sms: Phone,
  whatsapp: MessageSquare,
  email: Mail,
};

const categoryColors: Record<string, string> = {
  attendance: 'bg-amber-500/10 text-amber-600 border-amber-200',
  results: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  fees: 'bg-primary/10 text-primary border-primary/20',
  exam: 'bg-purple-500/10 text-purple-600 border-purple-200',
  general: 'bg-muted text-muted-foreground border-border',
};

const MessageTemplateCard: React.FC<MessageTemplateCardProps> = ({
  template,
  onSelect,
  onEdit,
  isSelected = false,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(template.body);
    toast({
      title: 'Copied!',
      description: 'Template copied to clipboard',
    });
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary border-primary'
      )}
      onClick={() => onSelect?.(template)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">{template.name}</h4>
            <Badge
              variant="outline"
              className={cn('text-xs mt-1', categoryColors[template.category])}
            >
              {getCategoryDisplayName(template.category)}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Template
              </DropdownMenuItem>
              {!template.isDefault && onEdit && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(template); }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Template
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.body}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            {template.channels.map((channel) => {
              const Icon = channelIcons[channel];
              return (
                <div
                  key={channel}
                  className="p-1.5 rounded-md bg-muted"
                  title={channel.toUpperCase()}
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground">
            {template.variables.length} variables
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageTemplateCard;
