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
    <div className="flex items-center gap-3">
      {!isRunning ? (
        <button
          onClick={onPlay}
          disabled={!hasTemplate}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          title="Play"
        >
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
          title="Pause"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
      )}

      <button
        onClick={onReset}
        disabled={!hasTemplate}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
        title="Reset"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      <button
        onClick={onSkip}
        disabled={!hasTemplate}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
        title="Skip to next interval"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  );
}
