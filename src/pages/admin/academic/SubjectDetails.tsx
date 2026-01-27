import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, FileText, Hash, Clock, Calendar, ExternalLink, ChevronRight, CircleHelp, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockSubjects, getChaptersBySubject, getClassById, mockMcqs, mockCqs } from '@/lib/academic-mock-data';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const SubjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const subject = mockSubjects.find((s) => s.id === id);
  const cls = subject ? getClassById(subject.classId) : null;
  const chapters = subject ? getChaptersBySubject(subject.id) : [];
  const mcqCount = mockMcqs.filter(m => m.subjectId === id).length;
  const cqCount = mockCqs.filter(c => c.subjectId === id).length;

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Subject Not Found</h1>
          <Button onClick={() => navigate('/admin/subjects')}>Back to Subjects</Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => { toast.success('Subject deleted successfully'); navigate('/admin/subjects'); };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/subjects')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 flex-wrap">
                  <Link to={`/admin/classes/${cls?.id}`} className="hover:text-foreground">{cls?.displayName}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">{subject.displayName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">{subject.displayName}</h1>
                  {subject.code && <Badge variant="outline" className="font-mono">{subject.code}</Badge>}
                  <Badge variant={subject.isActive ? 'default' : 'secondary'} className={subject.isActive ? 'bg-green-100 text-green-700' : ''}>{subject.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              <Button onClick={() => navigate(`/admin/subjects/${id}/edit`)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-yellow-100 rounded-lg"><FileText className="h-5 w-5 text-yellow-600" /></div><div><p className="text-2xl font-bold">{chapters.length}</p><p className="text-xs text-muted-foreground">Chapters</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><CircleHelp className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{mcqCount}</p><p className="text-xs text-muted-foreground">MCQs</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><FileQuestion className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold">{cqCount}</p><p className="text-xs text-muted-foreground">CQs</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-gray-100 rounded-lg"><Hash className="h-5 w-5 text-gray-600" /></div><div><p className="text-2xl font-bold">{subject.position}</p><p className="text-xs text-muted-foreground">Position</p></div></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Subject Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Display Name</p><p className="font-medium">{subject.displayName}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Code</p>{subject.code ? <Badge variant="outline" className="font-mono">{subject.code}</Badge> : <span className="text-muted-foreground">—</span>}</div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Slug</p><code className="text-sm bg-muted px-2 py-1 rounded">{subject.name}</code></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Class</p><Link to={`/admin/classes/${cls?.id}`} className="text-primary hover:underline">{cls?.displayName}</Link></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Chapters ({chapters.length})</CardTitle><CardDescription>Chapters in this subject</CardDescription></div>
                <Button size="sm" onClick={() => navigate('/admin/chapters/create')}>Add Chapter</Button>
              </CardHeader>
              <CardContent>
                {chapters.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No chapters found.</p>
                ) : (
                  <div className="space-y-2">
                    {chapters.map((chapter) => (
                      <Link key={chapter.id} to={`/admin/chapters/${chapter.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{chapter.displayName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={chapter.isActive ? 'default' : 'secondary'} className={chapter.isActive ? 'bg-green-100 text-green-700' : ''}>{chapter.isActive ? 'Active' : 'Inactive'}</Badge>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
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
                <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Created</p><p className="text-sm font-medium">{subject.createdAt.toLocaleDateString()}</p></div></div>
                <Separator />
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Last Updated</p><p className="text-sm font-medium">{subject.updatedAt.toLocaleDateString()}</p></div></div>
                <Separator />
                <div><p className="text-xs text-muted-foreground mb-1">Subject ID</p><code className="text-xs bg-muted px-2 py-1 rounded block break-all">{subject.id}</code></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/mcqs?subject=${id}`)}>View MCQs</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/cqs?subject=${id}`)}>View CQs</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Subject" description={`Are you sure you want to delete "${subject.displayName}"?`} onConfirm={handleDelete} />
    </div>
  );
};

export default SubjectDetails;
