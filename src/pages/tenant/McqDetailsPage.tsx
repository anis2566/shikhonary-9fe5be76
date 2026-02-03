import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, BookOpen, FileText, Hash, Link2, Calculator, Tag, Layers, MessageSquare, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { mockMcqs, getSubjectById, getChapterById, getTopicById, getSubTopicById } from '@/lib/academic-mock-data';

const McqDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mcq = mockMcqs.find((m) => m.id === id);

  if (!mcq) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">MCQ Not Found</h2>
          <p className="text-muted-foreground mb-4">The question you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/tenant/question-bank')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Question Bank
          </Button>
        </div>
      </div>
    );
  }

  const subject = getSubjectById(mcq.subjectId);
  const chapter = getChapterById(mcq.chapterId);
  const topic = mcq.topicId ? getTopicById(mcq.topicId) : null;
  const subTopic = mcq.subTopicId ? getSubTopicById(mcq.subTopicId) : null;

  const typeColors: Record<string, string> = {
    'single': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'multiple': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'assertion': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'statement': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/question-bank')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">MCQ Details</h1>
            <p className="text-sm text-muted-foreground">View question information</p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Type & Status */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn('text-sm capitalize', typeColors[mcq.type.toLowerCase()])}>
            {mcq.type}
          </Badge>
          {mcq.isMath && (
            <Badge variant="outline" className="gap-1">
              <Calculator className="w-3 h-3" />
              Math
            </Badge>
          )}
          <Badge variant="outline" className="gap-1">
            <Hash className="w-3 h-3" />
            Session {mcq.session}
          </Badge>
          {mcq.source && (
            <Badge variant="secondary" className="gap-1">
              <Tag className="w-3 h-3" />
              {mcq.source}
            </Badge>
          )}
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed text-lg">{mcq.question}</p>

            {mcq.questionUrl && (
              <a href={mcq.questionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <ImageIcon className="w-4 h-4" />
                View Question Image
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </CardContent>
        </Card>

        {/* Context */}
        {mcq.context && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Context / Passage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{mcq.context}</p>
              {mcq.contextUrl && (
                <a href={mcq.contextUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline mt-3">
                  <ImageIcon className="w-4 h-4" />
                  View Context Image
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </CardContent>
          </Card>
        )}

        {/* Statements */}
        {mcq.statements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Statements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mcq.statements.map((statement, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                    <span>{statement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mcq.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isCorrect = option === mcq.answer || letter === mcq.answer;
                return (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg transition-colors',
                      isCorrect 
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700' 
                        : 'bg-muted/50 border border-border'
                    )}
                  >
                    <span
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                        isCorrect 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted-foreground/20 text-muted-foreground'
                      )}
                    >
                      {letter}
                    </span>
                    <span className={cn('flex-1 pt-1', isCorrect && 'font-medium text-green-700 dark:text-green-400')}>
                      {option}
                    </span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        {mcq.explanation && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <BookOpen className="w-5 h-5" />
                Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 dark:text-blue-300 leading-relaxed">{mcq.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* References */}
        {mcq.reference.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mcq.reference.map((ref, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {ref}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Academic Path */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {subject && <Badge variant="default">{subject.displayName}</Badge>}
              {chapter && <Badge variant="secondary">{chapter.displayName}</Badge>}
              {topic && <Badge variant="outline">{topic.displayName}</Badge>}
              {subTopic && <Badge variant="outline" className="bg-muted/50">{subTopic.displayName}</Badge>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default McqDetailsPage;
