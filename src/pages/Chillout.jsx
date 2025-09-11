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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-4 chillout-border rounded-full animate-spin"></div>
            <SparklesIcon className="w-6 h-6 chillout-text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading your communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-4 bg-white backdrop-blur-md rounded-full px-8 py-4 chillout-border-light shadow-lg mb-8 border">
            <SparklesSolid className="w-10 h-10 chillout-text-primary" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold chillout-gradient bg-clip-text text-transparent">
              Chillout Zone
            </h1>
            <div className="text-4xl">🎉</div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
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
                className="inline-flex items-center gap-2 bg-white backdrop-blur-sm px-4 py-2 rounded-full chillout-border-light text-gray-700 shadow-sm border"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Join Community Button */}
          <Link 
            to="/communities" 
            className="group relative overflow-hidden chillout-primary text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3"
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
            <div className="max-w-lg w-full bg-white rounded-3xl p-12 text-center chillout-border-light shadow-xl border">
              <div className="relative mb-8">
                <div className="w-24 h-24 chillout-gradient rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <SparklesSolid className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 chillout-secondary rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl">✨</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No Communities Yet
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Join or create a chillout community to start planning amazing activities with your batch!
              </p>
              <Link 
                to="/communities" 
                className="chillout-primary text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
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
      gradient: 'academic-secondary',
      bg: 'bg-blue-50',
      description: 'Fun conversations & memes',
      emoji: '💬'
    },
    { 
      icon: CalendarSolid, 
      label: 'Events', 
      link: `/chillout/${community._id}/events`,
      gradient: 'chillout-primary',
      bg: 'chillout-light',
      description: 'Plan trips & activities',
      emoji: '📅'
    },
    { 
      icon: CurrencyDollarSolid, 
      label: 'Expenses', 
      link: `/chillout/${community._id}/expenses`,
      gradient: 'dashboard-primary',
      bg: 'dashboard-light',
      description: 'Split bills & track money',
      emoji: '💰'
    },
    { 
      icon: ChartBarIcon, 
      label: 'Polls', 
      link: `/chillout/${community._id}/polls`,
      gradient: 'auth-accent',
      bg: 'auth-light',
      description: 'Quick group decisions',
      emoji: '📊'
    },
    { 
      icon: CameraIcon, 
      label: 'Gallery', 
      link: `/chillout/${community._id}/gallery`,
      gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
      bg: 'bg-pink-50',
      description: 'Share photos & memories',
      emoji: '📸'
    },
  ];

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 chillout-border-light border">
      {/* Header */}
      <div className="relative p-6 pb-4 chillout-light border-b chillout-border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 truncate">
              {community.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 chillout-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                <SparklesIcon className="w-4 h-4" />
                Chillout Zone
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
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
          <p className="text-gray-600 mt-4 text-sm leading-relaxed line-clamp-2">
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
              className={`group/item flex items-center justify-between p-4 rounded-2xl ${feature.bg} border border-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 ${feature.gradient} rounded-xl shadow-lg group-hover/item:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {feature.label}
                    </span>
                    <span className="text-lg">{feature.emoji}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-3">
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover/item:chillout-text-primary group-hover/item:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Community Code */}
        <div className="mt-6 pt-4 border-t chillout-border-light">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-500">Community Code:</span>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
              <code className="font-mono font-bold chillout-text-primary">
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