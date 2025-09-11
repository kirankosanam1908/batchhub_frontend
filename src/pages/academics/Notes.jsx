import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  DocumentTextIcon, 
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  BookOpenIcon,
  AcademicCapIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Notes = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [community, setCommunity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [downloadingNotes, setDownloadingNotes] = useState(new Set());

  useEffect(() => {
    fetchCommunityAndNotes();
  }, [communityId, filterSubject, filterSemester, currentPage, sortBy]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      fetchCommunityAndNotes();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const fetchCommunityAndNotes = async () => {
    try {
      // Fetch community details
      if (!community) {
        const communityRes = await api.get(`/api/communities/${communityId}`);
        setCommunity(communityRes.data);
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(filterSubject && { subject: filterSubject }),
        ...(filterSemester && { semester: filterSemester }),
      });

      // Fetch notes with server-side filtering and pagination
      const notesRes = await api.get(`/api/notes/community/${communityId}?${params}`);
      setNotes(notesRes.data.notes || []);
      setTotalPages(notesRes.data.totalPages || 1);
      setCurrentPage(parseInt(notesRes.data.currentPage) || 1);
    } catch (error) {
      toast.error('Failed to fetch study materials');
      console.error('Notes fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (noteId, noteTitle, fileUrl) => {
    try {
      setDownloadingNotes(prev => new Set([...prev, noteId]));
      
      // First, get the download URL and update the count
      const { data } = await api.get(`/api/notes/${noteId}/download`);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = data.url || fileUrl;
      link.download = noteTitle;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // For PDFs and other viewable files, open in new tab
      // For downloadable files, force download
      const fileExtension = noteTitle.split('.').pop()?.toLowerCase();
      const viewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
      
      if (viewableTypes.includes(fileExtension)) {
        window.open(data.url || fileUrl, '_blank');
        toast.success(`Opening ${noteTitle}`);
      } else {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloading ${noteTitle}`);
      }
      
      // Refresh to show updated download count
      setTimeout(() => {
        fetchCommunityAndNotes();
      }, 1000);
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to access file. Please try again.');
    } finally {
      setDownloadingNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(noteId);
        return newSet;
      });
    }
  };

  const handleDelete = async (noteId, noteTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${noteTitle}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/notes/${noteId}`);
      toast.success('Study material deleted successfully');
      fetchCommunityAndNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    }
  };

  // Get unique subjects and semesters for filters
  const uniqueSubjects = [...new Set(notes.map(note => note.subject).filter(Boolean))];
  const uniqueSemesters = [...new Set(notes.map(note => note.semester).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSubject('');
    setFilterSemester('');
    setCurrentPage(1);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen academic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Loading study materials...</p>
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
              <li className="text-white/60">Study Materials</li>
            </ul>
          </div>
          
          <div className="card bg-white shadow-xl border-0 p-8 mb-6 animate-slide-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold academic-text-primary flex items-center gap-3 mb-3">
                  <BookOpenIcon className="w-10 h-10 academic-text-accent" />
                  Study Materials Repository
                </h1>
                <p className="text-gray-600 text-xl mb-4">
                  Organized collection of notes, documents, and study resources
                </p>
                {notes.length > 0 && (
                  <div className="flex items-center gap-6 text-base academic-text-secondary">
                    <span className="flex items-center gap-2">
                      📁 <strong>{notes.length}</strong> files available
                    </span>
                    <span className="flex items-center gap-2">
                      🎯 <strong>{uniqueSubjects.length}</strong> subjects
                    </span>
                    <span className="flex items-center gap-2">
                      📚 <strong>{uniqueSemesters.length}</strong> semesters
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn academic-primary shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                Upload Study Material
              </button>
            </div>
          </div>
        </div>

        {/* Academic Search and Filter */}
        <div className="card bg-white shadow-xl border-0 mb-8 animate-fade-in">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Academic Search */}
              <div className="form-control lg:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold academic-text-dark text-lg">Search Materials</span>
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 academic-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search by title, description, or tags..."
                    className="input input-bordered w-full pl-12 h-12 academic-border focus:academic-border text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold academic-text-dark text-lg">Subject</span>
                </label>
                <select
                  className="select select-bordered h-12 academic-border focus:academic-border text-base"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  <option value="">All Subjects</option>
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold academic-text-dark text-lg">Semester</span>
                </label>
                <select
                  className="select select-bordered h-12 academic-border focus:academic-border text-base"
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {uniqueSemesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold academic-text-dark text-lg">Actions</span>
                </label>
                <button 
                  onClick={clearFilters}
                  className="btn btn-outline academic-border academic-text-primary hover:academic-primary h-12 transition-all"
                  disabled={!searchTerm && !filterSubject && !filterSemester}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Study Materials Grid */}
        {loading && currentPage > 1 ? (
          <div className="flex justify-center py-8">
            <div className="text-white text-lg">Loading more materials...</div>
          </div>
        ) : notes.length === 0 ? (
          <div className="card bg-white shadow-xl border-0">
            <div className="p-20 text-center">
              <FolderIcon className="w-24 h-24 mx-auto academic-text-light mb-6" />
              <h3 className="text-3xl font-bold academic-text-primary mb-4">No Study Materials Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {searchTerm || filterSubject || filterSemester ? 
                  'Try adjusting your search criteria or filters to find relevant materials.' : 
                  'Be the first to contribute! Upload study materials to help your batchmates.'
                }
              </p>
              {!searchTerm && !filterSubject && !filterSemester && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn academic-primary shadow-lg hover:shadow-xl transition-all"
                >
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                  Upload First Material
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {notes.map((note) => (
                <StudyMaterialCard 
                  key={note._id} 
                  note={note} 
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  currentUser={user}
                  community={community}
                  isDownloading={downloadingNotes.has(note._id)}
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

      {/* Upload Modal - FIXED MODAL STRUCTURE */}
      {showUploadModal && (
        <UploadStudyMaterialModal
          communityId={communityId}
          community={community}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            fetchCommunityAndNotes();
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
};

const StudyMaterialCard = ({ note, onDownload, onDelete, currentUser, community, isDownloading }) => {
  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      ppt: '📊',
      pptx: '📊',
      xls: '📈',
      xlsx: '📈',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      mp4: '🎥',
      avi: '🎥',
      mov: '🎥',
      txt: '📃',
      zip: '🗜️',
      rar: '🗜️'
    };
    return icons[fileType] || '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if user can delete this note
  const canDelete = note.uploadedBy?._id === currentUser?._id || 
                   community?.moderators?.includes(currentUser?._id);

  return (
    <div className="card bg-white shadow-xl hover:shadow-2xl transition-all border-0 overflow-hidden hover:-translate-y-2 animate-slide-in">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-3">
            <h2 className="text-xl font-bold academic-text-primary line-clamp-2 mb-3">
              {note.title}
            </h2>
            {note.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {note.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className="text-4xl">{getFileIcon(note.fileType)}</span>
          </div>
        </div>
        
        {/* Academic Tags */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="academic-light px-4 py-2 rounded-full text-sm font-semibold">
            {note.subject}
          </div>
          {note.semester && (
            <div className="academic-accent px-4 py-2 rounded-full text-sm font-semibold">
              {note.semester}
            </div>
          )}
        </div>

        {/* Study Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 academic-text-secondary text-xs rounded-full font-medium">
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 academic-text-secondary text-xs rounded-full font-medium">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* File Metadata */}
        <div className="text-sm text-gray-500 mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 font-medium">
              <span>📤 {note.uploadedBy?.name || 'Unknown'}</span>
            </span>
            {note.fileSize && (
              <span className="text-xs bg-gray-50 px-3 py-1 rounded-full font-semibold">
                {formatFileSize(note.fileSize)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs academic-text-secondary font-medium">
              📅 {format(new Date(note.createdAt), 'MMM dd, yyyy')}
            </span>
            <span className="flex items-center gap-1 text-xs academic-text-secondary font-medium">
              <EyeIcon className="w-3 h-3" />
              {note.downloads || 0} downloads
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 academic-border-light border-t">
          <button
            onClick={() => onDownload(note._id, note.title, note.fileUrl)}
            disabled={isDownloading}
            className={`btn academic-primary flex-1 transition-all hover:-translate-y-1 ${isDownloading ? 'loading' : ''}`}
            title="Download or view file"
          >
            {isDownloading ? (
              <span>Opening...</span>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                Access
              </>
            )}
          </button>
          
          {canDelete && (
            <button
              onClick={() => onDelete(note._id, note.title)}
              className="btn btn-outline status-text-error hover:status-error transition-all"
              title="Delete file"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// FIXED MODAL COMPONENT
const UploadStudyMaterialModal = ({ communityId, community, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
    tags: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Academic subjects suggestions
  const commonSubjects = [
    'Computer Science', 'Data Structures', 'Algorithms', 
    'Database Management', 'Operating Systems', 'Computer Networks', 'Software Engineering',
    'Machine Learning', 'Artificial Intelligence', 'Web Development',
    'Mobile Development', 'Cybersecurity', 'Mathematics', 'Statistics',
    'Physics', 'Chemistry', 'Electronics', 'Digital Logic'
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Drag and drop handlers
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
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // Auto-fill title if empty
      if (!formData.title && droppedFile.name) {
        const fileName = droppedFile.name.split('.').slice(0, -1).join('.');
        setFormData(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    
    // Auto-fill title if empty
    if (!formData.title && selectedFile.name) {
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setFormData(prev => ({ ...prev, title: fileName }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    // File size validation (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    // File type validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported. Please upload PDF, DOC, PPT, XLS, images, or text files.');
      return;
    }

    setLoading(true);
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('subject', formData.subject);
    uploadData.append('semester', formData.semester);
    uploadData.append('tags', formData.tags);
    uploadData.append('communityId', communityId);

    try {
      await api.post('/api/notes/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000 // 60 seconds timeout for large files
      });
      toast.success('Study material uploaded successfully! 📚');
      onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Upload timeout. Please try with a smaller file or check your connection.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to upload file. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    // FIXED MODAL STRUCTURE
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[95vh] overflow-y-auto w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 pb-6 academic-border-light border-b">
            <div>
              <h3 className="text-3xl font-bold academic-text-primary flex items-center gap-3">
                <ArrowUpTrayIcon className="w-8 h-8 academic-text-accent" />
                Upload Study Material
              </h3>
              <p className="text-gray-600 mt-2 text-lg">Share educational resources with your academic community</p>
            </div>
            <button 
              className="btn btn-ghost btn-circle hover:bg-gray-100 transition-colors" 
              onClick={onClose}
              type="button"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xl font-bold academic-text-dark">Academic File *</span>
              </label>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all ${
                  dragActive 
                    ? 'academic-border academic-light scale-105 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-6">
                    <CloudArrowUpIcon className="w-20 h-20 mx-auto status-text-success" />
                    <div>
                      <p className="font-bold text-xl academic-text-primary">{file.name}</p>
                      <p className="text-gray-500 text-lg mt-2">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="btn btn-outline academic-text-primary hover:academic-primary transition-all"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <CloudArrowUpIcon className="w-20 h-20 mx-auto text-gray-400" />
                    <div>
                      <p className="text-2xl font-bold academic-text-dark">Drop your academic file here</p>
                      <p className="text-gray-500 mt-3 text-lg">
                        or click to browse your computer
                      </p>
                      <p className="text-sm text-gray-400 mt-3">
                        Supported: PDF, DOC, PPT, XLS, Images, Text files • Max 50MB
                      </p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.zip,.rar"
                  id="file-upload"
                />
                
                {!file && (
                  <label 
                    htmlFor="file-upload" 
                    className="btn academic-primary mt-6 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                  >
                    Choose Academic File
                  </label>
                )}
              </div>
            </div>

            {/* Academic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold academic-text-dark text-lg">Material Title *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered h-14 text-lg academic-border focus:academic-border focus:shadow-lg transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Database Management Chapter 1 Notes"
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold academic-text-dark text-lg">Subject *</span>
                </label>
                <input
                  type="text"
                  list="subjects"
                  className="input input-bordered h-14 text-lg academic-border focus:academic-border focus:shadow-lg transition-all"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Computer Science"
                  required
                  maxLength={50}
                />
                <datalist id="subjects">
                  {commonSubjects.map(subject => (
                    <option key={subject} value={subject} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold academic-text-dark text-lg">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-32 text-base academic-border focus:academic-border focus:shadow-lg transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Brief description of the content, what topics are covered, difficulty level, etc."
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold academic-text-dark text-lg">Semester/Year</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered h-12 text-base academic-border focus:academic-border focus:shadow-lg transition-all"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="e.g., Semester 5, Year 3"
                  maxLength={20}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold academic-text-dark text-lg">Tags</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered h-12 text-base academic-border focus:academic-border focus:shadow-lg transition-all"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="algorithms, theory, practice, exam-prep"
                  maxLength={200}
                />
              </div>
            </div>

            {/* Academic Guidelines */}
            <div className="academic-light rounded-2xl p-6 border academic-border-light">
              <h4 className="font-bold academic-text-primary mb-4 flex items-center gap-2 text-lg">
                <AcademicCapIcon className="w-6 h-6" />
                Academic Upload Guidelines
              </h4>
              <ul className="text-sm academic-text-dark space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Ensure content is relevant to the course curriculum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Use clear, descriptive titles and subject names</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Add comprehensive descriptions and relevant tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Respect copyright and only upload original or permitted content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Maximum file size: 50MB per upload</span>
                </li>
              </ul>
            </div>

            {/* Upload Progress */}
            {loading && (
              <div className="academic-light rounded-2xl p-6 border academic-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin academic-text-primary"></div>
                  <span className="font-bold text-lg academic-text-primary">Uploading your academic material...</span>
                </div>
                <progress className="progress academic-secondary w-full h-3"></progress>
                <p className="text-sm text-gray-600 mt-3">Please wait while we process and upload your file.</p>
              </div>
            )}

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
                {loading ? 'Uploading Material...' : 'Upload Study Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Notes;        