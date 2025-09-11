import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import AuthCallback from './pages/auth/AuthCallback';
import Dashboard from './pages/Dashboard';
import Communities from './pages/Communities';
import Academics from './pages/Academics';
import Chillout from './pages/Chillout';
import Profile from './pages/Profile';
import Notes from './pages/academics/Notes';
import Discussions from './pages/academics/Discussions';
import ChilloutDiscussions from './pages/chillout/ChilloutDiscussions';
import Events from './pages/chillout/Events';
import Expenses from './pages/chillout/Expenses';
import Polls from './pages/chillout/Polls';
import Gallery from './pages/chillout/Gallery';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

const HomeRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <Home />;
};

const DarkModeInitializer = () => {
  useEffect(() => {
    // Force dark mode initialization
    const initializeDarkMode = () => {
      // Set data-theme to dark
      document.documentElement.setAttribute('data-theme', 'dark');
      
      // Add dark class for Tailwind
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      
      // Set color scheme
      document.documentElement.style.colorScheme = 'dark';
      
      // Save preference
      localStorage.setItem('theme', 'dark');
      
      // Override any system preference changes
      const handleSystemChange = () => {
        // Always force dark regardless of system change
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.colorScheme = 'dark';
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      };
      
      // Listen for system theme changes and override them
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleSystemChange);
      
      // Also listen for light mode preference and override
      const lightMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      lightMediaQuery.addEventListener('change', handleSystemChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleSystemChange);
        lightMediaQuery.removeEventListener('change', handleSystemChange);
      };
    };

    const cleanup = initializeDarkMode();
    return cleanup;
  }, []);

  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeInitializer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#334155', // slate-700 (dark theme)
              color: '#f8fafc',      // white text
              border: '1px solid #475569', // slate-600 border
            },
            success: {
              style: {
                background: '#065f46', // green-800
                color: '#ffffff',
                border: '1px solid #059669', // green-600
              },
            },
            error: {
              style: {
                background: '#991b1b', // red-800
                color: '#ffffff',
                border: '1px solid #dc2626', // red-600
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeRedirect />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-email/:token" element={<VerifyEmail />} />
            <Route path="auth/callback" element={<AuthCallback />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="communities"
              element={
                <ProtectedRoute>
                  <Communities />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="academics"
              element={
                <ProtectedRoute>
                  <Academics />
                </ProtectedRoute>
              }
            />
            <Route
              path="chillout"
              element={
                <ProtectedRoute>
                  <Chillout />
                </ProtectedRoute>
              }
            />
            
            {/* Academic specific routes */}
            <Route
              path="academics/:communityId/notes"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
            <Route
              path="academics/:communityId/discussions"
              element={
                <ProtectedRoute>
                  <Discussions />
                </ProtectedRoute>
              }
            />
            
            {/* Chillout specific routes */}
            <Route
              path="chillout/:communityId/discussions"
              element={
                <ProtectedRoute>
                  <ChilloutDiscussions />
                </ProtectedRoute>
              }
            />
            <Route
              path="chillout/:communityId/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="chillout/:communityId/expenses"
              element={
                <ProtectedRoute>
                  <Expenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="chillout/:communityId/polls"
              element={
                <ProtectedRoute>
                  <Polls />
                </ProtectedRoute>
              }
            />
            <Route
              path="chillout/:communityId/gallery"
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;