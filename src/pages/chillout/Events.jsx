import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  CalendarIcon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronRightIcon,
  PhotoIcon,
  SparklesIcon,
  ClockIcon as TimeIcon,
  GlobeAltIcon,
  PlayIcon,
  UserIcon,
  TagIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  CalendarIcon as CalendarSolid,
  ClockIcon as ClockSolid
} from '@heroicons/react/24/solid';
import { format, parseISO, isPast, formatDistanceToNow } from 'date-fns';

const Events = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [community, setCommunity] = useState(null);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchCommunityAndEvents();
  }, [communityId, filter]);

  const fetchCommunityAndEvents = async () => {
    try {
      const communityRes = await api.get(`/api/communities/${communityId}`);
      setCommunity(communityRes.data);

      const eventsRes = await api.get(`/api/events/community/${communityId}?status=${filter}`);
      setEvents(eventsRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Events fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (eventId, status) => {
    try {
      await api.post(`/api/events/${eventId}/attendance`, { status });
      toast.success(`Attendance updated successfully!`);
      fetchCommunityAndEvents();
    } catch (error) {
      toast.error('Failed to update attendance');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
            <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading events...</p>
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
              <li className="text-purple-600 dark:text-purple-400 font-semibold">Events</li>
            </ul>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-6 py-3 border border-purple-200 dark:border-purple-800 shadow-lg mb-6">
              <CalendarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
                Event Hub
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
              Plan amazing events, manage attendance, and create unforgettable memories
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
                <span className="hidden sm:inline text-lg">Create Event</span>
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
                { key: 'upcoming', label: 'Upcoming', icon: SparklesIcon, count: events.filter(e => !isPast(new Date(e.date))).length },
                { key: 'past', label: 'Past Events', icon: CheckCircleIcon, count: events.filter(e => isPast(new Date(e.date))).length },
                { key: 'all', label: 'All Events', icon: CalendarIcon, count: events.length }
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

        {/* Events Content */}
        {events.length === 0 ? (
          <div className="flex justify-center">
            <div className="max-w-md w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-center border border-purple-200 dark:border-purple-800 shadow-xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CalendarIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                {filter === 'upcoming' ? 'No upcoming events' : `No ${filter} events`}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {filter === 'upcoming' 
                  ? 'Start planning your next adventure! Create an event to bring everyone together.'
                  : `No ${filter === 'all' ? '' : filter + ' '}events available right now.`
                }
              </p>
              {filter === 'upcoming' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Create First Event
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {events.map((event) => (
              <div key={event._id} className="break-inside-avoid">
                <EventCard 
                  event={event} 
                  onAttendance={handleAttendance}
                  onClick={() => setSelectedEvent(event)}
                  currentUser={user}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          communityId={communityId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchCommunityAndEvents();
            setShowCreateModal(false);
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={fetchCommunityAndEvents}
          currentUser={user}
        />
      )}
    </div>
  );
};

const EventCard = ({ event, onAttendance, onClick, currentUser }) => {
  const eventDate = new Date(event.date);
  const isEventPast = isPast(eventDate);
  const userAttendance = event.attendees?.find(a => a.user._id === currentUser?._id || a.user === currentUser?._id);
  const goingCount = event.attendees?.filter(a => a.status === 'going').length || 0;
  const maybeCount = event.attendees?.filter(a => a.status === 'maybe').length || 0;

  return (
    <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-purple-100 dark:border-purple-800 cursor-pointer">
      {/* Cover Image or Placeholder */}
      <div className="relative overflow-hidden" onClick={onClick}>
        {event.coverImage ? (
          <img 
            src={event.coverImage} 
            alt={event.title} 
            className="w-full h-48 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 sm:h-52 bg-gradient-to-br from-purple-400 via-fuchsia-400 to-pink-400 flex items-center justify-center">
            <CalendarSolid className="w-16 h-16 text-white/80" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge */}
        {isEventPast && (
          <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            Past Event
          </div>
        )}
        
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {format(eventDate, 'dd')}
            </div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {format(eventDate, 'MMM')}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" onClick={onClick}>
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ClockSolid className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span>{format(eventDate, 'h:mm a • MMM dd, yyyy')}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <MapPinIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="truncate">{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <UserGroupIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span>
              {goingCount} going{maybeCount > 0 && ` • ${maybeCount} maybe`}
            </span>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-100 dark:border-purple-800">
          <div className="avatar placeholder">
            <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-8 h-8 text-sm font-semibold">
              {event.createdBy?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Created by {event.createdBy?.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formatDistanceToNow(new Date(event.createdAt))} ago
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isEventPast && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onAttendance(event._id, 'going')}
              className={`flex-1 btn btn-sm rounded-xl font-medium transition-all duration-300 ${
                userAttendance?.status === 'going' 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
              }`}
            >
              <CheckCircleSolid className="w-4 h-4 mr-1" />
              Going
            </button>
            <button
              onClick={() => onAttendance(event._id, 'maybe')}
              className={`flex-1 btn btn-sm rounded-xl font-medium transition-all duration-300 ${
                userAttendance?.status === 'maybe' 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
              }`}
            >
              <ClockIcon className="w-4 h-4 mr-1" />
              Maybe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CreateEventModal = ({ communityId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (file) => {
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('date', new Date(formData.date).toISOString());
      if (formData.endDate) {
        uploadData.append('endDate', new Date(formData.endDate).toISOString());
      }
      uploadData.append('location', formData.location);
      uploadData.append('communityId', communityId);
      if (coverImage) {
        uploadData.append('coverImage', coverImage);
      }

      await api.post('/api/events/create', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Event created successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
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
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Create New Event</h3>
              <p className="text-slate-600 dark:text-slate-400">Plan your next amazing gathering</p>
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
          {/* Cover Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Event Cover Image</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                dragActive 
                  ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-slate-300 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-600" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mb-4">
                    <PhotoIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Add a cover image
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Drop an image here or click to browse
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="cover-upload"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                  />
                  <label
                    htmlFor="cover-upload"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    Choose Image
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Event Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Event Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's the event called?"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Tell everyone what this event is about..."
              required
            />
          </div>

          {/* Date/Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Start Date & Time</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-700 dark:text-slate-300">End Date & Time</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.date}
              />
              <label className="label">
                <span className="label-text-alt text-slate-500 dark:text-slate-400">Optional</span>
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Location</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Where is this happening?"
            />
            <label className="label">
              <span className="label-text-alt text-slate-500 dark:text-slate-400">
                Add a location to help attendees find the event
              </span>
            </label>
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
              disabled={loading || !formData.title.trim() || !formData.description.trim() || !formData.date}
            >
              {loading ? 'Creating...' : (
                <>
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EventDetailModal = ({ event, onClose, onUpdate, currentUser }) => {
  const [todoItem, setTodoItem] = useState('');
  const [loading, setLoading] = useState(false);

  const addTodoItem = async (e) => {
    e.preventDefault();
    if (!todoItem.trim()) return;

    setLoading(true);
    try {
      await api.post(`/api/events/${event._id}/todo`, { task: todoItem });
      toast.success('Todo item added!');
      setTodoItem('');
      onUpdate();
    } catch (error) {
      toast.error('Failed to add todo item');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoItem = async (todoId) => {
    try {
      await api.put(`/api/events/${event._id}/todo/${todoId}`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update todo item');
    }
  };

  const eventDate = new Date(event.date);
  const isEventPast = isPast(eventDate);

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-6xl h-[90vh] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800 p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-xl">
              <CalendarSolid className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 truncate">
                {event.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{format(eventDate, 'PPP')}</span>
                <span>•</span>
                <ClockIcon className="w-4 h-4" />
                <span>{format(eventDate, 'p')}</span>
              </div>
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
          {/* Cover Image */}
          {event.coverImage && (
            <div className="relative">
              <img 
                src={event.coverImage} 
                alt={event.title} 
                className="w-full h-64 sm:h-80 object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          <div className="p-6">
            {/* Event Info */}
            <div className="mb-8">
              <div className="prose prose-sm sm:prose max-w-none mb-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  {event.description}
                </p>
              </div>

              {event.location && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <MapPinIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">Location</div>
                    <div className="text-slate-600 dark:text-slate-400">{event.location}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Attendees Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Attendees
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    status: 'going', 
                    label: 'Going', 
                    color: 'from-green-400 to-emerald-500', 
                    bgColor: 'bg-green-50 dark:bg-green-900/20', 
                    textColor: 'text-green-700 dark:text-green-300',
                    borderColor: 'border-green-200 dark:border-green-800'
                  },
                  { 
                    status: 'maybe', 
                    label: 'Maybe', 
                    color: 'from-yellow-400 to-orange-500', 
                    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', 
                    textColor: 'text-yellow-700 dark:text-yellow-300',
                    borderColor: 'border-yellow-200 dark:border-yellow-800'
                  },
                  { 
                    status: 'not_going', 
                    label: "Can't Go", 
                    color: 'from-red-400 to-pink-500', 
                    bgColor: 'bg-red-50 dark:bg-red-900/20', 
                    textColor: 'text-red-700 dark:text-red-300',
                    borderColor: 'border-red-200 dark:border-red-800'
                  }
                ].map(({ status, label, color, bgColor, textColor, borderColor }) => {
                  const attendees = event.attendees?.filter(a => a.status === status) || [];
                  return (
                    <div key={status} className={`card ${bgColor} border ${borderColor} backdrop-blur-sm`}>
                      <div className="card-body p-6">
                        <h4 className={`font-bold mb-4 flex items-center justify-between ${textColor}`}>
                          <span>{label}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${color} text-white shadow-md`}>
                            {attendees.length}
                          </span>
                        </h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {attendees.length === 0 ? (
                            <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">
                              No one yet
                            </p>
                          ) : (
                            attendees.map(attendee => (
                              <div 
                                key={attendee._id || attendee.user} 
                                className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-800/70 rounded-xl backdrop-blur-sm border border-white/50 dark:border-slate-600/50"
                              >
                                <div className="avatar placeholder">
                                  <div className={`bg-gradient-to-br ${color} text-white rounded-full w-8 h-8 text-sm font-semibold`}>
                                    {(attendee.user?.name || attendee.user || 'U').charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                                  {attendee.user?.name || attendee.user}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Todo List Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Event Todo List
              </h3>
              
              {/* Add Todo Form */}
              {!isEventPast && (
                <form onSubmit={addTodoItem} className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      className="flex-1 input input-bordered text-slate-200 bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
                      value={todoItem}
                      onChange={(e) => setTodoItem(e.target.value)}
                      placeholder="Add a task to prepare for this event..."
                    />
                    <button 
                      type="submit" 
                      className={`btn bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${loading ? 'loading' : ''}`} 
                      disabled={loading || !todoItem.trim()}
                    >
                      {loading ? '' : (
                        <>
                          <PlusIcon className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Add Task</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Todo Items */}
              <div className="space-y-3">
                {(!event.todoList || event.todoList.length === 0) ? (
                  <div className="card bg-slate-50 dark:bg-slate-700/50 border-2 border-dashed border-slate-300 dark:border-slate-600">
                    <div className="card-body py-12 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        No tasks yet
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400">
                        {isEventPast 
                          ? 'No preparation tasks were added for this event' 
                          : 'Add tasks to help organize and prepare for this event!'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  event.todoList.map((todo) => (
                    <div 
                      key={todo._id} 
                      className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-300 ${
                        todo.completed 
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                          : 'bg-white/70 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-lg"
                        checked={todo.completed}
                        onChange={() => toggleTodoItem(todo._id)}
                        disabled={isEventPast}
                      />
                      <span className={`flex-1 font-medium transition-all duration-300 ${
                        todo.completed 
                          ? 'line-through text-slate-500 dark:text-slate-400' 
                          : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {todo.task}
                      </span>
                      {todo.completed && (
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <CheckCircleSolid className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Progress Bar */}
              {event.todoList && event.todoList.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                  <div className="flex items-center justify-between text-sm font-medium mb-3">
                    <span className="text-slate-700 dark:text-slate-300">Task Progress</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {event.todoList.filter(t => t.completed).length} / {event.todoList.length} completed
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{ 
                          width: `${(event.todoList.filter(t => t.completed).length / event.todoList.length) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal backdrop */}
      <div className="modal-backdrop bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};

export default Events; 