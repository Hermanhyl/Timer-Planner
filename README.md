# Timer & Planner

A productivity app built with React, TypeScript, and Tailwind CSS. Features a customizable focus timer with session templates and a flexible planner with both weekly and monthly views.

## Features

### Focus Timer
- Create session templates with multiple work/break intervals
- Set durations in hours, minutes, and seconds
- Play, pause, reset, and skip controls
- Circular progress display with gradient ring and glow effects
- Session progress bar showing total elapsed time
- Loud, attention-grabbing audio notifications with distinct sounds for interval changes and session completion
- Accurate timestamp-based timing that won't drift
- Save and load templates from localStorage

### Weekly Planner
- 7-day grid view with practical working hours (6 AM - 11 PM)
- Drag-and-drop activities between time slots
- Sticky header with day names and dates
- Current day highlighting
- Color-coded categories (Work, Gym, Errands, Study, Personal, Rest)
- Create, edit, and delete activities
- Add custom categories with any color

### Monthly Planner
- Full calendar grid showing the entire month
- Navigate between months with prev/next buttons
- "Today" button to quickly jump to current month
- Click any day to add activities
- View activities as colored pills on each day
- Days outside current month appear dimmed

### Activity Scheduling
- **Date-specific activities**: Activities are tied to specific dates, not just days of the week
- **Recurring options**:
  - Does not repeat (default) - one-time activity
  - Daily - repeats every day
  - Weekly - repeats on the same day each week
  - Monthly - repeats on the same day number each month
- Date picker for selecting exact dates
- Activities only appear from their start date onward

### Data Management
- All data persists in localStorage
- Export all data as JSON backup
- Import data from backup file

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Hermanhyl/Timer-Planner.git
cd Timer-Planner

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **@dnd-kit** - Drag and drop functionality

## Project Structure

```
src/
├── components/
│   ├── Timer/
│   │   ├── TimerDisplay.tsx    # Circular progress UI with glow effects
│   │   ├── TimerControls.tsx   # Play/pause/reset/skip buttons
│   │   ├── SessionBuilder.tsx  # Create/manage templates
│   │   └── index.tsx           # Main Timer view with session progress
│   └── Planner/
│       ├── WeekView.tsx        # 7-day grid with drag-drop
│       ├── MonthView.tsx       # Monthly calendar view
│       ├── TimeSlot.tsx        # Individual hour slots
│       ├── ActivityBlock.tsx   # Draggable activity items
│       ├── CategoryManager.tsx # Add/edit/delete categories
│       ├── ActivityModal.tsx   # Add/edit activity form with date picker
│       └── index.tsx           # Main Planner view with Week/Month toggle
├── hooks/
│   ├── useTimer.ts             # Timer state & logic with accurate timing
│   ├── useLocalStorage.ts      # localStorage sync
│   ├── usePlanner.ts           # Planner state & date-based queries
│   └── index.ts
├── types/
│   └── index.ts                # TypeScript interfaces
├── App.tsx                     # Navigation & export/import
├── main.tsx                    # Entry point
└── index.css                   # Tailwind imports
```

## Usage

### Timer
1. Click **New** to create a session template
2. Add intervals with names, durations (hours/minutes/seconds), and types (work/break)
3. Save the template
4. Click **Load** to select a template
5. Press **Play** to start the timer
6. Watch the session progress bar to see overall progress
7. Audio will alert you when intervals change or the session completes

### Planner
1. Toggle between **Week** and **Month** views using the buttons in the header
2. Click any empty time slot (week view) or day (month view) to add an activity
3. Fill in the title, category, date, start time, and duration
4. Choose a repeat option if you want the activity to recur
5. Drag activities to reschedule them (week view)
6. Click **Categories** to manage custom categories
7. Use **Export** to backup your data

## License

MIT
