import React from 'react';
import { 
  Timer, BarChart2, Calendar, CheckSquare, Bell, 
  Settings, HeartPulse 
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  stats,
  settings,
  onOpenSettings,
  onOpenWellnessModal,
  wellnessTimeRemaining,
  requestNotifications
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="sticky top-0 z-40 px-4 lg:px-10 py-4 backdrop-blur-md bg-[#FDFBF7]/80 border-b border-[#EBE4D8]/80 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Flocus Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#D8C3B0] bg-[#FAF5EE] flex items-center justify-center shadow-sm">
            <Timer className="w-5 h-5 text-[#2C4639]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#2C4639] tracking-tight">Flocus</h1>
            <p className="text-xs text-[#7A8A80] font-medium">Minimalist Deep Work & Health Companion</p>
          </div>
        </div>

        {/* Center Pill Navigation Bar */}
        <div className="flex items-center gap-1 bg-[#EFE7DC]/90 p-1.5 rounded-2xl border border-[#E0D5C5] shadow-inner">
          {[
            { id: 'timer', label: 'Timer', icon: Timer },
            { id: 'dashboard', label: 'Insights', icon: BarChart2 },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#68809A] text-white shadow-md font-bold'
                    : 'text-[#6A7B70] hover:text-[#2C4639] hover:bg-[#E4D9C9]/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-2.5">
          {/* Health Prompt Pill */}
          <button
            onClick={onOpenWellnessModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#98B89F]/30 hover:bg-[#98B89F]/40 border border-[#85A68C]/50 text-[#1C3626] text-xs font-bold transition-all cursor-pointer"
            title="40-min Micro Break Prompt"
          >
            <HeartPulse className="w-4 h-4 text-[#2C523A]" />
            <span>Health Prompt: <strong>{formatTime(wellnessTimeRemaining)}</strong></span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={requestNotifications}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              settings.notificationsEnabled
                ? 'bg-[#68809A]/20 border-[#68809A]/40 text-[#405870]'
                : 'bg-[#A8C5D6]/30 border-[#94B3C5]/50 text-[#304B5C] hover:bg-[#A8C5D6]/50'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#D8C5B4]/40 border border-[#C6B09E]/50 text-[#544336] hover:bg-[#D8C5B4]/60 transition-all cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
