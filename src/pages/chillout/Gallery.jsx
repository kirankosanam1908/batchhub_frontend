import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  PhotoIcon,
  PlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  PlayIcon,
  EyeIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

const Gallery = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [community, setCommunity] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCommunityAndMedia();
  }, [communityId, filter, currentPage]);

  const fetchCommunityAndMedia = async () => {
    try {
      const communityRes = await api.get(`/api/communities/${communityId}`);
      setCommunity(communityRes.data);

      const mediaRes = await api.get(`/api/media/community/${communityId}?page=${currentPage}&limit=20${filter !== 'all' ? `&type=${filter}` : ''}`);
      setMedia(mediaRes.data.media || []);
      setTotalPages(mediaRes.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch media');
      console.error('Media fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (mediaId) => {
    try {
      await api.post(`/api/media/${mediaId}/like`);
      fetchCommunityAndMedia();
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (mediaId, comment) => {
    try {
      await api.post(`/api/media/${mediaId}/comment`, { text: comment });
      fetchCommunityAndMedia();
      if (selectedMedia && selectedMedia._id === mediaId) {
        const updatedMedia = media.find(m => m._id === mediaId);
        if (updatedMedia) {
          setSelectedMedia(updatedMedia);
        }
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const filteredMedia = media;

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction) => {
    const newIndex = lightboxIndex + direction;
    if (newIndex >= 0 && newIndex < filteredMedia.length) {
      setLightboxIndex(newIndex);
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
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading your memories...</p>
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
              <li className="text-purple-600 dark:text-purple-400 font-semibold">Gallery</li>
            </ul>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-6 py-3 border border-purple-200 dark:border-purple-800 shadow-lg mb-6">
              <PhotoIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
                Memory Gallery
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
              Share and relive your best moments together
            </p>
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowUploadModal(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-3">
                <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline text-lg">Share Memories</span>
                <span className="sm:hidden">Share</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-2 border border-purple-200 dark:border-purple-800 shadow-lg">
              {[
                { key: 'all', label: 'All Media', icon: SparklesIcon, count: media.length },
                { key: 'image', label: 'Photos', icon: PhotoIcon, count: media.filter(m => m.type === 'image').length },
                { key: 'video', label: 'Videos', icon: PlayIcon, count: media.filter(m => m.type === 'video').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filter === tab.key 
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => {setFilter(tab.key); setCurrentPage(1);}}
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

        {/* Media Content */}
        {filteredMedia.length === 0 ? (
          <div className="flex justify-center">
            <div className="max-w-md w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-center border border-purple-200 dark:border-purple-800 shadow-xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <PhotoIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                {filter === 'all' ? 'No memories yet' : `No ${filter}s yet`}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {filter === 'all' 
                  ? 'Start building your memory collection by sharing your first photo or video!'
                  : `Share your first ${filter} to get started!`
                }
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Share First Memory
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6 mb-8">
              {filteredMedia.map((item, index) => (
                <div key={item._id} className="break-inside-avoid">
                  <MediaCard 
                    media={item} 
                    onLike={handleLike}
                    onClick={() => setSelectedMedia(item)}
                    onImageClick={() => openLightbox(index)}
                    currentUser={user}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-2 border border-purple-200 dark:border-purple-800 shadow-lg">
                  <div className="flex items-center">
                    <button 
                      className="px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-100 dark:hover:bg-slate-700"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 text-slate-700 dark:text-slate-300 font-medium">
                      <span className="hidden sm:inline">Page </span>{currentPage} of {totalPages}
                    </span>
                    <button 
                      className="px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-100 dark:hover:bg-slate-700"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showUploadModal && (
        <UploadMediaModal
          communityId={communityId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            fetchCommunityAndMedia();
            setShowUploadModal(false);
          }}
        />
      )}

      {selectedMedia && (
        <MediaDetailModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onLike={handleLike}
          onComment={handleComment}
          currentUser={user}
        />
      )}

      {lightboxIndex !== null && (
        <Lightbox
          media={filteredMedia[lightboxIndex]}
          onClose={closeLightbox}
          onPrevious={() => navigateLightbox(-1)}
          onNext={() => navigateLightbox(1)}
          hasPrevious={lightboxIndex > 0}
          hasNext={lightboxIndex < filteredMedia.length - 1}
        />
      )}
    </div>
  );
};

const MediaCard = ({ media, onLike, onClick, onImageClick, currentUser }) => {
  const hasLiked = media.likes?.some(like => 
    (typeof like === 'object' ? like._id : like) === currentUser?._id
  );
  const likeCount = Array.isArray(media.likes) ? media.likes.length : (media.likes || 0);
  const commentCount = Array.isArray(media.comments) ? media.comments.length : (media.comments || 0);

  return (
    <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-purple-100 dark:border-purple-800">
      {/* Media Display */}
      <div 
        className="relative cursor-pointer overflow-hidden"
        onClick={media.type === 'image' ? onImageClick : onClick}
      >
        {media.type === 'image' ? (
          <img 
            src={media.url} 
            alt={media.caption || 'Community media'} 
            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ aspectRatio: 'auto' }}
          />
        ) : (
          <div className="relative">
            <video 
              src={media.url} 
              className="w-full object-cover"
              poster={media.thumbnail}
              style={{ aspectRatio: '16/9' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <PlayIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* View Icon */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <EyeIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="avatar placeholder">
            <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-10 h-10 text-sm font-semibold">
              {media.uploadedBy?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {media.uploadedBy?.name}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CalendarIcon className="w-3 h-3" />
              <span>{format(new Date(media.createdAt), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Caption */}
        {media.caption && (
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {media.caption}
          </p>
        )}

        {/* Tags */}
        {media.tags && media.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {media.tags.slice(0, 3).map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg text-xs font-medium">
                <TagIcon className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {media.tags.length > 3 && (
              <span className="text-purple-600 dark:text-purple-400 text-xs font-medium">
                +{media.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(media._id);
              }}
              className={`group flex items-center gap-2 transition-all duration-300 ${
                hasLiked 
                  ? 'text-red-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
              }`}
            >
              {hasLiked ? (
                <HeartSolid className="w-5 h-5 animate-pulse" />
              ) : (
                <HeartIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              )}
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            
            <button
              onClick={onClick}
              className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
            >
              <ChatBubbleLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium">{commentCount}</span>
            </button>
          </div>
          
          <button className="group p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-all duration-300">
            <ShareIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadMediaModal = ({ communityId, onClose, onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);
    
    const newPreviews = fileArray.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
    setPreviews(newPreviews);
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
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previews[index].url);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('communityId', communityId);
      formData.append('caption', caption);
      formData.append('tags', tags);

      await api.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Media uploaded successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, []);

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-xl">
              <PhotoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Share Memories</h3>
              <p className="text-slate-600 dark:text-slate-400">Upload photos and videos</p>
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
          {/* File Upload Area */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Media Files</span>
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
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mb-4">
                  <PhotoIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Drop files here or click to browse
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Support for images and videos up to 100MB each
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="media-upload"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFileChange(e.target.files)}
                />
                <label
                  htmlFor="media-upload"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  <PlusIcon className="w-5 h-5" />
                  Choose Files
                </label>
              </div>
            </div>
          </div>

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                  Preview ({previews.length} file{previews.length !== 1 ? 's' : ''})
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                      {preview.type === 'image' ? (
                        <img 
                          src={preview.url} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video 
                            src={preview.url} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <PlayIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Caption</span>
            </label>
            <textarea
              className="textarea textarea-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl resize-none"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Share what makes this moment special..."
            />
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Tags</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="trip, fun, memories, friends (comma-separated)"
            />
            <label className="label">
              <span className="label-text-alt text-slate-500 dark:text-slate-400">
                Add tags to help organize and find your memories
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="button" 
              className="flex-1 btn btn-ghost bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl order-2 sm:order-1" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`flex-1 btn border-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 order-1 sm:order-2 ${loading ? 'loading' : ''}`}
              disabled={loading || files.length === 0}
            >
              {loading ? 'Uploading...' : `Share ${files.length} ${files.length === 1 ? 'Memory' : 'Memories'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MediaDetailModal = ({ media, onClose, onLike, onComment, currentUser }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const hasLiked = media.likes?.some(like => 
    (typeof like === 'object' ? like._id : like) === currentUser?._id
  );
  const likeCount = Array.isArray(media.likes) ? media.likes.length : (media.likes || 0);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await onComment(media._id, comment);
      setComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-6xl h-[90vh] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800 p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-10 h-10 text-sm font-semibold">
                {media.uploadedBy?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{media.uploadedBy?.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {format(new Date(media.createdAt), 'PPP')}
              </div>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-circle bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600 hover:rotate-90 transition-all duration-300" 
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Media Display */}
          <div className="flex-1 bg-black flex items-center justify-center min-h-[50vh] lg:min-h-full">
            {media.type === 'image' ? (
              <img 
                src={media.url} 
                alt={media.caption || 'Community media'} 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video 
                src={media.url} 
                controls 
                autoPlay
                className="max-w-full max-h-full"
              />
            )}
          </div>

          {/* Details Sidebar */}
          <div className="lg:w-96 flex flex-col bg-slate-50 dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700">
            {/* Media Info */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              {media.caption && (
                <p className="text-slate-800 dark:text-slate-200 mb-4 leading-relaxed">{media.caption}</p>
              )}
              {media.tags && media.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {media.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg text-sm font-medium">
                      <TagIcon className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onLike(media._id)}
                className={`group flex items-center gap-3 transition-all duration-300 ${
                  hasLiked ? 'text-red-500' : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
                }`}
              >
                {hasLiked ? (
                  <HeartSolid className="w-6 h-6 animate-pulse" />
                ) : (
                  <HeartIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                )}
                <span className="font-medium">
                  {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                </span>
              </button>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <ChatBubbleLeftIcon className="w-5 h-5" />
                Comments
              </h3>
              <div className="space-y-4">
                {(!media.comments || media.comments.length === 0) ? (
                  <div className="text-center py-8">
                    <ChatBubbleLeftIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  media.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <div className="avatar placeholder shrink-0">
                        <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-8 h-8 text-xs font-semibold">
                          {comment.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-600">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">
                            {comment.user?.name}
                          </div>
                          <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            {comment.text}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-4">
                          {format(new Date(comment.createdAt), 'MMM dd, yyyy • h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <form onSubmit={handleComment} className="flex gap-3">
                <div className="avatar placeholder shrink-0">
                  <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-8 h-8 text-xs font-semibold">
                    {currentUser?.name?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 input input-bordered bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-sm"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <button 
                    type="submit" 
                    className={`btn btn-sm bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${loading ? 'loading' : ''}`}
                    disabled={loading || !comment.trim()}
                  >
                    {loading ? '' : 'Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal backdrop click handler */}
      <div className="modal-backdrop bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};

const Lightbox = ({ media, onClose, onPrevious, onNext, hasPrevious, hasNext }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrevious) onPrevious();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext]);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {hasPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
        >
          <ArrowRightIcon className="w-6 h-6" />
        </button>
      )}

      {/* Media Content */}
      <div className="max-w-[95vw] max-h-[95vh] flex items-center justify-center">
        {media.type === 'image' ? (
          <img 
            src={media.url} 
            alt={media.caption || 'Community media'} 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          />
        ) : (
          <video 
            src={media.url} 
            controls 
            autoPlay
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
          />
        )}
      </div>

      {/* Media Info */}
      {media.caption && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="bg-black/50 backdrop-blur-md text-white rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-8 h-8 text-sm font-semibold">
                  {media.uploadedBy?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="font-semibold">{media.uploadedBy?.name}</div>
                <div className="text-sm text-white/70">
                  {format(new Date(media.createdAt), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
            <p className="leading-relaxed">{media.caption}</p>
            {media.tags && media.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {media.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm">
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Hints */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-black/50 backdrop-blur-md text-white rounded-xl px-4 py-2 text-sm">
          <div className="flex items-center gap-4">
            <span>ESC to close</span>
            {(hasPrevious || hasNext) && (
              <span>← → to navigate</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;