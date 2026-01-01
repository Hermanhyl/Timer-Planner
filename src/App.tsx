import { useState, useRef } from 'react';
import { Timer } from './components/Timer';
import { Planner } from './components/Planner';
import { useLocalStorage, usePlanner } from './hooks';
import type { SessionTemplate, AppData } from './types';

type View = 'timer' | 'planner';

function App() {
  const [currentView, setCurrentView] = useState<View>('timer');
  const [templates, setTemplates] = useLocalStorage<SessionTemplate[]>('timer-templates', []);
  const planner = usePlanner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data: AppData = {
      version: '1.0.0',
      exportedAt: Date.now(),
      templates,
      planner: {
        activities: planner.activities,
        categories: planner.categories,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productivity-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as AppData;

        if (data.version && data.templates && data.planner) {
          setTemplates(data.templates);
          planner.setPlannerState(data.planner);
          alert('Data imported successfully!');
        } else {
          alert('Invalid backup file format');
        }
      } catch {
        alert('Failed to parse backup file');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Navigation */}
      <nav className="flex-shrink-0 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentView('timer')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'timer'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Timer</span>
                </span>
              </button>
              <button
                onClick={() => setCurrentView('planner')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'planner'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Planner</span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1"
                title="Export data"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1"
                title="Import data"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Import</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className={`flex-1 overflow-hidden ${currentView === 'timer' ? 'overflow-y-auto' : ''}`}>
        <div className={currentView === 'timer' ? 'max-w-6xl mx-auto' : 'h-full max-w-7xl mx-auto'}>
          {currentView === 'timer' ? <Timer /> : <Planner />}
        </div>
      </main>
    </div>
  );
}

export default App;
