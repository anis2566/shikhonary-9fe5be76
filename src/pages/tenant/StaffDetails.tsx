import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Briefcase, Calendar, Hash, DollarSign, User, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStaff } from '@/lib/tenant-mock-data';
import { toast } from 'sonner';

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string; copyable?: boolean }> = ({ icon, label, value, copyable }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="text-muted-foreground mt-0.5 shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground break-words">{value || 'N/A'}</p>
    </div>
    {copyable && value && (
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => { navigator.clipboard.writeText(value); toast.success('Copied to clipboard'); }}
      >
        <Hash className="w-3 h-3" />
      </Button>
    )}
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
  const tenure = (() => {
    const start = new Date(staff.joiningDate);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;
    if (totalMonths < 12) return `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return `${y} year${y !== 1 ? 's' : ''}${m > 0 ? `, ${m} month${m !== 1 ? 's' : ''}` : ''}`;
  })();

  const handleDelete = () => {
    toast.error(`Delete ${staff.name}?`, {
      description: 'This action cannot be undone. All associated records will be removed.',
      action: {
        label: 'Delete',
        onClick: () => {
          toast.success('Staff member deleted');
          navigate('/tenant/staff');
        },
      },
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenant/staff')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Staff Details</h1>
          <p className="text-sm text-muted-foreground">View and manage staff member profile</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />Delete
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/tenant/staff/${staff.id}/edit`}><Edit className="w-4 h-4 mr-2" />Edit</Link>
          </Button>
        </div>
      </div>

      {/* Profile Card + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={staff.imageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mt-4">{staff.name}</h2>
            <p className="text-sm text-muted-foreground">{staff.designation}</p>
            <Badge variant={staff.isActive ? 'default' : 'secondary'} className="mt-2">
              {staff.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Badge variant="outline">{staff.department}</Badge>
              <Badge variant="secondary" className="font-mono text-xs">{staff.employeeId}</Badge>
            </div>

            <Separator className="my-4 w-full" />

            {/* Quick Actions */}
            <div className="w-full space-y-2">
              {staff.email && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href={`mailto:${staff.email}`}><Mail className="w-4 h-4 mr-2" />Send Email</a>
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href={`tel:${staff.phone}`}><Phone className="w-4 h-4 mr-2" />Call</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{tenure}</p>
                <p className="text-[10px] text-muted-foreground">Tenure</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{staff.department}</p>
                <p className="text-[10px] text-muted-foreground">Department</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{staff.designation}</p>
                <p className="text-[10px] text-muted-foreground">Designation</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{staff.salary ? `৳${(staff.salary / 1000).toFixed(0)}k` : 'N/A'}</p>
                <p className="text-[10px] text-muted-foreground">Salary</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                  <InfoRow icon={<User className="w-4 h-4" />} label="Full Name" value={staff.name} />
                  <Separator />
                  {staff.gender && (
                    <>
                      <InfoRow icon={<User className="w-4 h-4" />} label="Gender" value={staff.gender} />
                      <Separator />
                    </>
                  )}
                  <InfoRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="Date of Birth"
                    value={staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
                  />
                  <Separator />
                  <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={staff.address} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Employment Information</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                  <InfoRow icon={<Hash className="w-4 h-4" />} label="Employee ID" value={staff.employeeId} copyable />
                  <Separator />
                  <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Department" value={staff.department} />
                  <Separator />
                  <InfoRow icon={<Shield className="w-4 h-4" />} label="Designation" value={staff.designation} />
                  <Separator />
                  <InfoRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="Joining Date"
                    value={new Date(staff.joiningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  />
                  <Separator />
                  <InfoRow icon={<Clock className="w-4 h-4" />} label="Tenure" value={tenure} />
                  {staff.salary != null && (
                    <>
                      <Separator />
                      <InfoRow icon={<DollarSign className="w-4 h-4" />} label="Monthly Salary (BDT)" value={`৳${staff.salary.toLocaleString()}`} />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                  <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={staff.email} copyable />
                  <Separator />
                  <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={staff.phone} copyable />
                  <Separator />
                  <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={staff.address} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Metadata Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>Created: {new Date(staff.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {staff.updatedAt && (
              <span>Last updated: {new Date(staff.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            )}
            <span>ID: <code className="text-[10px] bg-muted px-1 py-0.5 rounded">{staff.id}</code></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDetails;
