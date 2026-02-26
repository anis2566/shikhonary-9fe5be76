import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Layers, CheckCircle2, Edit, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockAcademicYears, mockBatches, mockStudents } from '@/lib/tenant-mock-data';

const AcademicYearDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/academic-years')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Academic Year {year.name}</h1>
            {year.isCurrent && <Badge variant="default" className="gap-1"><Star className="w-3 h-3" /> Current</Badge>}
            <Badge variant={year.isActive ? 'default' : 'secondary'}>{year.isActive ? 'Active' : 'Inactive'}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(year.startDate).toLocaleDateString()} – {new Date(year.endDate).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => navigate(`/tenant/academic-years/${id}/edit`)}>
          <Edit className="w-4 h-4" /> Edit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Users className="w-5 h-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{year.totalStudents}</p><p className="text-xs text-muted-foreground">Students</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><Layers className="w-5 h-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold">{year.totalBatches}</p><p className="text-xs text-muted-foreground">Batches</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10"><Calendar className="w-5 h-5 text-green-500" /></div>
            <div><p className="text-2xl font-bold">{Math.ceil((new Date(year.endDate).getTime() - new Date(year.startDate).getTime()) / (1000 * 60 * 60 * 24))}</p><p className="text-xs text-muted-foreground">Total Days</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10"><CheckCircle2 className="w-5 h-5 text-orange-500" /></div>
            <div><p className="text-2xl font-bold">{yearBatches.length}</p><p className="text-xs text-muted-foreground">Active Batches</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Batches in this year */}
      <Card>
        <CardHeader><CardTitle>Batches</CardTitle></CardHeader>
        <CardContent>
          {yearBatches.length > 0 ? (
            <div className="space-y-3">
              {yearBatches.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/tenant/batches/${b.id}`)}>
                  <div>
                    <p className="font-medium text-foreground">{b.name}</p>
                    <p className="text-sm text-muted-foreground">{b.className} • {b.currentSize}/{b.capacity || '∞'} students</p>
                  </div>
                  <Badge variant={b.isActive ? 'default' : 'secondary'}>{b.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">No batches in this academic year.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademicYearDetails;
