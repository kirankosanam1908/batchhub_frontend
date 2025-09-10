import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute Check:', { loading, isAuthenticated, hasUser: !!user });

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  console.log('ProtectedRoute - Authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;