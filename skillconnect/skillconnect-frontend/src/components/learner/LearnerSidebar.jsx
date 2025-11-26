import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaCalendar, 
  FaSearch, 
  FaUsers, 
  FaComments,
  FaCog
} from 'react-icons/fa';

const LearnerSidebar = () => {
  const navItems = [
    { to: '/learn/dashboard', icon: FaHome, label: 'Dashboard' },
    { to: '/learn/my-learning', icon: FaBook, label: 'My Learning' },
    { to: '/learn/my-schedule', icon: FaCalendar, label: 'My Schedule' },
    { to: '/browse', icon: FaSearch, label: 'Browse Courses' },
    { to: '/community', icon: FaUsers, label: 'Community' },
    { to: '/messages', icon: FaComments, label: 'Messages' },
    { to: '/settings/profile', icon: FaCog, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Learning Hub</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default LearnerSidebar;
