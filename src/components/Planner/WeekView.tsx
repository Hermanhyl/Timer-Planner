import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, pointerWithin } from '@dnd-kit/core';
import type { Activity, Category } from '../../types';
import { DAYS_OF_WEEK, HOURS } from '../../types';
import { TimeSlot } from './TimeSlot';
import { ActivityModal } from './ActivityModal';

interface WeekViewProps {
  activities: Activity[];
  categories: Category[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (id: string, updates: Partial<Omit<Activity, 'id'>>) => void;
  onDeleteActivity: (id: string) => void;
  onMoveActivity: (id: string, dayIndex: number, startHour: number) => void;
}

export function WeekView({
  activities,
  categories,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onMoveActivity,
}: WeekViewProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialData?: Partial<Activity>;
  }>({ isOpen: false, mode: 'create' });

  const [draggingActivity, setDraggingActivity] = useState<Activity | null>(null);

  const formatHour = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  const getActivitiesForSlot = (dayIndex: number, hour: number): Activity[] => {
    return activities.filter(
      (a) =>
        a.dayIndex === dayIndex &&
        hour >= a.startHour &&
        hour < a.startHour + a.duration
    );
  };

  const handleAddActivity = (dayIndex: number, hour: number) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      initialData: { dayIndex, startHour: hour },
    });
  };

  const handleEditActivity = (activity: Activity) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      initialData: activity,
    });
  };

  const handleSaveActivity = (data: Omit<Activity, 'id'> | Activity) => {
    if ('id' in data) {
      const { id, ...updates } = data;
      onUpdateActivity(id, updates);
    } else {
      onAddActivity(data);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activity = event.active.data.current as Activity | undefined;
    if (activity) {
      setDraggingActivity(activity);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingActivity(null);

    const { active, over } = event;
    if (!over) return;

    const activityId = active.id as string;
    const dropData = over.data.current as { dayIndex: number; hour: number } | undefined;

    if (dropData) {
      onMoveActivity(activityId, dropData.dayIndex, dropData.hour);
    }
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 border-b border-gray-700">
            <div className="p-2 text-center text-gray-500 text-sm">Time</div>
            {DAYS_OF_WEEK.map((day, index) => (
              <div
                key={day}
                className="p-2 text-center text-white font-medium text-sm border-l border-gray-700"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
                {index === new Date().getDay() && (
                  <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                )}
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-8">
            {/* Time column */}
            <div>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-10 flex items-center justify-center text-xs text-gray-500 border-b border-gray-700"
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS_OF_WEEK.map((_, dayIndex) => (
              <div key={dayIndex} className="border-l border-gray-700">
                {HOURS.map((hour) => (
                  <TimeSlot
                    key={`${dayIndex}-${hour}`}
                    dayIndex={dayIndex}
                    hour={hour}
                    activities={getActivitiesForSlot(dayIndex, hour)}
                    categories={categories}
                    onAddActivity={handleAddActivity}
                    onEditActivity={handleEditActivity}
                    onDeleteActivity={onDeleteActivity}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {draggingActivity && (
          <div
            className="px-2 py-1 rounded-md text-white text-xs font-medium shadow-lg"
            style={{
              backgroundColor:
                categories.find((c) => c.id === draggingActivity.categoryId)?.color ??
                '#6B7280',
              minWidth: '80px',
            }}
          >
            {draggingActivity.title}
          </div>
        )}
      </DragOverlay>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create' })}
        onSave={handleSaveActivity}
        categories={categories}
        initialData={modalState.initialData}
        mode={modalState.mode}
      />
    </DndContext>
  );
}
