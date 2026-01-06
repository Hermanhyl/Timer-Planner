import { useDroppable } from '@dnd-kit/core';
import type { Activity, Category } from '../../types';
import { ActivityBlock } from './ActivityBlock';

interface TimeSlotProps {
  date: string;
  hour: number;
  activities: Activity[];
  categories: Category[];
  onAddActivity: (date: string, hour: number) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
}

export function TimeSlot({
  date,
  hour,
  activities,
  categories,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}: TimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${date}-${hour}`,
    data: { date, hour },
  });

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  // Find activity that starts at this hour
  const startingActivity = activities.find((a) => a.startHour === hour);
  // Check if this slot is covered by a multi-hour activity
  const coveringActivity = activities.find(
    (a) => hour > a.startHour && hour < a.startHour + a.duration
  );

  return (
    <div
      ref={setNodeRef}
      onClick={() => !startingActivity && !coveringActivity && onAddActivity(date, hour)}
      className={`relative h-12 transition-colors ${
        isOver ? 'bg-blue-500/30 ring-1 ring-inset ring-blue-500' : 'hover:bg-gray-700/30'
      } ${!startingActivity && !coveringActivity ? 'cursor-pointer' : ''}`}
    >
      {startingActivity && (
        <ActivityBlock
          activity={startingActivity}
          category={getCategoryById(startingActivity.categoryId)}
          isStart={true}
          onEdit={onEditActivity}
          onDelete={onDeleteActivity}
        />
      )}
      {coveringActivity && (
        <div
          className="absolute inset-0 opacity-90"
          style={{ backgroundColor: getCategoryById(coveringActivity.categoryId)?.color ?? '#6B7280' }}
        />
      )}
    </div>
  );
}
