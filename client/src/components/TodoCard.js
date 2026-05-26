import { useState } from 'react';

const priorityConfig = {
  high:   { label: 'High',   bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500' },
  medium: { label: 'Medium', bg: 'bg-amber-50',  text: 'text-amber-600',  dot: 'bg-amber-500' },
  low:    { label: 'Low',    bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-500' },
};

const TodoCard = ({ todo, onToggle, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const p = priorityConfig[todo.priority] || priorityConfig.medium;
  const date = new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(todo._id);
    setDeleting(false);
  };

  return (
    <div
      className={`card p-4 flex gap-3 group transition-all duration-200 hover:shadow-md animate-slide-up ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo._id, !todo.completed)}
        className="mt-0.5 flex-shrink-0"
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-sm font-medium leading-snug ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {todo.title}
          </h3>
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => onEdit(todo)}
              className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
              aria-label="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Delete"
            >
              {deleting ? (
                <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {todo.description && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{todo.description}</p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className={`badge ${p.bg} ${p.text} gap-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
            {p.label}
          </span>
          <span className="text-xs text-gray-400">{date}</span>
          {todo.completed && (
            <span className="badge bg-green-50 text-green-600">Done</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
