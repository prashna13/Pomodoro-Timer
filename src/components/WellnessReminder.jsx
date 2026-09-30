import React, { useState, useEffect } from 'react';
import { HeartPulse, Droplets, Eye, CheckCircle, X, Sparkles } from 'lucide-react';
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
  
  const [eyeTimer, setEyeTimer] = useState(20);
  const [isEyeTimerRunning, setIsEyeTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isEyeTimerRunning && eyeTimer > 0) {
      interval = setInterval(() => setEyeTimer((prev) => prev - 1), 1000);
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
      waterGlasses: (stats.waterGlasses || 0) + 1
    });
    setWaterChecked(true);
    playSound('task_done');
  };

  const handleFinishWellness = () => {
    onUpdateStats({
      ...stats,
      stretchesCompleted: (stats.stretchesCompleted || 0) + (stretchChecked ? 1 : 0),
      outdoorLookCount: (stats.outdoorLookCount || 0) + (eyeRestChecked ? 1 : 0)
    });

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setStretchChecked(false);
    setWaterChecked(false);
    setEyeRestChecked(false);
    setEyeTimer(20);
    setIsEyeTimerRunning(false);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FDFBF7] border border-[#EBE4D8] rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl relative text-[#2C4639]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8A7B6E] hover:text-[#2C4639] rounded-full bg-[#FAF5EE] hover:bg-[#F2E8DC] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#98B89F]/30 border border-[#85A68C]/40 flex items-center justify-center text-[#2C523A] shrink-0">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#2C4639]">40-Minute Health Prompt!</h2>
            <p className="text-xs text-[#7A8A80]">Rest your body & eyes for 90 seconds to stay sharp</p>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* 1. Stretch */}
          <div className={`p-4 rounded-2xl border transition-all ${
            stretchChecked ? 'bg-[#EAF3EC] border-[#8FA88B]' : 'bg-white border-[#EBE4D8]'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧘</span>
                <div>
                  <h3 className="font-extrabold text-[#2C4639] text-sm">Stretch Your Body</h3>
                  <p className="text-xs text-[#7A6B5D]">Tilt neck, roll shoulders, and stretch arms</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setStretchChecked(!stretchChecked);
                  if (!stretchChecked) playSound('task_done');
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  stretchChecked ? 'bg-[#8FA88B] text-white' : 'bg-[#FAF5EE] text-[#8A7B6E]'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Drink Water */}
          <div className={`p-4 rounded-2xl border transition-all ${
            waterChecked ? 'bg-[#EDF4F9] border-[#68809A]' : 'bg-white border-[#EBE4D8]'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💧</span>
                <div>
                  <h3 className="font-extrabold text-[#2C4639] text-sm">Drink a Glass of Water</h3>
                  <p className="text-xs text-[#68809A] font-bold">
                    Today: {stats.waterGlasses || 0} / {settings.dailyWaterGoal} Glasses
                  </p>
                </div>
              </div>

              <button
                onClick={handleDrinkWater}
                className="px-3.5 py-1.5 rounded-xl bg-[#68809A] hover:bg-[#526880] text-white font-extrabold text-xs cursor-pointer shadow-sm"
              >
                +1 Glass 🥛
              </button>
            </div>
          </div>

          {/* 3. Look Outside */}
          <div className={`p-4 rounded-2xl border transition-all ${
            eyeRestChecked ? 'bg-[#EAF3EC] border-[#8FA88B]' : 'bg-white border-[#EBE4D8]'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪟</span>
                <div>
                  <h3 className="font-extrabold text-[#2C4639] text-sm">Look Outside Window</h3>
                  <p className="text-xs text-[#7A6B5D]">Focus on 20+ ft distance for 20 seconds</p>
                </div>
              </div>

              {isEyeTimerRunning ? (
                <div className="px-4 py-1.5 rounded-xl bg-[#8FA88B]/20 text-[#2C4639] font-mono font-extrabold text-sm border border-[#8FA88B]/40">
                  {eyeTimer}s...
                </div>
              ) : (
                <button
                  onClick={handleStartEyeTimer}
                  className="px-3.5 py-1.5 rounded-xl bg-[#8FA88B] hover:bg-[#738250] text-white font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Start 20s
                </button>
              )}
            </div>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-[#EBE4D8] flex items-center justify-between gap-4">
          <span className="text-xs text-[#7A6B5D] flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#D87A56]" /> Great work rhythm!
          </span>

          <button
            onClick={handleFinishWellness}
            className="px-6 py-2.5 rounded-xl bg-[#D87A56] hover:bg-[#C56845] text-white font-extrabold text-sm shadow-md cursor-pointer transition-all"
          >
            All Done! Back to Focus 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
