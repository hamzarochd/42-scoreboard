import { Student, Pooler } from '@/types';
import { StudentCard } from './StudentCard';
import { PoolerCard } from './PoolerCard';

interface ScoreboardGridProps {
  students?: Student[];
  poolers?: Pooler[];
  type: 'students' | 'poolers';
}

/**
 * Grid layout for displaying student or pooler cards
 */
export function ScoreboardGrid({ students, poolers, type }: ScoreboardGridProps) {
  if (type === 'students' && students) {
    if (students.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No students found matching your criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    );
  }

  if (type === 'poolers' && poolers) {
    if (poolers.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No poolers found matching your criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {poolers.map((pooler) => (
          <PoolerCard key={pooler.id} pooler={pooler} />
        ))}
      </div>
    );
  }

  return null;
}
