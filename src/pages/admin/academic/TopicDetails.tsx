import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Layers, Clock, Calendar, ExternalLink, ChevronRight, CircleHelp, FileQuestion, Hash, Copy, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopic, useChapter, useSubject, useClass, useSubTopics, useMcqs, useCqs, useTopicMutations } from '@/hooks/useAcademicData';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const TopicDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Data fetching
  const { data: topic, isLoading: topicLoading } = useTopic(id || '');
  const { data: chapter } = useChapter(topic?.chapter_id || '');
  const { data: subject } = useSubject(chapter?.subject_id || '');
  const { data: cls } = useClass(subject?.class_id || '');
  const { data: allSubTopics = [] } = useSubTopics();
  const { data: allMcqs = [] } = useMcqs();
  const { data: allCqs = [] } = useCqs();
  const { remove } = useTopicMutations();

  // Filter data for this topic
  const subTopics = allSubTopics.filter(st => st.topic_id === id);
  const subTopicIds = subTopics.map(st => st.id);
  const mcqs = allMcqs.filter(m => subTopicIds.includes(m.sub_topic_id));
  const cqs = allCqs.filter(c => subTopicIds.includes(c.sub_topic_id));

  // Loading state
  if (topicLoading) {
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  // Not found state
  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="p-4 bg-muted rounded-full w-fit mx-auto">
            <Hash className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Topic Not Found</h1>
          <p className="text-muted-foreground">The topic you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/topics')}>Back to Topics</Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(topic.id);
      navigate('/admin/topics');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(topic.id);
    toast.success('Topic ID copied to clipboard');
  };

  // Stats calculations
  const activeSubTopics = subTopics.filter(st => st.is_active).length;
  const totalQuestions = mcqs.length + cqs.length;
  const subTopicCoverage = subTopics.length > 0 ? Math.round((activeSubTopics / subTopics.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/topics')}>
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
                  <span className="text-foreground">{topic.display_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold">{topic.display_name}</h1>
                  <Badge variant={topic.is_active ? 'default' : 'secondary'} className={topic.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}>
                    {topic.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />Delete
              </Button>
              <Button onClick={() => navigate(`/admin/topics/${id}/edit`)}>
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
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{subTopics.length}</p>
                  <p className="text-xs text-muted-foreground">Sub-Topics</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FileQuestion className="h-5 w-5 text-green-600 dark:text-green-400" />
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
                <div className="p-2 bg-slate-100 dark:bg-slate-900/30 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{topic.position}</p>
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
            <TabsTrigger value="subtopics">Sub-Topics ({subTopics.length})</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle>Topic Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Display Name</p>
                        <p className="font-medium">{topic.display_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Slug</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{topic.name}</code>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Chapter</p>
                        <Link to={`/admin/chapters/${chapter?.id}`} className="text-primary hover:underline">{chapter?.display_name}</Link>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Subject</p>
                        <Link to={`/admin/subjects/${subject?.id}`} className="text-primary hover:underline">{subject?.display_name}</Link>
                      </div>
                    </div>
                    {topic.description && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Description</p>
                          <p className="text-sm">{topic.description}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Content Progress */}
                <Card>
                  <CardHeader><CardTitle>Content Progress</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Sub-Topic Coverage</span>
                        <span className="font-medium">{activeSubTopics}/{subTopics.length} active</span>
                      </div>
                      <Progress value={subTopicCoverage} className="h-2" />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{mcqs.length}</p>
                        <p className="text-xs text-muted-foreground">MCQs</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{cqs.length}</p>
                        <p className="text-xs text-muted-foreground">CQs</p>
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
                        <p className="text-sm font-medium">{new Date(topic.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Updated</p>
                        <p className="text-sm font-medium">{new Date(topic.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Topic ID</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">{topic.id}</code>
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
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/subtopics/create')}>
                      <Layers className="h-4 w-4 mr-2" />Add Sub-Topic
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/topics/${id}/edit`)}>
                      <Settings className="h-4 w-4 mr-2" />Edit Topic
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Sub-Topics Tab */}
          <TabsContent value="subtopics">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sub-Topics ({subTopics.length})</CardTitle>
                <Button size="sm" onClick={() => navigate('/admin/subtopics/create')}>Add Sub-Topic</Button>
              </CardHeader>
              <CardContent>
                {subTopics.length === 0 ? (
                  <div className="text-center py-8">
                    <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No sub-topics found in this topic.</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/subtopics/create')}>Add First Sub-Topic</Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subTopics.sort((a, b) => a.position - b.position).map((st) => {
                      const stMcqs = mcqs.filter(m => m.sub_topic_id === st.id).length;
                      const stCqs = cqs.filter(c => c.sub_topic_id === st.id).length;
                      return (
                        <Link key={st.id} to={`/admin/subtopics/${st.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{st.display_name}</p>
                              <p className="text-xs text-muted-foreground">{stMcqs} MCQs, {stCqs} CQs</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={st.is_active ? 'default' : 'secondary'} className={st.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}>
                              {st.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Content Distribution</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sub-Topics</span>
                      <span className="font-medium">{subTopics.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Questions</span>
                      <span className="font-medium">{totalQuestions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Questions/Sub-Topic</span>
                      <span className="font-medium">{subTopics.length > 0 ? (totalQuestions / subTopics.length).toFixed(1) : 0}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Questions by Type</p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                        <p className="text-lg font-bold text-blue-600">{mcqs.length}</p>
                        <p className="text-xs text-blue-600/70">MCQs</p>
                      </div>
                      <div className="flex-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                        <p className="text-lg font-bold text-green-600">{cqs.length}</p>
                        <p className="text-xs text-green-600/70">CQs</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Sub-Topic Breakdown</CardTitle></CardHeader>
                <CardContent>
                  {subTopics.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No sub-topics to analyze.</p>
                  ) : (
                    <div className="space-y-3">
                      {subTopics.slice(0, 5).map((st) => {
                        const stMcqs = mcqs.filter(m => m.sub_topic_id === st.id).length;
                        const stCqs = cqs.filter(c => c.sub_topic_id === st.id).length;
                        return (
                          <div key={st.id} className="flex items-center justify-between p-2 rounded border">
                            <span className="text-sm font-medium truncate flex-1">{st.display_name}</span>
                            <div className="flex gap-2 text-xs">
                              <Badge variant="outline">{stMcqs} MCQ</Badge>
                              <Badge variant="outline">{stCqs} CQ</Badge>
                            </div>
                          </div>
                        );
                      })}
                      {subTopics.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">+{subTopics.length - 5} more sub-topics</p>
                      )}
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
        title="Delete Topic" 
        description={`Are you sure you want to delete "${topic.display_name}"? This will also delete all sub-topics and questions within this topic.`} 
        onConfirm={handleDelete} 
      />
    </div>
  );
};

export default TopicDetails;
