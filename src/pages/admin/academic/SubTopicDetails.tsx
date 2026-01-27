import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, ChevronRight, CircleHelp, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockSubTopics, getTopicById, getChapterById, getSubjectById, getClassById, mockMcqs, mockCqs } from '@/lib/academic-mock-data';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const SubTopicDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const subTopic = mockSubTopics.find((s) => s.id === id);
  const topic = subTopic ? getTopicById(subTopic.topicId) : null;
  const chapter = topic ? getChapterById(topic.chapterId) : null;
  const subject = chapter ? getSubjectById(chapter.subjectId) : null;
  const cls = subject ? getClassById(subject.classId) : null;
  const mcqCount = mockMcqs.filter(m => m.subTopicId === id).length;
  const cqCount = mockCqs.filter(c => c.subTopicId === id).length;

  if (!subTopic) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-2">Sub-Topic Not Found</h1><Button onClick={() => navigate('/admin/subtopics')}>Back</Button></div></div>;
  }

  const handleDelete = () => { toast.success('Sub-topic deleted'); navigate('/admin/subtopics'); };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/subtopics')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1 flex-wrap">
                  <Link to={`/admin/classes/${cls?.id}`} className="hover:text-foreground">{cls?.displayName}</Link><ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/subjects/${subject?.id}`} className="hover:text-foreground">{subject?.displayName}</Link><ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/chapters/${chapter?.id}`} className="hover:text-foreground">{chapter?.displayName}</Link><ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/topics/${topic?.id}`} className="hover:text-foreground">{topic?.displayName}</Link><ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">{subTopic.displayName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold">{subTopic.displayName}</h1>
                  <Badge variant={subTopic.isActive ? 'default' : 'secondary'} className={subTopic.isActive ? 'bg-green-100 text-green-700' : ''}>{subTopic.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              <Button onClick={() => navigate(`/admin/subtopics/${id}/edit`)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><CircleHelp className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{mcqCount}</p><p className="text-xs text-muted-foreground">MCQs</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><FileQuestion className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold">{cqCount}</p><p className="text-xs text-muted-foreground">CQs</p></div></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Sub-Topic Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Display Name</p><p className="font-medium">{subTopic.displayName}</p></div>
                  <div><p className="text-sm text-muted-foreground">Slug</p><code className="text-sm bg-muted px-2 py-1 rounded">{subTopic.name}</code></div>
                  <div><p className="text-sm text-muted-foreground">Topic</p><Link to={`/admin/topics/${topic?.id}`} className="text-primary hover:underline">{topic?.displayName}</Link></div>
                  <div><p className="text-sm text-muted-foreground">Position</p><p className="font-medium">{subTopic.position}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Created</p><p className="text-sm font-medium">{subTopic.createdAt.toLocaleDateString()}</p></div></div>
              <Separator />
              <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Updated</p><p className="text-sm font-medium">{subTopic.updatedAt.toLocaleDateString()}</p></div></div>
              <Separator />
              <div><p className="text-xs text-muted-foreground mb-1">Sub-Topic ID</p><code className="text-xs bg-muted px-2 py-1 rounded block break-all">{subTopic.id}</code></div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Sub-Topic" description={`Delete "${subTopic.displayName}"?`} onConfirm={handleDelete} />
    </div>
  );
};

export default SubTopicDetails;
