import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Music, CheckCircle2, Sparkles, Sliders } from 'lucide-react';
import { ambientEngine } from '../utils/audio';

export default function PomodoroTimer({
  mode, // 'work' | 'shortBreak' | 'longBreak'
  setMode,
  timeLeft,
  totalDuration,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  activeTask,
  settings,
  onCompleteCurrentTask
}) {
  const [ambientSound, setAmbientSound] = useState('off');
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [customInputMins, setCustomInputMins] = useState(90);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Handle ambient sound playback when timer state changes
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
      if (soundType === 'off') {
        ambientEngine.stop();
      } else {
        ambientEngine.start(soundType, ambientVolume);
      }
    }
  };

  // Time calculations
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage (0 -> 100)
  const progressPercent = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;
  const strokeDashoffset = 754 - (754 * progressPercent) / 100; // Radius = 120, circumference = 2 * PI * 120 ≈ 753.98

  // Mode Theme colors
  const modeConfig = {
    work: {
      title: 'Deep Work Session',
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
      stroke: '#6366f1',
      glow: 'glow-indigo'
    },
    shortBreak: {
      title: 'Short Break',
      color: 'from-cyan-400 to-teal-500',
      textColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      stroke: '#06b6d4',
      glow: 'glow-sky'
    },
    longBreak: {
      title: 'Long Rest & Recharge',
      color: 'from-emerald-400 to-green-600',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      stroke: '#10b981',
      glow: 'glow-emerald'
    }
  };

  const currentTheme = modeConfig[mode] || modeConfig.work;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      
      {/* Background radial gradient glow */}
      <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-10 blur-3xl bg-gradient-to-tr ${currentTheme.color} pointer-events-none`}></div>

      {/* Preset Mode Selection Tabs */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-8">
        <button
          onClick={() => setMode('work', settings.workMinutes)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'work' && settings.workMinutes === 90
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
          }`}
        >
          🌟 1.5 Hrs (90m Work)
        </button>

        <button
          onClick={() => setMode('work', 50)}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            mode === 'work' && settings.workMinutes === 50
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
          }`}
        >
          ⏱️ 50m Focus
        </button>

        <button
          onClick={() => setMode('work', 25)}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            mode === 'work' && settings.workMinutes === 25
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
          }`}
        >
          🍅 25m Classic
        </button>

        <button
          onClick={() => setMode('shortBreak', settings.shortBreakMinutes)}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            mode === 'shortBreak'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
          }`}
        >
          ☕ Short Break ({settings.shortBreakMinutes}m)
        </button>

        <button
          onClick={() => setMode('longBreak', settings.longBreakMinutes)}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            mode === 'longBreak'
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
          }`}
        >
          🌴 Long Break ({settings.longBreakMinutes}m)
        </button>
      </div>

      {/* Main Circular Timer Display */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center my-4">
        {/* SVG Circular Progress Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
          {/* Background track circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            className="stroke-slate-800/80"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Active progress ring */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke={currentTheme.stroke}
            strokeWidth="12"
            strokeDasharray="754"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Timer Text Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border mb-2 uppercase tracking-wider ${currentTheme.badgeBg}`}>
            {currentTheme.title}
          </span>
          
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono drop-shadow-md">
            {formattedTime}
          </span>

          {activeTask ? (
            <div className="mt-3 px-3 py-1 max-w-[200px] truncate text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{activeTask.title}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 mt-2">Ready for focus</span>
          )}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={onResetTimer}
          className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleTimer}
          className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all cursor-pointer shadow-xl active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : `bg-gradient-to-r ${currentTheme.color} text-white shadow-indigo-500/30 hover:brightness-110`
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-6 h-6 fill-current" /> Pause
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current ml-0.5" /> Start Focus
            </>
          )}
        </button>

        <button
          onClick={onSkipTimer}
          className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
          title="Skip to Next Session"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Active Task Action Bar (if selected) */}
      {activeTask && (
        <div className="mt-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-200 truncate">
            <span className="text-slate-400 font-medium shrink-0">Working on:</span>
            <span className="font-semibold text-indigo-300 truncate">{activeTask.title}</span>
          </div>
          <button
            onClick={() => onCompleteCurrentTask(activeTask.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Complete
          </button>
        </div>
      )}

      {/* Integrated Ambient Sound Player */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Music className="w-4 h-4 text-indigo-400" />
          <span>Ambient Focus Audio:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {[
            { id: 'off', label: 'Off' },
            { id: 'rain', label: '🌧️ Rain' },
            { id: 'ocean', label: '🌊 Ocean' },
            { id: 'focus_drone', label: '🎧 432Hz Drone' },
            { id: 'brown', label: '📻 Brown Noise' }
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => handleAmbientSelect(snd.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                ambientSound === snd.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>

        {ambientSound !== 'off' && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        )}
      </div>

    </div>
  );
}
