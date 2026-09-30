import React, { useState } from 'react';
import { 
  Flame, Award, Clock, Target, Calendar as CalendarIcon, 
  TrendingUp, Droplets, HeartPulse, CheckCircle2, ChevronRight, BarChart2 
} from 'lucide-react';

export default function AnalyticsDashboard({
  history,
  todayStats,
  settings,
  onUpdateTargetHours
}) {
  const [chartPeriod, setChartPeriod] = useState(7); // 7 or 14 days
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  // Target calculations
  const targetMins = (settings.targetFocusHours || 4.5) * 60;
  const todayMins = todayStats.focusMinutes || 0;
  const todayHours = (todayMins / 60).toFixed(1);
  const targetPercent = Math.min(100, Math.round((todayMins / targetMins) * 100));

  // Compute Streak (consecutive days hitting target <= 100% or > 70%)
  const historyDates = Object.keys(history).sort().reverse();
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
      // If past day failed target, stop streak (except today if in progress)
      break;
    }
  }

  // Calculate Last N Days data for SVG chart
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

  // Find max hours for chart scale (min 6 hrs max scale)
  const maxChartHours = Math.max(6, ...pastDaysData.map(d => d.hours));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner: Daily Focus Target & Streak */}
      <div className="flocus-card p-6 lg:p-8 bg-gradient-to-r from-amber-500/10 via-stone-900/80 to-stone-900 border-amber-500/20 glow-cozy relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Daily Target Goal
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {streak} Day Streak
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {todayHours} <span className="text-slate-400 text-lg font-normal">/ {settings.targetFocusHours} hrs Focused Today</span>
            </h2>

            <p className="text-xs text-stone-400">
              {targetPercent >= 100 
                ? '🎉 Daily target accomplished! Great deep work rhythm.' 
                : `${(settings.targetFocusHours - todayHours).toFixed(1)} hours remaining to reach today's target.`}
            </p>
          </div>

          {/* Quick Target Modifier */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <span className="text-xs text-stone-400 font-medium">Adjust Daily Target:</span>
            <div className="flex items-center gap-1.5">
              {[3.0, 4.5, 6.0, 8.0].map((h) => (
                <button
                  key={h}
                  onClick={() => onUpdateTargetHours(h)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settings.targetFocusHours === h
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Target Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-semibold mb-1 text-stone-300">
            <span>Progress ({targetPercent}%)</span>
            <span>{todayMins}m / {targetMins}m</span>
          </div>
          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${targetPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="flocus-card p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Weekly Focus</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {(pastDaysData.reduce((acc, d) => acc + d.hours, 0)).toFixed(1)} <span className="text-xs text-stone-400 font-normal">hrs</span>
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Past {chartPeriod} days total</p>
        </div>

        <div className="flocus-card p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Blocks Completed</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {pastDaysData.reduce((acc, d) => acc + d.completedSessions, 0)} <span className="text-xs text-stone-400 font-normal">blocks</span>
          </p>
          <p className="text-[11px] text-stone-500 mt-1">1.5h sessions finished</p>
        </div>

        <div className="flocus-card p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Avg</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {(pastDaysData.reduce((acc, d) => acc + d.hours, 0) / chartPeriod).toFixed(1)} <span className="text-xs text-stone-400 font-normal">hrs/day</span>
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Average focus volume</p>
        </div>

        <div className="flocus-card p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Hydration Score</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.round(pastDaysData.reduce((acc, d) => acc + d.waterGlasses, 0) / chartPeriod)} <span className="text-xs text-stone-400 font-normal">glasses/day</span>
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Daily water average</p>
        </div>

      </div>

      {/* Visual Bar Chart: Focus Hours Analytics */}
      <div className="flocus-card p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-400" /> Focus Time Trends
            </h3>
            <p className="text-xs text-stone-400">Daily focus hours breakdown over time</p>
          </div>

          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setChartPeriod(7)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartPeriod === 7 ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartPeriod(14)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartPeriod === 14 ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              14 Days
            </button>
          </div>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="pt-4">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-stone-800 pb-2 relative">
            
            {/* Horizontal Target Line */}
            <div 
              className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500/40 z-10 flex items-center justify-end pr-2"
              style={{ bottom: `${(settings.targetFocusHours / maxChartHours) * 100}%` }}
            >
              <span className="text-[10px] font-bold text-amber-400 bg-stone-950/80 px-1.5 py-0.5 rounded border border-amber-500/30">
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
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-stone-950 border border-stone-700 text-stone-100 px-2 py-1 rounded text-[11px] font-bold whitespace-nowrap shadow-xl z-20 pointer-events-none">
                    {d.shortDate}: {d.hours}h ({d.completedSessions} blocks)
                  </div>

                  {/* Visual Bar */}
                  <div
                    className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 group-hover:brightness-125 relative ${
                      isToday
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400 glow-cozy'
                        : d.isTargetMet
                        ? 'bg-gradient-to-t from-amber-500/80 to-amber-400/90'
                        : 'bg-stone-800 hover:bg-stone-700 border-t border-stone-600'
                    }`}
                    style={{ height: `${Math.max(6, heightPercent)}%` }}
                  >
                    {d.isTargetMet && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px]">⭐</span>
                    )}
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <span className={`block text-[11px] font-semibold ${isToday ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
                      {d.dayName}
                    </span>
                    <span className="block text-[9px] text-stone-500">{d.shortDate}</span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Selected Day Details Panel */}
        {selectedDayDetail && (
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between text-xs animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                {selectedDayDetail.dayName}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{selectedDayDetail.date}</p>
                <p className="text-stone-400">
                  Focus: <strong>{selectedDayDetail.hours} hrs</strong> ({selectedDayDetail.completedSessions} blocks) • 💧 {selectedDayDetail.waterGlasses} Glasses
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDayDetail(null)}
              className="text-stone-400 hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700"
            >
              Close
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
