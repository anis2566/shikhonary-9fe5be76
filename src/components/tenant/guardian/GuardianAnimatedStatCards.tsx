import React from 'react';
import { Users, UserCheck, UserX, Link2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedStatCard from '@/components/tenant/stats/EnhancedStatCard';
import MobileEnhancedStatCard from '@/components/tenant/stats/MobileEnhancedStatCard';
import type { Guardian } from '@/lib/tenant-mock-data';

interface GuardianAnimatedStatCardsProps {
  guardians: Guardian[];
}

const GuardianAnimatedStatCards: React.FC<GuardianAnimatedStatCardsProps> = ({ guardians }) => {
  const isMobile = useIsMobile();

  const total = guardians.length;
  const active = guardians.filter((g) => g.isActive).length;
  const inactive = guardians.filter((g) => !g.isActive).length;
  const linkedStudents = new Set(guardians.flatMap((g) => g.studentIds)).size;

  const stats = [
    {
      title: 'Total Guardians',
      value: total,
      subtitle: 'All registered',
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
      trend: { value: 5, isPositive: true },
      sparklineData: [2, 4, 3, 5, 6, 5, active],
    },
    {
      title: 'Students Linked',
      value: linkedStudents,
      subtitle: 'Unique students',
      icon: Link2,
      color: 'blue' as const,
      sparklineData: [4, 6, 5, 8, 7, 9, linkedStudents],
    },
    {
      title: 'Inactive',
      value: inactive,
      subtitle: `${total ? Math.round((inactive / total) * 100) : 0}% of total`,
      icon: UserX,
      color: 'amber' as const,
      trend: inactive > 0 ? { value: 2, isPositive: false } : undefined,
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

export default GuardianAnimatedStatCards;
