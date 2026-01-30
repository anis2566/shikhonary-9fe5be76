import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Hash, Clock, Calendar, ExternalLink, ChevronRight, CircleHelp, FileQuestion, Layers, Copy, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useChapter, useSubject, useClass, useTopics, useSubTopics, useMcqs, useCqs, useChapterMutations } from '@/hooks/useAcademicData';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';

const ChapterDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Data fetching
  const { data: chapter, isLoading: chapterLoading } = useChapter(id || '');
  const { data: subject } = useSubject(chapter?.subject_id || '');
  const { data: cls } = useClass(subject?.class_id || '');
  const { data: allTopics = [] } = useTopics();
  const { data: allSubTopics = [] } = useSubTopics();
  const { data: allMcqs = [] } = useMcqs();
  const { data: allCqs = [] } = useCqs();
  const { remove } = useChapterMutations();

  // Filter data for this chapter
  const topics = allTopics.filter(t => t.chapter_id === id);
  const topicIds = topics.map(t => t.id);
  const subTopics = allSubTopics.filter(st => topicIds.includes(st.topic_id));
  const subTopicIds = subTopics.map(st => st.id);
  const mcqs = allMcqs.filter(m => subTopicIds.includes(m.sub_topic_id));
  const cqs = allCqs.filter(c => subTopicIds.includes(c.sub_topic_id));

  // Loading state
  if (chapterLoading) {
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
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="p-4 bg-muted rounded-full w-fit mx-auto">
            <Hash className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Chapter Not Found</h1>
          <p className="text-muted-foreground">The chapter you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/chapters')}>Back to Chapters</Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(chapter.id);
      navigate('/admin/chapters');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(chapter.id);
    toast.success('Chapter ID copied to clipboard');
  };

  // Stats calculations
  const activeTopics = topics.filter(t => t.is_active).length;
  const totalQuestions = mcqs.length + cqs.length;
  const topicCoverage = topics.length > 0 ? Math.round((activeTopics / topics.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/chapters')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1 flex-wrap">
                  <Link to={`/admin/classes/${cls?.id}`} className="hover:text-foreground transition-colors">{cls?.display_name || 'Class'}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link to={`/admin/subjects/${subject?.id}`} className="hover:text-foreground transition-colors">{subject?.display_name || 'Subject'}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">{chapter.display_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl lg:text-2xl font-bold">{chapter.display_name}</h1>
                  <Badge variant={chapter.is_active ? 'default' : 'secondary'} className={chapter.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}>
                    {chapter.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />Delete
              </Button>
              <Button onClick={() => navigate(`/admin/chapters/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Hash className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{topics.length}</p>
                  <p className="text-xs text-muted-foreground">Topics</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  <p className="text-2xl font-bold">{chapter.position}</p>
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
            <TabsTrigger value="topics">Topics ({topics.length})</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle>Chapter Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Display Name</p>
                        <p className="font-medium">{chapter.display_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Slug</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{chapter.name}</code>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Subject</p>
                        <Link to={`/admin/subjects/${subject?.id}`} className="text-primary hover:underline">{subject?.display_name}</Link>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Class</p>
                        <Link to={`/admin/classes/${cls?.id}`} className="text-primary hover:underline">{cls?.display_name}</Link>
                      </div>
                    </div>
                    {chapter.description && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Description</p>
                          <p className="text-sm">{chapter.description}</p>
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
                        <span className="text-muted-foreground">Topic Coverage</span>
                        <span className="font-medium">{activeTopics}/{topics.length} active</span>
                      </div>
                      <Progress value={topicCoverage} className="h-2" />
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
                        <p className="text-sm font-medium">{new Date(chapter.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Updated</p>
                        <p className="text-sm font-medium">{new Date(chapter.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Chapter ID</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">{chapter.id}</code>
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
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/topics/create')}>
                      <Hash className="h-4 w-4 mr-2" />Add Topic
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/chapters/${id}/edit`)}>
                      <Settings className="h-4 w-4 mr-2" />Edit Chapter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Topics ({topics.length})</CardTitle>
                <Button size="sm" onClick={() => navigate('/admin/topics/create')}>Add Topic</Button>
              </CardHeader>
              <CardContent>
                {topics.length === 0 ? (
                  <div className="text-center py-8">
                    <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No topics found in this chapter.</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/topics/create')}>Add First Topic</Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {topics.sort((a, b) => a.position - b.position).map((topic) => {
                      const topicSubTopics = subTopics.filter(st => st.topic_id === topic.id);
                      return (
                        <Link key={topic.id} to={`/admin/topics/${topic.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{topic.display_name}</p>
                              <p className="text-xs text-muted-foreground">{topicSubTopics.length} sub-topics</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={topic.is_active ? 'default' : 'secondary'} className={topic.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}>
                              {topic.is_active ? 'Active' : 'Inactive'}
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
                      <span className="text-sm">Topics</span>
                      <span className="font-medium">{topics.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sub-Topics</span>
                      <span className="font-medium">{subTopics.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Questions</span>
                      <span className="font-medium">{totalQuestions}</span>
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
                <CardHeader><CardTitle>Topic Breakdown</CardTitle></CardHeader>
                <CardContent>
                  {topics.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No topics to analyze.</p>
                  ) : (
                    <div className="space-y-3">
                      {topics.slice(0, 5).map((topic) => {
                        const topicSubTopicIds = subTopics.filter(st => st.topic_id === topic.id).map(st => st.id);
                        const topicMcqs = mcqs.filter(m => topicSubTopicIds.includes(m.sub_topic_id)).length;
                        const topicCqs = cqs.filter(c => topicSubTopicIds.includes(c.sub_topic_id)).length;
                        return (
                          <div key={topic.id} className="flex items-center justify-between p-2 rounded border">
                            <span className="text-sm font-medium truncate flex-1">{topic.display_name}</span>
                            <div className="flex gap-2 text-xs">
                              <Badge variant="outline">{topicMcqs} MCQ</Badge>
                              <Badge variant="outline">{topicCqs} CQ</Badge>
                            </div>
                          </div>
                        );
                      })}
                      {topics.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">+{topics.length - 5} more topics</p>
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
        title="Delete Chapter" 
        description={`Are you sure you want to delete "${chapter.display_name}"? This will also delete all topics, sub-topics, and questions within this chapter.`} 
        onConfirm={handleDelete} 
      />
    </div>
  );
};

export default ChapterDetails;
