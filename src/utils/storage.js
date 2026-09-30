const STORAGE_KEY_TASKS = 'flocus_tasks_v3';
const STORAGE_KEY_SETTINGS = 'flocus_settings_v3';
const STORAGE_KEY_HISTORY = 'flocus_history_v3';

export const DEFAULT_SETTINGS = {
  workMinutes: 90, // Default 1.5 hours
  shortBreakMinutes: 15,
  longBreakMinutes: 30,
  wellnessIntervalMinutes: 40, // Every 40 mins micro break
  targetFocusHours: 4.5, // 4.5 hours target per day (3 x 1.5h blocks)
  soundVolume: 0.5,
  soundEnabled: true,
  dailyWaterGoal: 8,
  notificationsEnabled: false,
};

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

// Clean fresh history state (0 focus hours, 0 streak, 0 stats)
function getInitialHistory() {
  return {};
}

export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Complete 1.5hr Deep Work block on core module',
    category: 'Work',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    completed: false,
    priority: 'high',
    dueDate: getTodayDateString(),
    dueTime: '11:00',
    notes: 'Focus without distractions in 90-min blocks.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Hydration & 40-min stretch breaks',
    category: 'Health',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    completed: false,
    priority: 'medium',
    dueDate: getTodayDateString(),
    dueTime: '',
    notes: 'Remember 20-20-20 rule for eye rest.',
    createdAt: new Date().toISOString()
  }
];

export function loadStoredTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!raw) return INITIAL_TASKS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (e) {}
}

export function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {}
}

export function loadStoredHistory() {
  try {
    // Clear old seeded v2 data if present to ensure 100% fresh start for user
    localStorage.removeItem('flocus_history_v2');
    localStorage.removeItem('flocus_tasks_v2');

    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return getInitialHistory();
    return JSON.parse(raw);
  } catch (e) {
    return getInitialHistory();
  }
}

export function saveStoredHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (e) {}
}

export function resetAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (e) {}
  return {};
}

export function getTodayStats(history, targetFocusHours) {
  const today = getTodayDateString();
  const targetMinutes = Math.round(targetFocusHours * 60);

  if (!history[today]) {
    return {
      date: today,
      focusMinutes: 0,
      completedSessions: 0,
      waterGlasses: 0,
      stretchesCompleted: 0,
      targetMinutes: targetMinutes
    };
  }

  return {
    ...history[today],
    targetMinutes: targetMinutes
  };
}

export function updateTodayStatsInHistory(history, updatedStats) {
  const today = getTodayDateString();
  const newHistory = {
    ...history,
    [today]: {
      ...updatedStats,
      date: today
    }
  };
  saveStoredHistory(newHistory);
  return newHistory;
}
