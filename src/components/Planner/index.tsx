import { useState } from 'react';
import { usePlanner } from '../../hooks';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { CategoryManager } from './CategoryManager';

type PlannerView = 'week' | 'month';

export function Planner() {
  const planner = usePlanner();
  const [showCategories, setShowCategories] = useState(false);
  const [currentView, setCurrentView] = useState<PlannerView>('week');

  // Count activities
  const activityCount = planner.activities.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('week')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'week'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="hidden sm:inline">Week</span>
                </span>
              </button>
              <button
                onClick={() => setCurrentView('month')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'month'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Month</span>
                </span>
              </button>
            </div>

            {/* Activity count */}
            <p className="text-sm text-gray-400 hidden sm:block">
              {activityCount} {activityCount === 1 ? 'activity' : 'activities'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Category legend - compact */}
            <div className="hidden lg:flex items-center gap-2 mr-2">
              {planner.categories.slice(0, 4).map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-700/50"
                  title={cat.name}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs text-gray-300">{cat.name}</span>
                </div>
              ))}
              {planner.categories.length > 4 && (
                <span className="text-xs text-gray-500">+{planner.categories.length - 4} more</span>
              )}
            </div>

            <button
              onClick={() => setShowCategories(!showCategories)}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                showCategories
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="hidden sm:inline">Categories</span>
            </button>
          </div>
        </div>

        {/* Category Manager - slides down */}
        {showCategories && (
          <div className="mt-4 max-w-md">
            <CategoryManager
              categories={planner.categories}
              onAdd={planner.addCategory}
              onUpdate={planner.updateCategory}
              onDelete={planner.deleteCategory}
            />
          </div>
        )}
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-auto bg-gray-900">
        {currentView === 'week' ? (
          <WeekView
            activities={planner.activities}
            categories={planner.categories}
            onAddActivity={planner.addActivity}
            onUpdateActivity={planner.updateActivity}
            onDeleteActivity={planner.deleteActivity}
            onMoveActivity={planner.moveActivity}
          />
        ) : (
          <MonthView
            activities={planner.activities}
            categories={planner.categories}
            onAddActivity={planner.addActivity}
            onUpdateActivity={planner.updateActivity}
            onDeleteActivity={planner.deleteActivity}
          />
        )}
      </div>

      {/* Mobile category legend */}
      <div className="lg:hidden flex-shrink-0 px-4 py-2 border-t border-gray-700 bg-gray-800/50 overflow-x-auto">
        <div className="flex items-center gap-3">
          {planner.categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-gray-400 whitespace-nowrap">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { WeekView } from './WeekView';
export { MonthView } from './MonthView';
export { TimeSlot } from './TimeSlot';
export { ActivityBlock } from './ActivityBlock';
export { CategoryManager } from './CategoryManager';
