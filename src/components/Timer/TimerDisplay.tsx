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

  const strokeColor = currentInterval?.type === 'break' ? '#10B981' : '#3B82F6';
  const glowColor = currentInterval?.type === 'break' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer glow effect when running */}
        {isRunning && (
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              boxShadow: `0 0 40px 10px ${glowColor}`,
              opacity: 0.5,
            }}
          />
        )}

        <svg width="280" height="280" className="-rotate-90">
          {/* Background circle with subtle gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={strokeColor} />
              <stop offset="100%" stopColor={currentInterval?.type === 'break' ? '#34D399' : '#60A5FA'} />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="url(#bgGradient)"
            strokeWidth="10"
            fill="none"
          />

          {/* Progress circle with smooth transition */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-200 ease-out"
            style={{
              filter: isRunning ? `drop-shadow(0 0 6px ${strokeColor})` : 'none',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Time display with better typography */}
          <span
            className={`font-mono font-bold tracking-tight ${
              hasHours ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
            } ${isRunning ? 'text-white' : 'text-gray-300'}`}
            style={{
              textShadow: isRunning ? '0 0 20px rgba(255,255,255,0.3)' : 'none',
            }}
          >
            {formattedTime}
          </span>

          {/* Current interval label */}
          {currentInterval && (
            <span
              className={`text-sm mt-2 px-4 py-1.5 rounded-full max-w-[200px] truncate font-medium transition-all ${
                currentInterval.type === 'break'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {currentInterval.name}
            </span>
          )}

          {/* Status indicator */}
          <div className="mt-2 flex items-center gap-2">
            {isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">Running</span>
              </>
            ) : currentInterval ? (
              <>
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-xs text-gray-400">Paused</span>
              </>
            ) : (
              <span className="text-xs text-gray-500">Load a template to start</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
