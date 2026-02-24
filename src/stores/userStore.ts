import { signal, computed } from '@preact/signals';
import type { UserProfile, PregnancyInfo } from '../types/user';
import { getUserProfile, saveUserProfile } from '../lib/storage';
import { getPregnancyInfo } from '../lib/date-utils';

// Initialize from localStorage
const storedProfile = getUserProfile();

export const userProfile = signal<UserProfile | null>(storedProfile);

export const pregnancyInfo = computed<PregnancyInfo | null>(() => {
  const profile = userProfile.value;
  if (!profile || !profile.dueDate) return null;

  const dueDate = new Date(profile.dueDate);
  return getPregnancyInfo(dueDate);
});

export const isOnboarded = computed<boolean>(() => {
  return userProfile.value?.onboardingCompleted ?? false;
});

// Actions
export function setUserProfile(profile: UserProfile) {
  userProfile.value = profile;
  saveUserProfile(profile);
}

export function updateProfile(updates: Partial<UserProfile>) {
  const current = userProfile.value;
  if (!current) return;

  const updated = { ...current, ...updates };
  setUserProfile(updated);
}

export function completeOnboarding(dueDate: string, userName?: string) {
  const dueDateObj = new Date(dueDate);
  const startDate = new Date(dueDateObj);
  startDate.setDate(startDate.getDate() - 280);

  const profile: UserProfile = {
    dueDate,
    userName,
    pregnancyStartDate: startDate.toISOString(),
    onboardingCompleted: true,
    notificationPermission: 'default',
    preferInAppNotifications: false,
  };

  setUserProfile(profile);
}
