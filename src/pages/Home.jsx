import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  AcademicCapIcon,
  SparklesIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PhotoIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  CameraIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { 
  AcademicCapIcon as AcademicCapSolid,
  SparklesIcon as SparklesSolid 
} from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);

  const featuredBenefits = [
    "📚 Organize study materials seamlessly",
    "🎉 Plan events together", 
    "💬 Get instant doubt resolution",
    "💰 Split expenses effortlessly",
    "🌱 Build your academic network"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % featuredBenefits.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featuredBenefits.length]);

  const academicFeatures = [
    { 
      icon: DocumentTextIcon, 
      title: 'Smart Notes Repository', 
      desc: 'Organize PDFs, study materials, and resources by subject with powerful search'
    },
    { 
      icon: ChatBubbleLeftRightIcon, 
      title: 'Q&A Discussion Forum', 
      desc: 'StackOverflow-style discussions with voting and best answer selection'
    },
    { 
      icon: UserGroupIcon, 
      title: 'Study Groups', 
      desc: 'Form study circles, share knowledge, and learn together effectively'
    },
    { 
      icon: AcademicCapIcon, 
      title: 'Academic Recognition', 
      desc: 'Teachers and CRs can pin important content and moderate discussions'
    }
  ];

  const socialFeatures = [
    { 
      icon: CalendarIcon, 
      title: 'Event Planning', 
      desc: 'Organize trips, parties, celebrations with collaborative to-do lists'
    },
    { 
      icon: CurrencyDollarIcon, 
      title: 'Expense Splitting', 
      desc: 'Split bills with automatic calculations and payment tracking'
    },
    { 
      icon: ChartBarIcon, 
      title: 'Group Polls', 
      desc: 'Make group decisions with real-time voting and results'
    },
    { 
      icon: CameraIcon, 
      title: 'Photo Gallery', 
      desc: 'Create shared albums and preserve your best batch moments'
    }
  ];

  const steps = [
    { 
      num: "1", 
      title: "Create or Join", 
      desc: "Start a new batch community or join using a 6-digit code",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      pingColor: "bg-blue-400"
    },
    { 
      num: "2", 
      title: "Choose Your Space", 
      desc: "Switch between Academic and Social zones based on your needs",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      pingColor: "bg-purple-400"
    },
    { 
      num: "3", 
      title: "Collaborate", 
      desc: "Share knowledge, plan events, and build lasting connections",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      pingColor: "bg-green-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700 shadow-lg mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              The Ultimate Student Community Platform
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-slate-900 dark:text-white">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              BatchHub
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Where <span className="font-semibold text-blue-600 dark:text-blue-400">Academic Excellence</span> meets 
            <span className="font-semibold text-purple-600 dark:text-purple-400"> Social Connection</span>
          </p>
          
          {/* Animated Feature */}
          <div className="h-8 mb-12">
            <p className="text-lg text-slate-500 dark:text-slate-400 transition-all duration-500">
              {featuredBenefits[currentFeature]}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <Link 
                to="/dashboard" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  to="/login" 
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full px-4 py-2 mb-6">
              <SparklesSolid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Two Powerful Zones</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Academic Focus + Social Joy
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Switch seamlessly between focused learning and social activities in one unified platform
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Academic Zone */}
            <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-slate-700/50 hover:-translate-y-1">
              {/* Header */}
              <div className="relative p-6 -m-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl border-b border-blue-100 dark:border-blue-800/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <AcademicCapSolid className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Academic Zone</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Focus on Learning</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {academicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-50/80 dark:bg-slate-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 group/item">
                    <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Zone */}
            <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-slate-700/50 hover:-translate-y-1">
              {/* Header */}
              <div className="relative p-6 -m-6 mb-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl border-b border-purple-100 dark:border-purple-800/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <SparklesSolid className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Social Zone</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">Connect & Celebrate</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {socialFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-50/80 dark:bg-slate-700/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300 group/item">
                    <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full px-4 py-2 mb-6">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Get Started in 3 Steps
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              From setup to collaboration in minutes
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="group text-center">
                <div className={`relative w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 group-hover:rotate-3`}>
                  <span className="text-2xl font-bold text-white">{step.num}</span>
                  <div className={`absolute -top-2 -right-2 w-6 h-6 ${step.pingColor} rounded-full opacity-75 animate-ping`}></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-40">
            <div className="absolute inset-0 bg-white/5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>

        <div className="container mx-auto text-center px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your College Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students creating better connections and academic success
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="group bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                to="/login" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link 
              to="/dashboard" 
              className="group bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              <span>2-minute setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;