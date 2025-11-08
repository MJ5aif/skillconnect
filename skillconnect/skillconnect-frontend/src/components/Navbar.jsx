import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const navLinks = [
  { name: 'Browse Courses', to: '/browse' },
  { name: 'Find Mentors', to: '/mentors' },
];

function Navbar() {
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-brand-blue">
          <span className="inline-block rounded bg-brand-blue/10 px-2 py-1 text-sm font-semibold text-brand-blue">Skill</span>
          <span className="inline-block text-gray-900">Connect</span>
        </Link>

        <div className="hidden flex-1 items-center gap-4 md:flex">
          <div className="relative w-full max-w-md">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What do you want to learn?"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition hover:text-brand-blue ${isActive ? 'text-brand-blue' : ''}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/signin"
            className="hidden rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-blue hover:text-brand-blue md:inline-block"
          >
            Sign In
          </Link>
          <Link
            to="/teach"
            className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600"
          >
            Start Teaching
          </Link>
        </div>
      </nav>

      {/* Compact layout for mobile */}
      <div className="flex flex-col gap-3 px-4 pb-4 md:hidden">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What do you want to learn?"
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
        <div className="flex items-center justify-between text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition hover:text-brand-blue ${isActive ? 'text-brand-blue' : ''}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/signin"
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-brand-blue hover:text-brand-blue"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
