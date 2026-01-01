import { useState } from 'react';
import type { SessionTemplate, TimerInterval } from '../../types';

interface SessionBuilderProps {
  templates: SessionTemplate[];
  onSave: (template: SessionTemplate) => void;
  onDelete: (id: string) => void;
  onLoad: (template: SessionTemplate) => void;
  currentTemplateId?: string;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export function SessionBuilder({
  templates,
  onSave,
  onDelete,
  onLoad,
  currentTemplateId,
}: SessionBuilderProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [intervals, setIntervals] = useState<TimerInterval[]>([]);
  const [newInterval, setNewInterval] = useState({
    name: '',
    hours: 0,
    minutes: 25,
    seconds: 0,
    type: 'work' as 'work' | 'break',
  });

  // Validation states - track if user has attempted to submit/add
  const [templateNameTouched, setTemplateNameTouched] = useState(false);
  const [intervalNameTouched, setIntervalNameTouched] = useState(false);
  const [addAttempted, setAddAttempted] = useState(false);
  const [saveAttempted, setSaveAttempted] = useState(false);

  // Validation checks
  const isTemplateNameValid = templateName.trim().length > 0;
  const isIntervalNameValid = newInterval.name.trim().length > 0;
  const intervalDuration = newInterval.hours * 3600 + newInterval.minutes * 60 + newInterval.seconds;
  const isDurationValid = intervalDuration > 0;
  const hasIntervals = intervals.length > 0;

  const addInterval = () => {
    setAddAttempted(true);
    setIntervalNameTouched(true);

    if (!isIntervalNameValid || !isDurationValid) return;

    setIntervals([
      ...intervals,
      {
        id: generateId(),
        name: newInterval.name.trim(),
        duration: intervalDuration,
        type: newInterval.type,
      },
    ]);
    setNewInterval({ name: '', hours: 0, minutes: 25, seconds: 0, type: 'work' });
    setIntervalNameTouched(false);
    setAddAttempted(false);
  };

  const removeInterval = (id: string) => {
    setIntervals(intervals.filter((i) => i.id !== id));
  };

  const saveTemplate = () => {
    setSaveAttempted(true);
    setTemplateNameTouched(true);

    if (!isTemplateNameValid || !hasIntervals) return;

    const template: SessionTemplate = {
      id: generateId(),
      name: templateName.trim(),
      intervals,
      createdAt: Date.now(),
    };

    onSave(template);
    resetForm();
  };

  const resetForm = () => {
    setIsCreating(false);
    setTemplateName('');
    setIntervals([]);
    setNewInterval({ name: '', hours: 0, minutes: 25, seconds: 0, type: 'work' });
    setTemplateNameTouched(false);
    setIntervalNameTouched(false);
    setAddAttempted(false);
    setSaveAttempted(false);
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.length > 0 ? parts.join(' ') : '0s';
  };

  // Show error states
  const showTemplateNameError = (templateNameTouched || saveAttempted) && !isTemplateNameValid;
  const showIntervalNameError = (intervalNameTouched || addAttempted) && !isIntervalNameValid;
  const showDurationError = addAttempted && !isDurationValid;
  const showNoIntervalsError = saveAttempted && !hasIntervals;

  if (isCreating) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Create Session Template</h3>

        {/* Template Name Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Template Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Pomodoro Session"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            onBlur={() => setTemplateNameTouched(true)}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
              showTemplateNameError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-600 focus:border-blue-500'
            }`}
          />
          {showTemplateNameError && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Template name is required
            </p>
          )}
        </div>

        {/* Interval list */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Intervals <span className="text-red-400">*</span>
            <span className="text-gray-500 font-normal ml-1">({intervals.length} added)</span>
          </label>

          {intervals.length === 0 ? (
            <div className={`text-center py-3 rounded-lg border border-dashed ${
              showNoIntervalsError ? 'border-red-500 bg-red-500/10' : 'border-gray-600'
            }`}>
              <p className={`text-sm ${showNoIntervalsError ? 'text-red-400' : 'text-gray-500'}`}>
                {showNoIntervalsError
                  ? 'Add at least one interval to save the template'
                  : 'No intervals yet. Add one below.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {intervals.map((interval, index) => (
                <div
                  key={interval.id}
                  className={`flex items-center justify-between px-3 py-2 rounded ${
                    interval.type === 'break' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}
                >
                  <span className="text-white text-sm">
                    {index + 1}. {interval.name} ({formatDuration(interval.duration)})
                  </span>
                  <button
                    onClick={() => removeInterval(interval.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="Remove interval"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add interval form */}
        <div className="border border-gray-600 rounded-lg p-3 mb-4 bg-gray-750">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Add New Interval</p>

          {/* Interval Name */}
          <div className="mb-2">
            <label className="block text-xs text-gray-400 mb-1">
              Interval Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Focus Time, Short Break"
              value={newInterval.name}
              onChange={(e) => setNewInterval({ ...newInterval, name: e.target.value })}
              onBlur={() => setIntervalNameTouched(true)}
              className={`w-full px-2 py-1.5 bg-gray-700 border rounded text-white text-sm placeholder-gray-500 focus:outline-none transition-colors ${
                showIntervalNameError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-blue-500'
              }`}
            />
            {showIntervalNameError && (
              <p className="text-red-400 text-xs mt-1">Interval name is required</p>
            )}
          </div>

          {/* Duration */}
          <div className="mb-2">
            <label className="block text-xs text-gray-400 mb-1">
              Duration <span className="text-red-400">*</span>
              {showDurationError && (
                <span className="text-red-400 ml-2">- Must be greater than 0</span>
              )}
            </label>
            <div className={`grid grid-cols-3 gap-2 p-2 rounded ${
              showDurationError ? 'bg-red-500/10 border border-red-500' : ''
            }`}>
              <div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={newInterval.hours}
                    onChange={(e) => setNewInterval({ ...newInterval, hours: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 text-xs whitespace-nowrap">hr</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={newInterval.minutes}
                    onChange={(e) => setNewInterval({ ...newInterval, minutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 text-xs whitespace-nowrap">min</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={newInterval.seconds}
                    onChange={(e) => setNewInterval({ ...newInterval, seconds: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 text-xs whitespace-nowrap">sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Type selector and Add button */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={newInterval.type}
                onChange={(e) => setNewInterval({ ...newInterval, type: e.target.value as 'work' | 'break' })}
                className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="work">Work</option>
                <option value="break">Break</option>
              </select>
            </div>
            <button
              onClick={addInterval}
              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors mt-5 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={resetForm}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveTemplate}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isTemplateNameValid && hasIntervals
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Template
          </button>
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-500 mt-3 text-center">
          <span className="text-red-400">*</span> indicates required fields
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Session Templates</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-gray-600 rounded-lg">
          <svg className="w-10 h-10 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-400 text-sm">No templates yet</p>
          <p className="text-gray-500 text-xs mt-1">Click "New" to create your first session template</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                currentTemplateId === template.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{template.name}</h4>
                <p className="text-gray-400 text-xs">
                  {template.intervals.length} interval{template.intervals.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => onLoad(template)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    currentTemplateId === template.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
                >
                  {currentTemplateId === template.id ? 'Loaded' : 'Load'}
                </button>
                <button
                  onClick={() => onDelete(template.id)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete template"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
