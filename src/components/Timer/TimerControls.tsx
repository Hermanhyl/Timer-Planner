interface TimerControlsProps {
  isRunning: boolean;
  hasTemplate: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({
  isRunning,
  hasTemplate,
  onPlay,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Reset button */}
      <button
        onClick={onReset}
        disabled={!hasTemplate}
        className="group flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 border border-gray-600 disabled:border-gray-700"
        title="Reset timer"
      >
        <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-disabled:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Play/Pause button - larger and more prominent */}
      {!isRunning ? (
        <button
          onClick={onPlay}
          disabled={!hasTemplate}
          className="group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25"
          title="Start timer"
        >
          <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={onPause}
          className="group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-amber-500/25"
          title="Pause timer"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
      )}

      {/* Skip button */}
      <button
        onClick={onSkip}
        disabled={!hasTemplate}
        className="group flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 border border-gray-600 disabled:border-gray-700"
        title="Skip to next interval"
      >
        <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-disabled:text-gray-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  );
}
