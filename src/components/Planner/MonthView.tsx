import { useState, useMemo } from 'react';
import type { Activity, Category } from '../../types';
import { DAYS_OF_WEEK } from '../../types';
import { formatDateString } from '../../hooks';
import { ActivityModal } from './ActivityModal';

interface MonthViewProps {
  categories: Category[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (id: string, updates: Partial<Omit<Activity, 'id'>>) => void;
  onDeleteActivity: (id: string) => void;
  getActivitiesForDate: (date: string) => Activity[];
}

export function MonthView({
  categories,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  getActivitiesForDate,
}: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialData?: Partial<Activity>;
    selectedDate?: Date;
  }>({ isOpen: false, mode: 'create' });

  // Get calendar data for the current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from the Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    // End on the Saturday of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      currentWeek.push(new Date(current));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      current.setDate(current.getDate() + 1);
    }

    return { weeks, month, year };
  }, [currentDate]);

  const getActivitiesForCalendarDate = (date: Date): Activity[] => {
    const dateString = formatDateString(date);
    return getActivitiesForDate(dateString);
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    const dateString = formatDateString(date);
    setModalState({
      isOpen: true,
      mode: 'create',
      initialData: { date: dateString, startHour: 9, recurring: 'none' },
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

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  const today = new Date();
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isCurrentMonth = (date: Date) => date.getMonth() === calendarData.month;

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-white ml-2">{monthName}</h2>
        </div>

        <button
          onClick={handleToday}
          className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center text-xs text-gray-500 uppercase tracking-wider py-2">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Calendar weeks */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.weeks.flat().map((date, index) => {
            const dayActivities = getActivitiesForCalendarDate(date);
            const isCurrentDay = isToday(date);
            const inCurrentMonth = isCurrentMonth(date);

            return (
              <div
                key={index}
                onClick={() => handleDayClick(date)}
                className={`min-h-[100px] p-2 rounded-lg border cursor-pointer transition-colors ${
                  isCurrentDay
                    ? 'border-blue-500 bg-blue-500/10'
                    : inCurrentMonth
                    ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                    : 'border-gray-800 bg-gray-900/50 hover:bg-gray-900'
                }`}
              >
                {/* Date number */}
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay
                    ? 'text-blue-400'
                    : inCurrentMonth
                    ? 'text-white'
                    : 'text-gray-600'
                }`}>
                  {date.getDate()}
                </div>

                {/* Activities for this day */}
                <div className="space-y-1">
                  {dayActivities.slice(0, 3).map((activity) => {
                    const category = getCategoryById(activity.categoryId);
                    return (
                      <div
                        key={activity.id}
                        className="group flex items-center gap-0.5"
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditActivity(activity);
                          }}
                          className="flex-1 text-xs px-1.5 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: category?.color ?? '#6B7280' }}
                          title={`${activity.title} (${activity.startHour}:00) - Click to edit`}
                        >
                          {activity.title}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteActivity(activity.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                  {dayActivities.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayActivities.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create' })}
        onSave={handleSaveActivity}
        categories={categories}
        initialData={modalState.initialData}
        mode={modalState.mode}
      />
    </div>
  );
}
