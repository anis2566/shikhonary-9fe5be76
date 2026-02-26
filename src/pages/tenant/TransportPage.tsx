import React, { useState } from 'react';
import {
  Bus,
  Search,
  Plus,
  MapPin,
  Users,
  Clock,
  Route,
  MoreHorizontal,
  Eye,
  Edit,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TransportRoute {
  id: string;
  routeName: string;
  routeNo: string;
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  capacity: number;
  studentsAssigned: number;
  stops: string[];
  departureTime: string;
  status: 'active' | 'inactive' | 'maintenance';
}

const mockRoutes: TransportRoute[] = [
  { id: 'tr-1', routeName: 'Dhanmondi - Uttara', routeNo: 'R-01', driverName: 'Abdul Karim', driverPhone: '+8801711111111', vehicleNo: 'DHA-1234', capacity: 40, studentsAssigned: 35, stops: ['Dhanmondi 27', 'Farmgate', 'Bijoy Sarani', 'Airport', 'Uttara Sector 3'], departureTime: '7:00 AM', status: 'active' },
  { id: 'tr-2', routeName: 'Mirpur - Gulshan', routeNo: 'R-02', driverName: 'Rafiq Miah', driverPhone: '+8801722222222', vehicleNo: 'DHA-5678', capacity: 35, studentsAssigned: 30, stops: ['Mirpur 10', 'Mirpur 12', 'Banani', 'Gulshan 1', 'Gulshan 2'], departureTime: '6:45 AM', status: 'active' },
  { id: 'tr-3', routeName: 'Mohammadpur - Motijheel', routeNo: 'R-03', driverName: 'Jamal Uddin', driverPhone: '+8801733333333', vehicleNo: 'DHA-9012', capacity: 45, studentsAssigned: 28, stops: ['Mohammadpur', 'Elephant Road', 'Shahbag', 'Press Club', 'Motijheel'], departureTime: '7:15 AM', status: 'active' },
  { id: 'tr-4', routeName: 'Bashundhara - Campus', routeNo: 'R-04', driverName: 'Habib Rahman', driverPhone: '+8801744444444', vehicleNo: 'DHA-3456', capacity: 30, studentsAssigned: 0, stops: ['Bashundhara R/A', 'Nadda', 'Campus'], departureTime: '-', status: 'maintenance' },
  { id: 'tr-5', routeName: 'Wari - Old Dhaka', routeNo: 'R-05', driverName: 'Selim Khan', driverPhone: '+8801755555555', vehicleNo: 'DHA-7890', capacity: 35, studentsAssigned: 22, stops: ['Wari', 'Sadarghat', 'Lalbagh', 'Azimpur'], departureTime: '6:30 AM', status: 'active' },
];

const TransportPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = mockRoutes.filter((r) =>
    r.routeName.toLowerCase().includes(search.toLowerCase()) ||
    r.driverName.toLowerCase().includes(search.toLowerCase()) ||
    r.vehicleNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = mockRoutes.reduce((a, r) => a + r.studentsAssigned, 0);
  const activeRoutes = mockRoutes.filter((r) => r.status === 'active').length;
  const totalCapacity = mockRoutes.reduce((a, r) => a + r.capacity, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'maintenance': return 'bg-amber-500/10 text-amber-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Transport</h1>
          <p className="text-muted-foreground mt-1">Manage routes, vehicles, and student assignments</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Route</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Route className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{mockRoutes.length}</p><p className="text-xs text-muted-foreground">Total Routes</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10 text-green-600"><Bus className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{activeRoutes}</p><p className="text-xs text-muted-foreground">Active</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><Users className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{totalStudents}</p><p className="text-xs text-muted-foreground">Students</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><MapPin className="w-5 h-5" /></div><div><p className="text-2xl font-bold">{totalCapacity}</p><p className="text-xs text-muted-foreground">Total Capacity</p></div></div></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search routes, drivers, vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((route) => (
          <Card key={route.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{route.routeName}</h3>
                    <Badge variant="outline" className="text-xs">{route.routeNo}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Vehicle: {route.vehicleNo}</p>
                </div>
                <Badge className={cn('text-xs capitalize', getStatusColor(route.status))}>{route.status}</Badge>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{route.driverName.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium">{route.driverName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{route.driverPhone}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {route.stops.map((stop, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                    <MapPin className="w-2.5 h-2.5" />{stop}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{route.studentsAssigned}/{route.capacity} students</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{route.departureTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TransportPage;
