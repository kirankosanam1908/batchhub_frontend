import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  UserIcon,
  PencilIcon,
  CameraIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    communitiesCount: 0,
    notesUploaded: 0,
    threadsCreated: 0,
    eventsCreated: 0
  });
  const [communities, setCommunities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUserStats();
    fetchUserCommunities();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data } = await api.get('/api/communities/my-communities');
      setStats({
        communitiesCount: data.length,
        notesUploaded: 0,
        threadsCreated: 0,
        eventsCreated: 0
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      const { data } = await api.get('/api/communities/my-communities');
      setCommunities(data);
    } catch (error) {
      console.error('Failed to fetch communities:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: UserIcon },
    { id: 'communities', label: 'My Communities', icon: CogIcon },
    { id: 'settings', label: 'Account Settings', icon: CogIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200">
              <div className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="auth-gradient text-white flex items-center justify-center w-full h-full text-2xl font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mt-3 text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="auth-primary text-white px-3 py-1 rounded-full text-sm font-medium mt-2 capitalize">{user?.role || 'student'}</div>
                  
                  {user?.isEmailVerified ? (
                    <div className="status-success text-white px-3 py-1 rounded-full text-sm font-medium mt-2">Email Verified</div>
                  ) : (
                    <div className="status-warning text-gray-800 px-3 py-1 rounded-full text-sm font-medium mt-2">Email Not Verified</div>
                  )}

                  {/* Quick Edit Button */}
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="auth-light auth-text-primary border auth-border hover:bg-yellow-100 px-4 py-2 rounded-xl font-medium mt-3 transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 rounded-2xl p-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats.communitiesCount}</div>
                      <div className="text-xs text-gray-600">Communities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">Member Since</div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-6 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id 
                          ? 'auth-primary text-white shadow-lg' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={logout}
                  className="w-full mt-6 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-medium transition-colors duration-200 inline-flex items-center justify-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200">
              <div className="p-8">
                {activeTab === 'profile' && <ProfileInfo user={user} />}
                {activeTab === 'communities' && <CommunitiesList communities={communities} />}
                {activeTab === 'settings' && <AccountSettings user={user} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updatedUser) => {
            updateUser(updatedUser);
            setShowEditModal(false);
            toast.success('Profile updated successfully!');
          }}
        />
      )}
    </div>
  );
};

const ProfileInfo = ({ user }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Profile Information</h2>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              {user?.name}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              {user?.email}
            </div>
          </div>
        </div>

        {user?.bio && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              {user.bio}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {user?.location && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {user.location}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 capitalize">
              {user?.role || 'Student'}
            </div>
          </div>
        </div>

        {user?.website && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="auth-text-primary hover:auth-text-secondary transition-colors duration-200">
                {user.website}
              </a>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Member Since
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Status
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            {user?.isEmailVerified ? (
              <span className="status-text-success font-medium">✓ Verified</span>
            ) : (
              <span className="status-text-warning font-medium">⚠ Not Verified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunitiesList = ({ communities }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">My Communities</h2>
      
      {communities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't joined any communities yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {communities.map((community) => (
            <div key={community._id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-900">{community.name}</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  community.type === 'academic' 
                    ? 'academic-light academic-text-primary academic-border border' 
                    : 'chillout-light chillout-text-primary chillout-border border'
                }`}>
                  {community.type === 'academic' ? (
                    <AcademicCapIcon className="w-3 h-3 inline mr-1" />
                  ) : (
                    <SparklesIcon className="w-3 h-3 inline mr-1" />
                  )}
                  {community.type}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {community.description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{community.members?.length || 0} members</span>
                <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">#{community.code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AccountSettings = ({ user }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Account Settings</h2>
      
      <div className="space-y-6">
        {/* Account Info */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Account ID:</span>
              <span className="font-mono text-sm">{user?._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member since:</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email verified:</span>
              <span className={user?.isEmailVerified ? 'status-text-success' : 'status-text-warning'}>
                {user?.isEmailVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy & Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Show profile to other members</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Allow community invites</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProfileModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profilePicture);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update basic profile info
      const profileResponse = await api.put('/api/auth/profile', formData);
      
      let updatedUser = profileResponse.data.user || profileResponse.data;

      // Upload profile picture if selected
      if (profilePicture) {
        const imageFormData = new FormData();
        imageFormData.append('profilePicture', profilePicture);
        
        const imageResponse = await api.put('/api/auth/profile-picture', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        updatedUser = { ...updatedUser, profilePicture: imageResponse.data.profilePicture };
      }

      onSuccess(updatedUser);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200" onClick={onClose}>
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button 
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                !showPasswordForm 
                  ? 'auth-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setShowPasswordForm(false)}
            >
              Profile Info
            </button>
            <button 
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                showPasswordForm 
                  ? 'auth-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showPasswordForm ? (
            /* Profile Form */
            <form onSubmit={handleProfileUpdate}>
              {/* Profile Picture */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="auth-gradient text-white flex items-center justify-center w-full h-full text-2xl font-bold">
                        {formData.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Profile Picture</h4>
                  <label className="auth-light auth-text-primary border auth-border hover:bg-yellow-100 px-4 py-2 rounded-xl font-medium cursor-pointer transition-colors duration-200 inline-flex items-center gap-2">
                    <CameraIcon className="w-4 h-4" />
                    Change Picture
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="form-control">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 auth-border focus:border-transparent transition-all duration-200"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    maxLength={50}
                  />
                </div>

                <div className="form-control">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 auth-border focus:border-transparent transition-all duration-200 resize-none"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    placeholder="Tell others about yourself..."
                    maxLength={500}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 auth-border focus:border-transparent transition-all duration-200"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Mumbai, India"
                      maxLength={100}
                    />
                  </div>

                  <div className="form-control">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 auth-border focus:border-transparent transition-all duration-200"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 px-6 py-3 auth-primary text-white font-semibold rounded-xl hover:auth-secondary transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          ) : (
            /* Password Change Form */
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 auth-border focus:border-transparent transition-all duration-200"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-control">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 auth-border focus:border-transparent transition-all duration-200"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                <div className="form-control">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 auth-border focus:border-transparent transition-all duration-200"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    placeholder="Confirm new password"
                  />
                  {passwordData.newPassword && passwordData.confirmPassword && 
                   passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs status-text-error mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="form-control">
                    <p className="text-xs text-gray-600 mb-2">Password Strength:</p>
                    <div className="flex gap-1">
                      <div className={`h-2 flex-1 rounded ${passwordData.newPassword.length >= 6 ? 'status-success' : 'bg-gray-300'}`}></div>
                      <div className={`h-2 flex-1 rounded ${passwordData.newPassword.length >= 8 && /[A-Z]/.test(passwordData.newPassword) ? 'status-success' : 'bg-gray-300'}`}></div>
                      <div className={`h-2 flex-1 rounded ${passwordData.newPassword.length >= 8 && /[0-9]/.test(passwordData.newPassword) && /[A-Z]/.test(passwordData.newPassword) ? 'status-success' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Use 8+ characters with uppercase letters and numbers for stronger security
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200" 
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }} 
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 px-6 py-3 auth-primary text-white font-semibold rounded-xl hover:auth-secondary transition-colors duration-200 ${loading || passwordData.newPassword !== passwordData.confirmPassword || passwordData.newPassword.length < 6 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  disabled={loading || passwordData.newPassword !== passwordData.confirmPassword || passwordData.newPassword.length < 6}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;                  