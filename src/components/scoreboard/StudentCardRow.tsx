import { ExternalLink, Coins, Star, Calendar, MapPin, Medal, Trophy, Crown } from 'lucide-react';
import { Student } from '@/types';

interface StudentCardRowProps {
  student: Student;
  rank: number;
}

/**
 * Student card component in row format with ranking
 */
export function StudentCardRow({ student, rank }: StudentCardRowProps) {
  const handleCardClick = () => {
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

  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-accent-500">#{rank}</span>;
    }
  };

  const getRankStyle = () => {
    if (rank <= 3) {
      return 'bg-gradient-to-r from-accent-500/20 to-accent-600/20 border-accent-500/50 accent-glow';
    }
    return 'border-dark-200';
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`card transition-all duration-300 cursor-pointer hover:border-accent-500/50 group ${getRankStyle()}`}
    >
      <div className="p-4 md:p-6">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="flex items-center space-x-4 mb-4">
            {/* Rank */}
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex-shrink-0">
              {getRankIcon()}
            </div>
            
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-3 flex-1">
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
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-dark-500">
                  @{student.login}
                </p>
              </div>
            </div>
          </div>

          {/* Level Progress - Mobile */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-white mb-1">Level</span>
              <span className="text-xl font-bold text-accent-500">
                {formatLevel(student.level)}
              </span>
              <div className="w-16 bg-white/10 backdrop-blur-sm rounded-full h-2 border border-white/20 mt-1">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(student.level % 1) * 100}%` }}
                />
              </div>
            </div>
            
            {/* External Link - Mobile */}
            <div>
              <ExternalLink className="w-5 h-5 text-dark-400 group-hover:text-accent-500 transition-colors" />
            </div>
          </div>

          {/* Stats Grid - Mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-dark-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-dark-500">Promo</p>
                <p className="text-sm font-semibold text-white">{student.promoYear}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-dark-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-dark-500">Campus</p>
                <p className="text-sm font-semibold text-white truncate">{student.campus}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-accent-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-dark-500">Wallet</p>
                <p className="text-sm font-semibold text-white">{student.wallet}₳</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-accent-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-dark-500">Eval Points</p>
                <p className="text-sm font-semibold text-white">{student.evaluationPoints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Rank */}
          <div className="flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            {getRankIcon()}
          </div>

          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4 flex-1 ml-6">
            <div className="relative">
              <img
                src={student.avatar}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-16 h-16 rounded-full border-2 border-dark-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=E6C642&color=000`;
                }}
              />
              <div 
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-100 ${getStatusColor(student.status.isOnline)}`}
                title={student.status.isOnline ? 'Online' : 'Offline'}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-dark-500">
                @{student.login}
              </p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="flex flex-col items-center space-y-2 min-w-[120px]">
            <span className="text-sm font-medium text-white">Level</span>
            <span className="text-2xl font-bold text-accent-500">
              {formatLevel(student.level)}
            </span>
            <div className="w-20 bg-white/10 backdrop-blur-sm rounded-full h-2 border border-white/20">
              <div 
                className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(student.level % 1) * 100}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 min-w-[280px] ml-8">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-dark-400" />
              <div>
                <p className="text-xs text-dark-500">Promo</p>
                <p className="text-sm font-semibold text-white">{student.promoYear}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-dark-400" />
              <div>
                <p className="text-xs text-dark-500">Campus</p>
                <p className="text-sm font-semibold text-white">{student.campus}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Coins className="w-5 h-5 text-accent-500" />
              <div>
                <p className="text-xs text-dark-500">Wallet</p>
                <p className="text-sm font-semibold text-white">{student.wallet}₳</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-accent-500" />
              <div>
                <p className="text-xs text-dark-500">Eval Points</p>
                <p className="text-sm font-semibold text-white">{student.evaluationPoints}</p>
              </div>
            </div>
          </div>

          {/* External Link */}
          <div className="ml-6">
            <ExternalLink className="w-5 h-5 text-dark-400 group-hover:text-accent-500 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
