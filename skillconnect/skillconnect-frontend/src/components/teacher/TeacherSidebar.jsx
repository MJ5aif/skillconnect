import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBriefcase,
  FaClipboardList,
  FaDollarSign,
  FaCalendarAlt,
  FaUsers,
  FaCog,
  FaComments
} from 'react-icons/fa';

const TeacherSidebar = () => {
  const navItems = [
    { to: '/teach/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { to: '/teach/services', icon: FaBriefcase, label: 'My Services' },
    { to: '/teach/orders', icon: FaClipboardList, label: 'Order Management' },
    { to: '/teach/earnings', icon: FaDollarSign, label: 'Earnings' },
    { to: '/teach/availability', icon: FaCalendarAlt, label: 'Manage Availability' },
    { to: '/teach/batches', icon: FaUsers, label: 'Batch Management' },
    { to: '/messages', icon: FaComments, label: 'Messages' },
    { to: '/settings/profile', icon: FaCog, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-gray-300 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <div className="bg-gray-700/50 rounded-lg p-3 mb-6 text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Seller Control Center
          </h2>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

export default TeacherSidebar;
