import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      
      if (error) {
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }
      
      if (token) {
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Refresh auth context to get user data
        await checkAuth();
        
        // Show success message
        toast.success('Login successful!');
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        toast.error('No authentication token received');
        navigate('/login');
      }
    };
    
    handleCallback();
  }, [searchParams, navigate, checkAuth]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <LoadingSpinner size="lg" />
          <h2 className="text-xl font-semibold mt-4">Completing authentication...</h2>
          <p className="text-base-content/70">Please wait while we log you in.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;