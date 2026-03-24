import React from 'react';
import { Users, UserCheck, UserX, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedStatCard from '@/components/tenant/stats/EnhancedStatCard';
import MobileEnhancedStatCard from '@/components/tenant/stats/MobileEnhancedStatCard';
import type { Student } from '@/lib/tenant-mock-data';

interface StudentAnimatedStatCardsProps {
  students: Student[];
}

const StudentAnimatedStatCards: React.FC<StudentAnimatedStatCardsProps> = ({ students }) => {
  const isMobile = useIsMobile();

  const total = students.length;
  const active = students.filter((s) => s.isActive).length;
  const inactive = students.filter((s) => !s.isActive).length;
  const thisMonth = students.filter((s) => {
    const date = new Date(s.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      title: 'Total Students',
      value: total,
      subtitle: 'All registered',
      icon: Users,
      color: 'primary' as const,
      sparklineData: [8, 12, 10, 15, 14, 18, total],
    },
    {
      title: 'Active',
      value: active,
      subtitle: `${total ? Math.round((active / total) * 100) : 0}% of total`,
      icon: UserCheck,
      color: 'success' as const,
      trend: { value: 8, isPositive: true },
      sparklineData: [6, 10, 9, 12, 11, 15, active],
    },
    {
      title: 'Inactive',
      value: inactive,
      subtitle: `${total ? Math.round((inactive / total) * 100) : 0}% of total`,
      icon: UserX,
      color: 'secondary' as const,
      trend: inactive > 0 ? { value: 3, isPositive: false } : undefined,
      sparklineData: [2, 3, 2, 4, 3, 2, inactive],
    },
    {
      title: 'New This Month',
      value: thisMonth,
      subtitle: 'Recent enrollments',
      icon: Calendar,
      color: 'accent' as const,
      trend: thisMonth > 0 ? { value: 12, isPositive: true } : undefined,
      sparklineData: [1, 3, 2, 4, 3, 5, thisMonth],
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

export default StudentAnimatedStatCards;
