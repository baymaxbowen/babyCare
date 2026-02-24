import type { Checkup } from '../types/checkup';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission as NotificationPermissionStatus;
}

// Show browser notification
export function showBrowserNotification(title: string, options?: NotificationOptions): void {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  new Notification(title, {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    ...options,
  });
}

// Schedule checkup notification
export function scheduleCheckupNotification(checkup: Checkup): void {
  if (!checkup.reminderEnabled) return;

  // For demo purposes, we'll use a simple timeout approach
  // In production, you might want to use a service worker or backend scheduler
  checkup.reminderTimes.forEach((minutesBefore) => {
    const notifyTime = new Date(checkup.date);
    notifyTime.setMinutes(notifyTime.getMinutes() - minutesBefore);

    const now = new Date();
    const msUntilNotify = notifyTime.getTime() - now.getTime();

    if (msUntilNotify > 0) {
      setTimeout(() => {
        showBrowserNotification('产检提醒', {
          body: `${checkup.type}在${formatTimeUntil(minutesBefore)}后`,
          tag: `checkup-${checkup.id}-${minutesBefore}`,
          requireInteraction: true,
        });
      }, msUntilNotify);
    }
  });
}

function formatTimeUntil(minutes: number): string {
  if (minutes < 60) return `${minutes}分钟`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}小时`;
  return `${Math.floor(minutes / 1440)}天`;
}

// Check for upcoming checkups (in-app notifications fallback)
export function getUpcomingCheckups(checkups: Checkup[], hoursAhead: number = 24): Checkup[] {
  const now = new Date();
  const deadline = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  return checkups.filter((checkup) => {
    if (checkup.completed) return false;

    const checkupDate = new Date(checkup.date);
    return checkupDate >= now && checkupDate <= deadline;
  });
}

// Vibration feedback
export function vibrate(pattern: number | number[] = 50): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}
