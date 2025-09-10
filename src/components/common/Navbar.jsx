import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  UserIcon,
  AcademicCapIcon,
  SparklesIcon,
  UserGroupIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import {
  AcademicCapIcon as AcademicCapSolid,
  SparklesIcon as SparklesSolid,
  Squares2X2Icon as Squares2X2Solid,
  UserGroupIcon as UserGroupSolid
} from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully! 👋');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    toast.success(`Switched to ${newTheme} mode! ${newTheme === 'dark' ? '🌙' : '☀️'}`);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: Squares2X2Icon,
      solidIcon: Squares2X2Solid,
      description: 'Your main hub',
      emoji: '🏠',
      color: 'blue'
    },
    { 
      path: '/communities', 
      label: 'Communities', 
      icon: UserGroupIcon,
      solidIcon: UserGroupSolid,
      description: 'Join & create',
      emoji: '👥',
      color: 'green'
    },
    { 
      path: '/academics', 
      label: 'Academics', 
      icon: AcademicCapIcon,
      solidIcon: AcademicCapSolid,
      description: 'Study zone',
      emoji: '📚',
      color: 'indigo'
    },
    { 
      path: '/chillout', 
      label: 'Chillout', 
      icon: SparklesIcon,
      solidIcon: SparklesSolid,
      description: 'Fun zone',
      emoji: '🎉',
      color: 'purple'
    }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    BH
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">✨</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">BatchHub</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 -mt-1">Connect & Learn</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {token && (
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = isActive(item.path) ? item.solidIcon : item.icon;
                  const isItemActive = isActive(item.path);
                  
                  return (
                    <Link 
                      key={item.path}
                      to={item.path}
                      className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isItemActive
                          ? `bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-300 shadow-sm` 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isItemActive ? `text-${item.color}-600 dark:text-${item.color}-400` : ''}`} />
                      <span>{item.label}</span>
                      <span className="text-base">{item.emoji}</span>
                      
                      {isItemActive && (
                        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-${item.color}-500 rounded-full`}></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 hover:scale-105"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </button>

              {user ? (
                /* User Menu */
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="relative">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm rounded-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white dark:border-slate-800">
                        {user.isEmailVerified ? (
                          <div className="w-full h-full bg-green-500 rounded-full"></div>
                        ) : (
                          <div className="w-full h-full bg-amber-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-24">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {user.role || 'Student'}
                      </div>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50">
                      
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {user.profilePicture ? (
                              <img 
                                src={user.profilePicture} 
                                alt={user.name} 
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg rounded-xl">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {user.email}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                                {user.role || 'Student'}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                                user.isEmailVerified 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                              }`}>
                                {user.isEmailVerified ? '✓ Verified' : '⏳ Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link 
                          to="/profile" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150"
                        >
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium">Profile Settings</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Manage your account</div>
                          </div>
                        </Link>

                        <Link 
                          to="/settings" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150"
                        >
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Cog6ToothIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium">Settings</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Preferences & privacy</div>
                          </div>
                        </Link>
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                        <button 
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 w-full"
                        >
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <div className="font-medium">Sign out</div>
                            <div className="text-xs text-red-500 dark:text-red-400">Sign out of your account</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Actions */
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              {token && (
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="w-5 h-5" />
                  ) : (
                    <Bars3Icon className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {token && mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = isActive(item.path) ? item.solidIcon : item.icon;
                const isItemActive = isActive(item.path);
                
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isItemActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isItemActive 
                        ? 'bg-blue-200 dark:bg-blue-800/50' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-lg">{item.emoji}</span>
                      </div>
                      <div className={`text-xs ${
                        isItemActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;