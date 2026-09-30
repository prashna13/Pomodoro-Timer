import React from 'react';
import { Timer, Droplets, HeartPulse, Bell, Settings, Award } from 'lucide-react';

export default function Header({ 
  stats, 
  settings, 
  onOpenSettings, 
  onOpenWellnessModal,
  wellnessTimeRemaining,
  requestNotifications
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const focusHours = (stats.totalFocusMinutes / 60).toFixed(1);

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Timer className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              FocusFlow <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">1.5h Deep Work</span>
            </h1>
            <p className="text-xs text-slate-400">Pomodoro & Daily Wellness Companion</p>
          </div>
        </div>

        {/* Live Daily Stats Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {/* Total Focus Time */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs sm:text-sm font-medium">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{focusHours}h Focused</span>
            <span className="text-slate-500 text-xs">({stats.completedSessions} blocks)</span>
          </div>

          {/* Hydration Tracker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs sm:text-sm font-medium">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>{stats.waterGlasses}/{settings.dailyWaterGoal} Glasses</span>
          </div>

          {/* 40-Min Micro Break Status */}
          <button 
            onClick={onOpenWellnessModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium transition-all group cursor-pointer"
            title="Click for Stretch, Hydrate & Eye Rest prompt"
          >
            <HeartPulse className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Micro-break: <strong className="font-semibold text-emerald-200">{formatTime(wellnessTimeRemaining)}</strong></span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={requestNotifications}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              settings.notificationsEnabled 
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={settings.notificationsEnabled ? 'Desktop Notifications Active' : 'Enable Desktop Notifications'}
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
            title="App Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
