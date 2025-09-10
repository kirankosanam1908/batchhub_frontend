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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary font-semibold">Loading study materials...</p>
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
              <li className="text-gray-600">Study Materials</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                  <BookOpenIcon className="w-8 h-8 text-primary" />
                  Study Materials Repository
                </h1>
                <p className="text-gray-600 text-lg">
                  Organized collection of notes, documents, and study resources
                </p>
                {notes.length > 0 && (
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>📁 {notes.length} files available</span>
                    <span>•</span>
                    <span>🎯 {uniqueSubjects.length} subjects</span>
                    <span>•</span>
                    <span>📚 {uniqueSemesters.length} semesters</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn btn-primary shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                Upload Study Material
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Academic Search */}
              <div className="form-control lg:col-span-2">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Search Materials</span>
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, description, or tags..."
                    className="input input-bordered w-full pl-10 focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Subject</span>
                </label>
                <select
                  className="select select-bordered focus:border-primary"
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
                  <span className="label-text font-medium text-gray-700">Semester</span>
                </label>
                <select
                  className="select select-bordered focus:border-primary"
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
                  <span className="label-text font-medium text-gray-700">Actions</span>
                </label>
                <button 
                  onClick={clearFilters}
                  className="btn btn-outline hover:btn-primary transition-all"
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
            <div className="text-primary">Loading more materials...</div>
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-16 text-center">
              <FolderIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Study Materials Found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || filterSubject || filterSemester ? 
                  'Try adjusting your search criteria or filters to find relevant materials.' : 
                  'Be the first to contribute! Upload study materials to help your batchmates.'
                }
              </p>
              {!searchTerm && !filterSubject && !filterSemester && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-primary"
                >
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                  Upload First Material
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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

      {/* Upload Modal */}
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-3">
            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
              {note.title}
            </h2>
            {note.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {note.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className="text-3xl">{getFileIcon(note.fileType)}</span>
          </div>
        </div>
        
        {/* Academic Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {note.subject}
          </div>
          {note.semester && (
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {note.semester}
            </div>
          )}
        </div>

        {/* Study Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* File Metadata */}
        <div className="text-sm text-gray-500 mb-4 space-y-1">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <span>📤 {note.uploadedBy?.name || 'Unknown'}</span>
            </span>
            {note.fileSize && (
              <span className="text-xs bg-gray-50 px-2 py-1 rounded">
                {formatFileSize(note.fileSize)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs">
              📅 {format(new Date(note.createdAt), 'MMM dd, yyyy')}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <EyeIcon className="w-3 h-3" />
              {note.downloads || 0} downloads
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onDownload(note._id, note.title, note.fileUrl)}
            disabled={isDownloading}
            className={`btn btn-primary flex-1 ${isDownloading ? 'loading' : ''}`}
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
              className="btn btn-outline btn-error"
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
    'Computer Science', 'Data Structures', 'Algorithms', 'Database Management',
    'Operating Systems', 'Computer Networks', 'Software Engineering',
    'Machine Learning', 'Artificial Intelligence', 'Web Development',
    'Mobile Development', 'Cybersecurity', 'Mathematics', 'Statistics',
    'Physics', 'Chemistry', 'Electronics', 'Digital Logic'
  ];

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
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl bg-white">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <ArrowUpTrayIcon className="w-7 h-7 text-primary" />
              Upload Study Material
            </h3>
            <p className="text-gray-600 mt-1">Share educational resources with your academic community</p>
          </div>
          <button 
            className="btn btn-ghost btn-circle hover:bg-gray-100" 
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold text-gray-700">Academic File *</span>
            </label>
            
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <CloudArrowUpIcon className="w-16 h-16 mx-auto text-green-500" />
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{file.name}</p>
                    <p className="text-gray-500">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="btn btn-outline btn-sm"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <CloudArrowUpIcon className="w-16 h-16 mx-auto text-gray-400" />
                  <div>
                    <p className="text-xl font-semibold text-gray-700">Drop your academic file here</p>
                    <p className="text-gray-500 mt-2">
                      or click to browse your computer
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supported: PDF, DOC, PPT, XLS, Images, Text files
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
                  className="btn btn-primary mt-4 cursor-pointer"
                >
                  Choose Academic File
                </label>
              )}
            </div>
          </div>

          {/* Academic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Material Title *</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-lg focus:border-primary"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Database Management Chapter 1 Notes"
                required
                maxLength={100}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Subject *</span>
              </label>
              <input
                type="text"
                list="subjects"
                className="input input-bordered input-lg focus:border-primary"
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
              <span className="label-text font-semibold text-gray-700">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered focus:border-primary"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Brief description of the content, what topics are covered, difficulty level, etc."
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Semester/Year</span>
              </label>
              <input
                type="text"
                className="input input-bordered focus:border-primary"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="e.g., Semester 5, Year 3"
                maxLength={20}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Tags</span>
              </label>
              <input
                type="text"
                className="input input-bordered focus:border-primary"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="algorithms, theory, practice, exam-prep"
                maxLength={200}
              />
            </div>
          </div>

          {/* Academic Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5" />
              Academic Upload Guidelines
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure content is relevant to the course curriculum</li>
              <li>• Use clear, descriptive titles and subject names</li>
              <li>• Add comprehensive descriptions and relevant tags</li>
              <li>• Respect copyright and only upload original or permitted content</li>
              <li>• Maximum file size: 50MB per upload</li>
            </ul>
          </div>

          {/* Upload Progress */}
          {loading && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="font-medium text-primary">Uploading your academic material...</span>
              </div>
              <progress className="progress progress-primary w-full"></progress>
              <p className="text-sm text-gray-600 mt-2">Please wait while we process and upload your file.</p>
            </div>
          )}

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
              {loading ? 'Uploading Material...' : 'Upload Study Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Notes;