import { StudentCardRow } from './StudentCardRow';
import { PoolerCardRow } from './PoolerCardRow';
import { Student, Pooler } from '@/types';

interface StudentListProps {
  students?: Student[];
  poolers?: Pooler[];
  type: 'students' | 'poolers';
}

/**
 * Component for displaying students/poolers in a ranked list format
 */
export function StudentList({ students, poolers, type }: StudentListProps) {
  if (type === 'students' && students) {
    return (
      <div className="space-y-4">
        {students.map((student, index) => (
          <StudentCardRow 
            key={student.id} 
            student={student} 
            rank={index + 1} 
          />
        ))}
      </div>
    );
  }

  if (type === 'poolers' && poolers) {
    return (
      <div className="space-y-4">
        {poolers.map((pooler, index) => (
          <PoolerCardRow 
            key={pooler.id} 
            pooler={pooler} 
            rank={index + 1} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-dark-500">Nessun dato disponibile.</p>
    </div>
  );
}
