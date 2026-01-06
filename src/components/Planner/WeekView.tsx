import { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, pointerWithin } from '@dnd-kit/core';
import type { Activity, Category } from '../../types';
import { DAYS_OF_WEEK } from '../../types';
import { formatDateString } from '../../hooks';
import { TimeSlot } from './TimeSlot';
import { ActivityModal } from './ActivityModal';

// Working hours (6 AM to 11 PM) - more practical range
const DISPLAY_HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

interface WeekViewProps {
  categories: Category[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (id: string, updates: Partial<Omit<Activity, 'id'>>) => void;
  onDeleteActivity: (id: string) => void;
  onMoveActivity: (id: string, date: string, startHour: number) => void;
  getActivitiesForDateAndHour: (date: string, hour: number) => Activity[];
}

export function WeekView({
  categories,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onMoveActivity,
  getActivitiesForDateAndHour,
}: WeekViewProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialData?: Partial<Activity>;
    selectedDate?: string;
  }>({ isOpen: false, mode: 'create' });

  const [draggingActivity, setDraggingActivity] = useState<Activity | null>(null);

  // Get current week dates
  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);

    return DAYS_OF_WEEK.map((_, index) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + index);
      return date;
    });
  }, []);

  const formatShortHour = (hour: number): string => {
    const period = hour >= 12 ? 'p' : 'a';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  const handleAddActivity = (date: string, hour: number) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      initialData: { date, startHour: hour, recurring: 'none' },
      selectedDate: date,
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
    const dropData = over.data.current as { date: string; hour: number } | undefined;

    if (dropData) {
      onMoveActivity(activityId, dropData.date, dropData.hour);
    }
  };

  const today = new Date();
  const todayIndex = today.getDay();

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header - Sticky */}
          <div className="sticky top-0 z-10 bg-gray-800 border-b border-gray-600">
            <div className="grid grid-cols-[auto_repeat(7,1fr)]">
              {/* Time column header */}
              <div className="p-2 flex items-center justify-center w-12">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Time</span>
              </div>

              {/* Day headers with dates */}
              {DAYS_OF_WEEK.map((day, index) => {
                const date = weekDates[index];
                const isToday = index === todayIndex;

                return (
                  <div
                    key={day}
                    className={`p-2 text-center border-l border-gray-700 ${
                      isToday ? 'bg-blue-500/10' : ''
                    }`}
                  >
                    <div className={`text-xs uppercase tracking-wider ${
                      isToday ? 'text-blue-400' : 'text-gray-500'
                    }`}>
                      <span className="hidden sm:inline">{day.slice(0, 3)}</span>
                      <span className="sm:hidden">{day.slice(0, 1)}</span>
                    </div>
                    <div className={`text-lg font-semibold ${
                      isToday ? 'text-blue-400' : 'text-white'
                    }`}>
                      {date.getDate()}
                    </div>
                    {isToday && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-[auto_repeat(7,1fr)]">
            {/* Time column */}
            <div className="bg-gray-800/50 w-12">
              {DISPLAY_HOURS.map((hour, index) => (
                <div
                  key={hour}
                  className={`h-12 flex items-start justify-end pr-2 pt-0.5 text-xs text-gray-500 ${
                    index !== 0 ? 'border-t border-gray-700/50' : ''
                  }`}
                >
                  {formatShortHour(hour)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDates.map((date, dayIndex) => {
              const isToday = dayIndex === todayIndex;
              const dateString = formatDateString(date);

              return (
                <div
                  key={dateString}
                  className={`border-l border-gray-700 ${
                    isToday ? 'bg-blue-500/5' : ''
                  }`}
                >
                  {DISPLAY_HOURS.map((hour, index) => (
                    <div
                      key={`${dateString}-${hour}`}
                      className={index !== 0 ? 'border-t border-gray-700/50' : ''}
                    >
                      <TimeSlot
                        date={dateString}
                        hour={hour}
                        activities={getActivitiesForDateAndHour(dateString, hour)}
                        categories={categories}
                        onAddActivity={handleAddActivity}
                        onEditActivity={handleEditActivity}
                        onDeleteActivity={onDeleteActivity}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {draggingActivity && (
          <div
            className="px-3 py-1.5 rounded-md text-white text-xs font-medium shadow-xl border border-white/20"
            style={{
              backgroundColor:
                categories.find((c) => c.id === draggingActivity.categoryId)?.color ??
                '#6B7280',
              minWidth: '100px',
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
