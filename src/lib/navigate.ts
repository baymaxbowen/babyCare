/// <reference types="vite/client" />
import { route } from 'preact-router';

// Vite replaces BASE_URL at build time: '/babyCare/' on GitHub Pages, '/' locally
const RAW_BASE = import.meta.env.BASE_URL as string;

// '/babyCare' or '' — no trailing slash, ready to prepend to paths like '/movement'
export const BASE_PREFIX = RAW_BASE === '/' ? '' : RAW_BASE.slice(0, -1);

/** Strip the base prefix from a full pathname, returning the clean path (e.g. '/movement') */
export function stripBase(fullPath: string): string {
  if (!BASE_PREFIX) return fullPath;
  return fullPath.startsWith(BASE_PREFIX)
    ? fullPath.slice(BASE_PREFIX.length) || '/'
    : fullPath;
}

/** Navigate using a clean path (e.g. '/movement') — base prefix is added automatically */
export function navigate(cleanPath: string, replace = false): void {
  route(BASE_PREFIX + cleanPath, replace);
}
