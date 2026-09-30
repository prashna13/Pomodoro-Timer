import React, { useState, useEffect } from 'react';
import { HeartPulse, Droplets, Eye, Activity, CheckCircle, X, Sparkles, RefreshCw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';

export default function WellnessReminder({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
  settings
}) {
  const [stretchChecked, setStretchChecked] = useState(false);
  const [waterChecked, setWaterChecked] = useState(false);
  const [eyeRestChecked, setEyeRestChecked] = useState(false);
  
  // Eye rest 20-second timer
  const [eyeTimer, setEyeTimer] = useState(20);
  const [isEyeTimerRunning, setIsEyeTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isEyeTimerRunning && eyeTimer > 0) {
      interval = setInterval(() => {
        setEyeTimer((prev) => prev - 1);
      }, 1000);
    } else if (eyeTimer === 0) {
      setIsEyeTimerRunning(false);
      setEyeRestChecked(true);
      playSound('task_done');
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isEyeTimerRunning, eyeTimer]);

  const handleStartEyeTimer = () => {
    setEyeTimer(20);
    setIsEyeTimerRunning(true);
  };

  const handleDrinkWater = () => {
    onUpdateStats({
      ...stats,
      waterGlasses: stats.waterGlasses + 1
    });
    setWaterChecked(true);
    playSound('task_done');
  };

  const handleFinishWellness = () => {
    // Save stats
    onUpdateStats({
      ...stats,
      stretchesCompleted: stats.stretchesCompleted + (stretchChecked ? 1 : 0),
      outdoorLookCount: stats.outdoorLookCount + (eyeRestChecked ? 1 : 0)
    });

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    
    // Reset local modal state
    setStretchChecked(false);
    setWaterChecked(false);
    setEyeRestChecked(false);
    setEyeTimer(20);
    setIsEyeTimerRunning(false);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl relative overflow-hidden text-slate-100">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-400"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              40-Minute Micro-Break Prompt!
            </h2>
            <p className="text-xs text-slate-400">Rest your body & eyes for 90 seconds to stay sharp</p>
          </div>
        </div>

        {/* The 3 Core Wellness Cards */}
        <div className="space-y-4">

          {/* 1. Stretch Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            stretchChecked 
              ? 'bg-emerald-950/40 border-emerald-500/50' 
              : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shrink-0">
                  🧘
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Stretch Your Body</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Tilt neck, roll shoulders, and stretch arms</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setStretchChecked(!stretchChecked);
                  if (!stretchChecked) playSound('task_done');
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  stretchChecked 
                    ? 'bg-emerald-500 text-slate-950 font-bold' 
                    : 'bg-slate-700/80 text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stretch Tips */}
            <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/40 text-[11px] text-slate-300">
              <div className="bg-slate-950/50 p-2 rounded-lg text-center">
                <span className="block font-semibold text-purple-300">Neck Tilt</span>
                <span className="text-slate-400">10s Left / Right</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg text-center">
                <span className="block font-semibold text-purple-300">Shoulder Rolls</span>
                <span className="text-slate-400">5 Forward & Back</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg text-center">
                <span className="block font-semibold text-purple-300">Torso Twist</span>
                <span className="text-slate-400">Release lower back</span>
              </div>
            </div>
          </div>

          {/* 2. Drink Water Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            waterChecked 
              ? 'bg-emerald-950/40 border-emerald-500/50' 
              : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold shrink-0">
                  💧
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Drink a Glass of Water</h3>
                  <p className="text-xs text-sky-300/80 font-medium">
                    Today's Hydration: <strong>{stats.waterGlasses} / {settings.dailyWaterGoal}</strong> Glasses
                  </p>
                </div>
              </div>

              <button
                onClick={handleDrinkWater}
                className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                +1 Glass 🥛
              </button>
            </div>
          </div>

          {/* 3. Look Outside (20-20-20 Rule) Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            eyeRestChecked 
              ? 'bg-emerald-950/40 border-emerald-500/50' 
              : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold shrink-0">
                  🪟
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Look Outside Window</h3>
                  <p className="text-xs text-slate-400">Focus on an object 20+ feet away for 20s</p>
                </div>
              </div>

              {isEyeTimerRunning ? (
                <div className="px-4 py-1.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono font-bold text-sm">
                  {eyeTimer}s...
                </div>
              ) : (
                <button
                  onClick={handleStartEyeTimer}
                  className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> Start 20s
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Keep up the deep work rhythm!
          </span>

          <button
            onClick={handleFinishWellness}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
          >
            All Done! Back to Focus 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
