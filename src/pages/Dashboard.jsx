import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  AcademicCapIcon, 
  SparklesIcon, 
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  TrophyIcon,
  HeartIcon,
  LightBulbIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CameraIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import {
  AcademicCapIcon as AcademicCapSolid,
  SparklesIcon as SparklesSolid,
  BookOpenIcon as BookOpenSolid,
  CalendarIcon as CalendarSolid,
  StarIcon as StarSolid
} from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [communities, setCommunities] = useState([]);
  const [stats, setStats] = useState({
    academicCommunities: 0,
    chilloutCommunities: 0,
    totalMembers: 0
  });
  const [loading, setLoading] = useState(true);

  // Inspirational quotes for rotation
  const quotes = [
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "The beautiful thing about learning is that nobody can take it away from you. - B.B. King",
    "Success is where preparation and opportunity meet. - Bobby Unser",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Learning never exhausts the mind. - Leonardo da Vinci"
  ];

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/api/communities/my-communities');
      setCommunities(data);
      
      const academic = data.filter(comm => comm.type === 'academic');
      const chillout = data.filter(comm => comm.type === 'chillout');
      const totalMembers = data.reduce((sum, comm) => sum + (comm.members?.length || 0), 0);
      
      setStats({
        academicCommunities: academic.length,
        chilloutCommunities: chillout.length,
        totalMembers
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <StarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 max-w-7xl">
        
        {/* Hero Welcome Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-8 py-4 border border-blue-200 dark:border-blue-800 shadow-lg mb-8">
            <StarSolid className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {getGreeting()}, {user?.name}!
            </h1>
            <div className="text-4xl">👋</div>
          </div>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Your unified platform for academics and fun activities with your batchmates
          </p>

          {/* Rotating Quote */}
          <div className="max-w-4xl mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3 justify-center">
              <LightBulbIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              <p className="text-sm sm:text-base italic text-slate-700 dark:text-slate-300 transition-all duration-500 text-center">
                "{quotes[currentQuote]}"
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-blue-100 dark:border-blue-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Communities</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{communities.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-green-100 dark:border-green-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Academic</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{stats.academicCommunities}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <AcademicCapSolid className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-purple-100 dark:border-purple-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Chillout</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{stats.chilloutCommunities}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <SparklesSolid className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-orange-100 dark:border-orange-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Role</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 capitalize">{user?.role || 'Student'}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                {user?.isEmailVerified ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Zone Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Academics Zone */}
          <Link to="/academics" className="group transform hover:scale-[1.02] transition-all duration-300">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 dark:border-blue-800">
              {/* Header */}
              <div className="relative p-8 pb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-100 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <AcademicCapSolid className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Academic Zone</h2>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">Professional Learning Hub</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      Your centralized platform for notes, resources, Q&A discussions, and collaborative learning.
                    </p>
                  </div>
                  <div className="text-4xl ml-4 group-hover:scale-110 transition-transform duration-300">📚</div>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <div className="grid gap-4 mb-6">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Study materials & notes repository</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Q&A discussions with peers & teachers</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <TrophyIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>Collaborative learning environment</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    "Knowledge shared is knowledge multiplied"
                  </p>
                </div>

                <div className="flex items-center justify-between bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                  <span className="font-semibold text-blue-800 dark:text-blue-200">Enter Study Zone</span>
                  <ArrowRightIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>

          {/* Chillout Zone */}
          <Link to="/chillout" className="group transform hover:scale-[1.02] transition-all duration-300">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100 dark:border-purple-800">
              {/* Header */}
              <div className="relative p-8 pb-6 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/30 border-b border-purple-100 dark:border-purple-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <SparklesSolid className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                          Chillout Zone
                        </h2>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">Fun & Social Hub</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      Plan events, manage expenses, share memories, and have amazing conversations with your batch!
                    </p>
                  </div>
                  <div className="text-4xl ml-4 group-hover:scale-110 transition-transform duration-300">🎉</div>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <div className="grid gap-4 mb-6">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>Plan trips, events & celebrations</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CurrencyDollarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Split bills & track expenses</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <HeartIcon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <span>Share memories & fun moments</span>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    "All work and no play makes Jack a dull boy"
                  </p>
                </div>

                <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 rounded-2xl p-4 group-hover:from-purple-200 group-hover:to-fuchsia-200 dark:group-hover:from-purple-900/50 dark:group-hover:to-fuchsia-900/50 transition-all duration-300">
                  <span className="font-semibold bg-gradient-to-r from-purple-700 to-fuchsia-700 dark:from-purple-200 dark:to-fuchsia-200 bg-clip-text text-transparent">
                    Enter Fun Zone
                  </span>
                  <ArrowRightIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <LightBulbIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              to="/communities" 
              className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 border border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Browse Communities</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
            </Link>

            <Link 
              to="/profile" 
              className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 border border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <UserGroupIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">View Profile</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" />
            </Link>

            <button 
              className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 border border-slate-200 dark:border-slate-600"
              onClick={() => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                toast.success(`Switched to ${newTheme} mode!`);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Toggle Theme</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Welcome Tips for New Users */}
        {communities.length === 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 dark:border-blue-800 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FireIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  Welcome to BatchHub! 
                  <span className="text-3xl">🚀</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Start your journey by joining or creating a community. Connect with your batchmates for both academic collaboration and fun activities. Share knowledge, plan events, and build lasting memories together!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/communities" 
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Join a Community
                  </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Academic zones for study materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>Chillout zones for fun activities</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Communities Preview */}
        {communities.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <UserGroupIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Your Communities</h3>
              </div>
              <Link 
                to="/communities" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center gap-1 transition-colors duration-200"
              >
                View all
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.slice(0, 6).map((community) => (
                <div key={community._id} className="group p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      community.type === 'academic' 
                        ? 'bg-blue-100 dark:bg-blue-900/30' 
                        : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {community.type === 'academic' ? (
                        <AcademicCapIcon className={`w-5 h-5 ${
                          community.type === 'academic' 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-purple-600 dark:text-purple-400'
                        }`} />
                      ) : (
                        <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{community.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{community.type} zone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{community.members?.length || 0} members</span>
                    </div>
                    <Link
                      to={community.type === 'academic' ? `/academics` : `/chillout`}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      Open →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;