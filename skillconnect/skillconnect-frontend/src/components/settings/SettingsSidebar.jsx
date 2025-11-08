import { NavLink } from 'react-router-dom';
import { FaUser, FaShieldAlt, FaBell } from 'react-icons/fa';

const SettingsSidebar = () => {
  const navItems = [
    { path: '/settings/profile', label: 'Profile', icon: FaUser },
    { path: '/settings/account', label: 'Account & Security', icon: FaShieldAlt },
    { path: '/settings/notifications', label: 'Notifications', icon: FaBell }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'font-semibold text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
