import { Users, TrendingUp, Award, UserCheck } from 'lucide-react';
import { StudentStats, PoolerStats } from '@/types';

interface StatsPanelProps {
  studentStats?: StudentStats;
  poolerStats?: PoolerStats;
  type: 'students' | 'poolers';
}

/**
 * Statistics panel showing key metrics
 */
export function StatsPanel({ studentStats, poolerStats, type }: StatsPanelProps) {
  if (type === 'students' && studentStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Total Students"
          value={studentStats.totalCount.toString()}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          title="Average Level"
          value={studentStats.averageLevel.toFixed(2)}
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-purple-600" />}
          title="Highest Level"
          value={studentStats.highestLevel.toFixed(2)}
        />
        <StatCard
          icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
          title="Online Now"
          value={studentStats.onlineCount.toString()}
        />
      </div>
    );
  }

  if (type === 'poolers' && poolerStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Total Poolers"
          value={poolerStats.totalCount.toString()}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          title="Average Level"
          value={poolerStats.averageLevel.toFixed(2)}
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-purple-600" />}
          title="Highest Level"
          value={poolerStats.highestLevel.toFixed(2)}
        />
        <StatCard
          icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
          title="In Progress"
          value={poolerStats.inProgressCount.toString()}
        />
      </div>
    );
  }

  return null;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
