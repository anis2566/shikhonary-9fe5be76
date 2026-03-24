import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Layers, CheckCircle2, Edit, Star, Trash2, Clock, CalendarDays, GraduationCap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import DeleteConfirmDialog from '@/components/academic/DeleteConfirmDialog';
import { mockAcademicYears, mockBatches, mockStudents } from '@/lib/tenant-mock-data';

const AcademicYearDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const year = mockAcademicYears.find((ay) => ay.id === id);

  if (!year) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Academic year not found.</p>
        <Button variant="outline" onClick={() => navigate('/tenant/academic-years')}>Back to List</Button>
      </div>
    );
  }

  const yearBatches = mockBatches.filter((b) => b.academicYear === year.name);
  const yearStudents = mockStudents.filter((s) => yearBatches.some((b) => b.id === s.batchId));
  const activeBatches = yearBatches.filter((b) => b.isActive);

  const startDate = new Date(year.startDate);
  const endDate = new Date(year.endDate);
  const today = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDays) * 100)));
  const remaining = Math.max(0, totalDays - elapsed);

  const handleDelete = () => {
    toast.success(`Academic year "${year.name}" deleted successfully`);
    navigate('/tenant/academic-years');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/academic-years')} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">Academic Year {year.name}</h1>
            {year.isCurrent && (
              <Badge className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
                <Star className="w-3 h-3" /> Current
              </Badge>
            )}
            <Badge variant={year.isActive ? 'default' : 'secondary'}>
              {year.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} – {endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" className="gap-2" onClick={() => navigate(`/tenant/academic-years/${id}/edit`)}>
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Activity className="w-4 h-4 text-primary" />
              Year Progress
            </div>
            <span className="text-sm font-semibold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2 mb-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{elapsed} days elapsed</span>
            <span>{remaining} days remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10"><Users className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{year.totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10"><Layers className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{year.totalBatches}</p>
              <p className="text-xs text-muted-foreground">Total Batches</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/10"><CalendarDays className="w-5 h-5 text-green-500" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalDays}</p>
              <p className="text-xs text-muted-foreground">Total Days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10"><CheckCircle2 className="w-5 h-5 text-orange-500" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeBatches.length}</p>
              <p className="text-xs text-muted-foreground">Active Batches</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="batches">Batches ({yearBatches.length})</TabsTrigger>
          <TabsTrigger value="students">Students ({yearStudents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Session Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Year Name</span>
                  <span className="text-sm font-medium text-foreground">{year.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="text-sm font-medium text-foreground">{startDate.toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="text-sm font-medium text-foreground">{endDate.toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium text-foreground">{totalDays} days ({Math.round(totalDays / 30)} months)</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={year.isActive ? 'default' : 'secondary'}>{year.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Year</span>
                  <Badge variant={year.isCurrent ? 'default' : 'secondary'}>{year.isCurrent ? 'Yes' : 'No'}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Quick Stats</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Batches</span>
                  <span className="text-sm font-medium text-foreground">{yearBatches.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Batches</span>
                  <span className="text-sm font-medium text-foreground">{activeBatches.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Inactive Batches</span>
                  <span className="text-sm font-medium text-foreground">{yearBatches.length - activeBatches.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Students</span>
                  <span className="text-sm font-medium text-foreground">{yearStudents.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created On</span>
                  <span className="text-sm font-medium text-foreground">{new Date(year.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Batches in {year.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {yearBatches.length > 0 ? (
                <div className="space-y-3">
                  {yearBatches.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/tenant/batches/${b.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <GraduationCap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{b.name}</p>
                          <p className="text-sm text-muted-foreground">{b.className} • {b.currentSize}/{b.capacity || '∞'} students</p>
                        </div>
                      </div>
                      <Badge variant={b.isActive ? 'default' : 'secondary'}>{b.isActive ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Layers className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No batches in this academic year.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Students in {year.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {yearStudents.length > 0 ? (
                <div className="space-y-3">
                  {yearStudents.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/tenant/students/${s.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {s.studentId} • {s.email}</p>
                        </div>
                      </div>
                      <Badge variant={s.isActive ? 'default' : 'secondary'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No students found for this academic year.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Academic Year"
        description={`Are you sure you want to delete academic year "${year.name}"? This action cannot be undone and may affect associated batches and student records.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AcademicYearDetails;
