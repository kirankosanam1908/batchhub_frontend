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

const HomeRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <Home />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              style: {
                background: '#10b981',
                color: '#ffffff',
                border: '1px solid #059669',
              },
            },
            error: {
              style: {
                background: '#e84393',
                color: '#ffffff',
                border: '1px solid #d63031',
              },
            },
            loading: {
              style: {
                background: '#74b9ff',
                color: '#ffffff',
                border: '1px solid #0984e3',
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