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
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col items-center text-center">
                  <div className="avatar">
                    <div className="w-20 rounded-full">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} />
                      ) : (
                        <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full text-2xl">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mt-3">{user?.name}</h2>
                  <p className="text-base-content/60">{user?.email}</p>
                  <div className="badge badge-outline mt-2 capitalize">{user?.role || 'student'}</div>
                  
                  {user?.isEmailVerified ? (
                    <div className="badge badge-success mt-2">Email Verified</div>
                  ) : (
                    <div className="badge badge-warning mt-2">Email Not Verified</div>
                  )}

                  {/* Quick Edit Button */}
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="btn btn-outline btn-sm mt-3"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div className="stats stats-vertical shadow mt-6">
                  <div className="stat">
                    <div className="stat-title text-xs">Communities</div>
                    <div className="stat-value text-lg">{stats.communitiesCount}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title text-xs">Member Since</div>
                    <div className="stat-value text-sm">
                      {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="menu menu-vertical mt-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`menu-item flex items-center gap-3 p-3 rounded-lg mb-1 ${
                        activeTab === tab.id 
                          ? 'bg-primary text-primary-content' 
                          : 'hover:bg-base-200'
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
                  className="btn btn-outline btn-error w-full mt-6"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
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
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <div className="p-3 bg-base-200 rounded-lg">
              {user?.name}
            </div>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <div className="p-3 bg-base-200 rounded-lg">
              {user?.email}
            </div>
          </div>
        </div>

        {user?.bio && (
          <div>
            <label className="label">
              <span className="label-text font-semibold">Bio</span>
            </label>
            <div className="p-3 bg-base-200 rounded-lg">
              {user.bio}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {user?.location && (
            <div>
              <label className="label">
                <span className="label-text font-semibold">Location</span>
              </label>
              <div className="p-3 bg-base-200 rounded-lg">
                {user.location}
              </div>
            </div>
          )}

          <div>
            <label className="label">
              <span className="label-text font-semibold">Role</span>
            </label>
            <div className="p-3 bg-base-200 rounded-lg capitalize">
              {user?.role || 'Student'}
            </div>
          </div>
        </div>

        {user?.website && (
          <div>
            <label className="label">
              <span className="label-text font-semibold">Website</span>
            </label>
            <div className="p-3 bg-base-200 rounded-lg">
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="link link-primary">
                {user.website}
              </a>
            </div>
          </div>
        )}

        <div>
          <label className="label">
            <span className="label-text font-semibold">Member Since</span>
          </label>
          <div className="p-3 bg-base-200 rounded-lg">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}
          </div>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Email Status</span>
          </label>
          <div className="p-3 bg-base-200 rounded-lg">
            {user?.isEmailVerified ? (
              <span className="text-success">✓ Verified</span>
            ) : (
              <span className="text-warning">⚠ Not Verified</span>
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
      <h2 className="text-2xl font-bold mb-6">My Communities</h2>
      
      {communities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-base-content/60">You haven't joined any communities yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {communities.map((community) => (
            <div key={community._id} className="card bg-base-200 shadow">
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <h3 className="card-title text-lg">{community.name}</h3>
                  <div className={`badge ${
                    community.type === 'academic' ? 'badge-primary' : 'badge-secondary'
                  }`}>
                    {community.type === 'academic' ? (
                      <AcademicCapIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <SparklesIcon className="w-3 h-3 mr-1" />
                    )}
                    {community.type}
                  </div>
                </div>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {community.description}
                </p>
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span>{community.members?.length || 0} members</span>
                  <span className="font-mono text-xs">#{community.code}</span>
                </div>
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
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        {/* Account Info */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">Account Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-base-content/60">Account ID:</span>
                <span className="font-mono text-sm">{user?._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Member since:</span>
                <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Email verified:</span>
                <span className={user?.isEmailVerified ? 'text-success' : 'text-warning'}>
                  {user?.isEmailVerified ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">Privacy & Security</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Show profile to other members</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Allow community invites</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Email notifications</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>
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
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Edit Profile</h3>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab ${!showPasswordForm ? 'tab-active' : ''}`}
            onClick={() => setShowPasswordForm(false)}
          >
            Profile Info
          </button>
          <button 
            className={`tab ${showPasswordForm ? 'tab-active' : ''}`}
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </button>
        </div>

        {!showPasswordForm ? (
          /* Profile Form */
          <form onSubmit={handleProfileUpdate}>
            {/* Profile Picture */}
            <div className="flex items-center gap-6 mb-6">
              <div className="avatar">
                <div className="w-20 rounded-full">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" />
                  ) : (
                    <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full text-2xl">
                      {formData.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Profile Picture</h4>
                <label className="btn btn-outline btn-sm">
                  <CameraIcon className="w-4 h-4 mr-2" />
                  Change Picture
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="text-xs text-base-content/60 mt-1">
                  JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={50}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell others about yourself..."
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Mumbai, India"
                    maxLength={100}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Website</span>
                  </label>
                  <input
                    type="url"
                    className="input input-bordered"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`} 
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
                <label className="label">
                  <span className="label-text">Current Password *</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className="input input-bordered w-full pr-10"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password *</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                />
                <label className="label">
                  <span className="label-text-alt">Minimum 6 characters</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm New Password *</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  placeholder="Confirm new password"
                />
                {passwordData.newPassword && passwordData.confirmPassword && 
                 passwordData.newPassword !== passwordData.confirmPassword && (
                  <label className="label">
                    <span className="label-text-alt text-error">Passwords do not match</span>
                  </label>
                )}
              </div>

              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text-alt">Password Strength:</span>
                  </label>
                  <div className="flex gap-1">
                    <div className={`h-2 w-full rounded ${passwordData.newPassword.length >= 6 ? 'bg-success' : 'bg-base-300'}`}></div>
                    <div className={`h-2 w-full rounded ${passwordData.newPassword.length >= 8 && /[A-Z]/.test(passwordData.newPassword) ? 'bg-success' : 'bg-base-300'}`}></div>
                    <div className={`h-2 w-full rounded ${passwordData.newPassword.length >= 8 && /[0-9]/.test(passwordData.newPassword) && /[A-Z]/.test(passwordData.newPassword) ? 'bg-success' : 'bg-base-300'}`}></div>
                  </div>
                  <div className="text-xs text-base-content/60 mt-1">
                    Use 8+ characters with uppercase letters and numbers for stronger security
                  </div>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button 
                type="button" 
                className="btn" 
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
                className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                disabled={loading || passwordData.newPassword !== passwordData.confirmPassword || passwordData.newPassword.length < 6}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;            