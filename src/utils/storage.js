const STORAGE_KEY_TASKS = 'flocus_tasks_v2';
const STORAGE_KEY_SETTINGS = 'flocus_settings_v2';
const STORAGE_KEY_HISTORY = 'flocus_history_v2';

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
  theme: 'cozy-dark' // 'cozy-dark' | 'zen-midnight' | 'serene-forest' | 'warm-sunset'
};

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

// Helper to generate seed history for the past 14 days so user can see dashboard & calendar insights immediately
function getInitialHistory() {
  const history = {};
  const today = new Date();

  // Seed sample realistic focus logs for the last 14 days
  const sampleData = [
    { daysAgo: 0, mins: 180, sessions: 2, water: 5, stretches: 3 },
    { daysAgo: 1, mins: 270, sessions: 3, water: 8, stretches: 5 },
    { daysAgo: 2, mins: 360, sessions: 4, water: 7, stretches: 6 },
    { daysAgo: 3, mins: 180, sessions: 2, water: 4, stretches: 2 },
    { daysAgo: 4, mins: 270, sessions: 3, water: 8, stretches: 4 },
    { daysAgo: 5, mins: 90,  sessions: 1, water: 3, stretches: 1 },
    { daysAgo: 6, mins: 315, sessions: 3, water: 6, stretches: 4 },
    { daysAgo: 7, mins: 270, sessions: 3, water: 8, stretches: 5 },
    { daysAgo: 8, mins: 225, sessions: 2, water: 5, stretches: 3 },
    { daysAgo: 9, mins: 360, sessions: 4, water: 8, stretches: 6 },
    { daysAgo: 10, mins: 180, sessions: 2, water: 4, stretches: 2 },
    { daysAgo: 11, mins: 270, sessions: 3, water: 7, stretches: 4 },
    { daysAgo: 12, mins: 0,   sessions: 0, water: 2, stretches: 0 },
    { daysAgo: 13, mins: 270, sessions: 3, water: 8, stretches: 5 }
  ];

  sampleData.forEach(({ daysAgo, mins, sessions, water, stretches }) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const dateStr = d.toISOString().split('T')[0];
    history[dateStr] = {
      date: dateStr,
      focusMinutes: mins,
      completedSessions: sessions,
      waterGlasses: water,
      stretchesCompleted: stretches,
      targetMinutes: 270 // 4.5h
    };
  });

  return history;
}

export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Complete 1.5hr Deep Work block on core module',
    category: 'Work',
    estimatedPomodoros: 2,
    completedPomodoros: 1,
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
