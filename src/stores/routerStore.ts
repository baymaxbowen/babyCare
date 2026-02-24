import { signal } from '@preact/signals';
import { stripBase } from '../lib/navigate';

const TAB_PATHS = ['/', '/movement', '/checkups', '/settings'];

function getTabIndex(cleanUrl: string): number {
  if (cleanUrl === '/' || cleanUrl === '') return 0;
  const idx = TAB_PATHS.findIndex((p, i) => i > 0 && cleanUrl.startsWith(p));
  return idx; // -1 if not a known tab
}

// currentUrl always stores the clean path (without base prefix)
export const currentUrl = signal(stripBase(window.location.pathname));
// 'right' = new content slides in from the right side
// 'left'  = new content slides in from the left side
export const slideDir = signal<'right' | 'left'>('right');

export function handleRouteChange(newUrl: string) {
  const cleanNew = stripBase(newUrl);
  const prevIdx = getTabIndex(currentUrl.value);
  const newIdx = getTabIndex(cleanNew);

  if (prevIdx >= 0 && newIdx >= 0) {
    // Tab-to-tab: direction based on tab order
    slideDir.value = newIdx >= prevIdx ? 'right' : 'left';
  } else if (newIdx < 0) {
    // Navigating deeper (sub-page): slide from right
    slideDir.value = 'right';
  } else {
    // Returning to a tab from sub-page: slide from left
    slideDir.value = 'left';
  }

  currentUrl.value = cleanNew;
}
