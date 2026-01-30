import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, BookText, FileText, Hash, Layers, Circle, ExternalLink, ArrowLeft, Expand, Shrink, Search } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  useClass,
  useSubjects,
  useChapters,
  useTopics,
  useSubTopics,
} from '@/hooks/useAcademicData';

interface TreeNodeProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  level: number;
  isActive: boolean;
  children?: React.ReactNode;
  count?: number;
  forceOpen?: boolean;
  searchMatch?: boolean;
  href?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  id,
  label,
  icon,
  level,
  isActive,
  children,
  count,
  forceOpen = false,
  searchMatch = false,
  href,
}) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const navigate = useNavigate();
  const hasChildren = React.Children.count(children) > 0;

  React.useEffect(() => {
    setIsOpen(forceOpen);
  }, [forceOpen]);

  const levelColors = [
    'border-l-blue-500 bg-blue-500/10',
    'border-l-green-500 bg-green-500/10',
    'border-l-yellow-500 bg-yellow-500/10',
    'border-l-orange-500 bg-orange-500/10',
  ];

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (href) {
      navigate(href);
    }
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer transition-all group',
          'hover:bg-muted/60 hover:shadow-sm',
          searchMatch && 'bg-primary/10 ring-1 ring-primary/30',
          !isActive && 'opacity-50'
        )}
        onClick={handleClick}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        {hasChildren ? (
          <button className="p-1 hover:bg-muted rounded-md transition-colors">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <Circle className="h-2 w-2 mx-2 text-muted-foreground/40" />
        )}
        <div className={cn('p-1.5 rounded-md border-l-2', levelColors[level] || 'border-l-muted bg-muted/30')}>
          {icon}
        </div>
        <span className={cn('flex-1 text-sm font-medium', searchMatch && 'text-primary')}>{label}</span>
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="text-xs px-2 py-0.5 font-normal">
            {count}
          </Badge>
        )}
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={cn(
            'text-xs px-2 py-0.5',
            isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
        {href && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleNavigate}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="relative">
          <div 
            className="absolute left-0 top-0 bottom-0 w-px bg-border" 
            style={{ marginLeft: `${level * 20 + 24}px` }}
          />
          {children}
        </div>
      )}
    </div>
  );
};

const ClassContentTree: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [expandAll, setExpandAll] = useState(true);

  const { data: classData, isLoading: classLoading } = useClass(id || '');
  const { data: subjects = [] } = useSubjects();
  const { data: chapters = [] } = useChapters();
  const { data: topics = [] } = useTopics();
  const { data: subTopics = [] } = useSubTopics();

  const classSubjects = subjects.filter(s => s.class_id === id);

  const matchesSearch = (text: string) => {
    if (!search) return false;
    return text.toLowerCase().includes(search.toLowerCase());
  };

  const getChaptersBySubject = (subjectId: string) => chapters.filter(c => c.subject_id === subjectId);
  const getTopicsByChapter = (chapterId: string) => topics.filter(t => t.chapter_id === chapterId);
  const getSubTopicsByTopic = (topicId: string) => subTopics.filter(s => s.topic_id === topicId);

  // Stats
  const totalSubjects = classSubjects.length;
  const totalChapters = classSubjects.reduce((acc, s) => acc + getChaptersBySubject(s.id).length, 0);
  const totalTopics = classSubjects.reduce((acc, s) => {
    return acc + getChaptersBySubject(s.id).reduce((cAcc, c) => cAcc + getTopicsByChapter(c.id).length, 0);
  }, 0);
  const totalSubTopics = classSubjects.reduce((acc, s) => {
    return acc + getChaptersBySubject(s.id).reduce((cAcc, c) => {
      return cAcc + getTopicsByChapter(c.id).reduce((tAcc, t) => tAcc + getSubTopicsByTopic(t.id).length, 0);
    }, 0);
  }, 0);

  if (classLoading) {
    return (
      <div className="min-h-screen">
        <DashboardHeader title="Content Tree" subtitle="Loading..." />
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen">
        <DashboardHeader title="Class Not Found" subtitle="The requested class doesn't exist" />
        <div className="p-6">
          <Button onClick={() => navigate('/admin/classes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title={`${classData.display_name} - Content Tree`}
        subtitle="Visual hierarchy of all content under this class"
      />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Back button + Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/classes/${id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Button>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setExpandAll(true)}>
              <Expand className="h-4 w-4 mr-2" />
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExpandAll(false)}>
              <Shrink className="h-4 w-4 mr-2" />
              Collapse All
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSubjects}</p>
            <p className="text-xs text-muted-foreground">Subjects</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalChapters}</p>
            <p className="text-xs text-muted-foreground">Chapters</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalTopics}</p>
            <p className="text-xs text-muted-foreground">Topics</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalSubTopics}</p>
            <p className="text-xs text-muted-foreground">Sub-Topics</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-blue-500/10 border-l-2 border-l-blue-500">
              <BookText className="h-3 w-3" />
            </div>
            <span>Subject</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-green-500/10 border-l-2 border-l-green-500">
              <FileText className="h-3 w-3" />
            </div>
            <span>Chapter</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-yellow-500/10 border-l-2 border-l-yellow-500">
              <Hash className="h-3 w-3" />
            </div>
            <span>Topic</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-orange-500/10 border-l-2 border-l-orange-500">
              <Layers className="h-3 w-3" />
            </div>
            <span>Sub-Topic</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>Click icon to view details</span>
          </div>
        </div>

        {/* Tree */}
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <ScrollArea className="h-[calc(100vh-420px)] min-h-[300px]">
            <div className="p-3" key={expandAll ? 'expanded' : 'collapsed'}>
              {classSubjects.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No subjects found</p>
                  <p className="text-sm">Add subjects to this class to see the content tree.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => navigate('/admin/subjects/create')}
                  >
                    Add Subject
                  </Button>
                </div>
              ) : (
                classSubjects.map((subject) => (
                  <TreeNode
                    key={subject.id}
                    id={subject.id}
                    label={subject.display_name}
                    icon={<BookText className="h-4 w-4 text-blue-500" />}
                    level={0}
                    isActive={subject.is_active}
                    count={getChaptersBySubject(subject.id).length}
                    forceOpen={expandAll || matchesSearch(subject.display_name)}
                    searchMatch={matchesSearch(subject.display_name)}
                    href={`/admin/subjects/${subject.id}`}
                  >
                    {getChaptersBySubject(subject.id).map((chapter) => (
                      <TreeNode
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.display_name}
                        icon={<FileText className="h-4 w-4 text-green-500" />}
                        level={1}
                        isActive={chapter.is_active}
                        count={getTopicsByChapter(chapter.id).length}
                        forceOpen={expandAll || matchesSearch(chapter.display_name)}
                        searchMatch={matchesSearch(chapter.display_name)}
                        href={`/admin/chapters/${chapter.id}`}
                      >
                        {getTopicsByChapter(chapter.id).map((topic) => (
                          <TreeNode
                            key={topic.id}
                            id={topic.id}
                            label={topic.display_name}
                            icon={<Hash className="h-4 w-4 text-yellow-600" />}
                            level={2}
                            isActive={topic.is_active}
                            count={getSubTopicsByTopic(topic.id).length}
                            forceOpen={expandAll || matchesSearch(topic.display_name)}
                            searchMatch={matchesSearch(topic.display_name)}
                            href={`/admin/topics/${topic.id}`}
                          >
                            {getSubTopicsByTopic(topic.id).map((subTopic) => (
                              <TreeNode
                                key={subTopic.id}
                                id={subTopic.id}
                                label={subTopic.display_name}
                                icon={<Layers className="h-4 w-4 text-orange-500" />}
                                level={3}
                                isActive={subTopic.is_active}
                                forceOpen={expandAll}
                                searchMatch={matchesSearch(subTopic.display_name)}
                                href={`/admin/subtopics/${subTopic.id}`}
                              />
                            ))}
                          </TreeNode>
                        ))}
                      </TreeNode>
                    ))}
                  </TreeNode>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ClassContentTree;
