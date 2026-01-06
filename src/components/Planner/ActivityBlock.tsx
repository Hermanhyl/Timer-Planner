import { useDraggable } from '@dnd-kit/core';
import type { Activity, Category } from '../../types';

interface ActivityBlockProps {
  activity: Activity;
  category: Category | undefined;
  isStart: boolean;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export function ActivityBlock({
  activity,
  category,
  isStart,
  onEdit,
  onDelete,
}: ActivityBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: activity.id,
    data: activity,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  // Only render at the start position
  if (!isStart) {
    return (
      <div
        className="absolute inset-0 opacity-50"
        style={{ backgroundColor: category?.color ?? '#6B7280' }}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: category?.color ?? '#6B7280',
        height: `${activity.duration * 100}%`,
      }}
      className={`absolute inset-x-0 top-0 rounded-md p-1 overflow-hidden group ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Drag handle - only this area is draggable */}
        <span
          className="text-xs font-medium text-white truncate flex-1 cursor-move"
          {...listeners}
          {...attributes}
        >
          {activity.title}
        </span>
        {/* Action buttons - not part of drag handle */}
        <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onEdit(activity);
            }}
            className="p-1 text-white/70 hover:text-white hover:bg-white/20 rounded transition-colors"
            title="Edit activity"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(activity.id);
            }}
            className="p-1 text-white/70 hover:text-red-300 hover:bg-white/20 rounded transition-colors"
            title="Delete activity"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      {activity.duration > 1 && (
        <span
          className="text-xs text-white/70 cursor-move"
          {...listeners}
          {...attributes}
        >
          {activity.duration}h
        </span>
      )}
    </div>
  );
}
