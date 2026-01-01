import { useState, useEffect } from 'react';
import type { Activity, Category } from '../../types';
import { HOURS } from '../../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id'> | Activity) => void;
  categories: Category[];
  initialData?: Partial<Activity>;
  mode: 'create' | 'edit';
}

export function ActivityModal({
  isOpen,
  onClose,
  onSave,
  categories,
  initialData,
  mode,
}: ActivityModalProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startHour, setStartHour] = useState(9);
  const [duration, setDuration] = useState(1);

  // Validation states
  const [titleTouched, setTitleTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Validation checks
  const isTitleValid = title.trim().length > 0;
  const isCategoryValid = categoryId.length > 0;

  // Show error states
  const showTitleError = (titleTouched || submitAttempted) && !isTitleValid;
  const showCategoryError = submitAttempted && !isCategoryValid;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '');
      setCategoryId(initialData.categoryId ?? categories[0]?.id ?? '');
      setStartHour(initialData.startHour ?? 9);
      setDuration(initialData.duration ?? 1);
    } else {
      setTitle('');
      setCategoryId(categories[0]?.id ?? '');
      setDuration(1);
    }
    // Reset validation states when modal opens/changes
    setTitleTouched(false);
    setSubmitAttempted(false);
  }, [initialData, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTitleTouched(true);

    if (!isTitleValid || !isCategoryValid) return;

    const activityData = {
      title: title.trim(),
      categoryId,
      dayIndex: initialData?.dayIndex ?? 0,
      startHour,
      duration,
    };

    if (mode === 'edit' && initialData?.id) {
      onSave({ ...activityData, id: initialData.id });
    } else {
      onSave(activityData);
    }

    onClose();
  };

  const handleClose = () => {
    setTitleTouched(false);
    setSubmitAttempted(false);
    onClose();
  };

  if (!isOpen) return null;

  const formatHour = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  // Get selected category color for preview
  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-white mb-4">
          {mode === 'create' ? 'Add Activity' : 'Edit Activity'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTitleTouched(true)}
              placeholder="e.g., Team Meeting, Gym Session"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                showTitleError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-blue-500'
              }`}
              autoFocus
            />
            {showTitleError && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Activity title is required
              </p>
            )}
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            {categories.length === 0 ? (
              <div className="px-3 py-2 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                No categories available. Please add a category first.
              </div>
            ) : (
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors appearance-none ${
                    showCategoryError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-600 focus:border-blue-500'
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {/* Category color indicator */}
                {selectedCategory && (
                  <div
                    className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                )}
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>

          {/* Time Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Time</label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {formatHour(hour)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
                  <option key={d} value={d}>
                    {d} hour{d > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          {selectedCategory && title.trim() && (
            <div className="pt-2">
              <label className="block text-xs text-gray-500 mb-1">Preview</label>
              <div
                className="px-3 py-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: selectedCategory.color }}
              >
                {title.trim()} ({formatHour(startHour)} - {formatHour(startHour + duration)})
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isTitleValid && isCategoryValid
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {mode === 'create' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </>
              )}
            </button>
          </div>

          {/* Help text */}
          <p className="text-xs text-gray-500 text-center">
            <span className="text-red-400">*</span> indicates required fields
          </p>
        </form>
      </div>
    </div>
  );
}
