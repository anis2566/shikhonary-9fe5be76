import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  Play,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockExams } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import ExamCard from '@/components/tenant/ExamCard';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import { toast } from 'sonner';

const ExamList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const isMobile = useIsMobile();

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Exams refreshed');
  }, []);

  const filteredExams = mockExams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || exam.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || exam.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Ongoing':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Published':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'WEEKLY':
        return 'bg-primary/10 text-primary';
      case 'MONTHLY':
        return 'bg-purple-500/10 text-purple-600';
      case 'TERM':
        return 'bg-orange-500/10 text-orange-600';
      case 'MOCK':
        return 'bg-cyan-500/10 text-cyan-600';
      case 'PRACTICE':
        return 'bg-emerald-500/10 text-emerald-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const stats = {
    total: mockExams.length,
    pending: mockExams.filter((e) => e.status === 'Pending').length,
    ongoing: mockExams.filter((e) => e.status === 'Ongoing').length,
    completed: mockExams.filter((e) => e.status === 'Completed').length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-foreground">Examinations</h1>
          <Button size="sm" asChild>
            <Link to="/tenant/exams/create">
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {stats.total} exams • {stats.ongoing} ongoing
        </p>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Examinations</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage exams for your students
          </p>
        </div>
        <Button size="sm" asChild>
          <Link to="/tenant/exams/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Link>
        </Button>
      </div>

      {/* Mobile Stats - Horizontal Scroll */}
      <div className="lg:hidden -mx-4 px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          <Card className="min-w-[90px] snap-start shrink-0">
            <CardContent className="p-3 text-center">
              <div className="p-2 rounded-lg bg-primary/10 text-primary mx-auto w-fit mb-1">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] snap-start shrink-0">
            <CardContent className="p-3 text-center">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 mx-auto w-fit mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold">{stats.pending}</p>
              <p className="text-[10px] text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] snap-start shrink-0">
            <CardContent className="p-3 text-center">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 mx-auto w-fit mb-1">
                <Play className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold">{stats.ongoing}</p>
              <p className="text-[10px] text-muted-foreground">Ongoing</p>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] snap-start shrink-0">
            <CardContent className="p-3 text-center">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600 mx-auto w-fit mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold">{stats.completed}</p>
              <p className="text-[10px] text-muted-foreground">Done</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop Stats Cards */}
      <div className="hidden lg:grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.ongoing}</p>
                <p className="text-xs text-muted-foreground">Ongoing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search exams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-auto min-w-[100px] h-8 text-xs shrink-0">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="TERM">Term</SelectItem>
            <SelectItem value="MOCK">Mock</SelectItem>
            <SelectItem value="PRACTICE">Practice</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-auto min-w-[100px] h-8 text-xs shrink-0">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Ongoing">Ongoing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Filters */}
      <Card className="hidden lg:block">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="TERM">Term</SelectItem>
                <SelectItem value="MOCK">Mock</SelectItem>
                <SelectItem value="PRACTICE">Practice</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card Grid with Pull to Refresh */}
      {isMobile && (
        <PullToRefresh onRefresh={handleRefresh} className="lg:hidden -mx-4 px-4">
          <div className="space-y-3 pb-20">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} enableSwipe={true} />
            ))}
            
            {filteredExams.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No exams found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </PullToRefresh>
      )}

      {/* Desktop Data Table */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Schedule</TableHead>
                <TableHead className="hidden sm:table-cell">Attempts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{exam.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {exam.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {exam.totalMarks} marks • {exam.duration} min
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className={cn('text-xs', getTypeColor(exam.type))}>
                      {exam.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(exam.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(exam.startDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{exam.attemptCount}</span>
                    </div>
                    {exam.avgScore > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Avg: {exam.avgScore.toFixed(1)}%
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getStatusColor(exam.status))}
                    >
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/tenant/exams/${exam.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/tenant/exams/${exam.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {exam.status === 'Pending' && (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No exams found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamList;
