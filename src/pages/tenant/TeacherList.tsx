import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { mockTeachers } from '@/lib/tenant-mock-data';
import { useIsMobile } from '@/hooks/use-mobile';
import TeacherCard from '@/components/tenant/TeacherCard';

const TeacherList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const isMobile = useIsMobile();

  const filteredTeachers = mockTeachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjectNames.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && teacher.isActive) ||
      (selectedStatus === 'inactive' && !teacher.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground mt-1">
            Manage teacher profiles and assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" asChild>
            <Link to="/tenant/teachers/create">
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats - Horizontal scroll on mobile */}
      {isMobile ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {[
            { value: mockTeachers.length, label: 'Total Teachers' },
            { value: mockTeachers.filter((t) => t.isActive).length, label: 'Active' },
            { value: new Set(mockTeachers.flatMap((t) => t.subjectIds)).size, label: 'Subjects' },
            { value: new Set(mockTeachers.map((t) => t.department).filter(Boolean)).size, label: 'Departments' },
          ].map((stat) => (
            <Card key={stat.label} className="shrink-0 w-28 snap-start">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{mockTeachers.length}</p>
              <p className="text-xs text-muted-foreground">Total Teachers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {mockTeachers.filter((t) => t.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {new Set(mockTeachers.flatMap((t) => t.subjectIds)).size}
              </p>
              <p className="text-xs text-muted-foreground">Subjects Covered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {new Set(mockTeachers.map((t) => t.department).filter(Boolean)).size}
              </p>
              <p className="text-xs text-muted-foreground">Departments</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card Grid */}
      {isMobile ? (
        <div className="space-y-3">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
          {filteredTeachers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <UserCheck className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No teachers found</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Desktop Data Table */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead className="hidden md:table-cell">Subjects</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="hidden sm:table-cell">Designation</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={teacher.imageUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {teacher.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {teacher.department || 'No department'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjectNames.slice(0, 2).map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjectNames.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.subjectNames.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-32">{teacher.email}</span>
                        </div>
                        {teacher.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {teacher.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm">{teacher.designation || '-'}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={teacher.isActive ? 'default' : 'secondary'}>
                        {teacher.isActive ? 'Active' : 'Inactive'}
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
                            <Link to={`/tenant/teachers/${teacher.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/tenant/teachers/${teacher.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
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

            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <UserCheck className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No teachers found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherList;
