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

  // Predefined communities
  const predefinedCommunities = [
    {
      _id: 'predefined-academic',
      name: 'CS Study Hub 2025',
      description: 'Collaborative space for CS students to share study materials, discuss topics, and support each other through coursework.',
      type: 'academic',
      code: 'H3O4MS',
      members: [],
      isPredefined: true
    },
    {
      _id: 'predefined-chillout',
      name: 'Campus Chill Zone',
      description: 'Relaxation hub for fun activities, casual conversations, and building friendships outside the classroom.',
      type: 'chillout',
      code: 'U6QR6S',
      members: [],
      isPredefined: true
    }
  ];

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data } = await api.get('/api/communities/my-communities');
      // Combine predefined communities with user communities
      setCommunities([...predefinedCommunities, ...data]);
    } catch (error) {
      // If API fails, still show predefined communities
      setCommunities(predefinedCommunities);
      toast.error('Failed to fetch user communities');
    } finally {
      setLoading(false);
    }
  };

  // Separate communities by type
  const academicCommunities = communities.filter(comm => comm.type === 'academic');
  const chilloutCommunities = communities.filter(comm => comm.type === 'chillout');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-transparent communities-gradient rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 communities-primary rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading your communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 max-w-7xl">
        
        {/* Enhanced Header with Royal Purple Galaxy Theme */}
        <div className="text-center mb-12 sm:mb-16 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 communities-primary opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 communities-secondary opacity-10 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-10 left-20 w-12 h-12 communities-accent opacity-10 rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="relative inline-flex items-center gap-2 sm:gap-4 bg-white backdrop-blur-md rounded-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 communities-border shadow-lg mb-6 sm:mb-8 border-2 max-w-full">
            <UserGroupSolid className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 communities-text-primary flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent leading-tight" style={{
              background: 'linear-gradient(135deg, #5f27cd 0%, #a55eea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              My Communities
            </h1>
            <div className="flex gap-1 text-base sm:text-lg lg:text-xl flex-shrink-0">
              <span className="animate-bounce">👥</span>
              <span className="animate-pulse delay-100">✨</span>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Manage your <span className="font-semibold academic-text-primary">academic communities</span> and 
            <span className="font-semibold chillout-text-primary"> chillout zones</span> in one powerful galaxy! 🌌🎉
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowJoinModal(true)}
              className="group communities-primary text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <UserGroupIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Join Community</span>
              <span className="text-xl">🌌</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="group communities-secondary text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Community</span>
              <span className="text-xl">🌟</span>
            </button>
          </div>
        </div>

        {/* Always show communities since we have predefined ones */}
        <div className="space-y-12">
          {/* Academic Communities Section */}
          {academicCommunities.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 academic-light rounded-2xl shadow-lg">
                  <AcademicCapSolid className="w-8 h-8 academic-text-primary" />
                </div>
                <h2 className="text-3xl font-bold academic-text-primary">
                  Academic Constellations
                </h2>
                <div className="px-4 py-2 academic-light rounded-full">
                  <span className="font-bold academic-text-primary">{academicCommunities.length}</span>
                </div>
                <span className="text-2xl">📚</span>
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
                <div className="p-3 chillout-light rounded-2xl shadow-lg">
                  <SparklesSolid className="w-8 h-8 chillout-text-primary" />
                </div>
                <h2 className="text-3xl font-bold chillout-text-primary">
                  Chillout Nebulas
                </h2>
                <div className="px-4 py-2 chillout-light rounded-full">
                  <span className="font-bold chillout-text-primary">{chilloutCommunities.length}</span>
                </div>
                <span className="text-2xl">🎉</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {chilloutCommunities.map((community) => (
                  <CommunityCard key={community._id} community={community} />
                ))}
              </div>
            </div>
          )}
        </div>

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

// Enhanced Community Card Component with Special Themes and Predefined Community Handling
const CommunityCard = ({ community }) => {
  const isAcademic = community.type === 'academic';
  const basePath = isAcademic ? '/academics' : '/chillout';
  const isPredefined = community.isPredefined;

  const handleJoinPredefined = async (code) => {
    try {
      await api.post('/api/communities/join', { code });
      toast.success('🌌 Welcome to the community galaxy!');
      // Refresh page to update communities
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join community');
    }
  };

  return (
    <div className="group transform hover:scale-[1.02] transition-all duration-500">
      <div className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border ${isAcademic ? 'academic-border-light' : 'chillout-border-light'}`}>
        
        {/* Header */}
        <div className={`relative p-6 pb-4 ${isAcademic ? 'academic-light' : 'chillout-light'} border-b ${isAcademic ? 'academic-border' : 'chillout-border'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 bg-white`}>
                  {isAcademic ? (
                    <AcademicCapSolid className="w-6 h-6 academic-text-primary" />
                  ) : (
                    <SparklesSolid className="w-6 h-6 chillout-text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className={`text-xl font-bold ${isAcademic ? 'academic-text-primary' : 'chillout-text-primary'}`}>
                      {community.name}
                    </h2>
                    {isPredefined && (
                      <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <StarSolid className="w-3 h-3" />
                        FEATURED
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      isAcademic 
                        ? 'academic-light academic-text-dark academic-border' 
                        : 'chillout-light chillout-text-dark chillout-border'
                    }`}>
                      {community.type} zone
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <UserGroupIcon className="w-3 h-3" />
                      <span>{community.members?.length || 0} members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-3xl ml-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              {isAcademic ? '📚' : '🎉'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
            {community.description}
          </p>

          {/* Predefined Community Actions */}
          {isPredefined ? (
            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-2xl border-2 border-dashed ${
                isAcademic 
                  ? 'academic-border-light academic-light' 
                  : 'chillout-border-light chillout-light'
              }`}>
                <div className="text-center">
                  <div className="text-2xl mb-2">🌟</div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    This is a featured community! Join to unlock full access.
                  </p>
                  <button
                    onClick={() => handleJoinPredefined(community.code)}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-white ${
                      isAcademic 
                        ? 'academic-primary hover:academic-dark' 
                        : 'chillout-primary hover:chillout-dark'
                    }`}
                  >
                    Join Galaxy 🚀
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Regular Community Quick Action Links */
            <div className="space-y-3 mb-6">
              <Link
                to={`${basePath}/${community._id}/discussions`}
                className={`group/item flex items-center justify-between p-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                  isAcademic 
                    ? 'academic-light hover:bg-blue-100 academic-border-light border' 
                    : 'chillout-light hover:bg-orange-100 chillout-border-light border'
                } hover:shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isAcademic 
                      ? 'academic-secondary' 
                      : 'chillout-secondary'
                  }`}>
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {isAcademic ? 'Q&A Discussions' : 'Fun Conversations'}
                  </span>
                </div>
                <ArrowRightIcon className={`w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform duration-300 ${
                  isAcademic 
                    ? 'group-hover/item:academic-text-primary' 
                    : 'group-hover/item:chillout-text-primary'
                }`} />
              </Link>
              
              <Link
                to={`${basePath}/${community._id}/${isAcademic ? 'notes' : 'events'}`}
                className={`group/item flex items-center justify-between p-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                  isAcademic 
                    ? 'dashboard-light hover:bg-green-100 dashboard-border-light border' 
                    : 'communities-light hover:bg-purple-100 communities-border-light border'
                } hover:shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isAcademic 
                      ? 'dashboard-secondary' 
                      : 'communities-secondary'
                  }`}>
                    {isAcademic ? (
                      <DocumentTextIcon className="w-4 h-4 text-white" />
                    ) : (
                      <CalendarIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {isAcademic ? 'Study Materials' : 'Events & Plans'}
                  </span>
                </div>
                <ArrowRightIcon className={`w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform duration-300 ${
                  isAcademic 
                    ? 'group-hover/item:dashboard-text-primary' 
                    : 'group-hover/item:communities-text-primary'
                }`} />
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {isPredefined ? (
              <div className="flex-1 text-center">
                <div className="text-xs text-gray-500 mb-1">Community Code</div>
                <div className="flex items-center justify-center gap-2">
                  <code className={`font-mono font-bold px-3 py-2 rounded text-sm ${
                    isAcademic 
                      ? 'academic-light academic-text-dark' 
                      : 'chillout-light chillout-text-dark'
                  }`}>
                    {community.code}
                  </code>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(community.code);
                      toast.success('Code copied! 🌌');
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110"
                  >
                    📋
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to={basePath}
                  className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center gap-2 ${
                    isAcademic 
                      ? 'academic-primary' 
                      : 'chillout-primary'
                  } text-white`}
                >
                  <span>Enter {isAcademic ? 'Zone' : 'Hub'}</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Community Code</div>
                  <div className="flex items-center gap-2">
                    <code className={`font-mono font-bold px-2 py-1 rounded text-xs ${
                      isAcademic 
                        ? 'academic-light academic-text-dark' 
                        : 'chillout-light chillout-text-dark'
                    }`}>
                      {community.code}
                    </code>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(community.code);
                        toast.success('Code copied! 🌌');
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Create Community Modal with Royal Purple Galaxy Theme
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
      toast.success(`${formData.type === 'academic' ? '📚 Academic Constellation' : '🎉 Chillout Nebula'} created successfully!`);
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
      <div className="bg-white backdrop-blur-md rounded-3xl shadow-2xl communities-border-light w-full max-w-lg border">
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 communities-light rounded-2xl shadow-lg">
                <PlusIcon className="w-6 h-6 communities-text-primary" />
              </div>
              <h3 className="text-2xl font-bold communities-text-primary">
                Create New Community
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Community Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Community Name
            </label>
            <input
              type="text"
              placeholder="e.g., CS 2025 - Database Systems"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 communities-border focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description
            </label>
            <textarea
              placeholder="What will flourish in this community? Describe its purpose and goals..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 communities-border focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 resize-none"
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
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Community Type
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
                    ? 'academic-border academic-light shadow-lg' 
                    : 'border-gray-200 bg-gray-50 hover:academic-border-light'
                }`}>
                  <div className="text-center">
                    <div className={`mx-auto mb-3 p-3 rounded-2xl ${
                      formData.type === 'academic' 
                        ? 'academic-primary shadow-lg' 
                        : 'bg-gray-200 group-hover:academic-light'
                    }`}>
                      <AcademicCapIcon className={`w-8 h-8 ${
                        formData.type === 'academic' ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className={`font-bold text-lg mb-1 ${
                      formData.type === 'academic' ? 'academic-text-primary' : 'text-gray-700'
                    }`}>
                      Academic Zone
                    </div>
                    <div className={`text-sm ${
                      formData.type === 'academic' ? 'academic-text-secondary' : 'text-gray-500'
                    }`}>
                      Study materials & Q&A 📚
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
                    ? 'chillout-border chillout-light shadow-lg' 
                    : 'border-gray-200 bg-gray-50 hover:chillout-border-light'
                }`}>
                  <div className="text-center">
                    <div className={`mx-auto mb-3 p-3 rounded-2xl ${
                      formData.type === 'chillout' 
                        ? 'chillout-primary shadow-lg' 
                        : 'bg-gray-200 group-hover:chillout-light'
                    }`}>
                      <SparklesIcon className={`w-8 h-8 ${
                        formData.type === 'chillout' ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className={`font-bold text-lg mb-1 ${
                      formData.type === 'chillout' ? 'chillout-text-primary' : 'text-gray-700'
                    }`}>
                      Chillout Zone
                    </div>
                    <div className={`text-sm ${
                      formData.type === 'chillout' ? 'chillout-text-secondary' : 'text-gray-500'
                    }`}>
                      Events & fun activities 🎉
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
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors duration-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`flex-1 px-6 py-3 font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-white ${
                formData.type === 'academic'
                  ? 'academic-primary hover:academic-dark'
                  : 'chillout-primary hover:chillout-dark'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                `Create ${formData.type === 'academic' ? '📚 Academic' : '🎉 Chillout'} Zone`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Join Community Modal with Royal Purple Galaxy Theme
const JoinCommunityModal = ({ onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/api/communities/join', { code });
      toast.success('🌌 Welcome to the community galaxy!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white backdrop-blur-md rounded-3xl shadow-2xl communities-border-light w-full max-w-md border">
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 communities-secondary rounded-2xl shadow-lg">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold communities-text-primary">
                Join Community
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-4">
              <div className="w-20 h-20 communities-gradient rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
                <ClipboardDocumentIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 auth-gradient rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-sm">👥</span>
              </div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Enter the <span className="font-bold communities-text-primary">6-character code</span> to join your batchmates' community galaxy!
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="ABCD12"
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 communities-border focus:border-transparent transition-all duration-300 text-center font-mono text-2xl tracking-widest font-bold text-gray-900 placeholder-gray-400"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 text-center mt-3">
                Code is case-insensitive • Join the galaxy! 🌌
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || code.length !== 6}
                className={`flex-1 px-6 py-3 communities-primary text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                  loading || code.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Joining...
                  </div>
                ) : (
                  'Join Galaxy 🌌'
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