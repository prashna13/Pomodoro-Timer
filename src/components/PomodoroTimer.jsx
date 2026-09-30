import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, Music, CheckCircle2, Sliders, Edit3, Target } from 'lucide-react';
import { ambientEngine } from '../utils/audio';

export default function PomodoroTimer({
  mode,
  setMode,
  timeLeft,
  totalDuration,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  activeTask,
  settings,
  onCompleteCurrentTask,
  todayStats
}) {
  const [ambientSound, setAmbientSound] = useState('off');
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [showAmbientMenu, setShowAmbientMenu] = useState(false);

  useEffect(() => {
    if (isRunning && ambientSound !== 'off') {
      ambientEngine.start(ambientSound, ambientVolume);
    } else {
      ambientEngine.stop();
    }
    return () => ambientEngine.stop();
  }, [isRunning, ambientSound]);

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setAmbientVolume(vol);
    ambientEngine.setVolume(vol);
  };

  const handleAmbientSelect = (soundType) => {
    setAmbientSound(soundType);
    if (isRunning) {
      if (soundType === 'off') ambientEngine.stop();
      else ambientEngine.start(soundType, ambientVolume);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;
  const strokeDashoffset = 754 - (754 * progressPercent) / 100;

  const todayHours = ((todayStats.focusMinutes || 0) / 60).toFixed(1);

  return (
    <div className="flocus-card p-6 sm:p-8 lg:p-10 relative overflow-hidden text-stone-800 shadow-xl bg-white/95">
      
      {/* Decorative Cozy Flower SVG Illustration Accent Bottom-Left */}
      <div className="absolute bottom-3 left-4 pointer-events-none opacity-80 flex items-end gap-1">
        <span className="text-xl">🌸</span>
        <span className="text-lg">🌿</span>
        <span className="text-sm">🍄</span>
      </div>

      {/* Presets Bar matching uploaded screenshot */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap mb-8 relative z-10">
        <button
          onClick={() => setMode('work', 90)}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
            mode === 'work' && settings.workMinutes === 90
              ? 'bg-[#68809A] text-white ring-2 ring-[#526880]'
              : 'bg-[#68809A]/80 text-white hover:bg-[#68809A]'
          }`}
        >
          ☀️ 1.5h Deep Work 🌸
        </button>

        <button
          onClick={() => setMode('work', 50)}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
            mode === 'work' && settings.workMinutes === 50
              ? 'bg-[#C97A70] text-white ring-2 ring-[#B06359]'
              : 'bg-[#C97A70]/80 text-white hover:bg-[#C97A70]'
          }`}
        >
          🔥 50m Focus
        </button>

        <button
          onClick={() => setMode('work', 25)}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
            mode === 'work' && settings.workMinutes === 25
              ? 'bg-[#8A9A65] text-white ring-2 ring-[#738250]'
              : 'bg-[#8A9A65]/80 text-white hover:bg-[#8A9A65]'
          }`}
        >
          🍅 25m Classic
        </button>

        <button
          onClick={() => setMode('shortBreak', settings.shortBreakMinutes)}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
            mode === 'shortBreak'
              ? 'bg-[#8A90BA] text-white ring-2 ring-[#7076A0]'
              : 'bg-[#8A90BA]/80 text-white hover:bg-[#8A90BA]'
          }`}
        >
          🍵 Short Break ({settings.shortBreakMinutes}m)
        </button>

        <button
          onClick={() => setMode('longBreak', settings.longBreakMinutes)}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
            mode === 'longBreak'
              ? 'bg-[#C99458] text-white ring-2 ring-[#B07B40]'
              : 'bg-[#C99458]/80 text-white hover:bg-[#C99458]'
          }`}
        >
          🍄 Long Break ({settings.longBreakMinutes}m)
        </button>
      </div>

      {/* Main Circular Timer Display matching reference screenshot */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center my-4">
        
        {/* Glowing Terracotta Radial Progress Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
          <circle
            cx="140"
            cy="140"
            r="120"
            className="stroke-[#F5EBE1]"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="#E07A5F"
            strokeWidth="10"
            strokeDasharray="754"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear timer-glow-ring"
          />
        </svg>

        {/* Center Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#F7ECE1] text-[#7A6658] border border-[#EADBCE] mb-2 uppercase tracking-widest">
            {mode === 'work' ? 'DEEP WORK SESSION' : 'REST & RECHARGE'}
          </span>

          <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#2C4639] font-mono drop-shadow-sm">
            {formattedTime}
          </span>

          <div className="mt-3 text-xs text-[#8A7B6E] font-medium flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-[#D87A56]" />
            <span>Target Today: <strong>{todayHours} / {settings.targetFocusHours}h</strong></span>
          </div>
        </div>
      </div>

      {/* Main Controls Row matching screenshot */}
      <div className="flex items-center justify-center gap-5 mt-6 relative z-10">
        
        {/* Circular Reset Button */}
        <button
          onClick={onResetTimer}
          className="w-12 h-12 rounded-full border border-[#B0C5B5] text-[#4A6B52] hover:bg-[#EAF3EC] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Large Terracotta Start Button */}
        <button
          onClick={onToggleTimer}
          className={`px-10 py-4 rounded-2xl font-extrabold text-lg flex items-center gap-3 transition-all cursor-pointer shadow-lg active:scale-95 text-white ${
            isRunning
              ? 'bg-[#C56845] hover:bg-[#B35735] shadow-[#C56845]/30'
              : 'bg-[#D87A56] hover:bg-[#C56845] shadow-[#D87A56]/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-6 h-6 fill-current" /> Pause
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current ml-0.5" /> Start Focus Block
            </>
          )}
        </button>

        {/* Circular Skip Button */}
        <button
          onClick={onSkipTimer}
          className="w-12 h-12 rounded-full border border-[#B5C8D8] text-[#4A6882] hover:bg-[#EDF4F9] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          title="Skip Session"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Active Task Banner if set */}
      {activeTask && (
        <div className="mt-6 p-3.5 rounded-2xl bg-[#F7ECE1] border border-[#EADBCE] flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#4A3E31] truncate">
            <span className="text-[#8A7B6E] font-medium shrink-0">Working on:</span>
            <span className="font-bold text-[#D87A56] truncate">{activeTask.title}</span>
          </div>
          <button
            onClick={() => onCompleteCurrentTask(activeTask.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#8FA88B] text-white text-xs font-bold shadow-sm cursor-pointer shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" /> Done
          </button>
        </div>
      )}

      {/* Bottom Left Small Tools matching screenshot */}
      <div className="mt-6 pt-4 border-t border-[#EBE4D8] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAmbientMenu(!showAmbientMenu)}
            className="p-2.5 rounded-full border border-[#D5C9BB] bg-[#FAF5EE] text-[#544336] hover:bg-[#F2E8DC] transition-all cursor-pointer shadow-sm"
            title="Cozy Ambient Audio"
          >
            <Music className="w-4 h-4" />
          </button>

          {showAmbientMenu && (
            <div className="flex items-center gap-1 bg-[#F5EFE6] p-1.5 rounded-xl border border-[#E2D6C5]">
              {[
                { id: 'off', label: 'Off' },
                { id: 'rain', label: '🌧️ Rain' },
                { id: 'ocean', label: '🌊 Ocean' },
                { id: 'focus_drone', label: '🎧 Drone' }
              ].map((snd) => (
                <button
                  key={snd.id}
                  onClick={() => handleAmbientSelect(snd.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    ambientSound === snd.id
                      ? 'bg-[#D87A56] text-white'
                      : 'text-[#6A5A4D] hover:bg-[#EAE0D2]'
                  }`}
                >
                  {snd.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {ambientSound !== 'off' && (
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <Volume2 className="w-4 h-4 text-[#D87A56]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-[#D5C9BB] rounded-lg appearance-none cursor-pointer accent-[#D87A56]"
            />
          </div>
        )}
      </div>

    </div>
  );
}
