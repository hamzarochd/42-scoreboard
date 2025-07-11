import { ExternalLink, Coins, Star, Calendar, MapPin } from 'lucide-react';
import { Student } from '@/types';

interface StudentCardProps {
  student: Student;
}

/**
 * Student card component displaying student information
 */
export function StudentCard({ student }: StudentCardProps) {
  const handleCardClick = () => {
    // Open mock 42 profile URL
    window.open(`https://profile.intra.42.fr/users/${student.login}`, '_blank');
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
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
                src={student.avatar}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=3b82f6&color=fff`;
                }}
              />
              <div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(student.status.isOnline)}`}
                title={student.status.isOnline ? 'Online' : 'Offline'}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {student.login}
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
              {formatLevel(student.level)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(student.level % 1) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{student.promoYear}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{student.campus}</span>
          </div>
        </div>

        {/* Wallet and Eval Points */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wallet</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {student.wallet}₳
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Eval Points</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {student.evaluationPoints}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
