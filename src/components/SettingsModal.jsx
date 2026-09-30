import React from 'react';
import { X, Settings, Volume2, Clock, Droplets, HeartPulse, RefreshCw } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetInsights
}) {
  if (!isOpen) return null;

  const handleChange = (key, val) => {
    onSaveSettings({ ...settings, [key]: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FDFBF7] border border-[#EBE4D8] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-[#2C4639]">
        
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EBE4D8]">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#D87A56]" />
            <h2 className="text-lg font-extrabold text-[#2C4639]">App Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8A7B6E] hover:text-[#2C4639] rounded-lg bg-[#FAF5EE] hover:bg-[#F2E8DC] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">

          {/* Work Duration */}
          <div>
            <label className="block text-xs font-bold text-[#4A3E31] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D87A56]" /> Default Work Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '☀️ 1.5h (90m)', val: 90 },
                { label: '⏱️ 50m', val: 50 },
                { label: '🍅 25m', val: 25 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleChange('workMinutes', opt.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    settings.workMinutes === opt.val
                      ? 'bg-[#68809A] border-[#68809A] text-white shadow-sm'
                      : 'bg-[#FAF5EE] border-[#EADBCE] text-[#544336] hover:bg-[#F2E8DC]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Health Prompt Interval */}
          <div>
            <label className="block text-xs font-bold text-[#4A3E31] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#8FA88B]" /> 40-Min Health Alert Interval
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 40, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleChange('wellnessIntervalMinutes', mins)}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    settings.wellnessIntervalMinutes === mins
                      ? 'bg-[#8FA88B] border-[#8FA88B] text-white shadow-sm'
                      : 'bg-[#FAF5EE] border-[#EADBCE] text-[#544336] hover:bg-[#F2E8DC]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Daily Water Target */}
          <div>
            <label className="block text-xs font-bold text-[#4A3E31] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#68809A]" /> Daily Water Target (Glasses)
            </label>
            <input
              type="number"
              min="4"
              max="16"
              value={settings.dailyWaterGoal}
              onChange={(e) => handleChange('dailyWaterGoal', parseInt(e.target.value) || 8)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5C9BB] text-[#2C4639] text-sm focus:outline-none focus:border-[#D87A56]"
            />
          </div>

          {/* Alert Volume */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#4A3E31] mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Volume2 className="w-4 h-4 text-[#D87A56]" /> Alert Volume
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
              className="w-full h-1.5 bg-[#D5C9BB] rounded-lg appearance-none cursor-pointer accent-[#D87A56]"
            />
          </div>

          {/* Reset Insights Data Button */}
          <div className="pt-2 border-t border-[#EBE4D8]">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all focus hours and insights data back to 0?')) {
                  onResetInsights();
                  onClose();
                }
              }}
              className="w-full py-2 px-3 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset All Insights & History to 0
            </button>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-[#EBE4D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D87A56] hover:bg-[#C56845] text-white font-extrabold text-xs cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
