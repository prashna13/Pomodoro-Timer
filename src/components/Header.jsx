import React from 'react';
import { 
  Timer, BarChart2, Calendar, CheckSquare, Bell, 
  Settings, HeartPulse, Palette, Flame, Droplets 
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  stats,
  settings,
  onOpenSettings,
  onOpenWellnessModal,
  wellnessTimeRemaining,
  requestNotifications,
  onThemeChange
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const focusHours = (stats.focusMinutes / 60).toFixed(1);

  return (
    <header className="bg-stone-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Flocus Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
              <Timer className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Flocus <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold uppercase tracking-wider">1.5h Cozy Mode</span>
            </h1>
            <p className="text-[11px] text-stone-400">Minimalist Deep Work & Health Companion</p>
          </div>
        </div>

        {/* Flocus Navigation Tabs */}
        <div className="flex items-center gap-1 bg-stone-900/90 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          {[
            { id: 'timer', label: 'Timer', icon: Timer },
            { id: 'dashboard', label: 'Insights', icon: BarChart2 },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Actions & Wellness Pill */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          
          {/* Micro Break Countdown Pill */}
          <button
            onClick={onOpenWellnessModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer group"
            title="40-min Micro Break Health Prompt"
          >
            <HeartPulse className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Health Prompt: <strong className="text-emerald-200">{formatTime(wellnessTimeRemaining)}</strong></span>
          </button>

          {/* Notifications Toggle */}
          <button
            onClick={requestNotifications}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              settings.notificationsEnabled
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-stone-900 border-white/10 text-stone-400 hover:text-stone-200'
            }`}
            title="Desktop Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Settings Modal Launcher */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-stone-900 border border-white/10 text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-all cursor-pointer"
            title="Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}
