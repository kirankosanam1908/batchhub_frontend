import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  ChatBubbleLeftRightIcon,
  PlusIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FaceSmileIcon,
  FireIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  StarIcon,
  GifIcon,
  PhotoIcon,
  ChevronRightIcon,
  SparklesIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid, 
  FaceSmileIcon as FaceSmileSolid,
  StarIcon as StarSolid 
} from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';

const ChilloutDiscussions = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [community, setCommunity] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCommunityAndThreads();
  }, [communityId, sortBy, currentPage]);

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      fetchCommunityAndThreads();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const fetchCommunityAndThreads = async () => {
    try {
      if (!community) {
        const communityRes = await api.get(`/api/communities/${communityId}`);
        setCommunity(communityRes.data);
      }

      const params = new URLSearchParams({
        type: 'chillout',
        sortBy,
        page: currentPage,
        limit: 15,
        ...(searchTerm && { search: searchTerm })
      });

      const threadsRes = await api.get(`/api/threads/community/${communityId}?${params}`);
      const fetchedThreads = threadsRes.data.threads || [];

      setThreads(fetchedThreads);
      setTotalPages(threadsRes.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load discussions');
      console.error('Chillout discussions fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (threadId, voteType) => {
    try {
      await api.post(`/api/threads/${threadId}/vote`, { voteType });
      fetchCommunityAndThreads();
    } catch (error) {
      toast.error('Voting failed! Try again');
    }
  };

  const handlePin = async (threadId) => {
    try {
      await api.put(`/api/threads/${threadId}/pin`);
      fetchCommunityAndThreads();
      toast.success('Post updated!');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const isModerator = community?.moderators?.includes(user?._id);

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          {/* Breadcrumbs */}
          <div className="breadcrumbs text-sm mb-6 overflow-x-auto">
            <ul className="flex-nowrap">
              <li>
                <Link 
                  to="/chillout" 
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-300"
                >
                  Chillout
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-none">
                  {community?.name}
                </span>
              </li>
              <li className="text-purple-600 dark:text-purple-400 font-semibold">Discussions</li>
            </ul>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-6 py-3 border border-purple-200 dark:border-purple-800 shadow-lg mb-6">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
                Discussion Hub
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
              Share thoughts, start conversations, and connect with your batch
            </p>
          </div>

          {/* Create Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-3">
                <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline text-lg">Start Discussion</span>
                <span className="sm:hidden">Start</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-6 border border-purple-200 dark:border-purple-800 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search discussions, topics, or keywords..."
                  className="input input-bordered w-full pl-12 pr-10 rounded-2xl bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex gap-2">
                {[
                  { key: 'recent', label: 'Recent', icon: SparklesIcon },
                  { key: 'popular', label: 'Popular', icon: FireIcon },
                  { key: 'upvotes', label: 'Top', icon: HeartIcon }
                ].map(sort => (
                  <button
                    key={sort.key}
                    onClick={() => setSortBy(sort.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      sortBy === sort.key
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <sort.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{sort.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Discussions Content */}
        {loading && currentPage > 1 ? (
          <div className="flex justify-center py-8">
            <div className="text-purple-600 dark:text-purple-400 font-medium">Loading more discussions...</div>
          </div>
        ) : threads.length === 0 ? (
          <div className="flex justify-center">
            <div className="max-w-md w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-center border border-purple-200 dark:border-purple-800 shadow-xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                {searchTerm ? 'No discussions found' : 'No discussions yet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {searchTerm 
                  ? 'Try different keywords or start a new discussion about this topic!'
                  : 'Be the first to start a conversation! Share your thoughts, ideas, or questions.'
                }
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Start First Discussion
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Discussions List */}
            <div className="space-y-4 sm:space-y-6 mb-8">
              {threads.map((thread) => (
                <ConversationCard 
                  key={thread._id} 
                  thread={thread} 
                  onVote={handleVote}
                  onPin={handlePin}
                  onClick={() => setSelectedThread(thread)}
                  currentUser={user}
                  isModerator={isModerator}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-2 border border-purple-200 dark:border-purple-800 shadow-lg">
                  <div className="flex items-center">
                    <button 
                      className="px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    <span className="px-6 py-2 text-slate-700 dark:text-slate-300 font-medium">
                      <span className="hidden sm:inline">Page </span>{currentPage} of {totalPages}
                    </span>
                    <button 
                      className="px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateConversationModal
          communityId={communityId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchCommunityAndThreads();
            setShowCreateModal(false);
          }}
        />
      )}

      {selectedThread && (
        <ConversationDetailModal
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
          onUpdate={fetchCommunityAndThreads}
          currentUser={user}
          isModerator={isModerator}
        />
      )}
    </div>
  );
};

const ConversationCard = ({ thread, onVote, onPin, onClick, currentUser, isModerator }) => {
  const hasUpvoted = thread.upvotes?.includes(currentUser?._id);
  const hasDownvoted = thread.downvotes?.includes(currentUser?._id);
  const netVotes = (thread.upvotes?.length || 0) - (thread.downvotes?.length || 0);
  const isAuthor = thread.author?._id === currentUser?._id;
  const canPin = isModerator || isAuthor;

  // Enhanced thread categories with better emojis
  const getThreadEmoji = (tags) => {
    if (!tags || tags.length === 0) return '💬';
    const tag = tags[0].toLowerCase();
    const emojiMap = {
      'meme': '😂', 'memes': '😂', 'funny': '🤣', 'joke': '😄', 'humor': '😆',
      'trip': '✈️', 'travel': '🌍', 'vacation': '🏖️', 'adventure': '🗺️',
      'food': '🍕', 'cooking': '👨‍🍳', 'recipe': '🍽️', 'restaurant': '🍴',
      'music': '🎵', 'song': '🎶', 'playlist': '🎧', 'concert': '🎤',
      'movie': '🎬', 'movies': '🎬', 'netflix': '📺', 'series': '🍿',
      'game': '🎮', 'games': '🎮', 'gaming': '🕹️', 'esports': '🏆',
      'party': '🎉', 'celebration': '🎊', 'birthday': '🎂', 'event': '🎪',
      'sports': '⚽', 'fitness': '💪', 'gym': '🏋️', 'workout': '🤸',
      'study': '📚', 'exam': '📝', 'motivation': '🔥', 'learning': '🧠',
      'random': '🎲', 'thoughts': '💭', 'shower': '🚿', 'weird': '🤪',
      'confession': '🤫', 'secret': '🔐', 'personal': '💝', 'diary': '📔',
      'advice': '💡', 'help': '🤝', 'tips': '👍', 'support': '🫂',
      'love': '💕', 'crush': '😍', 'relationship': '💑', 'dating': '💘',
      'college': '🎓', 'campus': '🏫', 'dorm': '🏠', 'class': '📖',
      'shopping': '🛍️', 'fashion': '👗', 'style': '✨', 'outfit': '👔',
      'tech': '💻', 'coding': '👨‍💻', 'programming': '🖥️', 'software': '⚙️',
      'art': '🎨', 'creative': '🖌️', 'design': '🎯', 'photo': '📸'
    };
    return emojiMap[tag] || '💬';
  };

  return (
    <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-purple-100 dark:border-purple-800">
      <div className="p-4 sm:p-6">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-2 min-w-[60px] sm:min-w-[70px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(thread._id, 'upvote');
              }}
              className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                hasUpvoted 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500' 
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-400'
              }`}
            >
              {hasUpvoted ? <HeartSolid className="w-5 h-5 sm:w-6 sm:h-6" /> : <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <span className={`font-bold text-sm sm:text-lg px-2 sm:px-3 py-1 rounded-full transition-colors ${
              netVotes > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 
              netVotes < 0 ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400' : 
              'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              {netVotes > 0 ? `+${netVotes}` : netVotes}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(thread._id, 'downvote');
              }}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                hasDownvoted 
                  ? 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400' 
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400'
              }`}
            >
              <HandThumbDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 cursor-pointer" onClick={onClick}>
            <div className="flex items-start gap-3 mb-4">
              <div className="avatar placeholder shrink-0">
                <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 text-sm font-semibold">
                  {thread.author?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {thread.author?.name}
                  </span>
                  {thread.author?.role === 'cr' && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                      CR
                    </span>
                  )}
                  {thread.author?.role === 'teacher' && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                      Teacher
                    </span>
                  )}
                  <span className="text-slate-400 dark:text-slate-500 text-sm">•</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {formatDistanceToNow(new Date(thread.createdAt))} ago
                  </span>
                  {thread.isPinned && (
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs font-medium">
                      <StarSolid className="w-3 h-3" />
                      <span>Pinned</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getThreadEmoji(thread.tags)}</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2">
                    {thread.title}
                  </h3>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4">
                  {thread.content}
                </p>

                {/* Tags */}
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.slice(0, 4).map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-lg hover:scale-105 transition-transform"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {thread.tags.length > 4 && (
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-lg">
                        +{thread.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center gap-4 sm:gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    <span>{thread.replies?.length || 0} replies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EyeIcon className="w-4 h-4" />
                    <span>{thread.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pin Button */}
          {canPin && (
            <div className="shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin(thread._id);
                }}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  thread.isPinned 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-slate-400 hover:text-yellow-500'
                }`}
              >
                {thread.isPinned ? <StarSolid className="w-5 h-5" /> : <StarIcon className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateConversationModal = ({ communityId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  // Enhanced quick tags with better categorization
  const quickTags = [
    { name: 'random', emoji: '🎲', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    { name: 'funny', emoji: '😂', color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
    { name: 'food', emoji: '🍕', color: 'from-orange-400 to-red-500', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
    { name: 'music', emoji: '🎵', color: 'from-pink-400 to-rose-500', bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300' },
    { name: 'movies', emoji: '🎬', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    { name: 'games', emoji: '🎮', color: 'from-green-400 to-teal-500', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    { name: 'love', emoji: '💕', color: 'from-red-400 to-pink-500', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
    { name: 'party', emoji: '🎉', color: 'from-indigo-400 to-purple-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
    { name: 'trip', emoji: '✈️', color: 'from-teal-400 to-cyan-500', bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300' },
    { name: 'advice', emoji: '💡', color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
    { name: 'confession', emoji: '🤫', color: 'from-slate-400 to-slate-600', bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300' },
    { name: 'motivation', emoji: '🔥', color: 'from-rose-400 to-red-500', bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300' }
  ];

  const addTag = (tag) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setFormData({ ...formData, tags: newTags });
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const newTags = currentTags.filter(tag => tag !== tagToRemove).join(', ');
    setFormData({ ...formData, tags: newTags });
  };

  const selectedTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/threads/create', {
        title: formData.title,
        content: formData.content,
        communityId,
        type: 'chillout',
        tags: formData.tags
      });
      toast.success('Discussion started successfully!');
      onSuccess();
    } catch (error) {
      console.error('Thread creation error:', error.response);
      
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors
          .map(err => err.msg)
          .join(', ');
        toast.error(errorMessage);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create discussion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-xl">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Start Discussion</h3>
              <p className="text-slate-600 dark:text-slate-400">Share your thoughts with the community</p>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-circle bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600 hover:rotate-90 transition-all duration-300" 
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Discussion Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's your topic? Make it engaging..."
              required
              minLength={5}
              maxLength={200}
            />
            <label className="label">
              <span className="label-text-alt text-slate-500 dark:text-slate-400">
                {formData.title.length}/200 characters
              </span>
            </label>
          </div>

          {/* Content */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Your Thoughts</span>
            </label>
            <textarea
              className="textarea textarea-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl resize-none"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              placeholder="Share your thoughts, experiences, questions, or anything you want to discuss with your batch..."
              required
              minLength={10}
              maxLength={2000}
            />
            <label className="label">
              <span className="label-text-alt text-slate-500 dark:text-slate-400">
                {formData.content.length}/2000 characters
              </span>
            </label>
          </div>

          {/* Quick Tags */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Choose Tags</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {quickTags.map(tag => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => isSelected ? removeTag(tag.name) : addTag(tag.name)}
                    className={`relative overflow-hidden p-3 rounded-xl transition-all duration-300 hover:scale-105 transform ${
                      isSelected 
                        ? `bg-gradient-to-r ${tag.color} text-white shadow-lg` 
                        : `${tag.bg} ${tag.text} hover:shadow-md`
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{tag.emoji}</div>
                      <div className="text-sm font-medium capitalize">{tag.name}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                        <XMarkIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Tags Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Custom Tags</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Add custom tags separated by commas..."
              maxLength={200}
            />
            <label className="label">
              <span className="label-text-alt text-slate-500 dark:text-slate-400">
                Help others discover your discussion with relevant tags
              </span>
            </label>
          </div>

          {/* Selected Tags Preview */}
          {selectedTags.length > 0 && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                  Selected Tags ({selectedTags.length})
                </span>
              </label>
              <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                {selectedTags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="button" 
              className="flex-1 btn btn-ghost bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl order-2 sm:order-1" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`flex-1 btn border-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 order-1 sm:order-2 ${loading ? 'loading' : ''}`}
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
            >
              {loading ? 'Creating...' : 'Start Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConversationDetailModal = ({ thread, onClose, onUpdate, currentUser, isModerator }) => {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadData, setThreadData] = useState(thread);
  const [repliesLoading, setRepliesLoading] = useState(false);

  const isAuthor = threadData.author?._id === currentUser?._id;
  const canPin = isModerator || isAuthor;

  useEffect(() => {
    fetchThreadDetails();
  }, [thread._id]);

  const fetchThreadDetails = async () => {
    try {
      setRepliesLoading(true);
      const { data } = await api.get(`/api/threads/${thread._id}`);
      setThreadData(data);
    } catch (error) {
      toast.error('Failed to load discussion details');
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      toast.error('Please write something first');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/threads/${thread._id}/reply`, { content: reply });
      toast.success('Reply posted successfully!');
      setReply('');
      fetchThreadDetails();
      onUpdate();
    } catch (error) {
      toast.error('Failed to post reply');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    try {
      await api.post(`/api/threads/${threadData._id}/vote`, { voteType });
      fetchThreadDetails();
      onUpdate();
    } catch (error) {
      toast.error('Voting failed');
    }
  };

  const handlePin = async () => {
    try {
      await api.put(`/api/threads/${threadData._id}/pin`);
      toast.success(threadData.isPinned ? 'Unpinned successfully' : 'Pinned successfully');
      fetchThreadDetails();
      onUpdate();
    } catch (error) {
      toast.error('Failed to update pin status');
    }
  };

  const hasUpvoted = threadData.upvotes?.includes(currentUser?._id);
  const hasDownvoted = threadData.downvotes?.includes(currentUser?._id);
  const netVotes = (threadData.upvotes?.length || 0) - (threadData.downvotes?.length || 0);

  const getThreadEmoji = (tags) => {
    if (!tags || tags.length === 0) return '💬';
    const tag = tags[0].toLowerCase();
    const emojiMap = {
      'meme': '😂', 'memes': '😂', 'funny': '🤣', 'joke': '😄', 'humor': '😆',
      'trip': '✈️', 'travel': '🌍', 'vacation': '🏖️', 'adventure': '🗺️',
      'food': '🍕', 'cooking': '👨‍🍳', 'recipe': '🍽️', 'restaurant': '🍴',
      'music': '🎵', 'song': '🎶', 'playlist': '🎧', 'concert': '🎤',
      'movie': '🎬', 'movies': '🎬', 'netflix': '📺', 'series': '🍿',
      'game': '🎮', 'games': '🎮', 'gaming': '🕹️', 'esports': '🏆',
      'party': '🎉', 'celebration': '🎊', 'birthday': '🎂', 'event': '🎪',
      'sports': '⚽', 'fitness': '💪', 'gym': '🏋️', 'workout': '🤸',
      'study': '📚', 'exam': '📝', 'motivation': '🔥', 'learning': '🧠',
      'random': '🎲', 'thoughts': '💭', 'shower': '🚿', 'weird': '🤪',
      'confession': '🤫', 'secret': '🔐', 'personal': '💝', 'diary': '📔',
      'advice': '💡', 'help': '🤝', 'tips': '👍', 'support': '🫂',
      'love': '💕', 'crush': '😍', 'relationship': '💑', 'dating': '💘',
      'college': '🎓', 'campus': '🏫', 'dorm': '🏠', 'class': '📖',
      'shopping': '🛍️', 'fashion': '👗', 'style': '✨', 'outfit': '👔'
    };
    return emojiMap[tag] || '💬';
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-6xl h-[90vh] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800 p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-3xl sm:text-4xl">{getThreadEmoji(threadData.tags)}</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 truncate">
                {threadData.title}
                {threadData.isPinned && (
                  <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shrink-0">
                    <StarSolid className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Pinned</span>
                  </div>
                )}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 truncate">
                Discussion by {threadData.author?.name}
              </p>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-circle bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600 hover:rotate-90 transition-all duration-300 shrink-0" 
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Original Post */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 sm:p-6">
            <div className="flex gap-4 sm:gap-6">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-3 min-w-[60px] sm:min-w-[80px]">
                <button
                  onClick={() => handleVote('upvote')}
                  className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                    hasUpvoted 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-500' 
                      : 'bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-400'
                  }`}
                >
                  {hasUpvoted ? <HeartSolid className="w-6 h-6 sm:w-7 sm:h-7" /> : <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7" />}
                </button>
                <span className={`font-bold text-lg sm:text-xl px-3 sm:px-4 py-1 sm:py-2 rounded-full ${
                  netVotes > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 
                  netVotes < 0 ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400' : 
                  'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {netVotes > 0 ? `+${netVotes}` : netVotes}
                </span>
                <button
                  onClick={() => handleVote('downvote')}
                  className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                    hasDownvoted 
                      ? 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400' 
                      : 'bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400'
                  }`}
                >
                  <HandThumbDownIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="avatar placeholder shrink-0">
                    <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 text-sm font-semibold">
                      {threadData.author?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {threadData.author?.name}
                      </span>
                      {threadData.author?.role === 'cr' && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                          CR
                        </span>
                      )}
                      {threadData.author?.role === 'teacher' && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                          Teacher
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Posted {formatDistanceToNow(new Date(threadData.createdAt))} ago</span>
                      <span>•</span>
                      <EyeIcon className="w-4 h-4" />
                      <span>{threadData.views || 0} views</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm sm:prose max-w-none mb-4">
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                    {threadData.content}
                  </p>
                </div>

                {threadData.tags && threadData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {threadData.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:scale-105 transition-transform"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pin Button */}
                {canPin && (
                  <div className="flex justify-end">
                    <button
                      onClick={handlePin}
                      className={`btn btn-sm rounded-xl transition-all duration-300 hover:scale-105 ${
                        threadData.isPinned 
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600'
                      }`}
                    >
                      {threadData.isPinned ? (
                        <>
                          <StarSolid className="w-4 h-4 mr-1" />
                          Unpin
                        </>
                      ) : (
                        <>
                          <StarIcon className="w-4 h-4 mr-1" />
                          Pin
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Replies Section */}
          <div className="p-4 sm:p-6">
            {/* Replies Header */}
            <div className="flex items-center gap-3 mb-6">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                {threadData.replies?.length || 0} {threadData.replies?.length === 1 ? 'Reply' : 'Replies'}
              </h3>
              {threadData.replies?.length > 0 && (
                <span className="text-slate-500 dark:text-slate-400 text-sm">Join the conversation!</span>
              )}
            </div>

            {/* Replies List */}
            {repliesLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">Loading replies...</p>
                </div>
              </div>
            ) : threadData.replies?.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-600 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No replies yet!</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Be the first to join this conversation and share your thoughts.
                </p>
                <div className="text-sm text-slate-400 dark:text-slate-500">
                  💡 Ask questions, share experiences, or add your perspective!
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {threadData.replies?.map((reply, index) => (
                  <div 
                    key={reply._id} 
                    className="bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="avatar placeholder shrink-0">
                        <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-semibold">
                          {reply.author?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {reply.author?.name}
                          </span>
                          {reply.author?.role === 'cr' && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                              CR
                            </span>
                          )}
                          {reply.author?.role === 'teacher' && (
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                              Teacher
                            </span>
                          )}
                          <span className="text-slate-400 dark:text-slate-500 text-sm">•</span>
                          <span className="text-slate-500 dark:text-slate-400 text-sm">
                            {formatDistanceToNow(new Date(reply.createdAt))} ago
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                        <button className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-400 transition-colors">
                          <HeartIcon className="w-4 h-4" />
                        </button>
                        <span>{reply.upvotes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <form onSubmit={handleReply}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Add to the conversation
                </span>
              </label>
              <div className="flex gap-3 sm:gap-4">
                <div className="avatar placeholder shrink-0">
                  <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-semibold">
                    {currentUser?.name?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    className="textarea textarea-bordered w-full rounded-xl border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 bg-white/90 dark:bg-slate-700/90 placeholder-slate-400 dark:placeholder-slate-500 min-h-[100px] resize-none transition-colors"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={4}
                    placeholder="Share your thoughts, ask questions, or add your perspective to this discussion..."
                    required
                    minLength={1}
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4 text-purple-500" />
                      <span>Be respectful and constructive</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {reply.length}/1000
                      </div>
                      <button
                        type="submit"
                        className={`btn bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${loading ? 'loading' : ''}`}
                        disabled={loading || !reply.trim()}
                      >
                        {loading ? 'Posting...' : (
                          <>
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                            Post Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modal backdrop */}
      <div className="modal-backdrop bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};

export default ChilloutDiscussions;                                          