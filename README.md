# Dispatch Hub

A B2B SaaS MVP for event companies managing multiple sub-brands with cross-brand resource allocation.

## Core Features

- **Temporal Conflict Engine**: Prevents double-booking staff across brands
- **Daily Agenda View**: Chronological event feed with date navigation
- **Dual-Mode Assignment**: Drag-and-drop (desktop) + tap-friendly (mobile)
- **Dynamic Crew Management**: Add temp workers on-the-fly

## Tech Stack

- React 18 (functional components, hooks)
- Tailwind CSS (professional B2B styling)
- Lucide React (icons)
- localStorage (MVP database simulation)

## Getting Started

```bash
npm install
npm run dev
```

## Data Models

- **Brand**: `{ id, name, color, badge }`
- **Staff**: `{ id, name }`
- **Event**: `{ id, brandId, date, title, startTime, endTime, location, assignedStaffIds }`

## Conflict Detection

Uses temporal overlap logic: `(Start A < End B) && (End A > Start B)` converted to minutes for precise detection.
