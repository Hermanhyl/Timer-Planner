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

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <h2 className="text-2xl font-bold text-white">Focus Timer</h2>

      <TimerDisplay
        formattedTime={timer.formattedTime}
        progress={timer.progress}
        currentInterval={timer.currentInterval}
        isRunning={timer.state.isRunning}
      />

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
        <div className="flex items-center gap-2">
          {timer.state.template.intervals.map((interval, index) => (
            <div
              key={interval.id}
              className={`w-3 h-3 rounded-full transition-colors ${
                index < timer.state.currentIntervalIndex
                  ? 'bg-green-500'
                  : index === timer.state.currentIntervalIndex
                  ? interval.type === 'break'
                    ? 'bg-green-400 ring-2 ring-green-400/50'
                    : 'bg-blue-400 ring-2 ring-blue-400/50'
                  : 'bg-gray-600'
              }`}
              title={`${interval.name} (${Math.floor(interval.duration / 60)}m)`}
            />
          ))}
        </div>
      )}

      <SessionBuilder
        templates={templates}
        onSave={handleSaveTemplate}
        onDelete={handleDeleteTemplate}
        onLoad={handleLoadTemplate}
        currentTemplateId={timer.state.template?.id}
      />
    </div>
  );
}

export { TimerDisplay } from './TimerDisplay';
export { TimerControls } from './TimerControls';
export { SessionBuilder } from './SessionBuilder';
