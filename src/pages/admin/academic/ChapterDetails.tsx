import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Hash, Clock, Calendar, ExternalLink, ChevronRight, CircleHelp, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockChapters, getTopicsByChapter, getSubjectById, getClassById, getBoardById, mockMcqs, mockCqs } from '@/lib/academic-mock-data';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const ChapterDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const chapter = mockChapters.find((c) => c.id === id);
  const subject = chapter ? getSubjectById(chapter.subjectId) : null;
  const cls = subject ? getClassById(subject.classId) : null;
  const board = cls ? getBoardById(cls.boardId) : null;
  const topics = chapter ? getTopicsByChapter(chapter.id) : [];
  const mcqCount = mockMcqs.filter(m => m.chapterId === id).length;
  const cqCount = mockCqs.filter(c => c.chapterId === id).length;

  if (!chapter) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-2">Chapter Not Found</h1><Button onClick={() => navigate('/admin/chapters')}>Back to Chapters</Button></div></div>;
  }

  const handleDelete = () => { toast.success('Chapter deleted'); navigate('/admin/chapters'); };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/chapters')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 flex-wrap">
                  <Link to={`/admin/boards/${board?.id}`} className="hover:text-foreground">{board?.code}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/classes/${cls?.id}`} className="hover:text-foreground">{cls?.displayName}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/subjects/${subject?.id}`} className="hover:text-foreground">{subject?.displayName}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">{chapter.displayName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold">{chapter.displayName}</h1>
                  <Badge variant={chapter.isActive ? 'default' : 'secondary'} className={chapter.isActive ? 'bg-green-100 text-green-700' : ''}>{chapter.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              <Button onClick={() => navigate(`/admin/chapters/${id}/edit`)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-orange-100 rounded-lg"><Hash className="h-5 w-5 text-orange-600" /></div><div><p className="text-2xl font-bold">{topics.length}</p><p className="text-xs text-muted-foreground">Topics</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><CircleHelp className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{mcqCount}</p><p className="text-xs text-muted-foreground">MCQs</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><FileQuestion className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold">{cqCount}</p><p className="text-xs text-muted-foreground">CQs</p></div></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Chapter Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Display Name</p><p className="font-medium">{chapter.displayName}</p></div>
                  <div><p className="text-sm text-muted-foreground">Slug</p><code className="text-sm bg-muted px-2 py-1 rounded">{chapter.name}</code></div>
                  <div><p className="text-sm text-muted-foreground">Subject</p><Link to={`/admin/subjects/${subject?.id}`} className="text-primary hover:underline">{subject?.displayName}</Link></div>
                  <div><p className="text-sm text-muted-foreground">Position</p><p className="font-medium">{chapter.position}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Topics ({topics.length})</CardTitle></div>
                <Button size="sm" onClick={() => navigate('/admin/topics/create')}>Add Topic</Button>
              </CardHeader>
              <CardContent>
                {topics.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No topics found.</p> : (
                  <div className="space-y-2">
                    {topics.map((topic) => (
                      <Link key={topic.id} to={`/admin/topics/${topic.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                        <div className="flex items-center gap-3"><Hash className="h-4 w-4 text-muted-foreground" /><p className="font-medium">{topic.displayName}</p></div>
                        <div className="flex items-center gap-2"><Badge variant={topic.isActive ? 'default' : 'secondary'} className={topic.isActive ? 'bg-green-100 text-green-700' : ''}>{topic.isActive ? 'Active' : 'Inactive'}</Badge><ExternalLink className="h-4 w-4 text-muted-foreground" /></div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Created</p><p className="text-sm font-medium">{chapter.createdAt.toLocaleDateString()}</p></div></div>
                <Separator />
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Updated</p><p className="text-sm font-medium">{chapter.updatedAt.toLocaleDateString()}</p></div></div>
                <Separator />
                <div><p className="text-xs text-muted-foreground mb-1">Chapter ID</p><code className="text-xs bg-muted px-2 py-1 rounded block break-all">{chapter.id}</code></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Chapter" description={`Delete "${chapter.displayName}"?`} onConfirm={handleDelete} />
    </div>
  );
};

export default ChapterDetails;
