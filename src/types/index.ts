// Timer Types
export interface TimerInterval {
  id: string;
  name: string;
  duration: number; // in seconds
  type: 'work' | 'break';
}

export interface SessionTemplate {
  id: string;
  name: string;
  intervals: TimerInterval[];
  createdAt: number;
}

export interface TimerState {
  isRunning: boolean;
  currentIntervalIndex: number;
  remainingSeconds: number;
  template: SessionTemplate | null;
}

// Planner Types
export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Activity {
  id: string;
  title: string;
  categoryId: string;
  dayIndex: number; // 0-6 (Sunday-Saturday)
  startHour: number; // 0-23
  duration: number; // in hours
}

export interface PlannerState {
  activities: Activity[];
  categories: Category[];
}

// App Data for Export/Import
export interface AppData {
  version: string;
  exportedAt: number;
  templates: SessionTemplate[];
  planner: PlannerState;
}

// Default categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#3B82F6' },
  { id: 'gym', name: 'Gym', color: '#10B981' },
  { id: 'errands', name: 'Errands', color: '#F59E0B' },
  { id: 'study', name: 'Study', color: '#8B5CF6' },
  { id: 'personal', name: 'Personal', color: '#EC4899' },
  { id: 'rest', name: 'Rest', color: '#6B7280' },
];

// Days of the week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Hours for the planner
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
