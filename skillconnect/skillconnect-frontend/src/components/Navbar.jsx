import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiSearch, FiChevronDown, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { name: 'Browse Courses', to: '/browse' },
  { name: 'Find Mentors', to: '/mentors' },
  { name: 'About Us', to: '/about' },
  { name: 'Help Center', to: '/help' },
];

function Navbar() {
  const [query, setQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getDashboardLink = () => {
    if (userRole === 'teacher') return '/teach/dashboard';
    if (userRole === 'learner') return '/learn/dashboard';
    return '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-3 py-1.5 rounded-lg">
            Skill
          </div>
          <span className="text-gray-900">Connect</span>
        </Link>

        {/* Search Bar & Navigation */}
        <div className="hidden flex-1 items-center gap-4 md:flex">
          <div className="relative w-full max-w-md">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What do you want to learn?"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-all duration-300 hover:text-blue-600 ${isActive ? 'text-blue-600 font-semibold' : ''}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center gap-3">
          {!currentUser ? (
            // Not logged in - Show Sign In & Sign Up
            <>
              <Link
                to="/signin"
                className="hidden md:inline-block rounded-lg border-2 border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:scale-105"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-teal-600 hover:shadow-lg hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          ) : (
            // Logged in - Show User Menu
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 transition-all duration-300 hover:border-blue-500 hover:shadow-md"
              >
                <img
                  src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&size=32&background=0D8ABC&color=fff`}
                  alt={currentUser.displayName}
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:inline text-sm font-semibold text-gray-700">
                  {currentUser.displayName || 'User'}
                </span>
                <FiChevronDown className={`text-gray-500 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{currentUser.displayName}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                    <p className="text-xs font-medium text-blue-600 mt-1 capitalize">{userRole}</p>
                  </div>
                  
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  >
                    <FiUser className="text-lg" />
                    <span>My Dashboard</span>
                  </Link>
                  
                  <Link
                    to="/settings/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  >
                    <FiSettings className="text-lg" />
                    <span>Settings</span>
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-300"
                    >
                      <FiLogOut className="text-lg" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Search & Nav */}
      <div className="flex flex-col gap-3 px-4 pb-4 md:hidden">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What do you want to learn?"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        
        {!currentUser && (
          <div className="flex items-center gap-2">
            <Link
              to="/signin"
              className="flex-1 text-center rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="flex-1 text-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-teal-600"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
