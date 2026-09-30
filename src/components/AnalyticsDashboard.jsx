import React, { useState } from 'react';
import { 
  Flame, Award, Clock, Target, Calendar as CalendarIcon, 
  TrendingUp, Droplets, HeartPulse, BarChart2 
} from 'lucide-react';

export default function AnalyticsDashboard({
  history,
  todayStats,
  settings,
  onUpdateTargetHours
}) {
  const [chartPeriod, setChartPeriod] = useState(7);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  const targetMins = (settings.targetFocusHours || 4.5) * 60;
  const todayMins = todayStats.focusMinutes || 0;
  const todayHours = (todayMins / 60).toFixed(1);
  const targetPercent = Math.min(100, Math.round((todayMins / targetMins) * 100));

  // Streak calculation
  let streak = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const log = history[dateKey];
    
    if (log && log.focusMinutes >= (log.targetMinutes || 270) * 0.75) {
      streak++;
    } else if (dateKey !== todayStr) {
      break;
    }
  }

  const pastDaysData = [];
  const today = new Date();

  for (let i = chartPeriod - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const shortDate = `${d.getMonth() + 1}/${d.getDate()}`;
    const log = history[dateKey] || { focusMinutes: 0, completedSessions: 0, waterGlasses: 0 };
    const hours = (log.focusMinutes / 60).toFixed(1);

    pastDaysData.push({
      date: dateKey,
      dayName,
      shortDate,
      focusMinutes: log.focusMinutes,
      hours: parseFloat(hours),
      completedSessions: log.completedSessions,
      waterGlasses: log.waterGlasses,
      isTargetMet: log.focusMinutes >= targetMins
    });
  }

  const maxChartHours = Math.max(6, ...pastDaysData.map(d => d.hours));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner: Target Goal & Streak */}
      <div className="flocus-card p-6 lg:p-8 bg-white/95 border-[#EBE4D8] relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#F7ECE1] text-[#D87A56] border border-[#EADBCE] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Daily Target Goal
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-[#C99458] bg-[#FFF8EE] px-2.5 py-0.5 rounded-full border border-[#EADBCE]">
                <Flame className="w-3.5 h-3.5 fill-[#C99458]" /> {streak} Day Streak
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C4639] tracking-tight">
              {todayHours} <span className="text-[#8A7B6E] text-lg font-normal">/ {settings.targetFocusHours} hrs Focused Today</span>
            </h2>

            <p className="text-xs text-[#7A6B5D]">
              {targetPercent >= 100 
                ? '🎉 Daily target accomplished! Great deep work rhythm.' 
                : `${(settings.targetFocusHours - todayHours).toFixed(1)} hours remaining to reach today's target.`}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <span className="text-xs text-[#7A6B5D] font-bold">Adjust Daily Target:</span>
            <div className="flex items-center gap-1.5">
              {[3.0, 4.5, 6.0, 8.0].map((h) => (
                <button
                  key={h}
                  onClick={() => onUpdateTargetHours(h)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    settings.targetFocusHours === h
                      ? 'bg-[#D87A56] text-white shadow-sm'
                      : 'bg-[#FAF5EE] text-[#544336] hover:bg-[#F2E8DC] border border-[#EADBCE]'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-bold mb-1 text-[#4A3E31]">
            <span>Progress ({targetPercent}%)</span>
            <span>{todayMins}m / {targetMins}m</span>
          </div>
          <div className="w-full h-3 bg-[#FAF5EE] rounded-full overflow-hidden p-0.5 border border-[#EADBCE]">
            <div
              className="h-full bg-gradient-to-r from-[#D87A56] to-[#E8987E] rounded-full transition-all duration-700"
              style={{ width: `${targetPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="flocus-card p-5 bg-white/95">
          <div className="flex items-center justify-between text-[#8A7B6E] mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider">Weekly Focus</span>
            <Clock className="w-4 h-4 text-[#D87A56]" />
          </div>
          <p className="text-2xl font-extrabold text-[#2C4639]">
            {(pastDaysData.reduce((acc, d) => acc + d.hours, 0)).toFixed(1)} <span className="text-xs text-[#8A7B6E] font-normal">hrs</span>
          </p>
          <p className="text-[11px] text-[#A09284] mt-1">Past {chartPeriod} days total</p>
        </div>

        <div className="flocus-card p-5 bg-white/95">
          <div className="flex items-center justify-between text-[#8A7B6E] mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider">Blocks Done</span>
            <Award className="w-4 h-4 text-[#68809A]" />
          </div>
          <p className="text-2xl font-extrabold text-[#2C4639]">
            {pastDaysData.reduce((acc, d) => acc + d.completedSessions, 0)} <span className="text-xs text-[#8A7B6E] font-normal">blocks</span>
          </p>
          <p className="text-[11px] text-[#A09284] mt-1">1.5h sessions finished</p>
        </div>

        <div className="flocus-card p-5 bg-white/95">
          <div className="flex items-center justify-between text-[#8A7B6E] mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider">Daily Avg</span>
            <TrendingUp className="w-4 h-4 text-[#8FA88B]" />
          </div>
          <p className="text-2xl font-extrabold text-[#2C4639]">
            {(pastDaysData.reduce((acc, d) => acc + d.hours, 0) / chartPeriod).toFixed(1)} <span className="text-xs text-[#8A7B6E] font-normal">hrs/day</span>
          </p>
          <p className="text-[11px] text-[#A09284] mt-1">Average focus volume</p>
        </div>

        <div className="flocus-card p-5 bg-white/95">
          <div className="flex items-center justify-between text-[#8A7B6E] mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider">Hydration</span>
            <Droplets className="w-4 h-4 text-[#68809A]" />
          </div>
          <p className="text-2xl font-extrabold text-[#2C4639]">
            {Math.round(pastDaysData.reduce((acc, d) => acc + d.waterGlasses, 0) / chartPeriod)} <span className="text-xs text-[#8A7B6E] font-normal">glasses/day</span>
          </p>
          <p className="text-[11px] text-[#A09284] mt-1">Daily water average</p>
        </div>

      </div>

      {/* SVG Bar Chart Card */}
      <div className="flocus-card p-6 lg:p-8 space-y-6 bg-white/95">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#2C4639] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#D87A56]" /> Focus Time Trends
            </h3>
            <p className="text-xs text-[#7A8A80]">Daily focus hours breakdown over time</p>
          </div>

          <div className="flex items-center gap-1 bg-[#FAF5EE] p-1 rounded-xl border border-[#EADBCE]">
            <button
              onClick={() => setChartPeriod(7)}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                chartPeriod === 7 ? 'bg-[#D87A56] text-white' : 'text-[#6A5A4D] hover:text-[#2C4639]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartPeriod(14)}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                chartPeriod === 14 ? 'bg-[#D87A56] text-white' : 'text-[#6A5A4D] hover:text-[#2C4639]'
              }`}
            >
              14 Days
            </button>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="pt-4">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-[#EBE4D8] pb-2 relative">
            
            <div 
              className="absolute left-0 right-0 border-t-2 border-dashed border-[#D87A56]/40 z-10 flex items-center justify-end pr-2"
              style={{ bottom: `${(settings.targetFocusHours / maxChartHours) * 100}%` }}
            >
              <span className="text-[10px] font-extrabold text-[#D87A56] bg-[#FAF5EE] px-1.5 py-0.5 rounded border border-[#EADBCE]">
                Target: {settings.targetFocusHours}h
              </span>
            </div>

            {pastDaysData.map((d) => {
              const heightPercent = Math.min(100, (d.hours / maxChartHours) * 100);
              const isToday = d.date === todayStr;

              return (
                <div
                  key={d.date}
                  onClick={() => setSelectedDayDetail(d)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#2C4639] text-white px-2 py-1 rounded text-[11px] font-bold whitespace-nowrap shadow-xl z-20 pointer-events-none">
                    {d.shortDate}: {d.hours}h ({d.completedSessions} blocks)
                  </div>

                  <div
                    className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 group-hover:brightness-110 relative ${
                      isToday
                        ? 'bg-[#D87A56] shadow-sm'
                        : d.isTargetMet
                        ? 'bg-[#E8987E]'
                        : 'bg-[#E6DCCD]'
                    }`}
                    style={{ height: `${Math.max(6, heightPercent)}%` }}
                  >
                    {d.isTargetMet && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px]">⭐</span>
                    )}
                  </div>

                  <div className="mt-2 text-center">
                    <span className={`block text-[11px] font-bold ${isToday ? 'text-[#D87A56]' : 'text-[#7A6B5D]'}`}>
                      {d.dayName}
                    </span>
                    <span className="block text-[9px] text-[#A09284]">{d.shortDate}</span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>

    </div>
  );
}
