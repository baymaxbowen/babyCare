export interface UserProfile {
  dueDate: string; // ISO date string
  userName?: string;
  pregnancyStartDate: string; // ISO date string (calculated: dueDate - 280 days)
  onboardingCompleted: boolean;
  notificationPermission: 'granted' | 'denied' | 'default';
  preferInAppNotifications: boolean;
}

export interface PregnancyInfo {
  weeks: number;
  days: number;
  daysUntilDue: number;
  trimester: 'early' | 'mid' | 'late';
  babySize: BabySize;
}

export interface BabySize {
  name: string;
  emoji: string;
  lengthCm?: number;
  weightGrams?: number;
}
