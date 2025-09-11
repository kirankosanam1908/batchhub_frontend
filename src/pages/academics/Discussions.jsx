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
      <div className="min-h-screen academic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Loading academic discussions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen academic-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Academic Header */}
        <div className="mb-8">
          <div className="text-sm breadcrumbs mb-4">
            <ul className="text-white/80">
              <li><Link to="/academics" className="academic-text-light hover:text-white transition-colors">📚 Academics</Link></li>
              <li><Link to="/academics" className="academic-text-light hover:text-white transition-colors">{community?.name}</Link></li>
              <li className="text-white/60">Academic Discussions</li>
            </ul>
          </div>
          
          <div className="card bg-white shadow-xl border-0 p-8 mb-6 animate-slide-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold academic-text-primary flex items-center gap-3 mb-3">
                  <AcademicCapIcon className="w-10 h-10 academic-text-accent" />
                  Academic Q&A Forum
                </h1>
                <p className="text-gray-600 text-xl mb-4">
                  Collaborative learning space for academic discussions and knowledge sharing
                </p>
                {threads.length > 0 && (
                  <div className="flex items-center gap-6 text-base academic-text-secondary">
                    <span className="flex items-center gap-2">
                      📋 <strong>{threads.length}</strong> active discussions
                    </span>
                    <span className="flex items-center gap-2">
                      🎯 <strong>{threads.filter(t => !t.isResolved).length}</strong> open questions
                    </span>
                    <span className="flex items-center gap-2">
                      ✅ <strong>{threads.filter(t => t.isResolved).length}</strong> resolved
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn academic-primary shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <LightBulbIcon className="w-5 h-5 mr-2" />
                Ask Academic Question
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Search and Filters */}
        <div className="card bg-white shadow-xl border-0 mb-8 animate-fade-in">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              {/* Academic Search */}
              <div className="form-control lg:col-span-5">
                <label className="label">
                  <span className="label-text font-semibold academic-text-dark text-lg">Search Questions & Answers</span>
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 academic-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search by keywords, topics, or concepts..."
                    className="input input-bordered w-full pl-12 h-12 academic-border focus:academic-border text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-control lg:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold academic-text-dark text-lg">Status</span>
                </label>
                <select
                  className="select select-bordered h-12 academic-border focus:academic-border text-base"
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
                  <span className="label-text font-semibold academic-text-dark text-lg">Sort By</span>
                </label>
                <select
                  className="select select-bordered h-12 academic-border focus:academic-border text-base"
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
                  className="btn btn-outline academic-border academic-text-primary hover:academic-primary h-12 transition-all"
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
            <div className="text-white text-lg">Loading more discussions...</div>
          </div>
        ) : threads.length === 0 ? (
          <div className="card bg-white shadow-xl border-0">
            <div className="p-20 text-center">
              <BookOpenIcon className="w-24 h-24 mx-auto academic-text-light mb-6" />
              <h3 className="text-3xl font-bold academic-text-primary mb-4">No Academic Discussions Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {searchTerm || filter !== 'all' ? 
                  'Try adjusting your search criteria or filters to find relevant discussions.' : 
                  'Be the pioneer! Start the first academic discussion in this community.'
                }
              </p>
              {!searchTerm && filter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn academic-primary shadow-lg hover:shadow-xl transition-all"
                >
                  <LightBulbIcon className="w-5 h-5 mr-2" />
                  Ask the First Question
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-12">
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

            {/* Academic Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="card bg-white shadow-xl border-0 p-3">
                  <div className="join">
                    <button 
                      className="join-item btn btn-ghost academic-text-primary"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    <button className="join-item btn academic-primary">
                      Page {currentPage} of {totalPages}
                    </button>
                    <button 
                      className="join-item btn btn-ghost academic-text-primary"
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
    <div className="card bg-white shadow-xl hover:shadow-2xl transition-all border-0 overflow-hidden hover:-translate-y-2 animate-slide-in">
      <div className="p-8">
        <div className="flex gap-8">
          {/* Academic Voting System */}
          <div className="flex flex-col items-center gap-3 min-w-[100px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(thread._id, 'upvote');
              }}
              className={`p-3 rounded-full transition-all hover:scale-110 shadow-lg ${
                hasUpvoted ? 'academic-primary' : 'bg-gray-100 hover:academic-primary hover:text-white'
              }`}
              title="This question is useful"
            >
              <HandThumbUpIcon className="w-6 h-6" />
            </button>
            
            <div className={`px-4 py-2 rounded-full font-bold text-xl shadow-md ${
              netVotes > 0 ? 'status-success' : 
              netVotes < 0 ? 'status-error' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {netVotes > 0 ? `+${netVotes}` : netVotes}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(thread._id, 'downvote');
              }}
              className={`p-3 rounded-full transition-all hover:scale-110 shadow-lg ${
                hasDownvoted ? 'status-error' : 'bg-gray-100 hover:status-error hover:text-white'
              }`}
              title="This question needs improvement"
            >
              <HandThumbDownIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 cursor-pointer" onClick={onClick}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-3">
                  {thread.isPinned && (
                    <div className="flex items-center gap-1 status-warning px-3 py-1 rounded-full text-sm font-bold">
                      <StarSolid className="w-4 h-4" />
                      <span>IMPORTANT</span>
                    </div>
                  )}
                  {thread.isResolved && (
                    <div className="flex items-center gap-1 status-success px-3 py-1 rounded-full text-sm font-bold">
                      <CheckCircleSolid className="w-4 h-4" />
                      <span>RESOLVED</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold academic-text-primary mb-4 leading-tight hover:academic-text-accent transition-colors">
                  {thread.title}
                </h3>
                
                <p className="text-gray-600 line-clamp-2 mb-5 leading-relaxed text-lg">
                  {thread.content}
                </p>

                {/* Academic Tags */}
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-5">
                    {thread.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="academic-light px-4 py-2 text-sm rounded-full font-semibold hover:academic-secondary hover:text-white transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                    {thread.tags.length > 4 && (
                      <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full font-semibold">
                        +{thread.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Academic Metadata */}
                <div className="flex items-center gap-6 text-base text-gray-500">
                  <div className="flex items-center gap-3">
                    <img 
                      src={thread.author?.profilePicture || `https://ui-avatars.com/api/?name=${thread.author?.name}&background=3b82f6&color=ffffff`} 
                      alt={thread.author?.name}
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                    <span className="font-semibold academic-text-dark">{thread.author?.name}</span>
                    {thread.author?.role === 'teacher' && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-bold">
                        👨‍🏫 TEACHER
                      </span>
                    )}
                    {thread.author?.role === 'cr' && (
                      <span className="px-3 py-1 academic-light text-xs rounded-full font-bold">
                        👑 CR
                      </span>
                    )}
                  </div>
                  <span>•</span>
                  <span>Asked {formatDistanceToNow(new Date(thread.createdAt))} ago</span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {thread.replies?.length || 0} answers
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <EyeIcon className="w-4 h-4" />
                    {thread.views || 0} views
                  </span>
                </div>
              </div>
              
              {/* Moderation Actions */}
              {canModerate && (
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onPin(thread._id, thread.isPinned)}
                    className={`p-3 rounded-full transition-all hover:scale-110 shadow-md ${
                      thread.isPinned ? 'status-warning' : 'bg-gray-100 hover:status-warning hover:text-white'
                    }`}
                    title={thread.isPinned ? "Remove from important" : "Mark as important"}
                  >
                    {thread.isPinned ? <StarSolid className="w-5 h-5" /> : <StarIcon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => onResolve(thread._id, thread.isResolved)}
                    className={`p-3 rounded-full transition-all hover:scale-110 shadow-md ${
                      thread.isResolved ? 'status-success' : 'bg-gray-100 hover:status-success hover:text-white'
                    }`}
                    title={thread.isResolved ? "Reopen question" : "Mark as resolved"}
                  >
                    {thread.isResolved ? 
                      <CheckCircleSolid className="w-5 h-5" /> : 
                      <CheckCircleIcon className="w-5 h-5" />
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
    <div className="modal modal-open modal-backdrop">
      <div className="modal-content max-w-5xl bg-white rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-8 pb-6 academic-border-light border-b">
          <div>
            <h3 className="text-3xl font-bold academic-text-primary flex items-center gap-3">
              <LightBulbIcon className="w-8 h-8 academic-text-accent" />
              Ask an Academic Question
            </h3>
            <p className="text-gray-600 mt-2 text-lg">Get help from your peers and instructors on academic topics</p>
          </div>
          <button 
            className="btn btn-ghost btn-circle hover:bg-gray-100 transition-colors" 
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xl font-bold academic-text-dark">Question Title *</span>
            </label>
            <input
              type="text"
              className="input input-bordered h-14 text-lg academic-border focus:academic-border focus:shadow-lg transition-all"
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
              <span className="label-text text-xl font-bold academic-text-dark">Detailed Question *</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-40 text-lg academic-border focus:academic-border focus:shadow-lg transition-all"
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
              <span className="label-text text-xl font-bold academic-text-dark">Subject Tags</span>
            </label>
            <div className="mb-6">
              <p className="text-sm academic-text-secondary mb-4 font-semibold">Popular academic topics (click to add):</p>
              <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-xl">
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
                    className={`btn btn-sm transition-all ${
                      formData.tags.includes(topic) ? 
                      'academic-primary opacity-50 cursor-not-allowed' : 
                      'btn-outline academic-border academic-text-primary hover:academic-primary'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
            
            <input
              type="text"
              className="input input-bordered h-12 text-base academic-border focus:academic-border focus:shadow-lg transition-all"
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
          <div className="academic-light rounded-2xl p-6 border academic-border-light">
            <h4 className="font-bold academic-text-primary mb-4 flex items-center gap-2 text-lg">
              <BookOpenIcon className="w-6 h-6" />
              Academic Question Guidelines
            </h4>
            <ul className="text-sm academic-text-dark space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Be specific about your academic level and course context</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Show your work or thought process when applicable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Ask one clear question per post</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Use proper academic terminology and formatting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Search existing questions before posting duplicates</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="button" 
              className="btn btn-ghost flex-1 hover:bg-gray-100 h-14 text-lg" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn academic-primary flex-1 shadow-lg hover:shadow-xl h-14 text-lg transition-all hover:-translate-y-1 ${loading ? 'loading' : ''}`} 
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
    <div className="modal modal-open modal-backdrop">
      <div className="modal-content max-w-7xl max-h-[95vh] overflow-hidden flex flex-col bg-white rounded-2xl shadow-2xl">
        <div className="flex justify-between items-start mb-8 pb-6 academic-border-light border-b">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-3">
              {threadData.isPinned && (
                <div className="flex items-center gap-1 status-warning px-3 py-1 rounded-full text-sm font-bold">
                  <StarSolid className="w-4 h-4" />
                  <span>IMPORTANT QUESTION</span>
                </div>
              )}
              {threadData.isResolved && (
                <div className="flex items-center gap-1 status-success px-3 py-1 rounded-full text-sm font-bold">
                  <CheckCircleSolid className="w-4 h-4" />
                  <span>RESOLVED</span>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold academic-text-primary leading-tight">
              {threadData.title}
            </h2>
            <p className="text-gray-600 mt-2 text-lg">Academic discussion in {threadData.community?.name}</p>
          </div>
          <button 
            className="btn btn-ghost btn-circle hover:bg-gray-100 transition-colors" 
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Original Question */}
          <div className="academic-gradient rounded-2xl p-8 mb-8 border academic-border-light">
            <div className="flex gap-8">
              {/* Academic Voting */}
              <div className="flex flex-col items-center gap-4 min-w-[110px]">
                <button
                  onClick={() => handleVote('upvote')}
                  className={`p-4 rounded-full transition-all hover:scale-110 shadow-lg ${
                    hasUpvoted ? 'bg-white academic-text-primary' : 'bg-white/20 hover:bg-white hover:academic-text-primary text-white'
                  }`}
                  title="This question is well-researched and useful"
                >
                  <HandThumbUpIcon className="w-6 h-6" />
                </button>
                
                <div className={`px-5 py-3 rounded-full font-bold text-2xl shadow-lg ${
                  netVotes > 0 ? 'bg-green-100 text-green-600' : 
                  netVotes < 0 ? 'bg-red-100 text-red-600' : 
                  'bg-white text-gray-600'
                }`}>
                  {netVotes > 0 ? `+${netVotes}` : netVotes}
                </div>
                
                <button
                  onClick={() => handleVote('downvote')}
                  className={`p-4 rounded-full transition-all hover:scale-110 shadow-lg ${
                    hasDownvoted ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-red-500 hover:text-white text-white'
                  }`}
                  title="This question lacks research or clarity"
                >
                  <HandThumbDownIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-5">
                  <img 
                    src={threadData.author?.profilePicture || `https://ui-avatars.com/api/?name=${threadData.author?.name}&background=ffffff&color=0f4c75`} 
                    alt={threadData.author?.name}
                    className="w-14 h-14 rounded-full border-3 border-white shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-lg">{threadData.author?.name}</span>
                      {threadData.author?.role === 'teacher' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-bold">

                          👨‍🏫 TEACHER
                        </span>
                      )}
                      {threadData.author?.role === 'cr' && (
                        <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full font-bold">
                          👑 CLASS REPRESENTATIVE
                        </span>
                      )}
                    </div>
                    <span className="text-white/80 text-base">
                      Asked {formatDistanceToNow(new Date(threadData.createdAt))} ago • {threadData.views || 0} views
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none mb-5">
                  <p className="whitespace-pre-wrap text-white text-xl leading-relaxed">
                    {threadData.content}
                  </p>
                </div>

                {threadData.tags && threadData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-5">
                    {threadData.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Moderation Actions */}
                {canModerate && (
                  <div className="flex gap-4 pt-5 border-t border-white/20">
                    <button
                      onClick={handlePin}
                      className={`btn btn-sm ${
                        threadData.isPinned ? 'status-warning' : 'btn-outline text-white border-white hover:status-warning'
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
                        threadData.isResolved ? 'status-success' : 'btn-outline text-white border-white hover:status-success'
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
          <div className="flex items-center gap-4 mb-8">
            <ChatBubbleLeftRightIcon className="w-7 h-7 academic-text-accent" />
            <h3 className="text-2xl font-bold academic-text-primary">
              {threadData.replies?.length || 0} Academic {threadData.replies?.length === 1 ? 'Answer' : 'Answers'}
            </h3>
            {threadData.replies?.length > 0 && (
              <span className="text-gray-500 text-base">
                Knowledge shared by the community
              </span>
            )}
          </div>

          {/* Answers List */}
          {repliesLoading ? (
            <div className="flex justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 border-4 academic-border border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="academic-text-primary font-semibold">Loading academic answers...</p>
              </div>
            </div>
          ) : threadData.replies?.length === 0 ? (
            <div className="card bg-white shadow-lg p-16 text-center academic-border border-2 mb-8">
              <BookOpenIcon className="w-20 h-20 mx-auto academic-text-light mb-4" />
              <h4 className="text-2xl font-bold academic-text-primary mb-3">No answers yet</h4>
              <p className="text-gray-500 mb-4 text-lg">Be the first to provide an academic solution to this question.</p>
              <div className="text-sm academic-text-secondary">
                💡 Tip: Provide detailed explanations, examples, and cite sources when possible
              </div>
            </div>
          ) : (
            <div className="space-y-8 mb-8">
              {threadData.replies?.map((reply, index) => (
                <div key={reply._id} className="card bg-white shadow-xl hover:shadow-2xl transition-shadow border-0">
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <img 
                        src={reply.author?.profilePicture || `https://ui-avatars.com/api/?name=${reply.author?.name}&background=3b82f6&color=ffffff`} 
                        alt={reply.author?.name}
                        className="w-14 h-14 rounded-full border-2 border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-bold academic-text-primary text-lg">{reply.author?.name}</span>
                          {reply.author?.role === 'teacher' && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full font-bold">
                              👨‍🏫 TEACHER
                            </span>
                          )}
                          {reply.author?.role === 'cr' && (
                            <span className="px-3 py-1 academic-light text-sm rounded-full font-bold">
                              👑 CR
                            </span>
                          )}
                          {reply.isAccepted && (
                            <span className="px-3 py-1 status-success text-sm rounded-full font-bold flex items-center gap-1">
                              <CheckCircleSolid className="w-4 h-4" />
                              ACCEPTED ANSWER
                            </span>
                          )}
                          <span className="text-gray-400 text-base">•</span>
                          <span className="text-gray-500 text-base">
                            {formatDistanceToNow(new Date(reply.createdAt))} ago
                          </span>
                        </div>
                        <div className="prose prose-lg max-w-none">
                          <p className="whitespace-pre-wrap leading-relaxed text-gray-700 text-lg">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-base text-gray-500">
                        <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                          <HandThumbUpIcon className="w-5 h-5" />
                        </button>
                        <span className="font-semibold">{reply.upvotes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Academic Answer Form */}
        <div className="border-t academic-border-light pt-8 mt-8 academic-light rounded-b-2xl">
          <form onSubmit={handleReply}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xl font-bold academic-text-primary flex items-center gap-2">
                  <LightBulbIcon className="w-6 h-6" />
                  Provide Your Academic Answer
                </span>
              </label>
              <div className="flex gap-6">
                <img 
                  src={currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=3b82f6&color=ffffff`} 
                  alt={currentUser?.name}
                  className="w-14 h-14 rounded-full border-2 border-gray-200 flex-shrink-0 mt-2"
                />
                <div className="flex-1">
                  <textarea
                    className="textarea textarea-bordered w-full academic-border focus:academic-border bg-white min-h-[140px] text-lg"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={7}
                    placeholder="Provide a comprehensive academic answer:&#10;• Explain the concept or solution step by step&#10;• Include examples, formulas, or code if relevant&#10;• Cite sources or reference materials&#10;• Be clear and educational in your explanation"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                  
                  {/* Academic Answer Guidelines */}
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm academic-text-primary font-bold mb-2">📚 Academic Answer Guidelines:</p>
                    <ul className="text-xs academic-text-secondary space-y-1">
                      <li>• Provide clear, step-by-step explanations</li>
                      <li>• Include relevant examples or demonstrations</li>
                      <li>• Use proper academic language and formatting</li>
                      <li>• Cite sources or reference materials when applicable</li>
                    </ul>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="text-base academic-text-secondary flex items-center gap-2">
                      <span>📝</span>
                      <span>Writing a quality answer helps the entire academic community</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-sm text-gray-400">
                        {reply.length}/3000 characters
                      </div>
                      <button
                        type="submit"
                        className={`btn academic-primary shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${loading ? 'loading' : ''}`}
                        disabled={loading || !reply.trim()}
                      >
                        {loading ? (
                          <span>Posting Answer...</span>
                        ) : (
                          <>
                            <BookOpenIcon className="w-5 h-5 mr-2" />
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