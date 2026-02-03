import React, { useState, useMemo } from 'react';
import { Search, CircleHelp, Filter, FileQuestion, Bookmark } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import StatsCard from '@/components/academic/StatsCard';
import Pagination from '@/components/academic/Pagination';
import TenantMcqCard from '@/components/tenant/question-bank/TenantMcqCard';
import TenantCqCard from '@/components/tenant/question-bank/TenantCqCard';
import { useQuestionBookmarks } from '@/hooks/useQuestionBookmarks';
import { useAuth } from '@/hooks/useAuth';
import { mockMcqs, mockCqs, mockSubjects, mockChapters, getSubjectById, getChapterById, getTopicById, getSubTopicById } from '@/lib/academic-mock-data';

const QuestionBankPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'mcqs';
  
  const { isBookmarked, toggleBookmark, getBookmarkedIds, isLoading: bookmarksLoading } = useQuestionBookmarks();

  // MCQ state
  const [mcqSearch, setMcqSearch] = useState('');
  const [mcqFilterSubject, setMcqFilterSubject] = useState<string>('all');
  const [mcqFilterType, setMcqFilterType] = useState<string>('all');
  const [mcqFilterChapter, setMcqFilterChapter] = useState<string>('all');
  const [mcqShowBookmarked, setMcqShowBookmarked] = useState(false);
  const [mcqPage, setMcqPage] = useState(1);
  const [mcqPerPage, setMcqPerPage] = useState(6);

  // CQ state
  const [cqSearch, setCqSearch] = useState('');
  const [cqFilterSubject, setCqFilterSubject] = useState<string>('all');
  const [cqFilterChapter, setCqFilterChapter] = useState<string>('all');
  const [cqShowBookmarked, setCqShowBookmarked] = useState(false);
  const [cqPage, setCqPage] = useState(1);
  const [cqPerPage, setCqPerPage] = useState(6);

  // Get bookmarked IDs
  const bookmarkedMcqIds = getBookmarkedIds('mcq');
  const bookmarkedCqIds = getBookmarkedIds('cq');

  // MCQ filtering
  const filteredMcqs = useMemo(() => {
    return mockMcqs.filter((mcq) => {
      if (!mcq.isActive) return false;
      if (mcqShowBookmarked && !bookmarkedMcqIds.includes(mcq.id)) return false;
      const matchesSearch = mcq.question.toLowerCase().includes(mcqSearch.toLowerCase());
      const matchesSubject = mcqFilterSubject === 'all' || mcq.subjectId === mcqFilterSubject;
      const matchesType = mcqFilterType === 'all' || mcq.type.toLowerCase() === mcqFilterType.toLowerCase();
      const matchesChapter = mcqFilterChapter === 'all' || mcq.chapterId === mcqFilterChapter;
      return matchesSearch && matchesSubject && matchesType && matchesChapter;
    });
  }, [mcqSearch, mcqFilterSubject, mcqFilterType, mcqFilterChapter, mcqShowBookmarked, bookmarkedMcqIds]);

  const paginatedMcqs = useMemo(() => {
    const start = (mcqPage - 1) * mcqPerPage;
    return filteredMcqs.slice(start, start + mcqPerPage);
  }, [filteredMcqs, mcqPage, mcqPerPage]);

  const mcqTotalPages = Math.ceil(filteredMcqs.length / mcqPerPage);

  // CQ filtering
  const filteredCqs = useMemo(() => {
    return mockCqs.filter((cq) => {
      if (!cq.isActive) return false;
      if (cqShowBookmarked && !bookmarkedCqIds.includes(cq.id)) return false;
      const matchesSearch = cq.context.toLowerCase().includes(cqSearch.toLowerCase()) ||
        cq.questionA.toLowerCase().includes(cqSearch.toLowerCase());
      const matchesSubject = cqFilterSubject === 'all' || cq.subjectId === cqFilterSubject;
      const matchesChapter = cqFilterChapter === 'all' || cq.chapterId === cqFilterChapter;
      return matchesSearch && matchesSubject && matchesChapter;
    });
  }, [cqSearch, cqFilterSubject, cqFilterChapter, cqShowBookmarked, bookmarkedCqIds]);

  const paginatedCqs = useMemo(() => {
    const start = (cqPage - 1) * cqPerPage;
    return filteredCqs.slice(start, start + cqPerPage);
  }, [filteredCqs, cqPage, cqPerPage]);

  const cqTotalPages = Math.ceil(filteredCqs.length / cqPerPage);

  // Stats
  const mcqStats = useMemo(() => {
    const active = mockMcqs.filter(m => m.isActive);
    return {
      total: active.length,
      single: active.filter(m => m.type === 'single').length,
      assertion: active.filter(m => m.type === 'assertion').length,
      statement: active.filter(m => m.type === 'statement').length,
      bookmarked: bookmarkedMcqIds.length,
    };
  }, [bookmarkedMcqIds]);

  const cqStats = useMemo(() => {
    const active = mockCqs.filter(c => c.isActive);
    return {
      total: active.length,
      bookmarked: bookmarkedCqIds.length,
    };
  }, [bookmarkedCqIds]);

  // Get unique types
  const uniqueTypes = useMemo(() => {
    return [...new Set(mockMcqs.filter(m => m.isActive).map(m => m.type))];
  }, []);

  // Get chapters for selected subject
  const availableChapters = useMemo(() => {
    const subjectId = activeTab === 'mcqs' ? mcqFilterSubject : cqFilterSubject;
    if (subjectId === 'all') return mockChapters;
    return mockChapters.filter(c => c.subjectId === subjectId);
  }, [activeTab, mcqFilterSubject, cqFilterSubject]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Question Bank</h1>
            <p className="text-sm text-muted-foreground">Browse available questions for exam preparation</p>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            <CircleHelp className="w-3 h-3 mr-1" />
            Read Only
          </Badge>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="mcqs" className="gap-2">
              <CircleHelp className="w-4 h-4" />
              MCQs
              <Badge variant="secondary" className="ml-1 text-xs">{mcqStats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cqs" className="gap-2">
              <FileQuestion className="w-4 h-4" />
              CQs
              <Badge variant="secondary" className="ml-1 text-xs">{cqStats.total}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* MCQs Tab */}
          <TabsContent value="mcqs" className="mt-6 space-y-6">
            {/* MCQ Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatsCard title="Total MCQs" value={mcqStats.total} icon={<CircleHelp className="h-5 w-5" />} />
              <StatsCard title="Single Choice" value={mcqStats.single} icon={<CircleHelp className="h-5 w-5" />} />
              <StatsCard title="Assertion" value={mcqStats.assertion} icon={<CircleHelp className="h-5 w-5" />} />
              <StatsCard title="Statement" value={mcqStats.statement} icon={<CircleHelp className="h-5 w-5" />} />
              <StatsCard title="Bookmarked" value={mcqStats.bookmarked} icon={<Bookmark className="h-5 w-5" />} />
            </div>

            {/* MCQ Filters */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={mcqSearch}
                    onChange={(e) => { setMcqSearch(e.target.value); setMcqPage(1); }}
                    className="pl-9"
                  />
                </div>
                {user && (
                  <Toggle
                    pressed={mcqShowBookmarked}
                    onPressedChange={(pressed) => { setMcqShowBookmarked(pressed); setMcqPage(1); }}
                    className="gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    aria-label="Show bookmarked only"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Bookmarked</span>
                    {mcqStats.bookmarked > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">{mcqStats.bookmarked}</Badge>
                    )}
                  </Toggle>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={mcqFilterSubject} onValueChange={(v) => { setMcqFilterSubject(v); setMcqFilterChapter('all'); setMcqPage(1); }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {mockSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>{subject.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={mcqFilterChapter} onValueChange={(v) => { setMcqFilterChapter(v); setMcqPage(1); }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    {availableChapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>{chapter.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={mcqFilterType} onValueChange={(v) => { setMcqFilterType(v); setMcqPage(1); }}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* MCQ Cards Grid */}
            {paginatedMcqs.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <CircleHelp className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  {mcqShowBookmarked ? 'No bookmarked MCQs found' : 'No MCQs found matching your criteria'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedMcqs.map((mcq) => (
                  <TenantMcqCard
                    key={mcq.id}
                    mcq={{
                      ...mcq,
                      subjectName: getSubjectById(mcq.subjectId)?.displayName,
                      chapterName: getChapterById(mcq.chapterId)?.displayName,
                      topicName: mcq.topicId ? getTopicById(mcq.topicId)?.displayName : undefined,
                      subTopicName: mcq.subTopicId ? getSubTopicById(mcq.subTopicId)?.displayName : undefined,
                    }}
                    isBookmarked={isBookmarked(mcq.id, 'mcq')}
                    onToggleBookmark={user ? () => toggleBookmark(mcq.id, 'mcq') : undefined}
                    onView={() => navigate(`/tenant/question-bank/mcqs/${mcq.id}`)}
                  />
                ))}
              </div>
            )}

            {filteredMcqs.length > 0 && (
              <Pagination
                currentPage={mcqPage}
                totalPages={mcqTotalPages}
                totalItems={filteredMcqs.length}
                itemsPerPage={mcqPerPage}
                onPageChange={setMcqPage}
                onItemsPerPageChange={(size) => { setMcqPerPage(size); setMcqPage(1); }}
              />
            )}
          </TabsContent>

          {/* CQs Tab */}
          <TabsContent value="cqs" className="mt-6 space-y-6">
            {/* CQ Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Total CQs" value={cqStats.total} icon={<FileQuestion className="h-5 w-5" />} />
              <StatsCard title="Bookmarked" value={cqStats.bookmarked} icon={<Bookmark className="h-5 w-5" />} />
            </div>

            {/* CQ Filters */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={cqSearch}
                    onChange={(e) => { setCqSearch(e.target.value); setCqPage(1); }}
                    className="pl-9"
                  />
                </div>
                {user && (
                  <Toggle
                    pressed={cqShowBookmarked}
                    onPressedChange={(pressed) => { setCqShowBookmarked(pressed); setCqPage(1); }}
                    className="gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    aria-label="Show bookmarked only"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Bookmarked</span>
                    {cqStats.bookmarked > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">{cqStats.bookmarked}</Badge>
                    )}
                  </Toggle>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={cqFilterSubject} onValueChange={(v) => { setCqFilterSubject(v); setCqFilterChapter('all'); setCqPage(1); }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {mockSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>{subject.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={cqFilterChapter} onValueChange={(v) => { setCqFilterChapter(v); setCqPage(1); }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    {availableChapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>{chapter.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CQ Cards Grid */}
            {paginatedCqs.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  {cqShowBookmarked ? 'No bookmarked CQs found' : 'No CQs found matching your criteria'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {paginatedCqs.map((cq) => (
                  <TenantCqCard
                    key={cq.id}
                    cq={{
                      ...cq,
                      subjectName: getSubjectById(cq.subjectId)?.displayName,
                      chapterName: getChapterById(cq.chapterId)?.displayName,
                      topicName: cq.topicId ? getTopicById(cq.topicId)?.displayName : undefined,
                    }}
                    isBookmarked={isBookmarked(cq.id, 'cq')}
                    onToggleBookmark={user ? () => toggleBookmark(cq.id, 'cq') : undefined}
                    onView={() => navigate(`/tenant/question-bank/cqs/${cq.id}`)}
                  />
                ))}
              </div>
            )}

            {filteredCqs.length > 0 && (
              <Pagination
                currentPage={cqPage}
                totalPages={cqTotalPages}
                totalItems={filteredCqs.length}
                itemsPerPage={cqPerPage}
                onPageChange={setCqPage}
                onItemsPerPageChange={(size) => { setCqPerPage(size); setCqPage(1); }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestionBankPage;
