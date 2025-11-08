import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineClipboardList,
  HiOutlineCash,
  HiOutlineCalendar,
  HiOutlineChat,
} from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', to: '/dashboard/teach', icon: HiOutlineViewGrid },
  { label: 'My Services', to: '/dashboard/teach/services', icon: HiOutlineCollection },
  { label: 'Order Management', to: '/dashboard/teach/orders', icon: HiOutlineClipboardList },
  { label: 'Earnings', to: '/dashboard/teach/earnings', icon: HiOutlineCash },
  { label: 'My Schedule', to: '/dashboard/teach/schedule', icon: HiOutlineCalendar },
  { label: 'Messages', to: '/messages', icon: HiOutlineChat },
];

function TeacherSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 bg-gray-900 px-6 py-10 text-white lg:block">
      <div className="sticky top-24">
        <div className="rounded-2xl bg-gray-800/80 p-4 text-sm uppercase tracking-wide text-gray-400">
          Seller Control Center
        </div>
        <nav className="mt-6 space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-inner'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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

export default TeacherSidebar;
