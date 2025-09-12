import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  UserIcon,
  AcademicCapIcon,
  SparklesIcon,
  UserGroupIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully! 👋');
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
      color: 'dashboard'
    },
    { 
      path: '/communities', 
      label: 'Communities', 
      icon: UserGroupIcon,
      solidIcon: UserGroupSolid,
      description: 'Join & create',
      emoji: '👥',
      color: 'communities'
    },
    { 
      path: '/academics', 
      label: 'Academics', 
      icon: AcademicCapIcon,
      solidIcon: AcademicCapSolid,
      description: 'Study zone',
      emoji: '📚',
      color: 'academic'
    },
    { 
      path: '/chillout', 
      label: 'Chillout', 
      icon: SparklesIcon,
      solidIcon: SparklesSolid,
      description: 'Fun zone',
      emoji: '🎉',
      color: 'chillout'
    }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const getNavItemClasses = (item, isItemActive) => {
    const baseClasses = "group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300";
    
    if (isItemActive) {
      switch (item.color) {
        case 'dashboard':
          return `${baseClasses} dashboard-primary text-white shadow-lg transform hover:-translate-y-0.5`;
        case 'communities':
          return `${baseClasses} communities-primary text-white shadow-lg transform hover:-translate-y-0.5`;
        case 'academic':
          return `${baseClasses} academic-primary text-white shadow-lg transform hover:-translate-y-0.5`;
        case 'chillout':
          return `${baseClasses} chillout-primary text-white shadow-lg transform hover:-translate-y-0.5`;
        default:
          return `${baseClasses} bg-gray-800 text-white shadow-lg`;
      }
    }
    
    return `${baseClasses} text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
  };

  const getMobileNavItemClasses = (item, isItemActive) => {
    const baseClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300";
    
    if (isItemActive) {
      switch (item.color) {
        case 'dashboard':
          return `${baseClasses} dashboard-gradient text-white shadow-lg`;
        case 'communities':
          return `${baseClasses} communities-gradient text-white shadow-lg`;
        case 'academic':
          return `${baseClasses} academic-gradient text-white shadow-lg`;
        case 'chillout':
          return `${baseClasses} chillout-gradient text-white shadow-lg`;
        default:
          return `${baseClasses} bg-gray-800 text-white shadow-lg`;
      }
    }
    
    return `${baseClasses} text-gray-700 hover:bg-gray-100`;
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 dashboard-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    BH
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 auth-gradient rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">✨</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-gray-900">BatchHub</div>
                  <div className="text-xs text-gray-500 -mt-1">Connect & Learn</div>
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
                      className={getNavItemClasses(item, isItemActive)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      <span className="text-base">{item.emoji}</span>
                      
                      {isItemActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-90"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {user ? (
                /* User Menu */
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:shadow-md border border-gray-200"
                  >
                    <div className="relative">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 auth-gradient text-white flex items-center justify-center font-semibold text-sm rounded-lg shadow-md">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white">
                        {user.isEmailVerified ? (
                          <div className="w-full h-full status-success rounded-full"></div>
                        ) : (
                          <div className="w-full h-full status-warning rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-24">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user.role || 'Student'}
                      </div>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50">
                      
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {user.profilePicture ? (
                              <img 
                                src={user.profilePicture} 
                                alt={user.name} 
                                className="w-12 h-12 rounded-xl object-cover shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 auth-gradient text-white flex items-center justify-center font-bold text-lg rounded-xl shadow-md">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {user.email}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium dashboard-primary text-white capitalize">
                                {user.role || 'Student'}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                                user.isEmailVerified 
                                  ? 'status-success text-white' 
                                  : 'status-warning text-white'
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
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="p-2 auth-light rounded-lg">
                            <UserIcon className="w-4 h-4 auth-text-dark" />
                          </div>
                          <div>
                            <div className="font-medium">Profile Settings</div>
                            <div className="text-xs text-gray-500">Manage your account</div>
                          </div>
                        </Link>

                        <Link 
                          to="/settings" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="p-2 communities-secondary rounded-lg">
                            <Cog6ToothIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">Settings</div>
                            <div className="text-xs text-gray-500">Preferences & privacy</div>
                          </div>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button 
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-3 px-4 py-3 text-sm status-text-error hover:bg-red-50 transition-colors duration-200 w-full"
                        >
                          <div className="p-2 bg-red-100 rounded-lg">
                            <ArrowRightOnRectangleIcon className="w-4 h-4 status-text-error" />
                          </div>
                          <div>
                            <div className="font-medium">Sign out</div>
                            <div className="text-xs status-text-error">Sign out of your account</div>
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
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 auth-gradient text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              {token && (
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
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
          <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = isActive(item.path) ? item.solidIcon : item.icon;
                const isItemActive = isActive(item.path);
                
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={getMobileNavItemClasses(item, isItemActive)}
                  >
                    <div className={`p-2 rounded-lg ${
                      isItemActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-100'
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
                          ? 'text-white/80' 
                          : 'text-gray-500'
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