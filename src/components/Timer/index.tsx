import { useTimer, useLocalStorage } from '../../hooks';
import type { SessionTemplate } from '../../types';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { SessionBuilder } from './SessionBuilder';

export function Timer() {
  const [templates, setTemplates] = useLocalStorage<SessionTemplate[]>('timer-templates', []);
  const timer = useTimer();

  const handleSaveTemplate = (template: SessionTemplate) => {
    setTemplates((prev) => [...prev, template]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoadTemplate = (template: SessionTemplate) => {
    timer.loadTemplate(template);
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    if (mins > 0) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${secs}s`;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Header with template name */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Focus Timer</h2>
        {timer.state.template && (
          <p className="text-sm text-gray-400 mt-1">
            {timer.state.template.name}
          </p>
        )}
      </div>

      {/* Timer Display */}
      <TimerDisplay
        formattedTime={timer.formattedTime}
        progress={timer.progress}
        currentInterval={timer.currentInterval}
        isRunning={timer.state.isRunning}
      />

      {/* Session Progress Bar */}
      {timer.state.template && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Session Progress</span>
            <span>{formatDuration(timer.elapsedSessionTime)} / {formatDuration(timer.totalSessionTime)}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${timer.sessionProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <TimerControls
        isRunning={timer.state.isRunning}
        hasTemplate={timer.state.template !== null}
        onPlay={timer.play}
        onPause={timer.pause}
        onReset={timer.reset}
        onSkip={timer.skipInterval}
      />

      {/* Interval progress indicator */}
      {timer.state.template && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {timer.state.template.intervals.map((interval, index) => (
              <div
                key={interval.id}
                className={`relative group cursor-default transition-transform ${
                  index === timer.state.currentIntervalIndex ? 'scale-125' : ''
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    index < timer.state.currentIntervalIndex
                      ? 'bg-green-500'
                      : index === timer.state.currentIntervalIndex
                      ? interval.type === 'break'
                        ? 'bg-green-400 ring-2 ring-green-400/50 animate-pulse'
                        : 'bg-blue-400 ring-2 ring-blue-400/50 animate-pulse'
                      : 'bg-gray-600'
                  }`}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-gray-600">
                  {interval.name}
                  <span className="text-gray-400 ml-1">({formatDuration(interval.duration)})</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Interval {timer.state.currentIntervalIndex + 1} of {timer.state.template.intervals.length}
          </p>
        </div>
      )}

      {/* Session Builder */}
      <div className="w-full max-w-md mt-2">
        <SessionBuilder
          templates={templates}
          onSave={handleSaveTemplate}
          onDelete={handleDeleteTemplate}
          onLoad={handleLoadTemplate}
          currentTemplateId={timer.state.template?.id}
        />
      </div>
    </div>
  );
}

export { TimerDisplay } from './TimerDisplay';
export { TimerControls } from './TimerControls';
export { SessionBuilder } from './SessionBuilder';
