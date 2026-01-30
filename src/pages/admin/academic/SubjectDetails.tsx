import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, FileText, Hash, Clock, Calendar, 
  ExternalLink, Plus, MoreHorizontal, CheckCircle2, XCircle, 
  TrendingUp, Layers, HelpCircle, BookOpen, ChevronRight, Copy,
  Activity, BarChart3, Target, Sparkles, BookText, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useSubject, useClass, useChapters, useTopics, useSubTopics, useMcqs, useCqs, useSubjectMutations } from '@/hooks/useAcademicData';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SubjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');

  // Fetch subject data from Supabase
  const { data: subject, isLoading: isLoadingSubject, error: subjectError } = useSubject(id || '');
  const { data: cls } = useClass(subject?.class_id || '');
  const { data: allChapters = [] } = useChapters();
  const { data: allTopics = [] } = useTopics();
  const { data: allSubTopics = [] } = useSubTopics();
  const { data: allMcqs = [] } = useMcqs();
  const { data: allCqs = [] } = useCqs();
  const { remove } = useSubjectMutations();

  // Calculate comprehensive stats based on chapters in this subject
  const chapters = allChapters.filter(ch => ch.subject_id === id);
  const chapterIds = chapters.map(c => c.id);
  const topics = allTopics.filter(t => chapterIds.includes(t.chapter_id));
  const topicIds = topics.map(t => t.id);
  const subTopics = allSubTopics.filter(st => topicIds.includes(st.topic_id));
  const subTopicIds = subTopics.map(st => st.id);
  const mcqs = allMcqs.filter(m => subTopicIds.includes(m.sub_topic_id));
  const cqs = allCqs.filter(c => subTopicIds.includes(c.sub_topic_id));
  
  const totalQuestions = mcqs.length + cqs.length;
  const activeChapters = chapters.filter(c => c.is_active).length;
  const completionRate = chapters.length > 0 ? Math.round((topics.length / (chapters.length * 5)) * 100) : 0;

  // Loading state
  if (isLoadingSubject) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card/80 p-4 lg:p-6">
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  // Not found state
  if (!subject || subjectError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Subject Not Found</h1>
          <p className="text-muted-foreground">The subject you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/admin/subjects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(subject.id);
      navigate('/admin/subjects');
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(subject.id);
    toast.success('ID copied to clipboard');
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    trend, 
    color = 'primary',
    onClick
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    trend?: string;
    color?: 'primary' | 'green' | 'yellow' | 'purple' | 'blue' | 'orange';
    onClick?: () => void;
  }) => {
    const colorClasses = {
      primary: 'bg-primary/10 text-primary',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    };

    return (
      <Card 
        className={cn(
          "transition-all duration-200",
          onClick && "cursor-pointer hover:shadow-md hover:border-primary/20"
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl", colorClasses[color])}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/subjects">Subjects</BreadcrumbLink>
              </BreadcrumbItem>
              {cls && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/admin/classes/${cls.id}`}>{cls.display_name}</BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{subject.display_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/subjects')} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">{subject.display_name}</h1>
                  <Badge 
                    variant={subject.is_active ? 'default' : 'secondary'} 
                    className={cn(
                      "gap-1",
                      subject.is_active && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                    )}
                  >
                    {subject.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {subject.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{subject.name}</code>
                  <span className="mx-2">•</span>
                  Position #{subject.position}
                  {cls && (
                    <>
                      <span className="mx-2">•</span>
                      <Link to={`/admin/classes/${cls.id}`} className="text-primary hover:underline">{cls.display_name}</Link>
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/admin/chapters/create?subjectId=${subject.id}`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
              <Button size="sm" onClick={() => navigate(`/admin/subjects/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyId}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy ID
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/admin/academic-tree?subjectId=${subject.id}`)}>
                    <Layers className="h-4 w-4 mr-2" />
                    View in Tree
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Subject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard 
            icon={FileText} 
            label="Chapters" 
            value={chapters.length} 
            color="yellow"
            onClick={() => setActiveTab('chapters')}
          />
          <StatCard 
            icon={Layers} 
            label="Topics" 
            value={topics.length}
            color="purple"
          />
          <StatCard 
            icon={BookOpen} 
            label="Sub-Topics" 
            value={subTopics.length}
            color="blue"
          />
          <StatCard 
            icon={HelpCircle} 
            label="MCQs" 
            value={mcqs.length}
            color="orange"
          />
          <StatCard 
            icon={Target} 
            label="CQs" 
            value={cqs.length}
            color="primary"
          />
          <StatCard 
            icon={Hash} 
            label="Position" 
            value={`#${subject.position}`}
            color="green"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="chapters" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Chapters</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{chapters.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Subject Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Subject Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                        <p className="text-base font-semibold">{subject.display_name}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge 
                          variant={subject.is_active ? 'default' : 'secondary'}
                          className={cn(
                            subject.is_active && "bg-green-100 text-green-700 hover:bg-green-100"
                          )}
                        >
                          {subject.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">System Name (Slug)</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded block w-fit">{subject.name}</code>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">Parent Class</p>
                        {cls ? (
                          <Link to={`/admin/classes/${cls.id}`} className="text-primary hover:underline font-medium">
                            {cls.display_name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </div>

                    {subject.description && (
                      <>
                        <Separator />
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-muted-foreground">Description</p>
                          <p className="text-sm">{subject.description}</p>
                        </div>
                      </>
                    )}

                    <Separator />

                    {/* Content Summary */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Content Summary</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{activeChapters}</p>
                          <p className="text-xs text-muted-foreground">Active Chapters</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{topics.length}</p>
                          <p className="text-xs text-muted-foreground">Total Topics</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
                          <p className="text-xs text-muted-foreground">Questions</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{Math.min(completionRate, 100)}%</p>
                          <p className="text-xs text-muted-foreground">Completion</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Chapters Preview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-lg">Recent Chapters</CardTitle>
                      <CardDescription>Latest chapters added to this subject</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('chapters')}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {chapters.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">No chapters added yet</p>
                        <Button size="sm" onClick={() => navigate(`/admin/chapters/create?subjectId=${subject.id}`)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Chapter
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapters.slice(0, 5).map((chapter, idx) => {
                          const chapterTopics = topics.filter(t => t.chapter_id === chapter.id);
                          return (
                            <Link
                              key={chapter.id}
                              to={`/admin/chapters/${chapter.id}`}
                              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-sm font-bold">
                                  {idx + 1}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">{chapter.display_name}</p>
                                  <p className="text-xs text-muted-foreground">{chapterTopics.length} topics</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={chapter.is_active ? 'default' : 'secondary'}
                                  className={cn(
                                    "text-xs",
                                    chapter.is_active && "bg-green-100 text-green-700 hover:bg-green-100"
                                  )}
                                >
                                  {chapter.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/chapters/create?subjectId=${subject.id}`)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Chapter
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/mcqs?subjectId=${id}`)}>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      View MCQs
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/cqs?subjectId=${id}`)}>
                      <Target className="h-4 w-4 mr-2" />
                      View CQs
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/academic-tree?subjectId=${subject.id}`)}>
                      <Layers className="h-4 w-4 mr-2" />
                      View Content Tree
                    </Button>
                    <Separator className="my-2" />
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => setDeleteDialogOpen(true)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Subject
                    </Button>
                  </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium">{new Date(subject.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">{new Date(subject.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Subject ID</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{subject.id}</code>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopyId}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Progress */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Content Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Topic Coverage</span>
                        <span className="text-sm font-medium">{Math.min(completionRate, 100)}%</span>
                      </div>
                      <Progress value={Math.min(completionRate, 100)} className="h-2" />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Active Chapters</span>
                        <span className="text-sm font-medium">{activeChapters}/{chapters.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Questions Added</span>
                        <span className="text-sm font-medium">{totalQuestions}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Chapters Tab */}
          <TabsContent value="chapters" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Chapters ({chapters.length})</CardTitle>
                  <CardDescription>Manage chapters in this subject</CardDescription>
                </div>
                <Button onClick={() => navigate(`/admin/chapters/create?subjectId=${subject.id}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chapter
                </Button>
              </CardHeader>
              <CardContent>
                {chapters.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No chapters yet</h3>
                    <p className="text-muted-foreground mb-4">Start building your subject by adding chapters</p>
                    <Button onClick={() => navigate(`/admin/chapters/create?subjectId=${subject.id}`)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Chapter
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chapters.map((chapter, idx) => {
                      const chapterTopics = topics.filter(t => t.chapter_id === chapter.id);
                      const chapterTopicIds = chapterTopics.map(t => t.id);
                      const chapterSubTopics = subTopics.filter(st => chapterTopicIds.includes(st.topic_id));
                      const chapterMcqs = mcqs.filter(m => chapterSubTopics.map(st => st.id).includes(m.sub_topic_id));
                      const chapterCqs = cqs.filter(c => chapterSubTopics.map(st => st.id).includes(c.sub_topic_id));

                      return (
                        <Link
                          key={chapter.id}
                          to={`/admin/chapters/${chapter.id}`}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-medium text-foreground group-hover:text-primary transition-colors">{chapter.display_name}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span>{chapterTopics.length} topics</span>
                                <span>•</span>
                                <span>{chapterSubTopics.length} sub-topics</span>
                                <span>•</span>
                                <span>{chapterMcqs.length + chapterCqs.length} questions</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={chapter.is_active ? 'default' : 'secondary'}
                              className={cn(
                                chapter.is_active && "bg-green-100 text-green-700 hover:bg-green-100"
                              )}
                            >
                              {chapter.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Distribution</CardTitle>
                  <CardDescription>Overview of content across chapters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chapters.map((chapter) => {
                      const chapterTopics = topics.filter(t => t.chapter_id === chapter.id);
                      const percentage = topics.length > 0 ? Math.round((chapterTopics.length / topics.length) * 100) : 0;
                      
                      return (
                        <div key={chapter.id}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium truncate flex-1 mr-2">{chapter.display_name}</span>
                            <span className="text-sm text-muted-foreground">{chapterTopics.length} topics</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                    {chapters.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No chapters to display</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Question Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question Distribution</CardTitle>
                  <CardDescription>MCQs vs CQs breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30">
                        <HelpCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{mcqs.length}</p>
                        <p className="text-sm text-orange-600/70 dark:text-orange-400/70">MCQs</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-3xl font-bold text-primary">{cqs.length}</p>
                        <p className="text-sm text-primary/70">CQs</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">MCQ Ratio</span>
                        <span className="text-sm font-medium">{totalQuestions > 0 ? Math.round((mcqs.length / totalQuestions) * 100) : 0}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-primary transition-all"
                          style={{ width: `${totalQuestions > 0 ? (mcqs.length / totalQuestions) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hierarchy Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Content Hierarchy</CardTitle>
                  <CardDescription>Visual breakdown of subject structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="relative p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30">
                      <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-2" />
                      <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{chapters.length}</p>
                      <p className="text-sm text-yellow-600/70 dark:text-yellow-400/70">Chapters</p>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-200 dark:bg-yellow-800 opacity-50" />
                      </div>
                    </div>
                    <div className="relative p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
                      <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{topics.length}</p>
                      <p className="text-sm text-purple-600/70 dark:text-purple-400/70">Topics</p>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800 opacity-50" />
                      </div>
                    </div>
                    <div className="relative p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{subTopics.length}</p>
                      <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Sub-Topics</p>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 opacity-50" />
                      </div>
                    </div>
                    <div className="relative p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                      <Activity className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">{totalQuestions}</p>
                      <p className="text-sm text-green-600/70 dark:text-green-400/70">Questions</p>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 opacity-50" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DeleteConfirmDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        title="Delete Subject" 
        description={`Are you sure you want to delete "${subject.display_name}"? This will also delete all chapters, topics, sub-topics, and questions within this subject.`} 
        onConfirm={handleDelete} 
      />
    </div>
  );
};

export default SubjectDetails;
