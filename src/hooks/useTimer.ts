import { useState, useEffect, useCallback, useRef } from 'react';
import type { SessionTemplate, TimerState } from '../types';

// Audio configuration for attention-grabbing notification
const NOTIFICATION_VOLUME = 0.7; // Louder volume (0.0 - 1.0)

function playNotificationSound(isSessionComplete = false) {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Create a more complex, attention-grabbing sound
    const playTone = (frequency: number, startTime: number, duration: number, type: OscillatorType = 'sine') => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // Envelope: quick attack, sustain, then fade
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(NOTIFICATION_VOLUME, startTime + 0.02);
      gainNode.gain.setValueAtTime(NOTIFICATION_VOLUME, startTime + duration - 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;

    if (isSessionComplete) {
      // Session complete: triumphant ascending melody (louder, longer)
      playTone(523.25, now, 0.3, 'triangle');        // C5
      playTone(659.25, now + 0.25, 0.3, 'triangle'); // E5
      playTone(783.99, now + 0.5, 0.3, 'triangle');  // G5
      playTone(1046.50, now + 0.75, 0.5, 'triangle'); // C6 (longer)
      // Add a second layer for richness
      playTone(261.63, now, 0.3, 'sine');            // C4 (bass)
      playTone(329.63, now + 0.25, 0.3, 'sine');     // E4
      playTone(392.00, now + 0.5, 0.3, 'sine');      // G4
      playTone(523.25, now + 0.75, 0.5, 'sine');     // C5
    } else {
      // Interval change: attention-grabbing two-tone chime
      // First chime
      playTone(880, now, 0.25, 'triangle');          // A5
      playTone(440, now, 0.25, 'sine');              // A4 (harmony)
      // Second chime (higher)
      playTone(1108.73, now + 0.3, 0.35, 'triangle'); // C#6
      playTone(554.37, now + 0.3, 0.35, 'sine');      // C#5 (harmony)
      // Third chime for emphasis
      playTone(880, now + 0.7, 0.25, 'triangle');    // A5
      playTone(440, now + 0.7, 0.25, 'sine');        // A4
    }
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
  totalSessionTime: number;
  elapsedSessionTime: number;
  sessionProgress: number;
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    currentIntervalIndex: 0,
    remainingSeconds: 0,
    template: null,
  });

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const currentInterval = state.template?.intervals[state.currentIntervalIndex] ?? null;

  const progress = currentInterval
    ? ((currentInterval.duration - state.remainingSeconds) / currentInterval.duration) * 100
    : 0;

  // Calculate total session time
  const totalSessionTime = state.template?.intervals.reduce((sum, interval) => sum + interval.duration, 0) ?? 0;

  // Calculate elapsed session time
  const elapsedSessionTime = state.template
    ? state.template.intervals
        .slice(0, state.currentIntervalIndex)
        .reduce((sum, interval) => sum + interval.duration, 0) +
      (currentInterval ? currentInterval.duration - state.remainingSeconds : 0)
    : 0;

  // Overall session progress percentage
  const sessionProgress = totalSessionTime > 0 ? (elapsedSessionTime / totalSessionTime) * 100 : 0;

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
        // Session complete - play triumphant sound
        playNotificationSound(true);
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

      // Move to next interval - play attention chime
      playNotificationSound(false);
      return {
        ...prev,
        currentIntervalIndex: nextIndex,
        remainingSeconds: prev.template.intervals[nextIndex].duration,
      };
    });
  }, []);

  const play = useCallback(() => {
    if (!state.template || state.template.intervals.length === 0) return;
    lastTickRef.current = Date.now();
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

  // Timer tick effect - more accurate timing using timestamps
  useEffect(() => {
    if (state.isRunning) {
      // Use a shorter interval and track actual elapsed time for accuracy
      const tick = () => {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;

        // Only decrement when a full second has passed
        if (elapsed >= 1000) {
          const secondsElapsed = Math.floor(elapsed / 1000);
          lastTickRef.current = now - (elapsed % 1000); // Keep remainder for accuracy

          setState((prev) => {
            const newRemaining = Math.max(0, prev.remainingSeconds - secondsElapsed);
            return { ...prev, remainingSeconds: newRemaining };
          });
        }
      };

      // Check more frequently for smoother updates
      intervalRef.current = window.setInterval(tick, 100);
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
    totalSessionTime,
    elapsedSessionTime,
    sessionProgress,
  };
}
