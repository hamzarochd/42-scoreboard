import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Pooler } from '@/types';

interface PoolerCardProps {
  pooler: Pooler;
}

/**
 * Pooler card component displaying pooler information
 */
export function PoolerCard({ pooler }: PoolerCardProps) {
  const handleCardClick = () => {
    // Open mock 42 profile URL
    window.open(`https://profile.intra.42.fr/users/${pooler.login}`, '_blank');
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline 
      ? 'bg-green-500' 
      : 'bg-gray-400';
  };

  const formatLevel = (level: number) => {
    return level.toFixed(2);
  };



  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 group"
    >
      <div className="p-6">
        {/* Header with avatar and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={pooler.avatar}
                alt={`${pooler.firstName} ${pooler.lastName}`}
                className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${pooler.firstName}+${pooler.lastName}&background=3b82f6&color=fff`;
                }}
              />
              <div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(pooler.status.isOnline)}`}
                title={pooler.status.isOnline ? 'Online' : 'Offline'}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {pooler.firstName} {pooler.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pooler.login}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>

        {/* Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatLevel(pooler.level)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(pooler.level % 1) * 100}%` }}
            />
          </div>
        </div>

        {/* Pool Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{pooler.poolYear}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{pooler.campus}</span>
          </div>
        </div>

        {/* Pool Month */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pool Month</p>
          <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {pooler.poolMonth}
          </span>
        </div>

        {/* Pool Dates */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>{pooler.poolStartDate} - {pooler.poolEndDate}</p>
        </div>
      </div>
    </div>
  );
}
