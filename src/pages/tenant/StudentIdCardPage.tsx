import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Printer,
  Search,
  QrCode,
  Users,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockStudents, mockBatches } from '@/lib/tenant-mock-data';
import { toast } from 'sonner';

const IdCard: React.FC<{ student: typeof mockStudents[0]; compact?: boolean }> = ({ student, compact }) => {
  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={`bg-card border rounded-xl overflow-hidden shadow-md ${compact ? 'w-[280px]' : 'w-[340px]'}`}>
      {/* Header stripe */}
      <div className="h-2 bg-gradient-to-r from-primary to-primary/70" />
      <div className="p-4 text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
          Student Identity Card
        </p>
        <h3 className="font-bold text-sm text-foreground">Shikhonary Academy</h3>
      </div>
      <Separator />
      <div className="p-4 flex gap-4 items-start">
        <Avatar className="w-16 h-16 border-2 border-primary/20 shadow">
          <AvatarImage src={student.imageUrl} />
          <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
            {getInitials(student.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="font-bold text-sm truncate">{student.name}</h4>
          <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-[10px] h-5">{student.className}</Badge>
            {student.batchName && (
              <Badge variant="outline" className="text-[10px] h-5">{student.batchName}</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div>
          <span className="text-muted-foreground">Roll:</span>{' '}
          <span className="font-medium">{student.roll || '—'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Section:</span>{' '}
          <span className="font-medium">{student.section || '—'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Group:</span>{' '}
          <span className="font-medium">{student.group || '—'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Blood:</span>{' '}
          <span className="font-medium">{student.bloodGroup || '—'}</span>
        </div>
        {student.fatherName && (
          <div className="col-span-2">
            <span className="text-muted-foreground">Father:</span>{' '}
            <span className="font-medium">{student.fatherName}</span>
          </div>
        )}
        <div className="col-span-2">
          <span className="text-muted-foreground">Phone:</span>{' '}
          <span className="font-medium">{student.primaryPhone}</span>
        </div>
      </div>
      {/* QR placeholder */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center border">
          <QrCode className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div className="text-right text-[10px] text-muted-foreground">
          <p>Valid: 2024-2025</p>
          <p>Academic Session</p>
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-primary to-primary/70" />
    </div>
  );
};

const StudentIdCardPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [previewStudent, setPreviewStudent] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((s) => {
      if (!s.isActive) return false;
      if (filterClass && s.academicClassId !== filterClass) return false;
      if (filterBatch && s.batchId !== filterBatch) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.studentId.includes(search)) return false;
      return true;
    });
  }, [search, filterClass, filterBatch]);

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const handleGenerate = () => {
    toast.success(`Generating ID cards for ${selectedStudents.length} student(s)...`);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const studentsToPreview = previewStudent
    ? mockStudents.filter((s) => s.id === previewStudent)
    : selectedStudents.length > 0
    ? mockStudents.filter((s) => selectedStudents.includes(s.id))
    : [];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/students')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">ID Card Generator</h1>
          <p className="text-muted-foreground text-sm">Generate and print student ID cards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} disabled={studentsToPreview.length === 0}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleGenerate} disabled={selectedStudents.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Student selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Students</CardTitle>
              <div className="space-y-2 mt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
                <div className="flex gap-2">
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Class" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cls-1">Class 10</SelectItem>
                      <SelectItem value="cls-2">Class 9</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterBatch} onValueChange={setFilterBatch}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Batch" /></SelectTrigger>
                    <SelectContent>
                      {mockBatches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto space-y-1">
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg mb-2">
                <Checkbox
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={toggleAll}
                />
                <span className="text-xs font-medium">Select All ({filteredStudents.length})</span>
              </div>
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => setPreviewStudent(student.id === previewStudent ? null : student.id)}
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={(e) => {
                      e ? setSelectedStudents((p) => [...p, student.id]) : setSelectedStudents((p) => p.filter((s) => s !== student.id));
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.imageUrl} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.studentId}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ID Card Preview</CardTitle>
              <CardDescription>
                {studentsToPreview.length > 0
                  ? `Showing ${studentsToPreview.length} card(s)`
                  : 'Select students to preview their ID cards'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentsToPreview.length > 0 ? (
                <div className="flex flex-wrap gap-6 justify-center print:block">
                  {studentsToPreview.map((student) => (
                    <IdCard key={student.id} student={student} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <QrCode className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="font-medium text-muted-foreground">No cards to preview</p>
                  <p className="text-sm text-muted-foreground">Click on a student or select students to generate cards</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCardPage;
