import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Award, Droplets, HeartPulse, CheckCircle } from 'lucide-react';

export default function CalendarView({ history, settings }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(new Date().toISOString().split('T')[0]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Target minutes (default 270m = 4.5h)
  const targetMins = (settings.targetFocusHours || 4.5) * 60;

  // Selected date details
  const selectedLog = history[selectedDateKey] || {
    date: selectedDateKey,
    focusMinutes: 0,
    completedSessions: 0,
    waterGlasses: 0,
    stretchesCompleted: 0
  };

  const selectedHours = (selectedLog.focusMinutes / 60).toFixed(1);
  const isSelectedTargetMet = selectedLog.focusMinutes >= targetMins;

  return (
    <div className="flocus-card p-6 lg:p-8 space-y-6 animate-fade-in">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-400" /> Focus History Calendar
          </h2>
          <p className="text-xs text-stone-400">Click any date to inspect focus hours & wellness logs</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm font-bold text-white min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-semibold text-stone-400 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        
        {/* Blank padding cells before 1st day of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
          <div key={`blank-${idx}`} className="h-14 sm:h-20 rounded-2xl bg-transparent"></div>
        ))}

        {/* Days of the Month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const monthStr = String(month + 1).padStart(2, '0');
          const dayStr = String(dayNum).padStart(2, '0');
          const dateKey = `${year}-${monthStr}-${dayStr}`;

          const log = history[dateKey] || { focusMinutes: 0 };
          const hours = (log.focusMinutes / 60).toFixed(1);
          const isSelected = dateKey === selectedDateKey;
          const isToday = dateKey === new Date().toISOString().split('T')[0];

          // Heatmap Level (0 -> 4)
          let heatClass = 'cell-level-0';
          if (log.focusMinutes >= targetMins) heatClass = 'cell-level-4';
          else if (log.focusMinutes >= 240) heatClass = 'cell-level-3';
          else if (log.focusMinutes >= 180) heatClass = 'cell-level-2';
          else if (log.focusMinutes > 0) heatClass = 'cell-level-1';

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDateKey(dateKey)}
              className={`h-14 sm:h-20 rounded-2xl p-1.5 sm:p-2.5 flex flex-col justify-between items-start transition-all cursor-pointer relative overflow-hidden border ${heatClass} ${
                isSelected
                  ? 'ring-2 ring-amber-400 border-white/60 shadow-lg scale-105 z-10'
                  : isToday
                  ? 'border-amber-500/60'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className={`text-xs font-bold ${isToday ? 'text-amber-400 font-extrabold' : ''}`}>
                  {dayNum}
                </span>

                {log.focusMinutes >= targetMins && (
                  <span className="text-[10px]">⭐</span>
                )}
              </div>

              {log.focusMinutes > 0 ? (
                <span className="text-[10px] sm:text-xs font-bold self-end mt-auto">
                  {hours}h
                </span>
              ) : (
                <span className="text-[9px] text-stone-500/50 self-end mt-auto">-</span>
              )}
            </button>
          );
        })}

      </div>

      {/* Selected Day Inspector Card */}
      <div className="mt-6 p-5 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Focus Summary for {selectedDateKey}</span>
            {isSelectedTargetMet ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Target Achieved!
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-xs">
                Target: {settings.targetFocusHours}h
              </span>
            )}
          </div>

          <p className="text-xs text-stone-400">
            Total Focus: <strong className="text-stone-100">{selectedHours} Hours</strong> ({selectedLog.completedSessions} blocks of 1.5h)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-1.5 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>{selectedLog.waterGlasses || 0} Glasses</span>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>{selectedLog.stretchesCompleted || 0} Micro-breaks</span>
          </div>
        </div>
      </div>

    </div>
  );
}
