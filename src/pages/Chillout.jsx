import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  SparklesIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  BanknotesIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { 
  SparklesIcon as SparklesSolid,
  CalendarIcon as CalendarSolid,
  CurrencyDollarIcon as CurrencyDollarSolid
} from '@heroicons/react/24/solid';

const Chillout = () => {
  const { user } = useAuth();
  const [chilloutCommunities, setChilloutCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChilloutCommunities();
  }, []);

  const fetchChilloutCommunities = async () => {
    try {
      const { data } = await api.get('/api/communities/my-communities');
      const chillout = data.filter(comm => comm.type === 'chillout');
      setChilloutCommunities(chillout);
    } catch (error) {
      toast.error('Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
            <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading your communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-8 py-4 border border-purple-200 dark:border-purple-800 shadow-lg mb-8">
            <SparklesSolid className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
              Chillout Zone
            </h1>
            <div className="text-4xl">🎉</div>
          </div>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Your ultimate hub for planning events, managing expenses, sharing memories, 
            and having amazing conversations with your batch!
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
            {[
              { icon: '💬', label: 'Discussions' },
              { icon: '📅', label: 'Events' },
              { icon: '💰', label: 'Expenses' },
              { icon: '📊', label: 'Polls' },
              { icon: '📸', label: 'Gallery' }
            ].map((item, index) => (
              <div 
                key={index}
                className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 dark:border-purple-700/50 text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Join Community Button */}
          <Link 
            to="/communities" 
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative flex items-center gap-3">
              <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-lg">Join Community</span>
            </div>
          </Link>
        </div>

        {/* Communities Grid */}
        {chilloutCommunities.length === 0 ? (
          <div className="flex justify-center">
            <div className="max-w-lg w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-12 text-center border border-purple-200 dark:border-purple-800 shadow-xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <SparklesSolid className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl">✨</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                No Communities Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Join or create a chillout community to start planning amazing activities with your batch!
              </p>
              <Link 
                to="/communities" 
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <ClipboardDocumentListIcon className="w-5 h-5" />
                Browse Communities
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {chilloutCommunities.map((community) => (
              <ChilloutCommunityCard key={community._id} community={community} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ChilloutCommunityCard = ({ community }) => {
  const features = [
    { 
      icon: ChatBubbleLeftRightIcon, 
      label: 'Discussions', 
      link: `/chillout/${community._id}/discussions`,
      gradient: 'from-blue-400 to-cyan-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Fun conversations & memes',
      emoji: '💬'
    },
    { 
      icon: CalendarSolid, 
      label: 'Events', 
      link: `/chillout/${community._id}/events`,
      gradient: 'from-purple-400 to-fuchsia-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Plan trips & activities',
      emoji: '📅'
    },
    { 
      icon: CurrencyDollarSolid, 
      label: 'Expenses', 
      link: `/chillout/${community._id}/expenses`,
      gradient: 'from-green-400 to-emerald-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      description: 'Split bills & track money',
      emoji: '💰'
    },
    { 
      icon: ChartBarIcon, 
      label: 'Polls', 
      link: `/chillout/${community._id}/polls`,
      gradient: 'from-yellow-400 to-orange-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      description: 'Quick group decisions',
      emoji: '📊'
    },
    { 
      icon: CameraIcon, 
      label: 'Gallery', 
      link: `/chillout/${community._id}/gallery`,
      gradient: 'from-pink-400 to-rose-500',
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      description: 'Share photos & memories',
      emoji: '📸'
    },
  ];

  return (
    <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-purple-100 dark:border-purple-800">
      {/* Header */}
      <div className="relative p-6 pb-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/30 border-b border-purple-100 dark:border-purple-800">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 truncate">
              {community.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                <SparklesIcon className="w-4 h-4" />
                Chillout Zone
              </div>
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-sm">
                <UserGroupIcon className="w-4 h-4" />
                {community.members?.length || 0} members
              </div>
            </div>
          </div>
          <div className="text-3xl ml-4 group-hover:scale-110 transition-transform duration-300">
            🎉
          </div>
        </div>
        
        {community.description && (
          <p className="text-slate-600 dark:text-slate-300 mt-4 text-sm leading-relaxed line-clamp-2">
            {community.description}
          </p>
        )}
      </div>

      {/* Features Grid */}
      <div className="p-6">
        <div className="grid gap-3">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className={`group/item flex items-center justify-between p-4 rounded-2xl ${feature.bg} border border-white/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg group-hover/item:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {feature.label}
                    </span>
                    <span className="text-lg">{feature.emoji}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-3">
                <ArrowRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover/item:text-purple-500 dark:group-hover/item:text-purple-400 group-hover/item:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Community Code */}
        <div className="mt-6 pt-4 border-t border-purple-100 dark:border-purple-800">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Community Code:</span>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
              <code className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {community.code}
              </code>
              <button 
                className="hover:scale-110 transition-transform duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(community.code);
                  toast.success('Code copied!');
                }}
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chillout;