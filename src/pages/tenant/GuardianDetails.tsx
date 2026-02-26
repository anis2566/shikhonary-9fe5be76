import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, CreditCard, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockGuardians, mockStudents } from '@/lib/tenant-mock-data';
import { toast } from 'sonner';

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2">
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);

const GuardianDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const guardian = mockGuardians.find((g) => g.id === id);

  if (!guardian) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Guardian not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/tenant/guardians')}>Back to Guardians</Button>
      </div>
    );
  }

  const linkedStudents = mockStudents.filter((s) => guardian.studentIds.includes(s.id));
  const initials = guardian.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/guardians')}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Guardian Details</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/tenant/guardians/${guardian.id}/edit`}><Edit className="w-4 h-4 mr-2" />Edit</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={guardian.imageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mt-4">{guardian.name}</h2>
            <p className="text-sm text-muted-foreground">{guardian.relationship}</p>
            <Badge variant={guardian.isActive ? 'default' : 'secondary'} className="mt-2">
              {guardian.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {guardian.occupation && (
              <Badge variant="outline" className="mt-2">{guardian.occupation}</Badge>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={guardian.email} />
            <Separator />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Primary Phone" value={guardian.phonePrimary} />
            {guardian.phoneSecondary && (
              <>
                <Separator />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Secondary Phone" value={guardian.phoneSecondary} />
              </>
            )}
            <Separator />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={guardian.address} />
            {guardian.nidNumber && (
              <>
                <Separator />
                <InfoRow icon={<CreditCard className="w-4 h-4" />} label="NID Number" value={guardian.nidNumber} />
              </>
            )}
            <Separator />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Added On" value={new Date(guardian.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-base">Linked Students ({linkedStudents.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {linkedStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students linked to this guardian</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {linkedStudents.map((student) => (
                <Link key={student.id} to={`/tenant/students/${student.id}`} className="block">
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.imageUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.className} • Roll: {student.roll}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardianDetails;
