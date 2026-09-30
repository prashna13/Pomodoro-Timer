import React, { useState } from 'react';
import { 
  CheckSquare, Plus, Trash2, Clock, Tag, Play, CheckCircle2, 
  Calendar, AlertCircle, Filter, Edit3, X, ChevronRight, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';

export default function TodoList({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSetActiveTask,
  activeTaskId
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'today' | 'work' | 'personal' | 'completed'
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      priority,
      estimatedPomodoros: parseInt(estimatedPomodoros) || 1,
      completedPomodoros: 0,
      completed: false,
      dueDate,
      dueTime,
      notes,
      createdAt: new Date().toISOString()
    };

    onAddTask(newTask);

    // Reset Form
    setTitle('');
    setNotes('');
    setIsAdding(false);
    playSound('task_done');
  };

  const handleToggle = (id, currentStatus) => {
    onToggleTask(id);
    if (!currentStatus) {
      playSound('task_done');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    }
  };

  // Filter Tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'today') return task.dueDate === todayStr && !task.completed;
    if (filter === 'work') return task.category === 'Work' && !task.completed;
    if (filter === 'personal') return task.category === 'Personal' && !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl flex flex-col h-full">
      
      {/* Todo Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" /> Todo & Reminders
          </h2>
          <p className="text-xs text-slate-400">Organize tasks & map them to 1.5h work blocks</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Cancel' : 'Add Task'}</span>
        </button>
      </div>

      {/* Add Task Form Modal/Inline */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="bg-slate-950/80 border border-slate-700/80 rounded-2xl p-4 mb-6 space-y-3 animate-fade-in">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design app architecture (90m block)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Work">💻 Work</option>
                <option value="Personal">🏠 Personal</option>
                <option value="Health">🧘 Health</option>
                <option value="Study">📚 Study</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Est. Work Blocks (1.5h)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Reminder Time (Optional)</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-md"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-slate-800 text-xs font-medium">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'today', label: '📆 Due Today' },
          { id: 'work', label: '💻 Work' },
          { id: 'personal', label: '🏠 Personal' },
          { id: 'completed', label: `✅ Done (${completedCount})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-slate-800 text-indigo-300 border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Cards List */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
            <CheckSquare className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium text-slate-400">No tasks in this view</p>
            <p className="text-xs text-slate-500 mt-1">Add a task above to schedule your 1.5h deep work sessions!</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isActive = activeTaskId === task.id;
            const priorityColors = {
              high: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
              medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              low: 'bg-sky-500/10 text-sky-400 border-sky-500/30'
            };

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : isActive
                    ? 'bg-indigo-950/30 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                {/* Left side: Checkbox & Text */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-600 hover:border-indigo-400 bg-slate-900'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold truncate ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}>
                        {task.title}
                      </span>

                      {/* Category Badge */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-medium border border-slate-700">
                        {task.category}
                      </span>

                      {/* Priority Tag */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Meta info: Pomodoros & Due date */}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        🍅 {task.completedPomodoros}/{task.estimatedPomodoros} blocks
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {task.dueDate} {task.dueTime && `@ ${task.dueTime}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Action Controls */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!task.completed && (
                    <button
                      onClick={() => onSetActiveTask(isActive ? null : task.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-500 text-white shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                      title={isActive ? 'Active focusing task' : 'Set as active timer task'}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isActive ? 'Active' : 'Focus This'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
