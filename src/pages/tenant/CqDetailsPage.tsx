import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCqs, getSubjectById, getChapterById, getTopicById } from '@/lib/academic-mock-data';

const CqDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const cq = mockCqs.find((c) => c.id === id);

  if (!cq) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">CQ Not Found</h2>
          <p className="text-muted-foreground mb-4">The question you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/tenant/question-bank?tab=cqs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Question Bank
          </Button>
        </div>
      </div>
    );
  }

  const subject = getSubjectById(cq.subjectId);
  const chapter = getChapterById(cq.chapterId);
  const topic = cq.topicId ? getTopicById(cq.topicId) : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/question-bank?tab=cqs')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">CQ Details</h1>
            <p className="text-sm text-muted-foreground">View creative question information</p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Type & Marks */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1 text-sm">
            <FileText className="w-3 h-3" />
            Creative Question
          </Badge>
          <Badge variant="default" className="gap-1 text-sm">
            <Award className="w-3 h-3" />
            {cq.marks} Marks
          </Badge>
        </div>

        {/* Context/Passage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Passage / Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed text-lg">{cq.context}</p>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                  A
                </span>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed">{cq.questionA}</p>
                  <p className="text-xs text-muted-foreground mt-2">Knowledge-based question</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                  B
                </span>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed">{cq.questionB}</p>
                  <p className="text-xs text-muted-foreground mt-2">Comprehension-based question</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                  C
                </span>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed">{cq.questionC}</p>
                  <p className="text-xs text-muted-foreground mt-2">Application-based question</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                  D
                </span>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed">{cq.questionD}</p>
                  <p className="text-xs text-muted-foreground mt-2">Higher-order thinking question</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CqDetailsPage;
