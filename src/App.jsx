import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PomodoroTimer from './components/PomodoroTimer';
import WellnessReminder from './components/WellnessReminder';
import TodoList from './components/TodoList';
import SettingsModal from './components/SettingsModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CalendarView from './components/CalendarView';
import { playSound } from './utils/audio';
import confetti from 'canvas-confetti';

import {
  loadStoredTasks,
  saveStoredTasks,
  loadStoredSettings,
  saveStoredSettings,
  loadStoredHistory,
  saveStoredHistory,
  resetAllHistory,
  getTodayStats,
  updateTodayStatsInHistory
} from './utils/storage';

export default function App() {
  const [tasks, setTasks] = useState(loadStoredTasks);
  const [settings, setSettings] = useState(loadStoredSettings);
  const [history, setHistory] = useState(loadStoredHistory);
  const [activeTab, setActiveTab] = useState('timer');

  const todayStats = getTodayStats(history, settings.targetFocusHours);

  // Timer State
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [totalDuration, setTotalDuration] = useState(settings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  // 40-Min Health Counter
  const [wellnessTimeLeft, setWellnessTimeLeft] = useState(settings.wellnessIntervalMinutes * 60);
  const [isWellnessModalOpen, setIsWellnessModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => { saveStoredTasks(tasks); }, [tasks]);
  useEffect(() => { saveStoredSettings(settings); }, [settings]);
  useEffect(() => { saveStoredHistory(history); }, [history]);

  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          setSettings(prev => ({ ...prev, notificationsEnabled: true }));
          new Notification('Flocus Activated', {
            body: 'Desktop notifications enabled for 90-min work blocks and 40-min health prompts!'
          });
        }
      });
    }
  };

  const sendDesktopNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted' && settings.notificationsEnabled) {
      new Notification(title, { body });
    }
  };

  const handleUpdateTodayStats = (updater) => {
    const currentToday = getTodayStats(history, settings.targetFocusHours);
    const updated = typeof updater === 'function' ? updater(currentToday) : updater;
    const newHistory = updateTodayStatsInHistory(history, updated);
    setHistory(newHistory);
  };

  const handleResetAllInsights = () => {
    const cleanHistory = resetAllHistory();
    setHistory(cleanHistory);
  };

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);

        if (mode === 'work') {
          setWellnessTimeLeft((prev) => {
            if (prev <= 1) {
              playSound('wellness_alert');
              sendDesktopNotification(
                '🧘 Micro-Break Prompt (40 mins elapsed)',
                'Time to stretch your body, drink water, and look outside for 20s!'
              );
              setIsWellnessModalOpen(true);
              return settings.wellnessIntervalMinutes * 60;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleSessionCompleted();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, settings.wellnessIntervalMinutes]);

  const handleSessionCompleted = () => {
    setIsRunning(false);

    if (mode === 'work') {
      playSound('work_end');
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

      const workedMins = Math.round(totalDuration / 60);

      handleUpdateTodayStats((prev) => ({
        ...prev,
        completedSessions: (prev.completedSessions || 0) + 1,
        focusMinutes: (prev.focusMinutes || 0) + workedMins
      }));

      if (activeTaskId) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === activeTaskId
              ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
              : task
          )
        );
      }

      sendDesktopNotification(
        '🎉 Deep Work Block Completed!',
        `Fantastic job completing your ${workedMins}-minute session. Time to rest!`
      );

      switchMode('shortBreak', settings.shortBreakMinutes);
    } else {
      playSound('break_end');
      sendDesktopNotification(
        '☕ Break Finished!',
        'Ready for your next deep work block?'
      );
      switchMode('work', settings.workMinutes);
    }
  };

  const switchMode = (newMode, minutes) => {
    setMode(newMode);
    const durationSecs = minutes * 60;
    setTimeLeft(durationSecs);
    setTotalDuration(durationSecs);
    setIsRunning(false);
  };

  const handleToggleTimer = () => setIsRunning(!isRunning);
  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalDuration);
  };
  const handleSkipTimer = () => {
    if (mode === 'work') switchMode('shortBreak', settings.shortBreakMinutes);
    else switchMode('work', settings.workMinutes);
  };

  const handleAddTask = (newTask) => setTasks([newTask, ...tasks]);
  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500">
      
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={todayStats}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWellnessModal={() => setIsWellnessModalOpen(true)}
        wellnessTimeRemaining={wellnessTimeLeft}
        requestNotifications={requestNotifications}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {activeTab === 'timer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <PomodoroTimer
                mode={mode}
                setMode={(m, mins) => switchMode(m, mins)}
                timeLeft={timeLeft}
                totalDuration={totalDuration}
                isRunning={isRunning}
                onToggleTimer={handleToggleTimer}
                onResetTimer={handleResetTimer}
                onSkipTimer={handleSkipTimer}
                activeTask={activeTask}
                settings={settings}
                onCompleteCurrentTask={(id) => handleToggleTask(id, false)}
                todayStats={todayStats}
              />
            </div>

            <div className="lg:col-span-5">
              <TodoList
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onSetActiveTask={(id) => setActiveTaskId(id)}
                activeTaskId={activeTaskId}
              />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <AnalyticsDashboard
            history={history}
            todayStats={todayStats}
            settings={settings}
            onUpdateTargetHours={(targetFocusHours) => setSettings({ ...settings, targetFocusHours })}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            history={history}
            settings={settings}
          />
        )}

        {activeTab === 'tasks' && (
          <div className="max-w-4xl mx-auto">
            <TodoList
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onSetActiveTask={(id) => setActiveTaskId(id)}
              activeTaskId={activeTaskId}
            />
          </div>
        )}

      </main>

      <WellnessReminder
        isOpen={isWellnessModalOpen}
        onClose={() => setIsWellnessModalOpen(false)}
        stats={todayStats}
        onUpdateStats={(newTodayStats) => handleUpdateTodayStats(newTodayStats)}
        settings={settings}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          if (!isRunning && mode === 'work') {
            const newSecs = newSettings.workMinutes * 60;
            setTimeLeft(newSecs);
            setTotalDuration(newSecs);
          }
        }}
        onResetInsights={handleResetAllInsights}
      />

      <footer className="py-4 text-center text-xs text-stone-500 border-t border-[#EBE4D8] mt-auto">
        Flocus • Minimalist 1.5h Deep Work Timer, Analytics & Health Prompts
      </footer>

    </div>
  );
}
