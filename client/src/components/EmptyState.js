const EmptyState = ({ filter, onAdd }) => {
  const messages = {
    all:       { title: 'No tasks yet',       sub: 'Create your first task to get started.' },
    completed: { title: 'Nothing completed',  sub: 'Mark tasks as done and they\'ll show up here.' },
    pending:   { title: 'All caught up!',     sub: 'You have no pending tasks. Great work! 🎉' },
  };
  const { title, sub } = messages[filter] || messages.all;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-xs">{sub}</p>
      {filter === 'all' && (
        <button onClick={onAdd} className="btn-primary text-sm px-5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add your first task
        </button>
      )}
    </div>
  );
};

export default EmptyState;
