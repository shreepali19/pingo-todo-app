import { useState, useEffect } from 'react';

const TodoModal = ({ isOpen, onClose, onSubmit, editTodo, loading }) => {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTodo) {
      setForm({ title: editTodo.title, description: editTodo.description || '', priority: editTodo.priority || 'medium' });
    } else {
      setForm({ title: '', description: '', priority: 'medium' });
    }
    setErrors({});
  }, [editTodo, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 200) e.title = 'Max 200 characters';
    if (form.description.length > 1000) e.description = 'Max 1000 characters';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {editTodo ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input
              className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
              rows={3}
              placeholder="Add more details…"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                    form.priority === p
                      ? p === 'high' ? 'bg-red-50 border-red-400 text-red-700'
                        : p === 'medium' ? 'bg-amber-50 border-amber-400 text-amber-700'
                        : 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
              ) : (editTodo ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;
