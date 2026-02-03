import React from 'react';
import { FileText, Eye, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface TenantCqCardData {
  id: string;
  context?: string;
  questionA: string;
  questionB: string;
  questionC: string;
  questionD: string;
  marks: number;
  subjectName?: string;
  chapterName?: string;
  topicName?: string;
}

interface TenantCqCardProps {
  cq: TenantCqCardData;
  onView?: () => void;
}

const TenantCqCard: React.FC<TenantCqCardProps> = ({ cq, onView }) => {
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs gap-1">
                <FileText className="w-3 h-3" />
                Creative Question
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                <Award className="w-3 h-3" />
                {cq.marks} Marks
              </Badge>
            </div>
          </div>
          
          {onView && (
            <Button variant="ghost" size="icon" onClick={onView} className="h-8 w-8 flex-shrink-0">
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Context/Passage */}
        {cq.context && (
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              Passage / Context
            </div>
            <p className="text-sm text-foreground leading-relaxed">{cq.context}</p>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground">Questions</div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2 bg-muted/30 rounded-md">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                A
              </span>
              <p className="text-sm flex-1">{cq.questionA}</p>
            </div>
            <div className="flex items-start gap-3 p-2 bg-muted/30 rounded-md">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                B
              </span>
              <p className="text-sm flex-1">{cq.questionB}</p>
            </div>
            <div className="flex items-start gap-3 p-2 bg-muted/30 rounded-md">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                C
              </span>
              <p className="text-sm flex-1">{cq.questionC}</p>
            </div>
            <div className="flex items-start gap-3 p-2 bg-muted/30 rounded-md">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                D
              </span>
              <p className="text-sm flex-1">{cq.questionD}</p>
            </div>
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          {cq.subjectName && (
            <Badge variant="secondary" className="text-xs">
              {cq.subjectName}
            </Badge>
          )}
          {cq.chapterName && (
            <Badge variant="outline" className="text-xs">
              {cq.chapterName}
            </Badge>
          )}
          {cq.topicName && (
            <Badge variant="outline" className="text-xs bg-muted/50">
              {cq.topicName}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantCqCard;
