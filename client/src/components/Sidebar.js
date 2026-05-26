import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/dashboard',
    label: 'All Tasks',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

const Sidebar = ({ isOpen, onClose, stats }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 md:translate-x-0 md:static md:h-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Nav links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Stats */}
          {stats && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Overview</p>
              <div className="space-y-2.5">
                <StatRow label="Total" value={stats.total} color="text-gray-700" />
                <StatRow label="Pending" value={stats.pending} color="text-amber-600" dot="bg-amber-500" />
                <StatRow label="Completed" value={stats.completed} color="text-green-600" dot="bg-green-500" />
              </div>
              {stats.total > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const StatRow = ({ label, value, color, dot }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className={`text-sm font-semibold ${color}`}>{value}</span>
  </div>
);

export default Sidebar;
