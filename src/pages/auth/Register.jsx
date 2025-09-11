import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolid,
  CheckCircleIcon as CheckCircleSolid
} from '@heroicons/react/24/solid';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm();
  const { register: registerUser, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerUser(data.name, data.email, data.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('root', { 
          type: 'manual', 
          message: result.error || 'Registration failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('root', { 
        type: 'manual', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setError('root', { 
          type: 'manual', 
          message: result.error || 'Google signup failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Google signup error:', error);
      setError('root', { 
        type: 'manual', 
        message: 'Google signup failed. Please try again.' 
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    const strengths = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Very Weak', color: 'bg-red-500' },
      { score: 2, label: 'Weak', color: 'bg-orange-500' },
      { score: 3, label: 'Fair', color: 'bg-yellow-500' },
      { score: 4, label: 'Good', color: 'bg-blue-500' },
      { score: 5, label: 'Strong', color: 'bg-green-500' }
    ];

    return strengths[score] || strengths[0];
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-3 sm:p-4">
      
      {/* Background Elements - Adjusted for mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
          
          {/* Header - More compact on mobile */}
          <div className="relative p-4 sm:p-8 pb-4 sm:pb-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <UserPlusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 dark:from-purple-400 dark:via-pink-400 dark:to-green-400 bg-clip-text text-transparent">
                    Join BatchHub
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Your journey starts here!</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed px-2 sm:px-0">
                Create your account and join thousands of students building amazing communities! ✨
              </p>
            </div>
          </div>

          {/* Form - Better mobile spacing */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-8 space-y-4 sm:space-y-6">
            
            {/* General Error Message */}
            {errors.root && (
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{errors.root.message}</p>
                </div>
              </div>
            )}
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-10 sm:pl-12 pr-10 py-3 sm:py-3 bg-white/80 dark:bg-slate-700/80 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm sm:text-base ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                />
                {!errors.name && watch('name') && watch('name').length >= 2 && (
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                    <CheckCircleSolid className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                )}
                {errors.name && (
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <ExclamationCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full pl-10 sm:pl-12 pr-10 py-3 bg-white/80 dark:bg-slate-700/80 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm sm:text-base ${
                    errors.email 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {!errors.email && watch('email') && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(watch('email')) && (
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                    <CheckCircleSolid className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                )}
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <ExclamationCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 bg-white/80 dark:bg-slate-700/80 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm sm:text-base ${
                    errors.password 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200" />
                  ) : (
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator - Mobile optimized */}
              {password && password.length > 0 && (
                <div className="mt-2 sm:mt-3">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 sm:h-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                      passwordStrength.score <= 2 ? 'text-red-500' : 
                      passwordStrength.score <= 3 ? 'text-yellow-500' : 
                      passwordStrength.score <= 4 ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <ExclamationCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-3 bg-white/80 dark:bg-slate-700/80 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm sm:text-base ${
                    errors.confirmPassword 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                {!errors.confirmPassword && watch('confirmPassword') && watch('confirmPassword') === password && (
                  <div className="absolute inset-y-0 right-8 sm:right-12 pr-1 sm:pr-2 flex items-center">
                    <CheckCircleSolid className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                )}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200" />
                  ) : (
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <ExclamationCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Agreement - More compact on mobile */}
            <div className="p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading || googleLoading}
              className={`w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 hover:from-purple-700 hover:via-pink-700 hover:to-green-700 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group ${
                loading ? 'animate-pulse' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">Creating your account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span>Create Account</span>
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button 
              type="button"
              onClick={handleGoogleSignup} 
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/90 dark:bg-slate-700/90 border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {googleLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-slate-300 dark:border-slate-500 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm sm:text-base">Continue with Google</span>
                  <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Footer - More compact on mobile */}
          <div className="px-4 sm:px-8 pb-4 sm:pb-8">
            <div className="text-center p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl">
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                >
                  Sign in instead
                </Link>
              </p>
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <StarSolid className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-center">Join thousands of students on BatchHub</span>
                <StarSolid className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-specific bottom spacing */}
        <div className="h-4 sm:h-0"></div>
      </div>
    </div>
  );
};

export default Register;