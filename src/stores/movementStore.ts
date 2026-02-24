import { signal } from '@preact/signals';
import type { MovementSession } from '../types/movement';

export const currentSession = signal<MovementSession | null>(null);
export const isTracking = signal<boolean>(false);

export function startSession() {
  const now = new Date();
  currentSession.value = {
    id: `session_${Date.now()}`,
    date: now,
    startTime: now,
    count: 0,
    completed: false,
  };
  isTracking.value = true;
}

export function incrementCount() {
  if (!currentSession.value) return;

  currentSession.value = {
    ...currentSession.value,
    count: currentSession.value.count + 1,
    completed: currentSession.value.count + 1 >= 10,
  };
}

export function endSession() {
  if (!currentSession.value) return;

  const now = new Date();
  const duration = Math.floor(
    (now.getTime() - currentSession.value.startTime.getTime()) / 1000 / 60
  );

  currentSession.value = {
    ...currentSession.value,
    endTime: now,
    duration,
  };

  isTracking.value = false;
}

export function resetSession() {
  currentSession.value = null;
  isTracking.value = false;
}
