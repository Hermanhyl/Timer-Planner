import { useState } from 'react';
import { usePlanner } from '../../hooks';
import { WeekView } from './WeekView';
import { CategoryManager } from './CategoryManager';

export function Planner() {
  const planner = usePlanner();
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Weekly Planner</h2>
        <button
          onClick={() => setShowCategories(!showCategories)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            showCategories
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </button>
      </div>

      {showCategories && (
        <div className="max-w-md">
          <CategoryManager
            categories={planner.categories}
            onAdd={planner.addCategory}
            onUpdate={planner.updateCategory}
            onDelete={planner.deleteCategory}
          />
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <WeekView
          activities={planner.activities}
          categories={planner.categories}
          onAddActivity={planner.addActivity}
          onUpdateActivity={planner.updateActivity}
          onDeleteActivity={planner.deleteActivity}
          onMoveActivity={planner.moveActivity}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {planner.categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-sm text-gray-400">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { WeekView } from './WeekView';
export { TimeSlot } from './TimeSlot';
export { ActivityBlock } from './ActivityBlock';
export { CategoryManager } from './CategoryManager';
