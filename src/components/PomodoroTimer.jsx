import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, Music, CheckCircle2, Sparkles, Target } from 'lucide-react';
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
    <div className="flocus-card p-6 lg:p-10 relative overflow-hidden text-stone-100 max-w-3xl mx-auto">
      
      {/* Background soft ambient warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Flocus Presets Bar */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8 relative z-10">
        <button
          onClick={() => setMode('work', 90)}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mode === 'work' && settings.workMinutes === 90
              ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/50'
              : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-white/10'
          }`}
        >
          🌟 1.5 Hours Deep Work
        </button>

        <button
          onClick={() => setMode('work', 50)}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'work' && settings.workMinutes === 50
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-white/10'
          }`}
        >
          ⏱️ 50m Focus
        </button>

        <button
          onClick={() => setMode('work', 25)}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'work' && settings.workMinutes === 25
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-white/10'
          }`}
        >
          🍅 25m Classic
        </button>

        <button
          onClick={() => setMode('shortBreak', settings.shortBreakMinutes)}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'shortBreak'
              ? 'bg-teal-500 text-stone-950 shadow-md'
              : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-white/10'
          }`}
        >
          ☕ Short Break ({settings.shortBreakMinutes}m)
        </button>

        <button
          onClick={() => setMode('longBreak', settings.longBreakMinutes)}
          className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'longBreak'
              ? 'bg-emerald-500 text-stone-950 shadow-md'
              : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-white/10'
          }`}
        >
          🌴 Long Break ({settings.longBreakMinutes}m)
        </button>
      </div>

      {/* Main Flocus Circular Timer */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center my-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
          <circle
            cx="140"
            cy="140"
            r="120"
            className="stroke-stone-800/80"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke={mode === 'work' ? '#f59e0b' : '#10b981'}
            strokeWidth="8"
            strokeDasharray="754"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear glow-cozy"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2 uppercase tracking-widest text-amber-400">
            {mode === 'work' ? 'Deep Work Session' : 'Rest & Recharge'}
          </span>

          <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white font-mono drop-shadow-md">
            {formattedTime}
          </span>

          {activeTask ? (
            <div className="mt-4 px-3.5 py-1 max-w-[220px] truncate text-xs text-amber-200 bg-amber-950/60 border border-amber-500/30 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{activeTask.title}</span>
            </div>
          ) : (
            <div className="mt-3 text-xs text-stone-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Today: <strong>{todayHours} / {settings.targetFocusHours}h</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8 relative z-10">
        <button
          onClick={onResetTimer}
          className="p-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleTimer}
          className={`px-10 py-4.5 rounded-2xl font-extrabold text-lg flex items-center gap-3 transition-all cursor-pointer shadow-xl active:scale-95 ${
            isRunning
              ? 'bg-amber-500 text-stone-950 shadow-amber-500/30 hover:brightness-110'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-amber-500/25 hover:brightness-110'
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

        <button
          onClick={onSkipTimer}
          className="p-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer active:scale-95"
          title="Skip Session"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Active Task Banner */}
      {activeTask && (
        <div className="mt-6 p-3.5 rounded-2xl bg-stone-900/90 border border-amber-500/20 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-stone-200 truncate">
            <span className="text-stone-400 font-medium shrink-0">Working on:</span>
            <span className="font-semibold text-amber-300 truncate">{activeTask.title}</span>
          </div>
          <button
            onClick={() => onCompleteCurrentTask(activeTask.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Complete
          </button>
        </div>
      )}

      {/* Cozy Ambient Audio Selector */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
          <Music className="w-4 h-4 text-amber-400" />
          <span>Cozy Ambient Sound:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {[
            { id: 'off', label: 'Off' },
            { id: 'rain', label: '🌧️ Gentle Rain' },
            { id: 'ocean', label: '🌊 Ocean Waves' },
            { id: 'focus_drone', label: '🎧 432Hz Drone' },
            { id: 'brown', label: '📻 Brown Noise' }
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => handleAmbientSelect(snd.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                ambientSound === snd.id
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>

        {ambientSound !== 'off' && (
          <div className="flex items-center gap-2 text-stone-400 text-xs">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        )}
      </div>

    </div>
  );
}
