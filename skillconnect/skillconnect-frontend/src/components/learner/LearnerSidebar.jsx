import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineSearch,
  HiOutlineChat,
  HiOutlinePlay,
} from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', to: '/dashboard/learn', icon: HiOutlineHome },
  { label: 'My Learning', to: '/dashboard/learn/courses', icon: HiOutlineBookOpen },
  { label: 'Classroom', to: '/dashboard/learn/classroom', icon: HiOutlinePlay },
  { label: 'My Schedule', to: '/dashboard/learn/schedule', icon: HiOutlineCalendar },
  { label: 'Browse', to: '/browse', icon: HiOutlineSearch },
  { label: 'Messages', to: '/messages', icon: HiOutlineChat },
];

function LearnerSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 bg-white px-6 py-10 shadow-lg lg:block">
      <div className="sticky top-24">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Navigation</p>
        <nav className="mt-6 space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-blue/10 text-brand-blue shadow-inner'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default LearnerSidebar;
