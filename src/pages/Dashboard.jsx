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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-4 dashboard-border rounded-full animate-spin"></div>
            <StarIcon className="w-6 h-6 dashboard-text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 max-w-7xl">
        
        {/* Hero Welcome Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-4 bg-white backdrop-blur-md rounded-full px-8 py-4 border border-gray-200 shadow-lg mb-8">
            <StarSolid className="w-10 h-10 dashboard-text-primary" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold dashboard-gradient bg-clip-text text-transparent">
              {getGreeting()}, {user?.name}!
            </h1>
            <div className="text-4xl">👋</div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Your unified platform for academics and fun activities with your batchmates
          </p>

          {/* Rotating Quote */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 justify-center">
              <LightBulbIcon className="w-6 h-6 status-text-warning" />
              <p className="text-sm sm:text-base italic text-gray-700 transition-all duration-500 text-center animate-fade-in">
                "{quotes[currentQuote]}"
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Communities</p>
                <p className="text-3xl font-bold text-gray-800">{communities.length}</p>
              </div>
              <div className="p-3 communities-light rounded-xl">
                <UserGroupIcon className="w-6 h-6 communities-text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Academic</p>
                <p className="text-3xl font-bold text-gray-800">{stats.academicCommunities}</p>
              </div>
              <div className="p-3 academic-light rounded-xl">
                <AcademicCapSolid className="w-6 h-6 academic-text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Chillout</p>
                <p className="text-3xl font-bold text-gray-800">{stats.chilloutCommunities}</p>
              </div>
              <div className="p-3 chillout-light rounded-xl">
                <SparklesSolid className="w-6 h-6 chillout-text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="text-2xl font-bold text-gray-800 capitalize">{user?.role || 'Student'}</p>
              </div>
              <div className="p-3 auth-light rounded-xl">
                {user?.isEmailVerified ? (
                  <CheckCircleIcon className="w-6 h-6 status-text-success" />
                ) : (
                  <ExclamationTriangleIcon className="w-6 h-6 status-text-warning" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Zone Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Academics Zone */}
          <Link to="/academics" className="group transform hover:scale-[1.02] transition-all duration-300">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200">
              {/* Header */}
              <div className="relative p-8 pb-6 academic-light border-b academic-border-light">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-white rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <AcademicCapSolid className="w-8 h-8 academic-text-primary" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800">Academic Zone</h2>
                        <p className="academic-text-primary font-medium">Professional Learning Hub</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Your centralized platform for notes, resources, Q&A discussions, and collaborative learning.
                    </p>
                  </div>
                  <div className="text-4xl ml-4 group-hover:scale-110 transition-transform duration-300">📚</div>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <div className="grid gap-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 status-success rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-white" />
                    </div>
                    <span>Study materials & notes repository</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 academic-secondary rounded-lg">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                    </div>
                    <span>Q&A discussions with peers & teachers</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 communities-secondary rounded-lg">
                      <TrophyIcon className="w-5 h-5 text-white" />
                    </div>
                    <span>Collaborative learning environment</span>
                  </div>
                </div>

                <div className="academic-light rounded-xl p-4 mb-6 text-center">
                  <p className="text-sm text-gray-600 italic">
                    "Knowledge shared is knowledge multiplied"
                  </p>
                </div>

                <div className="flex items-center justify-between academic-light rounded-2xl p-4 group-hover:bg-blue-100 transition-colors duration-300">
                  <span className="font-semibold academic-text-dark">Enter Study Zone</span>
                  <ArrowRightIcon className="w-5 h-5 academic-text-primary group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>

          {/* Chillout Zone */}
          <Link to="/chillout" className="group transform hover:scale-[1.02] transition-all duration-300">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200">
              {/* Header */}
              <div className="relative p-8 pb-6 chillout-light border-b chillout-border-light">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-white rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <SparklesSolid className="w-8 h-8 chillout-text-primary" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold chillout-gradient bg-clip-text text-transparent">
                          Chillout Zone
                        </h2>
                        <p className="chillout-text-primary font-medium">Fun & Social Hub</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Plan events, manage expenses, share memories, and have amazing conversations with your batch!
                    </p>
                  </div>
                  <div className="text-4xl ml-4 group-hover:scale-110 transition-transform duration-300">🎉</div>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <div className="grid gap-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 chillout-secondary rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <span>Plan trips, events & celebrations</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 status-success rounded-lg">
                      <CurrencyDollarIcon className="w-5 h-5 text-white" />
                    </div>
                    <span>Split bills & track expenses</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-pink-500 rounded-lg">
                      <HeartIcon className="w-5 h-5 text-white" />
                    </div>
                    <span>Share memories & fun moments</span>
                  </div>
                </div>

                <div className="chillout-light rounded-xl p-4 mb-6 text-center">
                  <p className="text-sm text-gray-600 italic">
                    "All work and no play makes Jack a dull boy"
                  </p>
                </div>

                <div className="flex items-center justify-between chillout-light rounded-2xl p-4 group-hover:bg-orange-100 transition-all duration-300">
                  <span className="font-semibold chillout-text-dark">
                    Enter Fun Zone
                  </span>
                  <ArrowRightIcon className="w-5 h-5 chillout-text-primary group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 auth-light rounded-xl">
              <LightBulbIcon className="w-6 h-6 auth-text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              to="/communities" 
              className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 dashboard-light rounded-lg">
                  <ClipboardDocumentListIcon className="w-5 h-5 dashboard-text-primary" />
                </div>
                <span className="font-medium text-gray-700">Browse Communities</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
            </Link>

            <Link 
              to="/profile" 
              className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 status-success rounded-lg">
                  <UserGroupIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700">View Profile</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" />
            </Link>

            <button 
              className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-yellow-50 transition-all duration-300 border border-gray-200"
              onClick={() => {
                toast.success('Theme preferences saved!');
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 auth-accent rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Preferences</span>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Welcome Tips for New Users */}
        {communities.length === 0 && (
          <div className="dashboard-light rounded-3xl p-8 border dashboard-border-light shadow-lg">
            <div className="flex items-start gap-6">
              <div className="shrink-0">
                <div className="w-16 h-16 dashboard-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <FireIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  Welcome to BatchHub! 
                  <span className="text-3xl">🚀</span>
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Start your journey by joining or creating a community. Connect with your batchmates for both academic collaboration and fun activities. Share knowledge, plan events, and build lasting memories together!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/communities" 
                    className="group dashboard-gradient text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Join a Community
                  </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 status-success rounded-full animate-pulse"></div>
                      <span>Academic zones for study materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 chillout-primary rounded-full animate-pulse"></div>
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
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 communities-light rounded-xl">
                  <UserGroupIcon className="w-6 h-6 communities-text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Your Communities</h3>
              </div>
              <Link 
                to="/communities" 
                className="dashboard-text-primary hover:dashboard-text-secondary font-medium text-sm inline-flex items-center gap-1 transition-colors duration-200"
              >
                View all
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.slice(0, 6).map((community) => (
                <div key={community._id} className="group p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      community.type === 'academic' 
                        ? 'academic-light' 
                        : 'chillout-light'
                    }`}>
                      {community.type === 'academic' ? (
                        <AcademicCapIcon className="w-5 h-5 academic-text-primary" />
                      ) : (
                        <SparklesIcon className="w-5 h-5 chillout-text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{community.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{community.type} zone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{community.members?.length || 0} members</span>
                    </div>
                    <Link
                      to={community.type === 'academic' ? `/academics` : `/chillout`}
                      className={`text-xs font-medium transition-colors duration-200 ${
                        community.type === 'academic' 
                          ? 'academic-text-primary hover:academic-text-secondary' 
                          : 'chillout-text-primary hover:chillout-text-secondary'
                      }`}
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