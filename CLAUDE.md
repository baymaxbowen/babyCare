# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server at http://localhost:3000
pnpm build        # tsc + vite build
pnpm preview      # preview production build
pnpm lint         # ESLint
pnpm type-check   # TypeScript check only (no emit)
```

No test framework is configured.

## Architecture

**Stack**: Preact + TypeScript + Tailwind CSS + Vite PWA + Dexie (IndexedDB) + @preact/signals + preact-router

### State & Persistence

Two layers of persistence:
- **IndexedDB** via Dexie (`src/lib/db.ts`): `movements`, `movementSessions`, `checkups` tables
- **localStorage** via `src/lib/storage.ts`: user profile only

State is managed with `@preact/signals` in `src/stores/`:
- `userStore.ts` — profile signal + computed `pregnancyInfo` and `isOnboarded`
- `movementStore.ts` — in-memory session tracking (start/increment/end/reset)

Signals are read in components via `.value` (e.g. `isTracking.value`).

### Routing & Layout

`App.tsx` guards routing: if `isOnboarded` is false, renders `<Onboarding>` exclusively; otherwise renders `<AppShell>` with preact-router.

Layout stack:
```
AppShell (h-screen, overflow-hidden, BottomNav fixed at bottom)
  └─ <main> (flex-1, pb-20, overflow-y-auto)
       └─ PageLayout (h-full, flex-col)
            ├─ optional Duolingo back button (px-4 pt-4)
            └─ scrollable children
```

All pages use `<PageLayout>` from `src/components/layout/PageLayout.tsx`:
- No back button: `<PageLayout>`
- With back button: `<PageLayout onBack={fn} backVariant="primary|secondary|accent">`

`backVariant` maps to the section color: `primary` (green, movement), `secondary` (orange, settings/profile), `accent` (blue, checkups).

### Design System

Duolingo-inspired. Colors are defined in both `tailwind.config.js` and CSS variables in `src/styles/globals.css`:
- `primary` (#58CC02 green), `secondary` (#FF9600 orange), `accent` (#1CB0F6 blue)
- `bg-secondary` (#F7F7F7) is the page background; `bg-white` for cards

Reusable CSS component classes in `globals.css`: `.btn-duolingo`, `.btn-primary/secondary/accent`, `.card`, `.form-input`, `.form-select`, `.form-label`, `.form-checkbox`, `.dropdown-panel`, `.dropdown-item`, `.calendar-day`.

Font: **ZCOOL KuaiLe** (站酷快乐体) loaded from Google Fonts, falls back to system sans-serif.

`Toast` and `Modal` components use `fixed` positioning and can be placed anywhere in the component tree.
