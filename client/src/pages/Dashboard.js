import { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TodoCard from '../components/TodoCard';
import TodoModal from '../components/TodoModal';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await todoService.getAll({ filter, search });
      setTodos(res.data.todos);
      setStats(res.data.stats);
    } catch {
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchTodos, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchTodos, search]);

  const handleCreate = async (data) => {
    setModalLoading(true);
    try {
      const res = await todoService.create(data);
      setTodos(prev => [res.data.todo, ...prev]);
      setStats(s => ({ ...s, total: s.total + 1, pending: s.pending + 1 }));
      toast.success('Task created!');
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setModalLoading(true);
    try {
      const res = await todoService.update(editTodo._id, data);
      setTodos(prev => prev.map(t => t._id === editTodo._id ? res.data.todo : t));
      toast.success('Task updated!');
      setEditTodo(null);
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggle = async (id, completed) => {
    const prev = todos.find(t => t._id === id);
    setTodos(t => t.map(todo => todo._id === id ? { ...todo, completed } : todo));
    setStats(s => ({
      ...s,
      completed: completed ? s.completed + 1 : s.completed - 1,
      pending: completed ? s.pending - 1 : s.pending + 1,
    }));
    try {
      await todoService.toggle(id, completed);
      toast.success(completed ? 'Marked complete ✓' : 'Marked pending');
    } catch {
      setTodos(t => t.map(todo => todo._id === id ? prev : todo));
      setStats(s => ({
        ...s,
        completed: completed ? s.completed - 1 : s.completed + 1,
        pending: completed ? s.pending + 1 : s.pending - 1,
      }));
      toast.error('Failed to update task.');
    }
  };

  const handleDelete = async (id) => {
    const deleted = todos.find(t => t._id === id);
    setTodos(prev => prev.filter(t => t._id !== id));
    setStats(s => ({
      ...s,
      total: s.total - 1,
      completed: deleted.completed ? s.completed - 1 : s.completed,
      pending: !deleted.completed ? s.pending - 1 : s.pending,
    }));
    try {
      await todoService.delete(id);
      toast.success('Task deleted.');
    } catch {
      setTodos(prev => [...prev, deleted]);
      toast.error('Failed to delete task.');
    }
  };

  const openEdit = (todo) => { setEditTodo(todo); setModalOpen(true); };
  const openCreate = () => { setEditTodo(null); setModalOpen(true); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} stats={stats} />

        <main className="flex-1 p-4 md:p-6 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {greeting()}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {stats.pending === 0
                ? 'All tasks completed!'
                : `You have ${stats.pending} pending task${stats.pending !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total', value: stats.total, color: 'text-gray-700', bg: 'bg-gray-100' },
              { label: 'Pending', value: stats.pending, color: 'text-amber-700', bg: 'bg-amber-50' },
              { label: 'Done', value: stats.completed, color: 'text-green-700', bg: 'bg-green-50' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="input-field pl-9"
                placeholder="Search tasks…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button onClick={openCreate} className="btn-primary sm:w-auto whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter === f.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Todo list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : todos.length === 0 ? (
            <EmptyState filter={filter} onAdd={openCreate} />
          ) : (
            <div className="space-y-2">
              {todos.map(todo => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <TodoModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTodo(null); }}
        onSubmit={editTodo ? handleUpdate : handleCreate}
        editTodo={editTodo}
        loading={modalLoading}
      />
    </div>
  );
};

export default Dashboard;
