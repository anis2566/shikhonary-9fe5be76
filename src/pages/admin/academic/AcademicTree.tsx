import React, { useState } from 'react';
import { ChevronRight, ChevronDown, BookOpen, GraduationCap, BookText, FileText, Hash, Layers, Circle } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Expand, Shrink } from 'lucide-react';
import {
  mockBoards,
  mockClasses,
  mockSubjects,
  mockChapters,
  mockTopics,
  mockSubTopics,
  getClassesByBoard,
  getSubjectsByClass,
  getChaptersBySubject,
  getTopicsByChapter,
  getSubTopicsByTopic,
} from '@/lib/academic-mock-data';

interface TreeNodeProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  level: number;
  isActive: boolean;
  children?: React.ReactNode;
  count?: number;
  defaultOpen?: boolean;
  searchMatch?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  id,
  label,
  icon,
  level,
  isActive,
  children,
  count,
  defaultOpen = false,
  searchMatch = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = React.Children.count(children) > 0;

  const levelColors = [
    'border-l-primary',
    'border-l-blue-500',
    'border-l-green-500',
    'border-l-yellow-500',
    'border-l-orange-500',
    'border-l-purple-500',
  ];

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors',
          'hover:bg-muted/50',
          searchMatch && 'bg-primary/10 ring-1 ring-primary/20',
          !isActive && 'opacity-60'
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasChildren ? (
          <button className="p-0.5 hover:bg-muted rounded">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <Circle className="h-2 w-2 mx-1.5 text-muted-foreground/50" />
        )}
        <div className={cn('p-1.5 rounded-md', levelColors[level] || 'border-l-muted', 'border-l-2 bg-muted/30')}>
          {icon}
        </div>
        <span className={cn('flex-1 text-sm', searchMatch && 'font-medium text-primary')}>{label}</span>
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {count}
          </Badge>
        )}
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={cn('text-xs px-1.5 py-0', isActive ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground')}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      {hasChildren && isOpen && <div className="relative">{children}</div>}
    </div>
  );
};

const AcademicTree: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandAll, setExpandAll] = useState(false);

  const matchesSearch = (text: string) => {
    if (!search) return false;
    return text.toLowerCase().includes(search.toLowerCase());
  };

  const handleExpandAll = () => {
    setExpandAll(true);
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
  };

  // Count children for each level
  const getChildCount = (type: string, parentId: string) => {
    switch (type) {
      case 'board':
        return mockClasses.filter((c) => c.boardId === parentId).length;
      case 'class':
        return mockSubjects.filter((s) => s.classId === parentId).length;
      case 'subject':
        return mockChapters.filter((c) => c.subjectId === parentId).length;
      case 'chapter':
        return mockTopics.filter((t) => t.chapterId === parentId).length;
      case 'topic':
        return mockSubTopics.filter((s) => s.topicId === parentId).length;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Academic Hierarchy" subtitle="View the complete academic structure" />

      <div className="p-4 lg:p-6 space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hierarchy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExpandAll}>
              <Expand className="h-4 w-4 mr-2" />
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={handleCollapseAll}>
              <Shrink className="h-4 w-4 mr-2" />
              Collapse All
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-primary/10 border-l-2 border-l-primary">
              <BookOpen className="h-3 w-3" />
            </div>
            <span>Board</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-blue-500/10 border-l-2 border-l-blue-500">
              <GraduationCap className="h-3 w-3" />
            </div>
            <span>Class</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-green-500/10 border-l-2 border-l-green-500">
              <BookText className="h-3 w-3" />
            </div>
            <span>Subject</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-yellow-500/10 border-l-2 border-l-yellow-500">
              <FileText className="h-3 w-3" />
            </div>
            <span>Chapter</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-orange-500/10 border-l-2 border-l-orange-500">
              <Hash className="h-3 w-3" />
            </div>
            <span>Topic</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1 rounded bg-purple-500/10 border-l-2 border-l-purple-500">
              <Layers className="h-3 w-3" />
            </div>
            <span>Sub-Topic</span>
          </div>
        </div>

        {/* Tree */}
        <div className="bg-card rounded-xl border border-border p-2 overflow-auto max-h-[calc(100vh-300px)]" key={expandAll ? 'expanded' : 'collapsed'}>
          {mockBoards.map((board) => (
            <TreeNode
              key={board.id}
              id={board.id}
              label={board.displayName}
              icon={<BookOpen className="h-4 w-4 text-primary" />}
              level={0}
              isActive={board.isActive}
              count={getChildCount('board', board.id)}
              defaultOpen={expandAll || matchesSearch(board.displayName)}
              searchMatch={matchesSearch(board.displayName)}
            >
              {getClassesByBoard(board.id).map((cls) => (
                <TreeNode
                  key={cls.id}
                  id={cls.id}
                  label={`${cls.displayName} (${cls.level})`}
                  icon={<GraduationCap className="h-4 w-4 text-blue-500" />}
                  level={1}
                  isActive={cls.isActive}
                  count={getChildCount('class', cls.id)}
                  defaultOpen={expandAll || matchesSearch(cls.displayName)}
                  searchMatch={matchesSearch(cls.displayName)}
                >
                  {getSubjectsByClass(cls.id).map((subject) => (
                    <TreeNode
                      key={subject.id}
                      id={subject.id}
                      label={subject.displayName}
                      icon={<BookText className="h-4 w-4 text-green-500" />}
                      level={2}
                      isActive={subject.isActive}
                      count={getChildCount('subject', subject.id)}
                      defaultOpen={expandAll || matchesSearch(subject.displayName)}
                      searchMatch={matchesSearch(subject.displayName)}
                    >
                      {getChaptersBySubject(subject.id).map((chapter) => (
                        <TreeNode
                          key={chapter.id}
                          id={chapter.id}
                          label={chapter.displayName}
                          icon={<FileText className="h-4 w-4 text-yellow-600" />}
                          level={3}
                          isActive={chapter.isActive}
                          count={getChildCount('chapter', chapter.id)}
                          defaultOpen={expandAll || matchesSearch(chapter.displayName)}
                          searchMatch={matchesSearch(chapter.displayName)}
                        >
                          {getTopicsByChapter(chapter.id).map((topic) => (
                            <TreeNode
                              key={topic.id}
                              id={topic.id}
                              label={topic.displayName}
                              icon={<Hash className="h-4 w-4 text-orange-500" />}
                              level={4}
                              isActive={topic.isActive}
                              count={getChildCount('topic', topic.id)}
                              defaultOpen={expandAll || matchesSearch(topic.displayName)}
                              searchMatch={matchesSearch(topic.displayName)}
                            >
                              {getSubTopicsByTopic(topic.id).map((subTopic) => (
                                <TreeNode
                                  key={subTopic.id}
                                  id={subTopic.id}
                                  label={subTopic.displayName}
                                  icon={<Layers className="h-4 w-4 text-purple-500" />}
                                  level={5}
                                  isActive={subTopic.isActive}
                                  searchMatch={matchesSearch(subTopic.displayName)}
                                />
                              ))}
                            </TreeNode>
                          ))}
                        </TreeNode>
                      ))}
                    </TreeNode>
                  ))}
                </TreeNode>
              ))}
            </TreeNode>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{mockBoards.length}</p>
            <p className="text-xs text-muted-foreground">Boards</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{mockClasses.length}</p>
            <p className="text-xs text-muted-foreground">Classes</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{mockSubjects.length}</p>
            <p className="text-xs text-muted-foreground">Subjects</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{mockChapters.length}</p>
            <p className="text-xs text-muted-foreground">Chapters</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{mockTopics.length}</p>
            <p className="text-xs text-muted-foreground">Topics</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{mockSubTopics.length}</p>
            <p className="text-xs text-muted-foreground">Sub-Topics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicTree;
