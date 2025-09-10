import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  FolderIcon,
  PlusIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  AcademicCapIcon as AcademicCapSolid,
  DocumentTextIcon as DocumentTextSolid,
  BookOpenIcon as BookOpenSolid
} from '@heroicons/react/24/solid';

const Academics = () => {
  const { user } = useAuth();
  const [academicCommunities, setAcademicCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcademicCommunities();
  }, []);

  const fetchAcademicCommunities = async () => {
    try {
      const { data } = await api.get('/api/communities/my-communities');
      const academic = data.filter(comm => comm.type === 'academic');
      setAcademicCommunities(academic);
    } catch (error) {
      toast.error('Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <AcademicCapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading your academic communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-8 py-4 border border-blue-200 dark:border-blue-800 shadow-lg mb-8">
            <AcademicCapSolid className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Academic Hub
            </h1>
            <div className="text-4xl">📚</div>
          </div>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Your centralized platform for notes, resources, Q&A discussions, and collaborative learning 
            with your batch mates and teachers.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
            {[
              { icon: '📝', label: 'Notes & Files' },
              { icon: '💭', label: 'Q&A Forum' },

            ].map((item, index) => (
              <div 
                key={index}
                className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 dark:border-blue-700/50 text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Join Community Button */}
          <Link 
            to="/communities" 
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative flex items-center gap-3">
              <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-lg">Join Academic Community</span>
            </div>
          </Link>
        </div>

        {/* Communities Grid */}
        {academicCommunities.length === 0 ? (
          <div className="flex justify-center">
            <div className="max-w-lg w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-12 text-center border border-blue-200 dark:border-blue-800 shadow-xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <AcademicCapSolid className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl">📚</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                No Academic Communities Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Join or create an academic community to start collaborating on studies, sharing notes, and discussing course materials!
              </p>
              <Link 
                to="/communities" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <ClipboardDocumentListIcon className="w-5 h-5" />
                Browse Communities
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {academicCommunities.map((community) => (
              <AcademicCommunityCard key={community._id} community={community} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AcademicCommunityCard = ({ community }) => {
  const features = [
    { 
      icon: DocumentTextSolid, 
      label: 'Notes & Files', 
      link: `/academics/${community._id}/notes`,
      gradient: 'from-green-400 to-emerald-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      description: 'PDFs, study materials & resources',
      emoji: '📝'
    },
    { 
      icon: ChatBubbleLeftRightIcon, 
      label: 'Q&A Forum', 
      link: `/academics/${community._id}/discussions`,
      gradient: 'from-blue-400 to-cyan-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Ask questions & get help',
      emoji: '💭'
    }
    
  ];

  return (
    <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-blue-100 dark:border-blue-800">
      {/* Header */}
      <div className="relative p-6 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-100 dark:border-blue-800">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 truncate">
              {community.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                <AcademicCapIcon className="w-4 h-4" />
                Academic Zone
              </div>
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-sm">
                <UserGroupIcon className="w-4 h-4" />
                {community.members?.length || 0} members
              </div>
            </div>
          </div>
          <div className="text-3xl ml-4 group-hover:scale-110 transition-transform duration-300">
            📚
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
                <ArrowRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 group-hover/item:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Study Stats */}
        <div className="mt-6 pt-4 border-t border-blue-100 dark:border-blue-800">
          
          
          {/* Community Code */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Community Code:</span>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
              <code className="font-mono font-bold text-blue-600 dark:text-blue-400">
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

export default Academics;