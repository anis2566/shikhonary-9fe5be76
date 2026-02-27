import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, X, Clock, Save, ArrowLeft, Users, Search, CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { mockTeachers } from '@/lib/tenant-mock-data';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'unmarked';

interface TeacherAttendance {
  teacherId: string;
  name: string;
  department: string;
  subject: string;
  status: AttendanceStatus;
}

const departments = ['All', 'Science', 'Mathematics', 'English', 'Social Studies', 'Languages'];

const MarkTeacherAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('All');
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<TeacherAttendance[]>(
    mockTeachers.map((t) => ({
      teacherId: t.id,
      name: t.name,
      department: t.department || 'General',
      subject: t.subjectNames?.[0] || 'N/A',
      status: 'unmarked' as AttendanceStatus,
    }))
  );

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesDept = selectedDept === 'All' || r.department === selectedDept;
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [records, selectedDept, search]);

  const setStatus = (teacherId: string, status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.teacherId === teacherId ? { ...r, status } : r))
    );
  };

  const markAllPresent = () => {
    const ids = filtered.map((r) => r.teacherId);
    setRecords((prev) =>
      prev.map((r) => (ids.includes(r.teacherId) ? { ...r, status: 'present' } : r))
    );
  };

  const handleSave = () => {
    const unmarked = filtered.filter((r) => r.status === 'unmarked').length;
    if (unmarked > 0) {
      toast({ title: 'Incomplete Attendance', description: `${unmarked} teacher(s) are still unmarked.`, variant: 'destructive' });
      return;
    }
    toast({ title: 'Attendance Saved', description: `Attendance for ${filtered.length} teachers has been saved successfully.` });
  };

  const stats = useMemo(() => {
    const present = filtered.filter((r) => r.status === 'present').length;
    const absent = filtered.filter((r) => r.status === 'absent').length;
    const late = filtered.filter((r) => r.status === 'late').length;
    const unmarked = filtered.filter((r) => r.status === 'unmarked').length;
    return { present, absent, late, unmarked, total: filtered.length };
  }, [filtered]);

  const statusButtons: { status: AttendanceStatus; icon: React.ReactNode; label: string; activeClass: string }[] = [
    { status: 'present', icon: <Check className="w-4 h-4" />, label: 'P', activeClass: 'bg-green-500 text-white hover:bg-green-600' },
    { status: 'late', icon: <Clock className="w-4 h-4" />, label: 'L', activeClass: 'bg-amber-500 text-white hover:bg-amber-600' },
    { status: 'absent', icon: <X className="w-4 h-4" />, label: 'A', activeClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/teacher-attendance')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Mark Teacher Attendance</h1>
            <p className="text-muted-foreground mt-1">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllPresent}>
            <CheckCheck className="w-4 h-4 mr-2" />Mark All Present
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />Save Attendance
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-green-600">{stats.present}</p><p className="text-xs text-muted-foreground">Present</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-destructive">{stats.absent}</p><p className="text-xs text-muted-foreground">Absent</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-amber-500">{stats.late}</p><p className="text-xs text-muted-foreground">Late</p></CardContent></Card>
        <Card className="col-span-2 lg:col-span-1"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-muted-foreground">{stats.unmarked}</p><p className="text-xs text-muted-foreground">Unmarked</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={selectedDept} onValueChange={setSelectedDept}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Departments" /></SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Teacher List */}
      <div className="space-y-2">
        {filtered.map((record) => (
          <Card key={record.teacherId} className={cn(
            'transition-colors',
            record.status === 'present' && 'border-green-500/30 bg-green-500/5',
            record.status === 'absent' && 'border-destructive/30 bg-destructive/5',
            record.status === 'late' && 'border-amber-500/30 bg-amber-500/5',
          )}>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {record.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{record.name}</p>
                  <p className="text-xs text-muted-foreground">{record.subject} · {record.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {statusButtons.map((btn) => (
                  <Button
                    key={btn.status}
                    variant={record.status === btn.status ? 'default' : 'outline'}
                    size="sm"
                    className={cn('w-9 h-9 p-0', record.status === btn.status && btn.activeClass)}
                    onClick={() => setStatus(record.teacherId, btn.status)}
                  >
                    {btn.icon}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No teachers found for the selected department.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MarkTeacherAttendancePage;
