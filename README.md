# Timer & Weekly Planner

A productivity app built with React, TypeScript, and Tailwind CSS. Features a customizable focus timer with session templates and a weekly planner with drag-and-drop scheduling.

## Features

### Custom Timer
- Create session templates with multiple work/break intervals
- Set durations in hours, minutes, and seconds
- Play, pause, reset, and skip controls
- Circular progress display with countdown
- Audio notifications when intervals change
- Save and load templates from localStorage

### Weekly Planner
- 7-day grid view with hourly time slots (24 hours)
- Drag-and-drop activities between time slots
- Color-coded categories (Work, Gym, Errands, Study, Personal, Rest)
- Create, edit, and delete activities
- Add custom categories with any color
- Current day indicator

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
│   │   ├── TimerDisplay.tsx    # Circular progress UI
│   │   ├── TimerControls.tsx   # Play/pause/reset/skip buttons
│   │   ├── SessionBuilder.tsx  # Create/manage templates
│   │   └── index.tsx           # Main Timer view
│   └── Planner/
│       ├── WeekView.tsx        # 7-day grid with drag-drop
│       ├── TimeSlot.tsx        # Individual hour slots
│       ├── ActivityBlock.tsx   # Draggable activity items
│       ├── CategoryManager.tsx # Add/edit/delete categories
│       ├── ActivityModal.tsx   # Add/edit activity form
│       └── index.tsx           # Main Planner view
├── hooks/
│   ├── useTimer.ts             # Timer state & logic
│   ├── useLocalStorage.ts      # localStorage sync
│   ├── usePlanner.ts           # Planner state & actions
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
2. Add intervals with names, durations, and types (work/break)
3. Save the template
4. Click **Load** to select a template
5. Press **Play** to start the timer

### Planner
1. Click any empty time slot to add an activity
2. Fill in the title, category, start time, and duration
3. Drag activities to reschedule them
4. Click **Categories** to manage custom categories
5. Use **Export** to backup your data

## License

MIT
