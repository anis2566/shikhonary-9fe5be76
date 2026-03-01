import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRightLeft,
  CheckCircle2,
  Users,
  GraduationCap,
  Loader2,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockStudents, mockBatches } from '@/lib/tenant-mock-data';
import { toast } from 'sonner';

const classes = [
  { id: 'cls-1', name: 'Class 10' },
  { id: 'cls-2', name: 'Class 9' },
  { id: 'cls-3', name: 'Class 8' },
  { id: 'cls-11', name: 'Class 11' },
];

const StudentPromotionPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'promote' | 'transfer'>('promote');
  const [search, setSearch] = useState('');
  const [sourceClass, setSourceClass] = useState('');
  const [sourceBatch, setSourceBatch] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [targetBatch, setTargetBatch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((s) => {
      if (sourceClass && s.academicClassId !== sourceClass) return false;
      if (sourceBatch && s.batchId !== sourceBatch) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.studentId.includes(search)) return false;
      return s.isActive;
    });
  }, [sourceClass, sourceBatch, search]);

  const sourceBatches = useMemo(() => {
    if (!sourceClass) return mockBatches;
    return mockBatches.filter((b) => b.academicClassId === sourceClass);
  }, [sourceClass]);

  const targetBatches = useMemo(() => {
    if (!targetClass) return mockBatches;
    return mockBatches.filter((b) => b.academicClassId === targetClass);
  }, [targetClass]);

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    setShowConfirmDialog(false);
    toast.success(
      mode === 'promote'
        ? `${selectedStudents.length} students promoted successfully!`
        : `${selectedStudents.length} students transferred successfully!`
    );
    setSelectedStudents([]);
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/students')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Student Promotion & Transfer</h1>
          <p className="text-muted-foreground text-sm">
            Bulk promote students to next class or transfer between batches
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <Tabs value={mode} onValueChange={(v) => { setMode(v as any); setSelectedStudents([]); }}>
        <TabsList>
          <TabsTrigger value="promote" className="gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Promote
          </TabsTrigger>
          <TabsTrigger value="transfer" className="gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Transfer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promote" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Promotion Settings</CardTitle>
              <CardDescription>
                Select the source class and target class for promotion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">From Class</label>
                  <Select value={sourceClass} onValueChange={(v) => { setSourceClass(v); setSourceBatch(''); setSelectedStudents([]); }}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">From Batch (Optional)</label>
                  <Select value={sourceBatch} onValueChange={setSourceBatch}>
                    <SelectTrigger><SelectValue placeholder="All batches" /></SelectTrigger>
                    <SelectContent>
                      {sourceBatches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Promote To</label>
                  <Select value={targetClass} onValueChange={setTargetClass}>
                    <SelectTrigger><SelectValue placeholder="Select target class" /></SelectTrigger>
                    <SelectContent>
                      {classes.filter((c) => c.id !== sourceClass).map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transfer Settings</CardTitle>
              <CardDescription>
                Transfer students between batches within the same or different class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Source</h4>
                  <Select value={sourceClass} onValueChange={(v) => { setSourceClass(v); setSourceBatch(''); setSelectedStudents([]); }}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sourceBatch} onValueChange={setSourceBatch}>
                    <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                    <SelectContent>
                      {sourceBatches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Destination</h4>
                  <Select value={targetClass} onValueChange={(v) => { setTargetClass(v); setTargetBatch(''); }}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={targetBatch} onValueChange={setTargetBatch}>
                    <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                    <SelectContent>
                      {targetBatches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Student Selection */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Select Students</CardTitle>
              <CardDescription>
                {selectedStudents.length} of {filteredStudents.length} selected
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-2">
                <Checkbox
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={student.imageUrl} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.studentId} • Roll: {student.roll || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{student.className}</Badge>
                    {student.batchName && (
                      <Badge variant="outline" className="text-xs">{student.batchName}</Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No students found</p>
              <p className="text-sm text-muted-foreground">Select a class or adjust your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Bar */}
      {selectedStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {selectedStudents.length} selected
              </Badge>
              <Separator orientation="vertical" className="h-6" />
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={mode === 'promote' ? !targetClass : !targetBatch}
                className="gap-2"
              >
                {mode === 'promote' ? (
                  <>
                    <ArrowUpRight className="w-4 h-4" />
                    Promote Students
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer Students
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {mode === 'promote' ? 'Confirm Promotion' : 'Confirm Transfer'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {mode === 'promote'
                ? `You are about to promote ${selectedStudents.length} student(s) to ${classes.find((c) => c.id === targetClass)?.name || 'the selected class'}. This action will update their class assignment.`
                : `You are about to transfer ${selectedStudents.length} student(s) to ${mockBatches.find((b) => b.id === targetBatch)?.name || 'the selected batch'}. This action will update their batch assignment.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleProcess} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentPromotionPage;
