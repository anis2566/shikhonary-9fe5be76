import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, ChevronRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockCqs, getSubjectById, getChapterById, getTopicById, getSubTopicById, getClassById, getBoardById } from '@/lib/academic-mock-data';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const CqDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const cq = mockCqs.find((c) => c.id === id);
  const subject = cq ? getSubjectById(cq.subjectId) : null;
  const chapter = cq ? getChapterById(cq.chapterId) : null;
  const topic = cq?.topicId ? getTopicById(cq.topicId) : null;
  const subTopic = cq?.subTopicId ? getSubTopicById(cq.subTopicId) : null;
  const cls = subject ? getClassById(subject.classId) : null;
  const board = cls ? getBoardById(cls.boardId) : null;

  if (!cq) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-2">CQ Not Found</h1><Button onClick={() => navigate('/admin/cqs')}>Back</Button></div></div>;
  }

  const handleDelete = () => { toast.success('CQ deleted'); navigate('/admin/cqs'); };
  const handleDuplicate = () => { toast.success('CQ duplicated'); };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cqs')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl lg:text-2xl font-bold">Creative Question Details</h1>
                  <Badge variant="outline">{cq.marks} marks</Badge>
                  <Badge variant={cq.isActive ? 'default' : 'secondary'} className={cq.isActive ? 'bg-green-100 text-green-700' : ''}>{cq.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{subject?.displayName} • {chapter?.displayName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDuplicate}><Copy className="h-4 w-4 mr-2" />Duplicate</Button>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              <Button onClick={() => navigate(`/admin/cqs/${id}/edit`)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
          <Link to={`/admin/boards/${board?.id}`} className="hover:text-foreground">{board?.code}</Link><ChevronRight className="h-3 w-3" />
          <Link to={`/admin/classes/${cls?.id}`} className="hover:text-foreground">{cls?.displayName}</Link><ChevronRight className="h-3 w-3" />
          <Link to={`/admin/subjects/${subject?.id}`} className="hover:text-foreground">{subject?.displayName}</Link><ChevronRight className="h-3 w-3" />
          <Link to={`/admin/chapters/${chapter?.id}`} className="hover:text-foreground">{chapter?.displayName}</Link>
          {topic && <><ChevronRight className="h-3 w-3" /><Link to={`/admin/topics/${topic.id}`} className="hover:text-foreground">{topic.displayName}</Link></>}
        </div>

        {/* Context */}
        {cq.context && (
          <Card>
            <CardHeader><CardTitle>Context / Stimulus</CardTitle></CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{cq.context}</p>
            </CardContent>
          </Card>
        )}

        {/* Questions */}
        <Card>
          <CardHeader><CardTitle>Questions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-l-primary">
              <p className="text-xs font-medium text-muted-foreground mb-1">(a) Knowledge</p>
              <p>{cq.questionA}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-l-blue-500">
              <p className="text-xs font-medium text-muted-foreground mb-1">(b) Comprehension</p>
              <p>{cq.questionB}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-l-yellow-500">
              <p className="text-xs font-medium text-muted-foreground mb-1">(c) Application</p>
              <p>{cq.questionC}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-l-red-500">
              <p className="text-xs font-medium text-muted-foreground mb-1">(d) Higher-order Thinking</p>
              <p>{cq.questionD}</p>
            </div>
          </CardContent>
        </Card>

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
              <div className="flex justify-between"><span className="text-muted-foreground">Total Marks</span><span className="font-medium">{cq.marks}</span></div>
              <Separator />
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Created</span><span className="text-sm">{cq.createdAt.toLocaleDateString()}</span></div>
              <Separator />
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Updated</span><span className="text-sm">{cq.updatedAt.toLocaleDateString()}</span></div>
              <Separator />
              <div><p className="text-xs text-muted-foreground mb-1">CQ ID</p><code className="text-xs bg-muted px-2 py-1 rounded block break-all">{cq.id}</code></div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete CQ" description="Are you sure you want to delete this CQ?" onConfirm={handleDelete} />
    </div>
  );
};

export default CqDetails;
