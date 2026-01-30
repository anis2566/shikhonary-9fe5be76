import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, BookText, FileText, Hash, Clock, Calendar, 
  ExternalLink, Plus, MoreHorizontal, CheckCircle2, XCircle, 
  TrendingUp, Layers, HelpCircle, BookOpen, ChevronRight, Copy,
  Activity, BarChart3, Target, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
import { mockClasses, getSubjectsByClass, mockChapters, mockTopics, mockSubTopics, mockMcqs, mockCqs } from '@/lib/academic-mock-data';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ClassDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');

  const cls = mockClasses.find((c) => c.id === id);
  const subjects = cls ? getSubjectsByClass(cls.id) : [];
  
  // Calculate comprehensive stats
  const subjectIds = subjects.map(s => s.id);
  const chapters = mockChapters.filter(ch => subjectIds.includes(ch.subjectId));
  const chapterIds = chapters.map(c => c.id);
  const topics = mockTopics.filter(t => chapterIds.includes(t.chapterId));
  const topicIds = topics.map(t => t.id);
  const subTopics = mockSubTopics.filter(st => topicIds.includes(st.topicId));
  const mcqs = mockMcqs.filter(m => subjectIds.includes(m.subjectId));
  const cqs = mockCqs.filter(c => subjectIds.includes(c.subjectId));
  
  const totalQuestions = mcqs.length + cqs.length;
  const activeSubjects = subjects.filter(s => s.isActive).length;
  const completionRate = subjects.length > 0 ? Math.round((chapters.length / (subjects.length * 5)) * 100) : 0;

  if (!cls) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Class Not Found</h1>
          <p className="text-muted-foreground">The class you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/classes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    toast.success('Class deleted successfully');
    navigate('/admin/classes');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(cls.id);
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
                <BreadcrumbLink href="/admin/classes">Classes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{cls.displayName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/classes')} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">{cls.displayName}</h1>
                  <Badge variant="outline" className="font-medium">{cls.level}</Badge>
                  <Badge 
                    variant={cls.isActive ? 'default' : 'secondary'} 
                    className={cn(
                      "gap-1",
                      cls.isActive && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                    )}
                  >
                    {cls.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {cls.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{cls.name}</code>
                  <span className="mx-2">•</span>
                  Position #{cls.position}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/admin/subjects/create?classId=${cls.id}`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
              <Button size="sm" onClick={() => navigate(`/admin/classes/${id}/edit`)}>
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
                  <DropdownMenuItem onClick={() => navigate(`/admin/academic-tree?classId=${cls.id}`)}>
                    <Layers className="h-4 w-4 mr-2" />
                    View in Tree
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Class
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
            icon={BookText} 
            label="Subjects" 
            value={subjects.length} 
            color="green"
            onClick={() => setActiveTab('subjects')}
          />
          <StatCard 
            icon={FileText} 
            label="Chapters" 
            value={chapters.length}
            color="yellow"
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
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2">
              <BookText className="h-4 w-4" />
              <span className="hidden sm:inline">Subjects</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{subjects.length}</Badge>
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
                {/* Class Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Class Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                        <p className="text-base font-semibold">{cls.displayName}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">Level / Board</p>
                        <Badge variant="outline" className="text-sm font-medium">{cls.level}</Badge>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">System Name (Slug)</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded block w-fit">{cls.name}</code>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">Display Position</p>
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{cls.position}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Content Summary */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Content Summary</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{activeSubjects}</p>
                          <p className="text-xs text-muted-foreground">Active Subjects</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{chapters.length}</p>
                          <p className="text-xs text-muted-foreground">Total Chapters</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
                          <p className="text-xs text-muted-foreground">Questions</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
                          <p className="text-xs text-muted-foreground">Completion</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Subjects Preview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-lg">Recent Subjects</CardTitle>
                      <CardDescription>Latest subjects added to this class</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('subjects')}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {subjects.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <BookText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">No subjects yet</p>
                        <Button size="sm" onClick={() => navigate(`/admin/subjects/create?classId=${cls.id}`)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Subject
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {subjects.slice(0, 4).map((subject) => {
                          const subjectChapters = mockChapters.filter(ch => ch.subjectId === subject.id);
                          return (
                            <Link 
                              key={subject.id} 
                              to={`/admin/subjects/${subject.id}`} 
                              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/20 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                  <BookText className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {subject.displayName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {subject.code && <span className="font-mono">{subject.code}</span>}
                                    {subject.code && ' • '}
                                    {subjectChapters.length} chapters
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant={subject.isActive ? 'default' : 'secondary'} 
                                  className={cn(
                                    "text-xs",
                                    subject.isActive && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                                  )}
                                >
                                  {subject.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Metadata & Quick Actions */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => navigate(`/admin/subjects/create?classId=${cls.id}`)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Subject
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(`/admin/academic-tree?classId=${cls.id}`)}
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      View Content Tree
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(`/admin/classes/${id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Class Details
                    </Button>
                    <Separator className="my-3" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Class
                    </Button>
                  </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium">{cls.createdAt.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">{cls.updatedAt.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Class ID</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1.5 rounded flex-1 break-all">{cls.id}</code>
                        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={handleCopyId}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Progress */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Content Progress</CardTitle>
                    <CardDescription>Based on average 5 chapters per subject</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Chapters Coverage</span>
                        <span className="font-medium">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {chapters.length} chapters across {subjects.length} subjects
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Subjects ({subjects.length})</CardTitle>
                  <CardDescription>Subjects belonging to {cls.displayName}</CardDescription>
                </div>
                <Button onClick={() => navigate(`/admin/subjects/create?classId=${cls.id}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </CardHeader>
              <CardContent>
                {subjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <BookText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Subjects Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                      Get started by adding subjects to this class. Subjects contain chapters, topics, and questions.
                    </p>
                    <Button onClick={() => navigate(`/admin/subjects/create?classId=${cls.id}`)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Subject
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {subjects.map((subject, index) => {
                      const subjectChapters = mockChapters.filter(ch => ch.subjectId === subject.id);
                      const subjectMcqs = mockMcqs.filter(m => m.subjectId === subject.id);
                      const subjectCqs = mockCqs.filter(c => c.subjectId === subject.id);
                      
                      return (
                        <Link
                          key={subject.id}
                          to={`/admin/subjects/${subject.id}`}
                          className="block p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group bg-card"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <BookText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {subject.displayName}
                                </h3>
                                {subject.code && (
                                  <p className="text-xs text-muted-foreground font-mono">{subject.code}</p>
                                )}
                              </div>
                            </div>
                            <Badge 
                              variant={subject.isActive ? 'default' : 'secondary'}
                              className={cn(
                                "text-xs",
                                subject.isActive && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                              )}
                            >
                              {subject.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {subjectChapters.length} chapters
                            </span>
                            <span className="flex items-center gap-1">
                              <HelpCircle className="h-3.5 w-3.5" />
                              {subjectMcqs.length + subjectCqs.length} questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="h-3.5 w-3.5" />
                              #{index + 1}
                            </span>
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
            <div className="grid gap-6 md:grid-cols-2">
              {/* Content Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Distribution</CardTitle>
                  <CardDescription>Breakdown of content across subjects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subjects.map((subject) => {
                    const subjectChapters = mockChapters.filter(ch => ch.subjectId === subject.id);
                    const percentage = chapters.length > 0 ? Math.round((subjectChapters.length / chapters.length) * 100) : 0;
                    
                    return (
                      <div key={subject.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{subject.displayName}</span>
                          <span className="text-muted-foreground">{subjectChapters.length} chapters</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                  {subjects.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No subjects to display</p>
                  )}
                </CardContent>
              </Card>

              {/* Question Bank Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question Bank Summary</CardTitle>
                  <CardDescription>MCQs and CQs in this class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-orange-100/50 dark:bg-orange-900/20">
                      <HelpCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-orange-600">{mcqs.length}</p>
                      <p className="text-sm text-muted-foreground">MCQs</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-primary/10">
                      <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-3xl font-bold text-primary">{cqs.length}</p>
                      <p className="text-sm text-muted-foreground">CQs</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Questions</span>
                    <span className="text-lg font-bold">{totalQuestions}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Hierarchy Depth */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Content Hierarchy</CardTitle>
                  <CardDescription>Complete breakdown from subjects to questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
                    <div className="text-center min-w-[100px]">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                        <BookText className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-2xl font-bold">{subjects.length}</p>
                      <p className="text-xs text-muted-foreground">Subjects</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
                    <div className="text-center min-w-[100px]">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
                        <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <p className="text-2xl font-bold">{chapters.length}</p>
                      <p className="text-xs text-muted-foreground">Chapters</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
                    <div className="text-center min-w-[100px]">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                        <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-2xl font-bold">{topics.length}</p>
                      <p className="text-xs text-muted-foreground">Topics</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
                    <div className="text-center min-w-[100px]">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold">{subTopics.length}</p>
                      <p className="text-xs text-muted-foreground">Sub-Topics</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
                    <div className="text-center min-w-[100px]">
                      <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
                        <HelpCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-2xl font-bold">{totalQuestions}</p>
                      <p className="text-xs text-muted-foreground">Questions</p>
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
        title="Delete Class" 
        description={`Are you sure you want to delete "${cls.displayName}"? This will also remove all associated subjects, chapters, topics, and questions. This action cannot be undone.`} 
        onConfirm={handleDelete} 
      />
    </div>
  );
};

export default ClassDetails;
