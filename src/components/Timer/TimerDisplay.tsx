import type { TimerInterval } from '../../types';

interface TimerDisplayProps {
  formattedTime: string;
  progress: number;
  currentInterval: TimerInterval | null;
  isRunning: boolean;
}

export function TimerDisplay({ formattedTime, progress, currentInterval, isRunning }: TimerDisplayProps) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Check if time includes hours (HH:MM:SS format)
  const hasHours = formattedTime.length > 5;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="280" height="280" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke={currentInterval?.type === 'break' ? '#10B981' : '#3B82F6'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-bold text-white ${
            hasHours ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
          }`}>
            {formattedTime}
          </span>
          {currentInterval && (
            <span className={`text-sm mt-2 px-3 py-1 rounded-full max-w-[200px] truncate ${
              currentInterval.type === 'break'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {currentInterval.name}
            </span>
          )}
          {isRunning && (
            <span className="text-xs text-gray-400 mt-2 animate-pulse">
              Running
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
