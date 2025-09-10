import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  XMarkIcon,
  ChevronRightIcon,
  SparklesIcon,
  CalendarIcon,
  EyeIcon,
  UsersIcon,
  HandRaisedIcon,
  ChartPieIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  ChartBarIcon as ChartBarSolid 
} from '@heroicons/react/24/solid';
import { format, isPast, formatDistanceToNow } from 'date-fns';

const Polls = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [community, setCommunity] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCommunityAndPolls();
  }, [communityId]);

  const fetchCommunityAndPolls = async () => {
    try {
      const communityRes = await api.get(`/api/communities/${communityId}`);
      setCommunity(communityRes.data);

      const pollsRes = await api.get(`/api/polls?communityId=${communityId}`);
      setPolls(pollsRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch polls');
      console.error('Polls fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIds) => {
    try {
      await api.post(`/api/polls/${pollId}/vote`, { optionIds });
      toast.success('Vote recorded successfully!');
      fetchCommunityAndPolls();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const filteredPolls = polls.filter(poll => {
    const isExpired = poll.endsAt && isPast(new Date(poll.endsAt));
    if (filter === 'active') return !isExpired;
    if (filter === 'ended') return isExpired;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
            <ChartBarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading polls...</p>
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
              <li className="text-purple-600 dark:text-purple-400 font-semibold">Polls</li>
            </ul>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-6 py-3 border border-purple-200 dark:border-purple-800 shadow-lg mb-6">
              <ChartBarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
                Decision Hub
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
              Create polls, gather opinions, and make group decisions together
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
                <span className="hidden sm:inline text-lg">Create Poll</span>
                <span className="sm:hidden">Create</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-2 border border-purple-200 dark:border-purple-800 shadow-lg">
              {[
                { key: 'all', label: 'All Polls', icon: ChartBarIcon, count: polls.length },
                { key: 'active', label: 'Active', icon: ArrowTrendingUpIcon, count: polls.filter(p => !p.endsAt || !isPast(new Date(p.endsAt))).length },
                { key: 'ended', label: 'Ended', icon: CheckCircleIcon, count: polls.filter(p => p.endsAt && isPast(new Date(p.endsAt))).length }
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filter === tab.key 
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setFilter(tab.key)}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {tab.count > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      filter === tab.key ? 'bg-white/30' : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Polls Content */}
        {filteredPolls.length === 0 ? (
          <div className="flex justify-center">
            <div className="max-w-md w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-center border border-purple-200 dark:border-purple-800 shadow-xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <ChartBarIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                {filter === 'all' ? 'No polls yet' : `No ${filter} polls`}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {filter === 'all' 
                  ? 'Start making group decisions by creating your first poll!'
                  : `No ${filter} polls available right now.`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Create First Poll
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {filteredPolls.map((poll) => (
              <PollCard 
                key={poll._id} 
                poll={poll} 
                onVote={handleVote}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Poll Modal */}
      {showCreateModal && (
        <CreatePollModal
          communityId={communityId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchCommunityAndPolls();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

const PollCard = ({ poll, onVote, currentUser }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const isExpired = poll.endsAt && isPast(new Date(poll.endsAt));
  const isEnded = isExpired;
  
  // Calculate total votes and check if user has voted
  const totalVotes = poll.options?.reduce((sum, option) => {
    const votes = option.votes || option.voteCount || 0;
    return sum + (typeof votes === 'number' ? votes : votes.length);
  }, 0) || 0;
  
  const userHasVoted = poll.options?.some(option => 
    option.votes?.some ? option.votes.some(vote => 
      (typeof vote === 'object' ? vote._id : vote) === currentUser?._id
    ) : false
  );

  const canViewResults = userHasVoted || isEnded || showResults;

  const handleOptionSelect = (optionId) => {
    if (isEnded || userHasVoted) return;

    if (poll.multipleChoice) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const submitVote = () => {
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one option');
      return;
    }
    onVote(poll._id, selectedOptions);
    setSelectedOptions([]);
  };

  return (
    <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-purple-100 dark:border-purple-800">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="avatar placeholder shrink-0">
                <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-12 h-12 text-sm font-semibold">
                  {poll.createdBy?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {poll.createdBy?.name}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-sm">•</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {formatDistanceToNow(new Date(poll.createdAt))} ago
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {poll.question}
                </h2>
              </div>
            </div>

            {/* Poll Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
              </div>
              {poll.endsAt && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {isEnded 
                        ? `Ended ${format(new Date(poll.endsAt), 'MMM dd, yyyy')}` 
                        : `Ends ${format(new Date(poll.endsAt), 'MMM dd, yyyy')}`
                      }
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {isEnded ? (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                <CheckCircleSolid className="w-4 h-4" />
                Ended
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                Active
              </div>
            )}
            {poll.multipleChoice && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                <HandRaisedIcon className="w-4 h-4" />
                Multiple Choice
              </div>
            )}
            {poll.isAnonymous && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                <ShieldCheckIcon className="w-4 h-4" />
                Anonymous
              </div>
            )}
          </div>
        </div>

        {/* Poll Options */}
        <div className="space-y-3 sm:space-y-4 mb-6">
          {poll.options?.map((option, index) => {
            const voteCount = typeof option.votes === 'number' ? option.votes : (option.votes?.length || 0);
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isUserChoice = option.votes?.some ? option.votes.some(vote => 
              (typeof vote === 'object' ? vote._id : vote) === currentUser?._id
            ) : false;
            const isSelected = selectedOptions.includes(option._id);

            return (
              <div key={option._id} className="relative">
                <div 
                  className={`relative overflow-hidden p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    isEnded || userHasVoted 
                      ? 'cursor-default' 
                      : 'hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transform hover:-translate-y-0.5'
                  } ${
                    isUserChoice 
                      ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                      : isSelected
                      ? 'border-fuchsia-400 dark:border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-900/20'
                      : 'border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50'
                  }`}
                  onClick={() => handleOptionSelect(option._id)}
                >
                  {/* Background Pattern */}
                  {canViewResults && (
                    <div 
                      className={`absolute inset-0 transition-all duration-1000 ease-out ${
                        isUserChoice 
                          ? 'bg-gradient-to-r from-purple-200/50 to-purple-300/50 dark:from-purple-700/30 dark:to-purple-600/30' 
                          : 'bg-gradient-to-r from-slate-100/50 to-slate-200/50 dark:from-slate-700/30 dark:to-slate-600/30'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  
                  <div className="relative flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Selection Indicator */}
                      {!canViewResults && (
                        <div className={`shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-fuchsia-500 border-fuchsia-500 shadow-lg' 
                            : 'border-slate-300 dark:border-slate-500 hover:border-purple-400'
                        }`}>
                          {isSelected && (
                            <CheckCircleSolid className="w-5 h-5 text-white" />
                          )}
                        </div>
                      )}
                      
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {option.text}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      {canViewResults && (
                        <div className="text-right">
                          <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
                            {percentage.toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {voteCount} vote{voteCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      )}
                      
                      {isUserChoice && (
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                          <CheckCircleSolid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Voters List (for non-anonymous polls) */}
                  {!poll.isAnonymous && canViewResults && option.votes?.length > 0 && Array.isArray(option.votes) && (
                    <div className="relative mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex flex-wrap gap-2">
                        {option.votes.slice(0, 8).map((vote, idx) => (
                          <div key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs">
                            <UserIcon className="w-3 h-3" />
                            <span>{typeof vote === 'object' ? vote.name : 'User'}</span>
                          </div>
                        ))}
                        {option.votes.length > 8 && (
                          <div className="inline-flex items-center px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 rounded-lg text-xs">
                            +{option.votes.length - 8} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Area */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {!userHasVoted && !isEnded ? (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {selectedOptions.length > 0 ? (
                <button 
                  onClick={submitVote} 
                  className="btn bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <HandRaisedIcon className="w-5 h-5 mr-2" />
                  Submit Vote{selectedOptions.length > 1 ? 's' : ''}
                </button>
              ) : (
                <div className="alert bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-blue-600 dark:stroke-blue-400 shrink-0 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-blue-800 dark:text-blue-200 text-sm">
                    Select {poll.multipleChoice ? 'options' : 'an option'} to vote
                  </span>
                </div>
              )}
              
              {totalVotes > 0 && !canViewResults && (
                <button
                  onClick={() => setShowResults(!showResults)}
                  className="btn btn-outline border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl"
                >
                  <ChartPieIcon className="w-5 h-5 mr-2" />
                  View Results
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CheckCircleSolid className="w-5 h-5 text-green-500" />
              <span>
                {userHasVoted ? 'You voted' : 'Poll ended'} • Results visible
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreatePollModal = ({ communityId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    question: '',
    options: [{ text: '' }, { text: '' }],
    endsAt: '',
    multipleChoice: false,
    isAnonymous: false
  });
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({
        ...formData,
        options: [...formData.options, { text: '' }]
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index, text) => {
    const newOptions = [...formData.options];
    newOptions[index] = { text };
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validOptions = formData.options.filter(option => option.text.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/polls/create', {
        ...formData,
        options: validOptions,
        communityId,
        endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : undefined
      });
      toast.success('Poll created successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-xl">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Create New Poll</h3>
              <p className="text-slate-600 dark:text-slate-400">Gather opinions and make decisions together</p>
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
          {/* Question */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Poll Question</span>
            </label>
            <textarea
              className="textarea textarea-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl resize-none"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="What would you like to ask your community?"
              rows={3}
              required
            />
            <label className="label">
              <span className="label-text-alt text-slate-500 dark:text-slate-400">
                Make it clear and engaging for better responses
              </span>
            </label>
          </div>

          {/* Options */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                Options ({formData.options.length}/10)
              </span>
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    className="input input-bordered flex-1 bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
                    value={option.text}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="btn btn-circle btn-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-0 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {formData.options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="btn btn-outline border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl mt-3 w-full sm:w-auto"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Option
              </button>
            )}
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* End Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-700 dark:text-slate-300">End Date (Optional)</span>
              </label>
              <input
                type="date"
                className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
                value={formData.endsAt}
                onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                min={minDateString}
              />
              <label className="label">
                <span className="label-text-alt text-slate-500 dark:text-slate-400">
                  Leave empty for no expiration
                </span>
              </label>
            </div>

            {/* Poll Settings */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <HandRaisedIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <div>
                      <span className="label-text font-medium text-slate-800 dark:text-slate-200">Multiple Choice</span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Allow users to select multiple options</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={formData.multipleChoice}
                    onChange={(e) => setFormData({ ...formData, multipleChoice: e.target.checked })}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <div>
                      <span className="label-text font-medium text-slate-800 dark:text-slate-200">Anonymous Voting</span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Hide who voted for what</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  />
                </label>
              </div>
            </div>
          </div>

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
              disabled={loading || !formData.question.trim() || formData.options.filter(opt => opt.text.trim()).length < 2}
            >
              {loading ? 'Creating...' : (
                <>
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Create Poll
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Polls;