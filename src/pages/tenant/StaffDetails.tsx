import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Briefcase, Calendar, Hash, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockStaff } from '@/lib/tenant-mock-data';

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2">
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);

const StaffDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const staff = mockStaff.find((s) => s.id === id);

  if (!staff) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Staff member not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/tenant/staff')}>Back to Staff</Button>
      </div>
    );
  }

  const initials = staff.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/staff')}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Staff Details</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/tenant/staff/${staff.id}/edit`}><Edit className="w-4 h-4 mr-2" />Edit</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={staff.imageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mt-4">{staff.name}</h2>
            <p className="text-sm text-muted-foreground">{staff.designation}</p>
            <Badge variant={staff.isActive ? 'default' : 'secondary'} className="mt-2">
              {staff.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline">{staff.department}</Badge>
              <Badge variant="secondary" className="font-mono">{staff.employeeId}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={<Hash className="w-4 h-4" />} label="Employee ID" value={staff.employeeId} />
            <Separator />
            <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Department" value={staff.department} />
            <Separator />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={staff.email} />
            <Separator />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={staff.phone} />
            <Separator />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={staff.address} />
            <Separator />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : undefined} />
            <Separator />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Joining Date" value={new Date(staff.joiningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            {staff.salary && (
              <>
                <Separator />
                <InfoRow icon={<DollarSign className="w-4 h-4" />} label="Salary (BDT)" value={`৳${staff.salary.toLocaleString()}`} />
              </>
            )}
            {staff.gender && (
              <>
                <Separator />
                <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Gender" value={staff.gender} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDetails;
