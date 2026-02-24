import type { UserProfile } from '../types/user';

const STORAGE_KEYS = {
  USER_PROFILE: 'baby_user_profile',
  ONBOARDING: 'baby_onboarding_completed',
} as const;

// User Profile Management
export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!data) return null;

  try {
    return JSON.parse(data) as UserProfile;
  } catch (error) {
    console.error('Failed to parse user profile:', error);
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  const current = getUserProfile();
  if (!current) return;

  const updated = { ...current, ...updates };
  saveUserProfile(updated);
}

export function clearUserProfile(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

// Onboarding Status
export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
}

export function setOnboardingCompleted(): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
}

// Generic storage helpers
export function getItem<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;

  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}
