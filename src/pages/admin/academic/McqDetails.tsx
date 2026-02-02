import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, ChevronRight, CheckCircle, XCircle, Copy, Calculator, Hash, Tag, Link2, ExternalLink, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockMcqs, getSubjectById, getChapterById, getTopicById, getSubTopicById, getClassById } from '@/lib/academic-mock-data';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const McqDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const mcq = mockMcqs.find((m) => m.id === id);
  const subject = mcq ? getSubjectById(mcq.subjectId) : null;
  const chapter = mcq ? getChapterById(mcq.chapterId) : null;
  const topic = mcq?.topicId ? getTopicById(mcq.topicId) : null;
  const subTopic = mcq?.subTopicId ? getSubTopicById(mcq.subTopicId) : null;
  const cls = subject ? getClassById(subject.classId) : null;

  if (!mcq) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-2">MCQ Not Found</h1><Button onClick={() => navigate('/admin/mcqs')}>Back</Button></div></div>;
  }

  const handleDelete = () => { toast.success('MCQ deleted'); navigate('/admin/mcqs'); };
  const handleDuplicate = () => { toast.success('MCQ duplicated'); };

  const typeColors: Record<string, string> = {
    'single': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'multiple': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'assertion': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'statement': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/mcqs')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl lg:text-2xl font-bold">MCQ Details</h1>
                  <Badge className={cn('capitalize', typeColors[mcq.type.toLowerCase()] || 'bg-muted')}>{mcq.type}</Badge>
                  {mcq.isMath && (
                    <Badge variant="outline" className="gap-1">
                      <Calculator className="w-3 h-3" />
                      Math
                    </Badge>
                  )}
                  <Badge variant={mcq.isActive ? 'default' : 'secondary'} className={mcq.isActive ? 'bg-green-100 text-green-700' : ''}>{mcq.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{subject?.displayName} • {chapter?.displayName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDuplicate}><Copy className="h-4 w-4 mr-2" />Duplicate</Button>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              <Button onClick={() => navigate(`/admin/mcqs/${id}/edit`)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
          <Link to={`/admin/classes/${cls?.id}`} className="hover:text-foreground">{cls?.displayName}</Link><ChevronRight className="h-3 w-3" />
          <Link to={`/admin/subjects/${subject?.id}`} className="hover:text-foreground">{subject?.displayName}</Link><ChevronRight className="h-3 w-3" />
          <Link to={`/admin/chapters/${chapter?.id}`} className="hover:text-foreground">{chapter?.displayName}</Link>
          {topic && <><ChevronRight className="h-3 w-3" /><Link to={`/admin/topics/${topic.id}`} className="hover:text-foreground">{topic.displayName}</Link></>}
          {subTopic && <><ChevronRight className="h-3 w-3" /><Link to={`/admin/subtopics/${subTopic.id}`} className="hover:text-foreground">{subTopic.displayName}</Link></>}
        </div>

        {/* Context (if available) */}
        {mcq.context && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Context
                {mcq.contextUrl && (
                  <a href={mcq.contextUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary hover:underline text-sm font-normal flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    View Image
                  </a>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mcq.context}</p>
            </CardContent>
          </Card>
        )}

        {/* Question */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              Question
              {mcq.questionUrl && (
                <a href={mcq.questionUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary hover:underline text-sm font-normal flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  View Image
                </a>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium whitespace-pre-line">{mcq.question}</p>
          </CardContent>
        </Card>

        {/* Statements (if available) */}
        {mcq.statements.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />
                Statements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mcq.statements.map((statement, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 bg-muted/30 rounded-md">
                  <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                  <span>{statement}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Options */}
        <Card>
          <CardHeader><CardTitle>Options</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mcq.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isCorrect = option === mcq.answer || letter === mcq.answer;
              return (
                <div key={index} className={cn('flex items-center gap-3 p-3 rounded-lg border', isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-border')}>
                  <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', isCorrect ? 'bg-green-500 text-white' : 'bg-muted')}>{letter}</span>
                  <span className="flex-1">{option}</span>
                  {isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-muted-foreground/30" />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Explanation */}
        {mcq.explanation && (
          <Card>
            <CardHeader><CardTitle>Explanation</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mcq.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* References */}
        {mcq.reference.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="h-4 w-4" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mcq.reference.map((ref, idx) => (
                  <Badge key={idx} variant="outline">{ref}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Classification</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Subject</span><Link to={`/admin/subjects/${subject?.id}`} className="text-primary hover:underline">{subject?.displayName}</Link></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Chapter</span><Link to={`/admin/chapters/${chapter?.id}`} className="text-primary hover:underline">{chapter?.displayName}</Link></div>
              {topic && <><Separator /><div className="flex justify-between"><span className="text-muted-foreground">Topic</span><Link to={`/admin/topics/${topic.id}`} className="text-primary hover:underline">{topic.displayName}</Link></div></>}
              {subTopic && <><Separator /><div className="flex justify-between"><span className="text-muted-foreground">Sub-Topic</span><Link to={`/admin/subtopics/${subTopic.id}`} className="text-primary hover:underline">{subTopic.displayName}</Link></div></>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type</span>
                <Badge className={cn('capitalize', typeColors[mcq.type.toLowerCase()] || 'bg-muted')}>{mcq.type}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Session</span>
                <Badge variant="outline" className="gap-1">
                  <Hash className="w-3 h-3" />
                  {mcq.session}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Math Content</span>
                <Badge variant={mcq.isMath ? 'default' : 'secondary'}>
                  {mcq.isMath ? 'Yes' : 'No'}
                </Badge>
              </div>
              {mcq.source && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Source</span>
                    <span className="flex items-center gap-1 text-sm">
                      <Tag className="w-3 h-3" />
                      {mcq.source}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Created</span><span className="text-sm">{mcq.createdAt.toLocaleDateString()}</span></div>
              <Separator />
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Updated</span><span className="text-sm">{mcq.updatedAt.toLocaleDateString()}</span></div>
              <Separator />
              <div><p className="text-xs text-muted-foreground mb-1">MCQ ID</p><code className="text-xs bg-muted px-2 py-1 rounded block break-all">{mcq.id}</code></div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete MCQ" description="Are you sure you want to delete this MCQ?" onConfirm={handleDelete} />
    </div>
  );
};

export default McqDetails;
