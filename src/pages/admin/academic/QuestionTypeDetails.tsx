import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Tag, Clock, Calendar, Copy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuestionType, useQuestionTypeMutations, useSubject, useChapter } from '@/hooks/useAcademicData';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const QuestionTypeDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: qt, isLoading } = useQuestionType(id || '');
  const { data: subject } = useSubject(qt?.subject_id || '');
  const { data: chapter } = useChapter(qt?.chapter_id || '');
  const { remove } = useQuestionTypeMutations();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card/50 p-4 lg:p-6">
          <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded" /><Skeleton className="h-6 w-64" /></div>
        </div>
        <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!qt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Tag className="h-8 w-8 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">Not Found</h1>
          <Button onClick={() => navigate('/admin/question-types')}>Back to List</Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(qt.id);
      navigate('/admin/question-types');
    } catch {}
  };

  const copyId = () => { navigator.clipboard.writeText(qt.id); toast.success('ID copied'); };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/question-types')}><ArrowLeft className="h-5 w-5" /></Button>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1 flex-wrap">
                  <Link to={`/admin/subjects/${subject?.id}`} className="hover:text-foreground transition-colors">{subject?.display_name || 'Subject'}</Link>
                  {chapter && (<><ChevronRight className="h-3 w-3" /><Link to={`/admin/chapters/${chapter.id}`} className="hover:text-foreground transition-colors">{chapter.display_name}</Link></>)}
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">{qt.display_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold">{qt.display_name}</h1>
                  <Badge variant={qt.is_active ? 'default' : 'secondary'} className={qt.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}>
                    {qt.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              <Button onClick={() => navigate(`/admin/question-types/${id}/edit`)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Display Name</p><p className="font-medium">{qt.display_name}</p></div>
                  <div><p className="text-sm text-muted-foreground">Slug</p><code className="text-sm bg-muted px-2 py-1 rounded">{qt.name}</code></div>
                  <div><p className="text-sm text-muted-foreground">Subject</p><Link to={`/admin/subjects/${subject?.id}`} className="text-primary hover:underline">{subject?.display_name}</Link></div>
                  <div><p className="text-sm text-muted-foreground">Chapter</p>{chapter ? <Link to={`/admin/chapters/${chapter.id}`} className="text-primary hover:underline">{chapter.display_name}</Link> : <span className="text-muted-foreground">—</span>}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Created</p><p className="text-sm font-medium">{new Date(qt.created_at).toLocaleDateString()}</p></div></div>
              <Separator />
              <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Updated</p><p className="text-sm font-medium">{new Date(qt.updated_at).toLocaleDateString()}</p></div></div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">{qt.id}</code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyId}><Copy className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Question Type" description={`Are you sure you want to delete "${qt.display_name}"?`} onConfirm={handleDelete} />
    </div>
  );
};

export default QuestionTypeDetails;
