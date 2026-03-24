import React from 'react';
import { Users, UserCheck, UserX, Building2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedStatCard from '@/components/tenant/stats/EnhancedStatCard';
import MobileEnhancedStatCard from '@/components/tenant/stats/MobileEnhancedStatCard';
import type { Staff } from '@/lib/tenant-mock-data';

interface StaffAnimatedStatCardsProps {
  staff: Staff[];
}

const StaffAnimatedStatCards: React.FC<StaffAnimatedStatCardsProps> = ({ staff }) => {
  const isMobile = useIsMobile();

  const total = staff.length;
  const active = staff.filter((s) => s.isActive).length;
  const inactive = staff.filter((s) => !s.isActive).length;
  const departments = new Set(staff.map((s) => s.department)).size;

  const stats = [
    {
      title: 'Total Staff',
      value: total,
      subtitle: 'All members',
      icon: Users,
      color: 'primary' as const,
      sparklineData: [3, 5, 4, 7, 6, 8, total],
    },
    {
      title: 'Active',
      value: active,
      subtitle: `${total ? Math.round((active / total) * 100) : 0}% of total`,
      icon: UserCheck,
      color: 'success' as const,
      trend: { value: 4, isPositive: true },
      sparklineData: [2, 4, 3, 5, 6, 5, active],
    },
    {
      title: 'Departments',
      value: departments,
      subtitle: 'Active departments',
      icon: Building2,
      color: 'accent' as const,
      sparklineData: [2, 3, 3, 4, 3, 4, departments],
    },
    {
      title: 'Inactive',
      value: inactive,
      subtitle: `${total ? Math.round((inactive / total) * 100) : 0}% of total`,
      icon: UserX,
      color: 'secondary' as const,
      trend: inactive > 0 ? { value: 1, isPositive: false } : undefined,
      sparklineData: [1, 2, 1, 3, 2, 1, inactive],
    },
  ];

  if (isMobile) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {stats.map((stat) => (
          <div key={stat.title} className="shrink-0 w-36 snap-start">
            <MobileEnhancedStatCard {...stat} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <EnhancedStatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default StaffAnimatedStatCards;
