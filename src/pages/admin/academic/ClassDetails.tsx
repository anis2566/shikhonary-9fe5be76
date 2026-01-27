import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, BookText, FileText, Hash, Clock, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockClasses, getSubjectsByClass, mockChapters } from '@/lib/academic-mock-data';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const ClassDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const cls = mockClasses.find((c) => c.id === id);
  const subjects = cls ? getSubjectsByClass(cls.id) : [];
  const chapterCount = subjects.reduce((acc, subj) => acc + mockChapters.filter(ch => ch.subjectId === subj.id).length, 0);

  if (!cls) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Class Not Found</h1>
          <Button onClick={() => navigate('/admin/classes')}>Back to Classes</Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    toast.success('Class deleted successfully');
    navigate('/admin/classes');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/classes')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">{cls.displayName}</h1>
                  <Badge variant="outline">{cls.level}</Badge>
                  <Badge variant={cls.isActive ? 'default' : 'secondary'} className={cls.isActive ? 'bg-green-100 text-green-700' : ''}>
                    {cls.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              <Button onClick={() => navigate(`/admin/classes/${id}/edit`)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><BookText className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold">{subjects.length}</p><p className="text-xs text-muted-foreground">Subjects</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-yellow-100 rounded-lg"><FileText className="h-5 w-5 text-yellow-600" /></div><div><p className="text-2xl font-bold">{chapterCount}</p><p className="text-xs text-muted-foreground">Chapters</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><Hash className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold">{cls.position}</p><p className="text-xs text-muted-foreground">Position</p></div></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Class Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Display Name</p><p className="font-medium">{cls.displayName}</p></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Level</p><Badge variant="outline">{cls.level}</Badge></div>
                  <div className="space-y-1"><p className="text-sm text-muted-foreground">Slug</p><code className="text-sm bg-muted px-2 py-1 rounded">{cls.name}</code></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Subjects ({subjects.length})</CardTitle><CardDescription>Subjects in this class</CardDescription></div>
                <Button size="sm" onClick={() => navigate('/admin/subjects/create')}>Add Subject</Button>
              </CardHeader>
              <CardContent>
                {subjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No subjects found.</p>
                ) : (
                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <Link key={subject.id} to={`/admin/subjects/${subject.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <BookText className="h-4 w-4 text-muted-foreground" />
                          <div><p className="font-medium">{subject.displayName}</p>{subject.code && <p className="text-xs text-muted-foreground">{subject.code}</p>}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={subject.isActive ? 'default' : 'secondary'} className={subject.isActive ? 'bg-green-100 text-green-700' : ''}>{subject.isActive ? 'Active' : 'Inactive'}</Badge>
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
                <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Created</p><p className="text-sm font-medium">{cls.createdAt.toLocaleDateString()}</p></div></div>
                <Separator />
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Last Updated</p><p className="text-sm font-medium">{cls.updatedAt.toLocaleDateString()}</p></div></div>
                <Separator />
                <div><p className="text-xs text-muted-foreground mb-1">Class ID</p><code className="text-xs bg-muted px-2 py-1 rounded block break-all">{cls.id}</code></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Class" description={`Are you sure you want to delete "${cls.displayName}"?`} onConfirm={handleDelete} />
    </div>
  );
};

export default ClassDetails;
