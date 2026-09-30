const STORAGE_KEY_TASKS = 'deepflow_tasks_v1';
const STORAGE_KEY_STATS = 'deepflow_stats_v1';
const STORAGE_KEY_SETTINGS = 'deepflow_settings_v1';

export const DEFAULT_SETTINGS = {
  workMinutes: 90, // Default 1.5 hours requested by user!
  shortBreakMinutes: 15,
  longBreakMinutes: 30,
  wellnessIntervalMinutes: 40, // Every 40 mins micro break!
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundVolume: 0.5,
  soundEnabled: true,
  dailyWaterGoal: 8,
  notificationsEnabled: false,
};

export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Complete 1.5hr Deep Work session on core project',
    category: 'Work',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    completed: false,
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '11:00',
    notes: 'Focus without distractions.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Hydrate & 40-min stretch breaks',
    category: 'Health',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    completed: false,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
    notes: 'Remember to look 20ft outside every 40 mins!',
    createdAt: new Date().toISOString()
  }
];

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function loadStoredTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!raw) return INITIAL_TASKS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load tasks', e);
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
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
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadStoredStats() {
  const today = getTodayDateString();
  const defaultStats = {
    date: today,
    completedSessions: 0,
    totalFocusMinutes: 0,
    waterGlasses: 0,
    stretchesCompleted: 0,
    outdoorLookCount: 0
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    if (parsed.date !== today) {
      // Reset daily counts for a new day while preserving history if needed
      return defaultStats;
    }
    return parsed;
  } catch (e) {
    return defaultStats;
  }
}

export function saveStoredStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}
