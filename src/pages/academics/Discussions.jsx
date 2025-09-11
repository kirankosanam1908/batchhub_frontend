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
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  StarIcon,
  XMarkIcon,
  AcademicCapIcon,
  BookOpenIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';

const Discussions = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [community, setCommunity] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

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

  useEffect(() => {
    setCurrentPage(1);
    fetchCommunityAndThreads();
  }, [filter]);

  const fetchCommunityAndThreads = async () => {
    try {
      if (!community) {
        const communityRes = await api.get(`/api/communities/${communityId}`);
        setCommunity(communityRes.data);
      }

      // Build query parameters
      const params = new URLSearchParams({
        type: 'academic',
        sortBy,
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      });

      const threadsRes = await api.get(`/api/threads/community/${communityId}?${params}`);
      let fetchedThreads = threadsRes.data.threads || [];

      // Apply client-side filter for resolved/unresolved
      if (filter === 'resolved') {
        fetchedThreads = fetchedThreads.filter(thread => thread.isResolved);
      } else if (filter === 'unresolved') {
        fetchedThreads = fetchedThreads.filter(thread => !thread.isResolved);
      } else if (filter === 'pinned') {
        fetchedThreads = fetchedThreads.filter(thread => thread.isPinned);
      }

      setThreads(fetchedThreads);
      setTotalPages(threadsRes.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch academic discussions');
      console.error('Discussions fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (threadId, voteType) => {
    try {
      await api.post(`/api/threads/${threadId}/vote`, { voteType });
      fetchCommunityAndThreads();
    } catch (error) {
      toast.error('Failed to vote on question');
    }
  };

  const handlePin = async (threadId, isPinned) => {
    try {
      await api.put(`/api/threads/${threadId}/pin`);
      toast.success(isPinned ? 'Question unpinned' : 'Question pinned for visibility');
      fetchCommunityAndThreads();
    } catch (error) {
      toast.error('Failed to update pin status');
    }
  };

  const handleResolve = async (threadId, isResolved) => {
    try {
      await api.put(`/api/threads/${threadId}/resolve`);
      toast.success(isResolved ? 'Question reopened' : 'Question marked as resolved');
      fetchCommunityAndThreads();
    } catch (error) {
      toast.error('Failed to update resolution status');
    }
  };

  // Check if user is moderator
  const isModerator = community?.moderators?.includes(user?._id);

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary font-semibold">Loading academic discussions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="text-sm breadcrumbs opacity-70 mb-4">
            <ul>
              <li><Link to="/academics" className="text-primary hover:text-primary-focus">📚 Academics</Link></li>
              <li><Link to="/academics" className="text-primary hover:text-primary-focus">{community?.name}</Link></li>
              <li className="text-gray-600">Academic Discussions</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                  <AcademicCapIcon className="w-8 h-8 text-primary" />
                  Academic Q&A Forum
                </h1>
                <p className="text-gray-600 text-lg">
                  Collaborative learning space for academic discussions and knowledge sharing
                </p>
                {threads.length > 0 && (
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>📋 {threads.length} active discussions</span>
                    <span>•</span>
                    <span>🎯 {threads.filter(t => !t.isResolved).length} open questions</span>
                    <span>•</span>
                    <span>✅ {threads.filter(t => t.isResolved).length} resolved</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary shadow-lg hover:shadow-xl transition-all"
              >
                <LightBulbIcon className="w-5 h-5 mr-2" />
                Ask Academic Question
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Academic Search */}
              <div className="form-control lg:col-span-5">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Search Questions & Answers</span>
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by keywords, topics, or concepts..."
                    className="input input-bordered w-full pl-10 focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-control lg:col-span-2">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Status</span>
                </label>
                <select
                  className="select select-bordered focus:border-primary"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Questions</option>
                  <option value="unresolved">📋 Open Questions</option>
                  <option value="resolved">✅ Resolved</option>
                  <option value="pinned">📌 Important</option>
                </select>
              </div>

              {/* Academic Sort */}
              <div className="form-control lg:col-span-3">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Sort By</span>
                </label>
                <select
                  className="select select-bordered focus:border-primary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">📅 Most Recent</option>
                  <option value="popular">🔥 Most Discussed</option>
                  <option value="upvotes">⭐ Highest Rated</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="form-control lg:col-span-2">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                    setSortBy('recent');
                    setCurrentPage(1);
                  }}
                  className="btn btn-outline hover:btn-primary transition-all"
                  disabled={!searchTerm && filter === 'all' && sortBy === 'recent'}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Threads List */}
        {loading && currentPage > 1 ? (
          <div className="flex justify-center py-8">
            <div className="text-primary">Loading more discussions...</div>
          </div>
        ) : threads.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-16 text-center">
              <BookOpenIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Academic Discussions Found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || filter !== 'all' ? 
                  'Try adjusting your search criteria or filters to find relevant discussions.' : 
                  'Be the pioneer! Start the first academic discussion in this community.'
                }
              </p>
              {!searchTerm && filter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  <LightBulbIcon className="w-5 h-5 mr-2" />
                  Ask the First Question
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {threads.map((thread) => (
                <AcademicThreadCard 
                  key={thread._id} 
                  thread={thread} 
                  onVote={handleVote}
                  onPin={handlePin}
                  onResolve={handleResolve}
                  onClick={() => setSelectedThread(thread)}
                  currentUser={user}
                  isModerator={isModerator}
                />
              ))}
            </div>

            {/* Professional Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="bg-white rounded-full shadow-lg border border-gray-100 p-2">
                  <div className="join">
                    <button 
                      className="join-item btn btn-ghost"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    <button className="join-item btn btn-primary">
                      Page {currentPage} of {totalPages}
                    </button>
                    <button 
                      className="join-item btn btn-ghost"
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

      {/* Create Thread Modal */}
      {showCreateModal && (
        <CreateAcademicQuestionModal
          communityId={communityId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchCommunityAndThreads();
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Thread Detail Modal */}
      {selectedThread && (
        <AcademicThreadDetailModal
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

const AcademicThreadCard = ({ thread, onVote, onPin, onResolve, onClick, currentUser, isModerator }) => {
  const hasUpvoted = thread.upvotes?.includes(currentUser?._id);
  const hasDownvoted = thread.downvotes?.includes(currentUser?._id);
  const isAuthor = thread.author?._id === currentUser?._id;
  const canModerate = isModerator || isAuthor;
  const netVotes = (thread.upvotes?.length || 0) - (thread.downvotes?.length || 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex gap-6">
          {/* Academic Voting System */}
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(thread._id, 'upvote');
              }}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                hasUpvoted ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-primary hover:text-white'
              }`}
              title="This question is useful"
            >
              <HandThumbUpIcon className="w-5 h-5" />
            </button>
            
            <div className={`px-3 py-1 rounded-full font-bold text-lg ${
              netVotes > 0 ? 'bg-green-100 text-green-600' : 
              netVotes < 0 ? 'bg-red-100 text-red-600' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {netVotes > 0 ? `+${netVotes}` : netVotes}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(thread._id, 'downvote');
              }}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                hasDownvoted ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-red-500 hover:text-white'
              }`}
              title="This question needs improvement"
            >
              <HandThumbDownIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 cursor-pointer" onClick={onClick}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  {thread.isPinned && (
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      <StarSolid className="w-3 h-3" />
                      <span>IMPORTANT</span>
                    </div>
                  )}
                  {thread.isResolved && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircleSolid className="w-3 h-3" />
                      <span>RESOLVED</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3 leading-tight hover:text-primary transition-colors">
                  {thread.title}
                </h3>
                
                <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                  {thread.content}
                </p>

                {/* Academic Tags */}
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium hover:bg-blue-100 transition-colors">
                        #{tag}
                      </span>
                    ))}
                    {thread.tags.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{thread.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Academic Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <img 
                      src={thread.author?.profilePicture || `https://ui-avatars.com/api/?name=${thread.author?.name}&background=3b82f6&color=ffffff`} 
                      alt={thread.author?.name}
                      className="w-6 h-6 rounded-full border border-gray-200"
                    />
                    <span className="font-medium text-gray-700">{thread.author?.name}</span>
                    {thread.author?.role === 'teacher' && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
                        👨‍🏫 TEACHER
                      </span>
                    )}
                    {thread.author?.role === 'cr' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                        👑 CR
                      </span>
                    )}
                  </div>
                  <span>•</span>
                  <span>Asked {formatDistanceToNow(new Date(thread.createdAt))} ago</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {thread.replies?.length || 0} answers
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    {thread.views || 0} views
                  </span>
                </div>
              </div>
              
              {/* Moderation Actions */}
              {canModerate && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onPin(thread._id, thread.isPinned)}
                    className={`p-2 rounded-full transition-all hover:scale-110 ${
                      thread.isPinned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 hover:bg-yellow-50 text-gray-600'
                    }`}
                    title={thread.isPinned ? "Remove from important" : "Mark as important"}
                  >
                    {thread.isPinned ? <StarSolid className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onResolve(thread._id, thread.isResolved)}
                    className={`p-2 rounded-full transition-all hover:scale-110 ${
                      thread.isResolved ? 'bg-green-100 text-green-600' : 'bg-gray-100 hover:bg-green-50 text-gray-600'
                    }`}
                    title={thread.isResolved ? "Reopen question" : "Mark as resolved"}
                  >
                    {thread.isResolved ? 
                      <CheckCircleSolid className="w-4 h-4" /> : 
                      <CheckCircleIcon className="w-4 h-4" />
                    }
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateAcademicQuestionModal = ({ communityId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  // Academic subject tags
  const academicTopics = [
    'algorithms', 'data-structures', 'database', 'networking', 'operating-systems',
    'software-engineering', 'mathematics', 'statistics', 'machine-learning', 'web-development',
    'mobile-development', 'cybersecurity', 'artificial-intelligence', 'computer-graphics',
    'distributed-systems', 'programming', 'javascript', 'python', 'java', 'cpp'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/threads/create', {
        title: formData.title,
        content: formData.content,
        communityId,
        type: 'academic',
        tags: formData.tags
      });
      toast.success('Your academic question has been posted successfully!');
      onSuccess();
    } catch (error) {
      console.error('Question creation error:', error.response);
      
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors
          .map(err => err.msg)
          .join(', ');
        toast.error(`Validation Error: ${errorMessage}`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to post question. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl bg-white">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <LightBulbIcon className="w-7 h-7 text-primary" />
              Ask an Academic Question
            </h3>
            <p className="text-gray-600 mt-1">Get help from your peers and instructors on academic topics</p>
          </div>
          <button 
            className="btn btn-ghost btn-circle hover:bg-gray-100" 
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold text-gray-700">Question Title *</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-lg focus:border-primary bg-gray-50"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What specific academic topic or problem do you need help with?"
              required
              minLength={10}
              maxLength={200}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Be specific and descriptive. Good titles get better answers (10-200 characters)
              </span>
            </label>
          </div>

          {/* Question Details */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold text-gray-700">Detailed Question *</span>
            </label>
            <textarea
              className="textarea textarea-bordered focus:border-primary bg-gray-50 min-h-[150px]"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              placeholder="Provide detailed context:&#10;• What exactly are you trying to understand or solve?&#10;• What have you already tried?&#10;• Where specifically are you getting stuck?&#10;• Include any relevant code, formulas, or examples"
              required
              minLength={20}
              maxLength={3000}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                The more context you provide, the better answers you'll receive (20-3000 characters)
              </span>
            </label>
          </div>

          {/* Academic Tags Suggestions */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold text-gray-700">Subject Tags</span>
            </label>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Popular academic topics (click to add):</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {academicTopics.map(topic => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
                      if (!currentTags.includes(topic)) {
                        const newTags = [...currentTags, topic].join(', ');
                        setFormData({ ...formData, tags: newTags });
                      }
                    }}
                    disabled={formData.tags.includes(topic)}
                    className={`btn btn-sm ${
                      formData.tags.includes(topic) ? 
                      'btn-primary opacity-50 cursor-not-allowed' : 
                      'btn-outline btn-primary hover:btn-primary'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
            
            <input
              type="text"
              className="input input-bordered focus:border-primary bg-gray-50"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Add custom tags: algorithms, data-structures, python, etc."
              maxLength={200}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Use relevant tags to help others find and answer your question
              </span>
            </label>
          </div>

          {/* Academic Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5" />
              Academic Question Guidelines
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be specific about your academic level and course context</li>
              <li>• Show your work or thought process when applicable</li>
              <li>• Ask one clear question per post</li>
              <li>• Use proper academic terminology and formatting</li>
              <li>• Search existing questions before posting duplicates</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="button" 
              className="btn btn-ghost flex-1 hover:bg-gray-100" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn btn-primary flex-1 shadow-lg hover:shadow-xl ${loading ? 'loading' : ''}`} 
              disabled={loading}
            >
              {loading ? 'Posting Question...' : 'Post Academic Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AcademicThreadDetailModal = ({ thread, onClose, onUpdate, currentUser, isModerator }) => {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadData, setThreadData] = useState(thread);
  const [repliesLoading, setRepliesLoading] = useState(false);

  const isAuthor = threadData.author?._id === currentUser?._id;
  const canModerate = isModerator || isAuthor;

  useEffect(() => {
    fetchThreadDetails();
  }, [thread._id]);

  const fetchThreadDetails = async () => {
    try {
      setRepliesLoading(true);
      const { data } = await api.get(`/api/threads/${thread._id}`);
      setThreadData(data);
    } catch (error) {
      toast.error('Failed to fetch question details');
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      toast.error('Please provide a detailed answer');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/threads/${thread._id}/reply`, { content: reply });
      toast.success('Your academic answer has been posted!');
      setReply('');
      fetchThreadDetails();
      onUpdate();
    } catch (error) {
      toast.error('Failed to post answer. Please try again.');
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
      toast.error('Failed to vote on question');
    }
  };

  const handlePin = async () => {
    try {
      await api.put(`/api/threads/${threadData._id}/pin`);
      toast.success(threadData.isPinned ? 'Question unpinned' : 'Question pinned for visibility');
      fetchThreadDetails();
      onUpdate();
    } catch (error) {
      toast.error('Failed to update pin status');
    }
  };

  const handleResolve = async () => {
    try {
      await api.put(`/api/threads/${threadData._id}/resolve`);
      toast.success(threadData.isResolved ? 'Question reopened' : 'Question marked as resolved');
      fetchThreadDetails();
      onUpdate();
    } catch (error) {
      toast.error('Failed to update resolution status');
    }
  };

  const hasUpvoted = threadData.upvotes?.includes(currentUser?._id);
  const hasDownvoted = threadData.downvotes?.includes(currentUser?._id);
  const netVotes = (threadData.upvotes?.length || 0) - (threadData.downvotes?.length || 0);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl max-h-[95vh] overflow-hidden flex flex-col bg-white">
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              {threadData.isPinned && (
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-medium">
                  <StarSolid className="w-4 h-4" />
                  <span>IMPORTANT QUESTION</span>
                </div>
              )}
              {threadData.isResolved && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                  <CheckCircleSolid className="w-4 h-4" />
                  <span>RESOLVED</span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              {threadData.title}
            </h2>
            <p className="text-gray-600 mt-1">Academic discussion in {threadData.community?.name}</p>
          </div>
          <button 
            className="btn btn-ghost btn-circle hover:bg-gray-100" 
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Original Question */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
            <div className="flex gap-6">
              {/* Academic Voting */}
              <div className="flex flex-col items-center gap-3 min-w-[90px]">
                <button
                  onClick={() => handleVote('upvote')}
                  className={`p-3 rounded-full transition-all hover:scale-110 ${
                    hasUpvoted ? 'bg-primary text-white' : 'bg-white hover:bg-primary hover:text-white shadow-md'
                  }`}
                  title="This question is well-researched and useful"
                >
                  <HandThumbUpIcon className="w-6 h-6" />
                </button>
                
                <div className={`px-4 py-2 rounded-full font-bold text-xl shadow-md ${
                  netVotes > 0 ? 'bg-green-100 text-green-600' : 
                  netVotes < 0 ? 'bg-red-100 text-red-600' : 
                  'bg-white text-gray-600'
                }`}>
                  {netVotes > 0 ? `+${netVotes}` : netVotes}
                </div>
                
                <button
                  onClick={() => handleVote('downvote')}
                  className={`p-3 rounded-full transition-all hover:scale-110 ${
                    hasDownvoted ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-500 hover:text-white shadow-md'
                  }`}
                  title="This question lacks research or clarity"
                >
                  <HandThumbDownIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={threadData.author?.profilePicture || `https://ui-avatars.com/api/?name=${threadData.author?.name}&background=3b82f6&color=ffffff`} 
                    alt={threadData.author?.name}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{threadData.author?.name}</span>
                      {threadData.author?.role === 'teacher' && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
                          👨‍🏫 TEACHER
                        </span>
                      )}
                      {threadData.author?.role === 'cr' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                          👑 CLASS REPRESENTATIVE
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">
                      Asked {formatDistanceToNow(new Date(threadData.createdAt))} ago • {threadData.views || 0} views
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none mb-4">
                  <p className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed">
                    {threadData.content}
                  </p>
                </div>

                {threadData.tags && threadData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {threadData.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Moderation Actions */}
                {canModerate && (
                  <div className="flex gap-3 pt-4 border-t border-blue-200">
                    <button
                      onClick={handlePin}
                      className={`btn btn-sm ${
                        threadData.isPinned ? 'btn-warning' : 'btn-outline hover:btn-warning'
                      }`}
                    >
                      {threadData.isPinned ? (
                        <>
                          <StarSolid className="w-4 h-4 mr-1" />
                          Remove from Important
                        </>
                      ) : (
                        <>
                          <StarIcon className="w-4 h-4 mr-1" />
                          Mark as Important
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleResolve}
                      className={`btn btn-sm ${
                        threadData.isResolved ? 'btn-success' : 'btn-outline hover:btn-success'
                      }`}
                    >
                      {threadData.isResolved ? (
                        <>
                          <CheckCircleSolid className="w-4 h-4 mr-1" />
                          Reopen Question
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Mark as Resolved
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="flex items-center gap-3 mb-6">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-gray-800">
              {threadData.replies?.length || 0} Academic {threadData.replies?.length === 1 ? 'Answer' : 'Answers'}
            </h3>
            {threadData.replies?.length > 0 && (
              <span className="text-gray-500 text-sm">
                Knowledge shared by the community
              </span>
            )}
          </div>

          {/* Answers List */}
          {repliesLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-primary font-medium">Loading academic answers...</p>
              </div>
            </div>
          ) : threadData.replies?.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 mb-6">
              <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No answers yet</h4>
              <p className="text-gray-500 mb-4">Be the first to provide an academic solution to this question.</p>
              <div className="text-sm text-gray-400">
                💡 Tip: Provide detailed explanations, examples, and cite sources when possible
              </div>
            </div>
          ) : (
            <div className="space-y-6 mb-6">
              {threadData.replies?.map((reply, index) => (
                <div key={reply._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img 
                        src={reply.author?.profilePicture || `https://ui-avatars.com/api/?name=${reply.author?.name}&background=3b82f6&color=ffffff`} 
                        alt={reply.author?.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-semibold text-gray-800">{reply.author?.name}</span>
                          {reply.author?.role === 'teacher' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
                              👨‍🏫 TEACHER
                            </span>
                          )}
                          {reply.author?.role === 'cr' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                              👑 CR
                            </span>
                          )}
                          {reply.isAccepted && (
                            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium flex items-center gap-1">
                              <CheckCircleSolid className="w-3 h-3" />
                              ACCEPTED ANSWER
                            </span>
                          )}
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-500 text-sm">
                            {formatDistanceToNow(new Date(reply.createdAt))} ago
                          </span>
                        </div>
                        <div className="prose prose-lg max-w-none">
                          <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <HandThumbUpIcon className="w-4 h-4" />
                        </button>
                        <span className="font-medium">{reply.upvotes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Academic Answer Form */}
        <div className="border-t border-gray-200 pt-6 mt-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <form onSubmit={handleReply}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <LightBulbIcon className="w-5 h-5 text-primary" />
                  Provide Your Academic Answer
                </span>
              </label>
              <div className="flex gap-4">
                <img 
                  src={currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=3b82f6&color=ffffff`} 
                  alt={currentUser?.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex-shrink-0 mt-2"
                />
                <div className="flex-1">
                  <textarea
                    className="textarea textarea-bordered w-full focus:border-primary bg-white min-h-[120px] text-lg"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={6}
                    placeholder="Provide a comprehensive academic answer:&#10;• Explain the concept or solution step by step&#10;• Include examples, formulas, or code if relevant&#10;• Cite sources or reference materials&#10;• Be clear and educational in your explanation"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                  
                  {/* Academic Answer Guidelines */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium mb-2">📚 Academic Answer Guidelines:</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• Provide clear, step-by-step explanations</li>
                      <li>• Include relevant examples or demonstrations</li>
                      <li>• Use proper academic language and formatting</li>
                      <li>• Cite sources or reference materials when applicable</li>
                    </ul>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>📝</span>
                      <span>Writing a quality answer helps the entire academic community</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="text-xs text-gray-400">
                        {reply.length}/3000 characters
                      </div>
                      <button
                        type="submit"
                        className={`btn btn-primary shadow-lg hover:shadow-xl transition-all ${loading ? 'loading' : ''}`}
                        disabled={loading || !reply.trim()}
                      >
                        {loading ? (
                          <span>Posting Answer...</span>
                        ) : (
                          <>
                            <BookOpenIcon className="w-4 h-4 mr-2" />
                            Post Academic Answer
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
    </div>
  );
};

export default Discussions;              