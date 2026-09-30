import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PomodoroTimer from './components/PomodoroTimer';
import WellnessReminder from './components/WellnessReminder';
import TodoList from './components/TodoList';
import SettingsModal from './components/SettingsModal';
import { playSound } from './utils/audio';
import confetti from 'canvas-confetti';

import {
  loadStoredTasks,
  saveStoredTasks,
  loadStoredSettings,
  saveStoredSettings,
  loadStoredStats,
  saveStoredStats
} from './utils/storage';

export default function App() {
  // App Persistent State
  const [tasks, setTasks] = useState(loadStoredTasks);
  const [settings, setSettings] = useState(loadStoredSettings);
  const [stats, setStats] = useState(loadStoredStats);

  // Timer State
  const [mode, setMode] = useState('work'); // 'work' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [totalDuration, setTotalDuration] = useState(settings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  // 40-Min Micro-Break Health Counter (in seconds)
  const [wellnessTimeLeft, setWellnessTimeLeft] = useState(settings.wellnessIntervalMinutes * 60);
  const [isWellnessModalOpen, setIsWellnessModalOpen] = useState(false);

  // Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save changes to local storage when state updates
  useEffect(() => { saveStoredTasks(tasks); }, [tasks]);
  useEffect(() => { saveStoredSettings(settings); }, [settings]);
  useEffect(() => { saveStoredStats(stats); }, [stats]);

  // Request browser desktop notification permission
  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          setSettings(prev => ({ ...prev, notificationsEnabled: true }));
          new Notification('FocusFlow 1.5 Active', {
            body: 'Desktop notifications enabled for 90-min work blocks and 40-min wellness reminders!'
          });
        }
      });
    }
  };

  const sendDesktopNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted' && settings.notificationsEnabled) {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  // Main Timer Tick Interval
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);

        // Deduct 40-min micro break timer when working
        if (mode === 'work') {
          setWellnessTimeLeft((prev) => {
            if (prev <= 1) {
              // Trigger 40-min wellness alert!
              playSound('wellness_alert');
              sendDesktopNotification(
                '🧘 Micro-Break Time! (40 mins elapsed)',
                'Time to stretch your body, drink a glass of water, and look outside for 20 seconds!'
              );
              setIsWellnessModalOpen(true);
              return settings.wellnessIntervalMinutes * 60; // Reset countdown
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Session Completed!
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

      // Update today's stats
      setStats((prev) => ({
        ...prev,
        completedSessions: prev.completedSessions + 1,
        totalFocusMinutes: prev.totalFocusMinutes + workedMins
      }));

      // Update active task progress if set
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
        `Awesome job completing your ${workedMins}-minute session. Take a break!`
      );

      // Auto switch to break
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

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalDuration);
  };

  const handleSkipTimer = () => {
    if (mode === 'work') {
      switchMode('shortBreak', settings.shortBreakMinutes);
    } else {
      switchMode('work', settings.workMinutes);
    }
  };

  // Task Operations
  const handleAddTask = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Header
        stats={stats}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWellnessModal={() => setIsWellnessModalOpen(true)}
        wellnessTimeRemaining={wellnessTimeLeft}
        requestNotifications={requestNotifications}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Pomodoro Timer */}
        <div className="lg:col-span-7 space-y-6">
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
          />
        </div>

        {/* Right Column: Todo & Reminders List */}
        <div className="lg:col-span-5 h-full">
          <TodoList
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onSetActiveTask={(id) => setActiveTaskId(id)}
            activeTaskId={activeTaskId}
          />
        </div>

      </main>

      {/* 40-Minute Micro-Break Prompt Modal */}
      <WellnessReminder
        isOpen={isWellnessModalOpen}
        onClose={() => setIsWellnessModalOpen(false)}
        stats={stats}
        onUpdateStats={setStats}
        settings={settings}
      />

      {/* Preferences & Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          // If work minutes changed, update current timer if reset
          if (!isRunning && mode === 'work') {
            const newSecs = newSettings.workMinutes * 60;
            setTimeLeft(newSecs);
            setTotalDuration(newSecs);
          }
        }}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 mt-auto">
        FocusFlow 1.5h Deep Work & Wellness • Optimized for daily focus blocks & 40-min health reminders
      </footer>

    </div>
  );
}
