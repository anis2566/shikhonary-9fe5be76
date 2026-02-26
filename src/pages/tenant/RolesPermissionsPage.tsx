import React, { useState } from 'react';
import {
  Shield,
  Users,
  Plus,
  Edit,
  Eye,
  MoreHorizontal,
  Check,
  X,
  Lock,
  Unlock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Permission {
  key: string;
  label: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  usersCount: number;
  isSystem: boolean;
  permissions: Record<string, boolean>;
}

const allPermissions: Permission[] = [
  { key: 'students.view', label: 'View Students', description: 'Can view student list and details' },
  { key: 'students.create', label: 'Create Students', description: 'Can enroll new students' },
  { key: 'students.edit', label: 'Edit Students', description: 'Can update student information' },
  { key: 'students.delete', label: 'Delete Students', description: 'Can remove students' },
  { key: 'exams.view', label: 'View Exams', description: 'Can view exam list and results' },
  { key: 'exams.create', label: 'Create Exams', description: 'Can create new exams' },
  { key: 'exams.edit', label: 'Edit Exams', description: 'Can modify existing exams' },
  { key: 'attendance.view', label: 'View Attendance', description: 'Can view attendance records' },
  { key: 'attendance.mark', label: 'Mark Attendance', description: 'Can mark daily attendance' },
  { key: 'fees.view', label: 'View Fees', description: 'Can view fee structures and payments' },
  { key: 'fees.manage', label: 'Manage Fees', description: 'Can collect and manage payments' },
  { key: 'reports.view', label: 'View Reports', description: 'Can access analytics and reports' },
  { key: 'settings.manage', label: 'Manage Settings', description: 'Can modify system settings' },
];

const mockRoles: Role[] = [
  {
    id: 'role-1', name: 'tenant_admin', displayName: 'Tenant Admin', description: 'Full access to all features', usersCount: 2, isSystem: true,
    permissions: Object.fromEntries(allPermissions.map((p) => [p.key, true])),
  },
  {
    id: 'role-2', name: 'teacher', displayName: 'Teacher', description: 'Can manage students, exams, and attendance', usersCount: 12, isSystem: true,
    permissions: { 'students.view': true, 'students.edit': true, 'exams.view': true, 'exams.create': true, 'exams.edit': true, 'attendance.view': true, 'attendance.mark': true, 'reports.view': true, 'students.create': false, 'students.delete': false, 'fees.view': false, 'fees.manage': false, 'settings.manage': false },
  },
  {
    id: 'role-3', name: 'accountant', displayName: 'Accountant', description: 'Can manage fees and payments', usersCount: 3, isSystem: false,
    permissions: { 'students.view': true, 'fees.view': true, 'fees.manage': true, 'reports.view': true, 'students.create': false, 'students.edit': false, 'students.delete': false, 'exams.view': false, 'exams.create': false, 'exams.edit': false, 'attendance.view': false, 'attendance.mark': false, 'settings.manage': false },
  },
  {
    id: 'role-4', name: 'receptionist', displayName: 'Receptionist', description: 'Can view students and mark attendance', usersCount: 2, isSystem: false,
    permissions: { 'students.view': true, 'students.create': true, 'attendance.view': true, 'attendance.mark': true, 'students.edit': false, 'students.delete': false, 'exams.view': false, 'exams.create': false, 'exams.edit': false, 'fees.view': false, 'fees.manage': false, 'reports.view': false, 'settings.manage': false },
  },
];

const RolesPermissionsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const totalUsers = mockRoles.reduce((a, r) => a + r.usersCount, 0);

  const getRoleColor = (name: string) => {
    switch (name) {
      case 'tenant_admin': return 'bg-primary/10 text-primary';
      case 'teacher': return 'bg-blue-500/10 text-blue-600';
      case 'accountant': return 'bg-green-500/10 text-green-600';
      case 'receptionist': return 'bg-amber-500/10 text-amber-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">Manage user roles and access control</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />Create Role</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Shield className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockRoles.length}</p><p className="text-xs text-muted-foreground">Total Roles</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><Users className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{totalUsers}</p><p className="text-xs text-muted-foreground">Users Assigned</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10 text-green-600"><Lock className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{allPermissions.length}</p><p className="text-xs text-muted-foreground">Permissions</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><Unlock className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockRoles.filter((r) => !r.isSystem).length}</p><p className="text-xs text-muted-foreground">Custom Roles</p></div></div></CardContent></Card>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRoles.map((role) => {
          const grantedCount = Object.values(role.permissions).filter(Boolean).length;
          return (
            <Card key={role.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', getRoleColor(role.name))}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{role.displayName}</h3>
                        {role.isSystem && <Badge variant="outline" className="text-xs">System</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedRole(role)}><Eye className="w-4 h-4 mr-2" />View Permissions</DropdownMenuItem>
                      {!role.isSystem && <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Role</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Separator className="my-3" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Users className="w-3.5 h-3.5" />{role.usersCount} users</span>
                  <span className="text-muted-foreground">{grantedCount}/{allPermissions.length} permissions</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {allPermissions.slice(0, 5).map((perm) => (
                    <span key={perm.key} className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                      role.permissions[perm.key] ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                    )}>
                      {role.permissions[perm.key] ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                      {perm.label.replace('View ', '').replace('Create ', '').replace('Manage ', '')}
                    </span>
                  ))}
                  {allPermissions.length > 5 && <span className="text-xs text-muted-foreground px-2 py-0.5">+{allPermissions.length - 5} more</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permission Detail Dialog */}
      <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <DialogContent className="max-w-lg">
          {selectedRole && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRole.displayName} — Permissions</DialogTitle>
                <DialogDescription>{selectedRole.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allPermissions.map((perm) => (
                  <div key={perm.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch checked={selectedRole.permissions[perm.key] || false} disabled={selectedRole.isSystem} onCheckedChange={() => toast({ title: 'Permission Updated', description: `${perm.label} toggled for ${selectedRole.displayName}` })} />
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesPermissionsPage;
