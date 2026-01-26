import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, GraduationCap, BookText, FileText, Clock, Calendar, Hash, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockBoards, getClassesByBoard, mockSubjects, mockChapters } from '@/lib/academic-mock-data';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const BoardDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const board = mockBoards.find((b) => b.id === id);
  const classes = board ? getClassesByBoard(board.id) : [];
  const subjectCount = classes.reduce((acc, cls) => acc + mockSubjects.filter(s => s.classId === cls.id).length, 0);
  const chapterCount = mockSubjects.filter(s => classes.some(c => c.id === s.classId)).reduce((acc, subj) => acc + mockChapters.filter(ch => ch.subjectId === subj.id).length, 0);

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Board Not Found</h1>
          <p className="text-muted-foreground mb-4">The board you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/boards')}>Back to Boards</Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    toast.success('Board deleted successfully');
    navigate('/admin/boards');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/boards')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">{board.displayName}</h1>
                  <Badge variant={board.isActive ? 'default' : 'secondary'} className={board.isActive ? 'bg-green-100 text-green-700' : ''}>
                    {board.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">Board Details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button onClick={() => navigate(`/admin/boards/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Board
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><GraduationCap className="h-5 w-5 text-blue-600" /></div>
                <div>
                  <p className="text-2xl font-bold">{classes.length}</p>
                  <p className="text-xs text-muted-foreground">Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg"><BookText className="h-5 w-5 text-green-600" /></div>
                <div>
                  <p className="text-2xl font-bold">{subjectCount}</p>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg"><FileText className="h-5 w-5 text-yellow-600" /></div>
                <div>
                  <p className="text-2xl font-bold">{chapterCount}</p>
                  <p className="text-xs text-muted-foreground">Chapters</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg"><Hash className="h-5 w-5 text-purple-600" /></div>
                <div>
                  <p className="text-2xl font-bold">{board.position}</p>
                  <p className="text-xs text-muted-foreground">Position</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Board Information</CardTitle>
                <CardDescription>Basic details about this academic board</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Display Name</p>
                    <p className="font-medium">{board.displayName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Code</p>
                    <Badge variant="outline" className="font-mono">{board.code}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Slug</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{board.name}</code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{board.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classes List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Classes ({classes.length})</CardTitle>
                  <CardDescription>Classes under this board</CardDescription>
                </div>
                <Button size="sm" onClick={() => navigate('/admin/classes/create')}>Add Class</Button>
              </CardHeader>
              <CardContent>
                {classes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No classes found for this board.</p>
                ) : (
                  <div className="space-y-2">
                    {classes.map((cls) => (
                      <Link
                        key={cls.id}
                        to={`/admin/classes/${cls.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{cls.displayName}</p>
                            <p className="text-xs text-muted-foreground">{cls.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={cls.isActive ? 'default' : 'secondary'} className={cls.isActive ? 'bg-green-100 text-green-700' : ''}>
                            {cls.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">{board.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">{board.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Board ID</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block break-all">{board.id}</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/academic-tree')}>
                  View in Hierarchy
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/classes/create')}>
                  Add New Class
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Board"
        description={`Are you sure you want to delete "${board.displayName}"? This will also remove all associated classes, subjects, and content.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BoardDetails;
