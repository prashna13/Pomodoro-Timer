import React from 'react';
import { X, Settings, Volume2, Bell, HeartPulse, Clock, Droplets, Check } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) {
  if (!isOpen) return null;

  const handleChange = (key, val) => {
    onSaveSettings({ ...settings, [key]: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">App Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Controls */}
        <div className="space-y-4">

          {/* Work Block Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> Default Work Block (Minutes)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '🌟 1.5h (90m)', val: 90 },
                { label: '⏱️ 50m', val: 50 },
                { label: '🍅 25m', val: 25 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleChange('workMinutes', opt.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    settings.workMinutes === opt.val
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Micro-Break Interval (40 mins default) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-400" /> 40-Min Health Alert Interval
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 40, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleChange('wellnessIntervalMinutes', mins)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    settings.wellnessIntervalMinutes === mins
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Water Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" /> Daily Water Target (Glasses)
            </label>
            <input
              type="number"
              min="4"
              max="16"
              value={settings.dailyWaterGoal}
              onChange={(e) => handleChange('dailyWaterGoal', parseInt(e.target.value) || 8)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Audio Volume */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Volume2 className="w-4 h-4 text-amber-400" /> Alert Sound Volume
              </span>
              <span>{Math.round(settings.soundVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.soundVolume}
              onChange={(e) => handleChange('soundVolume', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
