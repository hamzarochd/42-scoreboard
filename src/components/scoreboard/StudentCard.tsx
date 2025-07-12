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
      ? 'bg-accent-500' 
      : 'bg-dark-400';
  };

  const formatLevel = (level: number) => {
    return level.toFixed(2);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="card hover:accent-glow transition-all duration-300 cursor-pointer hover:border-accent-500 group"
    >
      <div className="p-6">
        {/* Header with avatar and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={student.avatar}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-12 h-12 rounded-full border-2 border-dark-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=E6C642&color=000`;
                }}
              />
              <div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-100 ${getStatusColor(student.status.isOnline)}`}
                title={student.status.isOnline ? 'Online' : 'Offline'}
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-dark-500">
                {student.login}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-dark-400 group-hover:text-accent-500 transition-colors" />
        </div>

        {/* Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Level</span>
            <span className="text-lg font-bold text-accent-500">
              {formatLevel(student.level)}
            </span>
          </div>
          <div className="w-full bg-dark-200 rounded-full h-2">
            <div 
              className="bg-accent-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(student.level % 1) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-dark-400" />
            <span className="text-sm text-dark-500">{student.promoYear}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-dark-400" />
            <span className="text-sm text-dark-500">{student.campus}</span>
          </div>
        </div>

        {/* Wallet and Eval Points */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-accent-500" />
            <div>
              <p className="text-xs text-dark-500">Wallet</p>
              <p className="text-sm font-semibold text-white">
                {student.wallet}₳
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-accent-500" />
            <div>
              <p className="text-xs text-dark-500">Eval Points</p>
              <p className="text-sm font-semibold text-white">
                {student.evaluationPoints}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
