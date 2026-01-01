import { useState, useEffect, useCallback, useRef } from 'react';
import type { SessionTemplate, TimerState } from '../types';

const AUDIO_NOTIFICATION_FREQUENCY = 440; // Hz
const AUDIO_NOTIFICATION_DURATION = 200; // ms

function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = AUDIO_NOTIFICATION_FREQUENCY;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + AUDIO_NOTIFICATION_DURATION / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + AUDIO_NOTIFICATION_DURATION / 1000);

    // Play a second beep after a short delay
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 520;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + AUDIO_NOTIFICATION_DURATION / 1000);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + AUDIO_NOTIFICATION_DURATION / 1000);
    }, 250);
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
}

export interface UseTimerReturn {
  state: TimerState;
  loadTemplate: (template: SessionTemplate) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  skipInterval: () => void;
  currentInterval: SessionTemplate['intervals'][0] | null;
  progress: number;
  formattedTime: string;
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    currentIntervalIndex: 0,
    remainingSeconds: 0,
    template: null,
  });

  const intervalRef = useRef<number | null>(null);

  const currentInterval = state.template?.intervals[state.currentIntervalIndex] ?? null;

  const progress = currentInterval
    ? ((currentInterval.duration - state.remainingSeconds) / currentInterval.duration) * 100
    : 0;

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedTime = formatTime(state.remainingSeconds);

  const loadTemplate = useCallback((template: SessionTemplate) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState({
      isRunning: false,
      currentIntervalIndex: 0,
      remainingSeconds: template.intervals[0]?.duration ?? 0,
      template,
    });
  }, []);

  const advanceToNextInterval = useCallback(() => {
    setState((prev) => {
      if (!prev.template) return prev;

      const nextIndex = prev.currentIntervalIndex + 1;

      if (nextIndex >= prev.template.intervals.length) {
        // Session complete
        playNotificationSound();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return {
          ...prev,
          isRunning: false,
          currentIntervalIndex: 0,
          remainingSeconds: prev.template.intervals[0]?.duration ?? 0,
        };
      }

      // Move to next interval
      playNotificationSound();
      return {
        ...prev,
        currentIntervalIndex: nextIndex,
        remainingSeconds: prev.template.intervals[nextIndex].duration,
      };
    });
  }, []);

  const play = useCallback(() => {
    if (!state.template || state.template.intervals.length === 0) return;
    setState((prev) => ({ ...prev, isRunning: true }));
  }, [state.template]);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isRunning: false,
      currentIntervalIndex: 0,
      remainingSeconds: prev.template?.intervals[0]?.duration ?? 0,
    }));
  }, []);

  const skipInterval = useCallback(() => {
    advanceToNextInterval();
  }, [advanceToNextInterval]);

  // Timer tick effect
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.remainingSeconds <= 1) {
            return { ...prev, remainingSeconds: 0 };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning]);

  // Check for interval completion
  useEffect(() => {
    if (state.isRunning && state.remainingSeconds === 0 && state.template) {
      advanceToNextInterval();
    }
  }, [state.remainingSeconds, state.isRunning, state.template, advanceToNextInterval]);

  return {
    state,
    loadTemplate,
    play,
    pause,
    reset,
    skipInterval,
    currentInterval,
    progress,
    formattedTime,
  };
}
