import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, ChevronRight, CircleHelp, FileQuestion, Layers, Copy, BarChart3, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubTopic, useTopic, useChapter, useSubject, useClass, useMcqs, useCqs, useSubTopicMutations } from '@/hooks/useAcademicData';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const SubTopicDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Data fetching
  const { data: subTopic, isLoading: subTopicLoading } = useSubTopic(id || '');
  const { data: topic } = useTopic(subTopic?.topic_id || '');
  const { data: chapter } = useChapter(topic?.chapter_id || '');
  const { data: subject } = useSubject(chapter?.subject_id || '');
  const { data: cls } = useClass(subject?.class_id || '');
  const { data: allMcqs = [] } = useMcqs();
  const { data: allCqs = [] } = useCqs();
  const { remove } = useSubTopicMutations();

  // Filter data for this sub-topic
  const mcqs = allMcqs.filter(m => m.sub_topic_id === id);
  const cqs = allCqs.filter(c => c.sub_topic_id === id);

  // Loading state
  if (subTopicLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card/50 p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-64" />
            </div>
          </div>
        </div>
        <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  // Not found state
  if (!subTopic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="p-4 bg-muted rounded-full w-fit mx-auto">
            <Layers className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Sub-Topic Not Found</h1>
          <p className="text-muted-foreground">The sub-topic you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/subtopics')}>Back to Sub-Topics</Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(subTopic.id);
      navigate('/admin/subtopics');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(subTopic.id);
    toast.success('Sub-Topic ID copied to clipboard');
  };

  // Stats calculations
  const totalQuestions = mcqs.length + cqs.length;
  const easyMcqs = mcqs.filter(m => m.difficulty === 'easy').length;
  const mediumMcqs = mcqs.filter(m => m.difficulty === 'medium').length;
  const hardMcqs = mcqs.filter(m => m.difficulty === 'hard').length;
  const easyCqs = cqs.filter(c => c.difficulty === 'easy').length;
  const mediumCqs = cqs.filter(c => c.difficulty === 'medium').length;
  const hardCqs = cqs.filter(c => c.difficulty === 'hard').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/subtopics')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1 flex-wrap">
                  <Link to={`/admin/classes/${cls?.id}`} className="hover:text-foreground transition-colors">{cls?.display_name || 'Class'}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/subjects/${subject?.id}`} className="hover:text-foreground transition-colors">{subject?.display_name || 'Subject'}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/chapters/${chapter?.id}`} className="hover:text-foreground transition-colors">{chapter?.display_name || 'Chapter'}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/topics/${topic?.id}`} className="hover:text-foreground transition-colors">{topic?.display_name || 'Topic'}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">{subTopic.display_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold">{subTopic.display_name}</h1>
                  <Badge variant={subTopic.is_active ? 'default' : 'secondary'} className={subTopic.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}>
                    {subTopic.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />Delete
              </Button>
              <Button onClick={() => navigate(`/admin/subtopics/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CircleHelp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mcqs.length}</p>
                  <p className="text-xs text-muted-foreground">MCQs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileQuestion className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{cqs.length}</p>
                  <p className="text-xs text-muted-foreground">CQs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalQuestions}</p>
                  <p className="text-xs text-muted-foreground">Total Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900/30 rounded-lg">
                  <Layers className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{subTopic.position}</p>
                  <p className="text-xs text-muted-foreground">Position</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions ({totalQuestions})</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle>Sub-Topic Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Display Name</p>
                        <p className="font-medium">{subTopic.display_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Slug</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{subTopic.name}</code>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Topic</p>
                        <Link to={`/admin/topics/${topic?.id}`} className="text-primary hover:underline">{topic?.display_name}</Link>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Chapter</p>
                        <Link to={`/admin/chapters/${chapter?.id}`} className="text-primary hover:underline">{chapter?.display_name}</Link>
                      </div>
                    </div>
                    {subTopic.description && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Description</p>
                          <p className="text-sm">{subTopic.description}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Question Summary */}
                <Card>
                  <CardHeader><CardTitle>Question Summary</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <CircleHelp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{mcqs.length}</p>
                        <p className="text-sm text-blue-600/70">Multiple Choice Questions</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <FileQuestion className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                        <p className="text-2xl font-bold text-purple-600">{cqs.length}</p>
                        <p className="text-sm text-purple-600/70">Creative Questions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium">{new Date(subTopic.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Updated</p>
                        <p className="text-sm font-medium">{new Date(subTopic.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Sub-Topic ID</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">{subTopic.id}</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyId}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/mcqs/create')}>
                      <CircleHelp className="h-4 w-4 mr-2" />Add MCQ
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/cqs/create')}>
                      <FileQuestion className="h-4 w-4 mr-2" />Add CQ
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/subtopics/${id}/edit`)}>
                      <Settings className="h-4 w-4 mr-2" />Edit Sub-Topic
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>MCQs ({mcqs.length})</CardTitle>
                  <Button size="sm" onClick={() => navigate('/admin/mcqs/create')}>Add MCQ</Button>
                </CardHeader>
                <CardContent>
                  {mcqs.length === 0 ? (
                    <div className="text-center py-6">
                      <CircleHelp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No MCQs in this sub-topic.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {mcqs.slice(0, 10).map((mcq) => (
                        <Link key={mcq.id} to={`/admin/mcqs/${mcq.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{mcq.question}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Badge variant="outline" className="text-xs capitalize">{mcq.difficulty}</Badge>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                      {mcqs.length > 10 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">+{mcqs.length - 10} more MCQs</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>CQs ({cqs.length})</CardTitle>
                  <Button size="sm" onClick={() => navigate('/admin/cqs/create')}>Add CQ</Button>
                </CardHeader>
                <CardContent>
                  {cqs.length === 0 ? (
                    <div className="text-center py-6">
                      <FileQuestion className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No CQs in this sub-topic.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {cqs.slice(0, 10).map((cq) => (
                        <Link key={cq.id} to={`/admin/cqs/${cq.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{cq.context.substring(0, 60)}...</p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Badge variant="outline" className="text-xs capitalize">{cq.difficulty}</Badge>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                      {cqs.length > 10 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">+{cqs.length - 10} more CQs</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>MCQ Difficulty Distribution</CardTitle></CardHeader>
                <CardContent>
                  {mcqs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No MCQs to analyze.</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Easy</span>
                        <span className="text-lg font-bold text-green-700 dark:text-green-400">{easyMcqs}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Medium</span>
                        <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{mediumMcqs}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Hard</span>
                        <span className="text-lg font-bold text-red-700 dark:text-red-400">{hardMcqs}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>CQ Difficulty Distribution</CardTitle></CardHeader>
                <CardContent>
                  {cqs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No CQs to analyze.</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Easy</span>
                        <span className="text-lg font-bold text-green-700 dark:text-green-400">{easyCqs}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Medium</span>
                        <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{mediumCqs}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Hard</span>
                        <span className="text-lg font-bold text-red-700 dark:text-red-400">{hardCqs}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DeleteConfirmDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        title="Delete Sub-Topic" 
        description={`Are you sure you want to delete "${subTopic.display_name}"? This will also delete all questions within this sub-topic.`} 
        onConfirm={handleDelete} 
      />
    </div>
  );
};

export default SubTopicDetails;
