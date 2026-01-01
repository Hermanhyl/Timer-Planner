import { useDroppable } from '@dnd-kit/core';
import type { Activity, Category } from '../../types';
import { ActivityBlock } from './ActivityBlock';

interface TimeSlotProps {
  dayIndex: number;
  hour: number;
  activities: Activity[];
  categories: Category[];
  onAddActivity: (dayIndex: number, hour: number) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
}

export function TimeSlot({
  dayIndex,
  hour,
  activities,
  categories,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}: TimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayIndex}-${hour}`,
    data: { dayIndex, hour },
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
      onClick={() => !startingActivity && !coveringActivity && onAddActivity(dayIndex, hour)}
      className={`relative h-10 border-b border-r border-gray-700 transition-colors ${
        isOver ? 'bg-blue-500/20' : 'hover:bg-gray-700/50'
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
          className="absolute inset-0"
          style={{ backgroundColor: getCategoryById(coveringActivity.categoryId)?.color ?? '#6B7280' }}
        />
      )}
    </div>
  );
}
