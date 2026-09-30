import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Droplets, HeartPulse, CheckCircle } from 'lucide-react';

export default function CalendarView({ history, settings }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const targetMins = (settings.targetFocusHours || 4.5) * 60;

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
    <div className="flocus-card p-6 lg:p-8 space-y-6 bg-white/95 animate-fade-in">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBE4D8] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#2C4639] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#D87A56]" /> Focus History Calendar
          </h2>
          <p className="text-xs text-[#7A8A80]">Click any date to inspect focus hours & health logs</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#4A3E31] border border-[#EADBCE] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm font-extrabold text-[#2C4639] min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#4A3E31] border border-[#EADBCE] transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-[#8A7B6E] uppercase tracking-wider">
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
        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
          <div key={`blank-${idx}`} className="h-14 sm:h-20 rounded-2xl bg-transparent"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const monthStr = String(month + 1).padStart(2, '0');
          const dayStr = String(dayNum).padStart(2, '0');
          const dateKey = `${year}-${monthStr}-${dayStr}`;

          const log = history[dateKey] || { focusMinutes: 0 };
          const hours = (log.focusMinutes / 60).toFixed(1);
          const isSelected = dateKey === selectedDateKey;
          const isToday = dateKey === new Date().toISOString().split('T')[0];

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
                  ? 'ring-2 ring-[#D87A56] border-[#D87A56] shadow-md scale-105 z-10'
                  : isToday
                  ? 'border-[#D87A56]'
                  : 'border-transparent hover:border-[#D5C9BB]'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className={`text-xs font-extrabold ${isToday ? 'text-[#D87A56]' : ''}`}>
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
                <span className="text-[9px] opacity-40 self-end mt-auto">-</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspector */}
      <div className="mt-6 p-5 rounded-2xl bg-[#FAF5EE] border border-[#EADBCE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-[#2C4639]">Focus Summary for {selectedDateKey}</span>
            {isSelectedTargetMet ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#8FA88B] text-white text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Target Met!
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-white border border-[#EADBCE] text-[#7A6B5D] text-xs font-bold">
                Target: {settings.targetFocusHours}h
              </span>
            )}
          </div>

          <p className="text-xs text-[#7A6B5D]">
            Total Focus: <strong className="text-[#2C4639]">{selectedHours} Hours</strong> ({selectedLog.completedSessions} blocks of 1.5h)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#4A3E31]">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#EADBCE] font-bold">
            <Droplets className="w-4 h-4 text-[#68809A]" />
            <span>{selectedLog.waterGlasses || 0} Glasses</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#EADBCE] font-bold">
            <HeartPulse className="w-4 h-4 text-[#8FA88B]" />
            <span>{selectedLog.stretchesCompleted || 0} Health Breaks</span>
          </div>
        </div>
      </div>

    </div>
  );
}
