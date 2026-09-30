import React, { useState } from 'react';
import { 
  CheckSquare, Plus, Trash2, Play, CheckCircle2, 
  Calendar, X
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
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('high');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('');

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
      createdAt: new Date().toISOString()
    };

    onAddTask(newTask);
    setTitle('');
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

  const todayStr = new Date().toISOString().split('T')[0];
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'today') return task.dueDate === todayStr && !task.completed;
    if (filter === 'work') return task.category === 'Work' && !task.completed;
    if (filter === 'study') return task.category === 'Study' && !task.completed;
    if (filter === 'personal') return task.category === 'Personal' && !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const categoryBadgeColors = {
    Work: 'bg-[#2C4639]',
    Study: 'bg-[#68809A]',
    Personal: 'bg-[#D87A56]',
    Health: 'bg-[#8FA88B]'
  };

  return (
    <div className="flocus-card p-6 lg:p-8 relative overflow-hidden bg-white/95 shadow-xl flex flex-col h-full">
      
      {/* Decorative Tree / Floating Island Accent Bottom Right */}
      <div className="absolute bottom-1 right-2 pointer-events-none opacity-85 text-right">
        <span className="text-3xl block">🌳</span>
        <span className="text-xs text-[#8A7B6E] font-serif italic">Have a good day!</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-[#2C4639] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#D87A56]" /> Todo & Reminders
          </h2>
          <p className="text-xs text-[#7A8A80]">Organize tasks & map them to 1.5h work blocks</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-2xl bg-[#D87A56] hover:bg-[#C56845] text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#D87A56]/20 cursor-pointer transition-all shrink-0"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Cancel' : '+ Add Task'}</span>
        </button>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="bg-[#FAF5EE] border border-[#EADBCE] rounded-2xl p-4 mb-5 space-y-3 animate-fade-in">
          <div>
            <label className="block text-xs font-bold text-[#4A3E31] mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Study Operating Systems (90m block)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5C9BB] text-[#2C4639] placeholder-stone-400 text-sm focus:outline-none focus:border-[#D87A56]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#4A3E31] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5C9BB] text-[#2C4639] text-xs focus:outline-none"
              >
                <option value="Work">💻 Work</option>
                <option value="Study">📚 Study</option>
                <option value="Personal">🏠 Personal</option>
                <option value="Health">🧘 Health</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3E31] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5C9BB] text-[#2C4639] text-xs focus:outline-none"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3E31] mb-1">Est. 1.5h Blocks</label>
              <input
                type="number"
                min="1"
                max="10"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5C9BB] text-[#2C4639] text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#8A7B6E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#D87A56] text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs including Work, Study, Personal */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-[#EBE4D8] text-xs font-bold">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'today', label: 'Due Today' },
          { id: 'work', label: '💻 Work' },
          { id: 'study', label: '📚 Study' },
          { id: 'personal', label: '🏠 Personal' },
          { id: 'completed', label: '✅ Done' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-[#F7ECE1] text-[#D87A56] border border-[#EADBCE] font-extrabold shadow-xs'
                : 'text-[#7A8A80] hover:text-[#2C4639] hover:bg-[#F5EFE6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Item Cards */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1 relative z-10">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#E5DDD0] rounded-2xl bg-[#FAF5EE]/50">
            <p className="text-sm font-bold text-[#8A7B6E]">No tasks in this view</p>
            <p className="text-xs text-[#A09284] mt-1">Add a task above to schedule your 1.5h deep work sessions!</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isActive = activeTaskId === task.id;
            const badgeBg = categoryBadgeColors[task.category] || 'bg-[#2C4639]';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-[#F5EFE6]/60 border-[#E2D6C5] opacity-65'
                    : isActive
                    ? 'bg-[#F7ECE1] border-[#D87A56] shadow-md ring-1 ring-[#D87A56]/40'
                    : 'bg-white border-[#EBE4D8] shadow-xs hover:border-[#D5C9BB]'
                }`}
              >
                {/* Left side: Circle Indicator & Details */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      task.completed
                        ? 'bg-[#8FA88B] border-[#8FA88B] text-white'
                        : 'border-[#D5C9BB] bg-[#FAF5EE] hover:border-[#D87A56]'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-sm font-extrabold truncate ${
                        task.completed ? 'line-through text-stone-400' : 'text-[#2C4639]'
                      }`}>
                        {task.title}
                      </span>
                    </div>

                    {/* Category & Priority Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md ${badgeBg} text-white text-[10px] font-extrabold uppercase tracking-wider`}>
                        {task.category}
                      </span>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-white ${
                        task.priority === 'high' ? 'bg-[#D87A56]' : task.priority === 'medium' ? 'bg-[#C99458]' : 'bg-[#68809A]'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Blocks & Date info */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#7A6B5D] font-medium">
                      <span className="flex items-center gap-1">
                        🍅 {task.completedPomodoros}/{task.estimatedPomodoros} blocks
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#A09284]" />
                          {task.dueDate} {task.dueTime && `@ ${task.dueTime}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Focus This button */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!task.completed && (
                    <button
                      onClick={() => onSetActiveTask(isActive ? null : task.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#D87A56] text-white border-[#D87A56] shadow-sm'
                          : 'bg-white hover:bg-[#FAF5EE] text-[#4A3E31] border-[#D5C9BB]'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isActive ? 'Active' : 'Focus This'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
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
