import { useCallback } from 'react';
import type { Activity, Category, PlannerState } from '../types';
import { DEFAULT_CATEGORIES } from '../types';
import { useLocalStorage } from './useLocalStorage';

const generateId = () => Math.random().toString(36).substring(2, 11);

export interface UsePlannerReturn {
  activities: Activity[];
  categories: Category[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Omit<Activity, 'id'>>) => void;
  deleteActivity: (id: string) => void;
  moveActivity: (id: string, dayIndex: number, startHour: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
  getActivitiesForSlot: (dayIndex: number, hour: number) => Activity[];
  getCategoryById: (id: string) => Category | undefined;
  setPlannerState: (state: PlannerState) => void;
}

export function usePlanner(): UsePlannerReturn {
  const [plannerState, setPlannerState] = useLocalStorage<PlannerState>('planner-state', {
    activities: [],
    categories: DEFAULT_CATEGORIES,
  });

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    setPlannerState((prev) => ({
      ...prev,
      activities: [...prev.activities, { ...activity, id: generateId() }],
    }));
  }, [setPlannerState]);

  const updateActivity = useCallback((id: string, updates: Partial<Omit<Activity, 'id'>>) => {
    setPlannerState((prev) => ({
      ...prev,
      activities: prev.activities.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  }, [setPlannerState]);

  const deleteActivity = useCallback((id: string) => {
    setPlannerState((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a.id !== id),
    }));
  }, [setPlannerState]);

  const moveActivity = useCallback((id: string, dayIndex: number, startHour: number) => {
    setPlannerState((prev) => ({
      ...prev,
      activities: prev.activities.map((a) =>
        a.id === id ? { ...a, dayIndex, startHour } : a
      ),
    }));
  }, [setPlannerState]);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    setPlannerState((prev) => ({
      ...prev,
      categories: [...prev.categories, { ...category, id: generateId() }],
    }));
  }, [setPlannerState]);

  const updateCategory = useCallback((id: string, updates: Partial<Omit<Category, 'id'>>) => {
    setPlannerState((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  }, [setPlannerState]);

  const deleteCategory = useCallback((id: string) => {
    setPlannerState((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      // Also remove activities with this category
      activities: prev.activities.filter((a) => a.categoryId !== id),
    }));
  }, [setPlannerState]);

  const getActivitiesForSlot = useCallback((dayIndex: number, hour: number): Activity[] => {
    return plannerState.activities.filter(
      (a) =>
        a.dayIndex === dayIndex &&
        hour >= a.startHour &&
        hour < a.startHour + a.duration
    );
  }, [plannerState.activities]);

  const getCategoryById = useCallback((id: string): Category | undefined => {
    return plannerState.categories.find((c) => c.id === id);
  }, [plannerState.categories]);

  return {
    activities: plannerState.activities,
    categories: plannerState.categories,
    addActivity,
    updateActivity,
    deleteActivity,
    moveActivity,
    addCategory,
    updateCategory,
    deleteCategory,
    getActivitiesForSlot,
    getCategoryById,
    setPlannerState,
  };
}
