import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  PlusIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  SparklesIcon,
  ArrowRightIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  StarIcon,
  FireIcon,
  BookOpenIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import {
  UserGroupIcon as UserGroupSolid,
  AcademicCapIcon as AcademicCapSolid,
  SparklesIcon as SparklesSolid,
  StarIcon as StarSolid
} from '@heroicons/react/24/solid';

const Communities = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data } = await api.get('/api/communities/my-communities');
      setCommunities(data);
    } catch (error) {
      toast.error('Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  };

  // Separate communities by type
  const academicCommunities = communities.filter(comm => comm.type === 'academic');
  const chilloutCommunities = communities.filter(comm => comm.type === 'chillout');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-green-900 dark:via-emerald-900 dark:to-teal-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading your communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-green-900 dark:via-emerald-900 dark:to-teal-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 max-w-7xl">
        
        {/* Enhanced Header with Green Transition Theme */}
        <div className="text-center mb-12 sm:mb-16 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-green-300/20 to-emerald-300/20 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-10 left-20 w-12 h-12 bg-gradient-to-r from-teal-300/20 to-cyan-300/20 rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="relative inline-flex items-center gap-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-8 py-4 border border-transparent bg-gradient-to-r from-green-200/50 via-emerald-200/50 to-teal-200/50 dark:from-green-800/50 dark:via-emerald-800/50 dark:to-teal-800/50 shadow-lg mb-8">
            <UserGroupSolid className="w-10 h-10 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 via-teal-600 to-cyan-600 dark:from-green-400 dark:via-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              My Communities
            </h1>
            <div className="flex gap-1 text-3xl">
              <span className="animate-bounce">🌱</span>
              <span className="animate-pulse delay-100">✨</span>
            </div>
          </div>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Manage your <span className="font-semibold text-green-600 dark:text-green-400">academic communities</span> and 
            <span className="font-semibold text-emerald-600 dark:text-emerald-400"> chillout zones</span> in one flourishing ecosystem! 🌿🎉
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowJoinModal(true)}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <UserGroupIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Join Community</span>
              <span className="text-xl">🌿</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Community</span>
              <span className="text-xl">🌟</span>
            </button>
          </div>
        </div>

        {communities.length === 0 ? (
          <div className="flex justify-center">
            <div className="max-w-2xl w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-12 text-center border border-transparent bg-gradient-to-r from-green-200/30 via-emerald-200/30 to-teal-200/30 dark:from-green-800/30 dark:via-emerald-800/30 dark:to-teal-800/30 shadow-xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <UserGroupSolid className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                  <StarSolid className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Ready to Grow Your Network? 🌱
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Plant the seeds of collaboration! Join an existing community or create your own 
                <span className="font-semibold text-green-600 dark:text-green-400"> academic garden</span> or 
                <span className="font-semibold text-emerald-600 dark:text-emerald-400"> fun forest</span>!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="group bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  <UserGroupIcon className="w-5 h-5" />
                  Join Community
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="group bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Community
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Academic Communities Section */}
            {academicCommunities.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg">
                    <AcademicCapSolid className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
                    Academic Gardens
                  </h2>
                  <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full">
                    <span className="font-bold text-green-600 dark:text-green-400">{academicCommunities.length}</span>
                  </div>
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {academicCommunities.map((community) => (
                    <CommunityCard key={community._id} community={community} />
                  ))}
                </div>
              </div>
            )}

            {/* Chillout Communities Section */}
            {chilloutCommunities.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl shadow-lg">
                    <SparklesSolid className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Chillout Oasis
                  </h2>
                  <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{chilloutCommunities.length}</span>
                  </div>
                  <span className="text-2xl">🌊</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {chilloutCommunities.map((community) => (
                    <CommunityCard key={community._id} community={community} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Modals */}
        {showCreateModal && (
          <CreateCommunityModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              fetchCommunities();
              setShowCreateModal(false);
            }}
          />
        )}

        {showJoinModal && (
          <JoinCommunityModal
            onClose={() => setShowJoinModal(false)}
            onSuccess={() => {
              fetchCommunities();
              setShowJoinModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Enhanced Community Card Component with Green Theme
const CommunityCard = ({ community }) => {
  const isAcademic = community.type === 'academic';
  const basePath = isAcademic ? '/academics' : '/chillout';

  const cardGradient = isAcademic 
    ? 'from-green-200/30 to-emerald-200/30 dark:from-green-800/30 dark:to-emerald-800/30'
    : 'from-emerald-200/30 to-teal-200/30 dark:from-emerald-800/30 dark:to-teal-800/30';

  const headerGradient = isAcademic
    ? 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
    : 'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30';

  return (
    <div className="group transform hover:scale-[1.02] transition-all duration-500">
      <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-transparent bg-gradient-to-r ${cardGradient}`}>
        
        {/* Header */}
        <div className={`relative p-6 pb-4 bg-gradient-to-br ${headerGradient} border-b ${isAcademic ? 'border-green-100 dark:border-green-800' : 'border-emerald-100 dark:border-emerald-800'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                  isAcademic 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30' 
                    : 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30'
                }`}>
                  {isAcademic ? (
                    <AcademicCapSolid className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" />
                  ) : (
                    <SparklesSolid className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className={`text-xl font-bold mb-1 ${
                    isAcademic 
                      ? 'bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent'
                  }`}>
                    {community.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      isAcademic 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700' 
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700'
                    }`}>
                      {community.type} zone
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <UserGroupIcon className="w-3 h-3" />
                      <span>{community.members?.length || 0} members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-3xl ml-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              {isAcademic ? '🌿' : '🌊'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2">
            {community.description || `A flourishing ${community.type} community for collaborative growth and learning.`}
          </p>

          {/* Quick Action Links */}
          <div className="space-y-3 mb-6">
            <Link
              to={`${basePath}/${community._id}/discussions`}
              className={`group/item flex items-center justify-between p-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                isAcademic 
                  ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 border border-green-100 dark:border-green-800/50' 
                  : 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50'
              } hover:shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isAcademic 
                    ? 'bg-green-100 dark:bg-green-900/50' 
                    : 'bg-emerald-100 dark:bg-emerald-900/50'
                }`}>
                  <ChatBubbleLeftRightIcon className={`w-4 h-4 ${
                    isAcademic 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isAcademic ? 'Q&A Discussions' : 'Fun Conversations'}
                </span>
              </div>
              <ArrowRightIcon className={`w-4 h-4 text-slate-400 group-hover/item:translate-x-1 transition-transform duration-300 ${
                isAcademic 
                  ? 'group-hover/item:text-green-500' 
                  : 'group-hover/item:text-emerald-500'
              }`} />
            </Link>
            
            <Link
              to={`${basePath}/${community._id}/${isAcademic ? 'notes' : 'events'}`}
              className={`group/item flex items-center justify-between p-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                isAcademic 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50' 
                  : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-100 dark:border-teal-800/50'
              } hover:shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isAcademic 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50' 
                    : 'bg-teal-100 dark:bg-teal-900/50'
                }`}>
                  {isAcademic ? (
                    <DocumentTextIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <CalendarIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isAcademic ? 'Study Materials' : 'Events & Plans'}
                </span>
              </div>
              <ArrowRightIcon className={`w-4 h-4 text-slate-400 group-hover/item:translate-x-1 transition-transform duration-300 ${
                isAcademic 
                  ? 'group-hover/item:text-emerald-500' 
                  : 'group-hover/item:text-teal-500'
              }`} />
            </Link>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-600/30">
            <Link
              to={basePath}
              className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2 ${
                isAcademic 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              } text-white`}
            >
              <span>Enter {isAcademic ? 'Garden' : 'Oasis'}</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Community Code</div>
              <div className="flex items-center gap-2">
                <code className={`font-mono font-bold px-2 py-1 rounded text-xs ${
                  isAcademic 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {community.code}
                </code>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(community.code);
                    toast.success('Code copied! 🌿');
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 hover:scale-110"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Create Community Modal with Green Theme
const CreateCommunityModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'academic'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/api/communities/create', formData);
      toast.success(`${formData.type === 'academic' ? '🌿 Academic Garden' : '🌊 Chillout Oasis'} created successfully!`);
      onSuccess();
    } catch (error) {
      console.error('Create community error:', error.response);
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-3xl shadow-2xl border border-transparent bg-gradient-to-r from-green-100/30 via-emerald-100/30 to-teal-100/30 dark:from-green-800/30 dark:via-emerald-800/30 dark:to-teal-800/30 w-full max-w-lg">
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-slate-200/50 dark:border-slate-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg">
                <PlusIcon className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
                Plant New Community
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Community Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Community Name
            </label>
            <input
              type="text"
              placeholder="e.g., CS 2025 - Database Systems"
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Description
            </label>
            <textarea
              placeholder="What will flourish in this community? Describe its purpose and goals..."
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              minLength={10}
              maxLength={500}
            />
          </div>

          {/* Community Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Community Ecosystem
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer group transition-all duration-300 ${
                formData.type === 'academic' ? 'scale-105' : 'hover:scale-102'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="academic"
                  checked={formData.type === 'academic'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="sr-only"
                />
                <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  formData.type === 'academic' 
                    ? 'border-green-400 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 shadow-lg' 
                    : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:border-green-300 dark:hover:border-green-600'
                }`}>
                  <div className="text-center">
                    <div className={`mx-auto mb-3 p-3 rounded-2xl ${
                      formData.type === 'academic' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' 
                        : 'bg-slate-200 dark:bg-slate-600 group-hover:bg-green-100 dark:group-hover:bg-green-900/30'
                    }`}>
                      <AcademicCapIcon className={`w-8 h-8 ${
                        formData.type === 'academic' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                      }`} />
                    </div>
                    <div className={`font-bold text-lg mb-1 ${
                      formData.type === 'academic' ? 'text-green-700 dark:text-green-300' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      Academic Garden
                    </div>
                    <div className={`text-sm ${
                      formData.type === 'academic' ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      Study materials & Q&A 🌿
                    </div>
                  </div>
                </div>
              </label>
              
              <label className={`cursor-pointer group transition-all duration-300 ${
                formData.type === 'chillout' ? 'scale-105' : 'hover:scale-102'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="chillout"
                  checked={formData.type === 'chillout'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="sr-only"
                />
                <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  formData.type === 'chillout' 
                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 shadow-lg' 
                    : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}>
                  <div className="text-center">
                    <div className={`mx-auto mb-3 p-3 rounded-2xl ${
                      formData.type === 'chillout' 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg' 
                        : 'bg-slate-200 dark:bg-slate-600 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30'
                    }`}>
                      <SparklesIcon className={`w-8 h-8 ${
                        formData.type === 'chillout' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                      }`} />
                    </div>
                    <div className={`font-bold text-lg mb-1 ${
                      formData.type === 'chillout' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      Chillout Oasis
                    </div>
                    <div className={`text-sm ${
                      formData.type === 'chillout' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      Events & fun activities 🌊
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`flex-1 px-6 py-3 font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-white ${
                formData.type === 'academic'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Growing...
                </div>
              ) : (
                `Plant ${formData.type === 'academic' ? '🌿 Garden' : '🌊 Oasis'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Join Community Modal with Green Theme
const JoinCommunityModal = ({ onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/api/communities/join', { code });
      toast.success('🌿 Welcome to the community ecosystem!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-3xl shadow-2xl border border-transparent bg-gradient-to-r from-green-100/30 via-emerald-100/30 to-teal-100/30 dark:from-green-800/30 dark:via-emerald-800/30 dark:to-teal-800/30 w-full max-w-md">
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-slate-200/50 dark:border-slate-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl shadow-lg">
                <UserGroupIcon className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Join Ecosystem
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
                <ClipboardDocumentIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-sm">🌱</span>
              </div>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Enter the <span className="font-bold text-emerald-600 dark:text-emerald-400">6-character seed code</span> to join your batchmates' growing community!
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="ABCD12"
                className="w-full px-6 py-4 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-center font-mono text-2xl tracking-widest font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-3">
                Code is case-insensitive • Plant yourself in the community! 🌱
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || code.length !== 6}
                className={`flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                  loading || code.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Growing...
                  </div>
                ) : (
                  'Join Ecosystem 🌿'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Communities;