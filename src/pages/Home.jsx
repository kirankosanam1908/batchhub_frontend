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
      bgColor: "dashboard-gradient",
      ringColor: "ring-4 ring-offset-4 ring-dashboard-secondary ring-opacity-30"
    },
    { 
      num: "2", 
      title: "Choose Your Space", 
      desc: "Switch between Academic and Social zones based on your needs",
      bgColor: "communities-gradient",
      ringColor: "ring-4 ring-offset-4 ring-communities-secondary ring-opacity-30"
    },
    { 
      num: "3", 
      title: "Collaborate", 
      desc: "Share knowledge, plan events, and build lasting connections",
      bgColor: "academic-gradient",
      ringColor: "ring-4 ring-offset-4 ring-academic-secondary ring-opacity-30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 dashboard-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 communities-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 w-96 h-96 academic-primary opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-lg mb-8">
            <div className="w-2 h-2 status-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">
              The Ultimate Student Community Platform
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900">
            <span 
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' }}
            >
              BatchHub
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Where <span className="font-semibold academic-text-primary">Academic Excellence</span> meets 
            <span className="font-semibold chillout-text-primary"> Social Connection</span>
          </p>
          
          {/* Animated Feature */}
          <div className="h-8 mb-12">
            <p className="text-lg text-gray-500 transition-all duration-500 animate-fade-in">
              {featuredBenefits[currentFeature]}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <Link 
                to="/dashboard" 
                className="group dashboard-gradient text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="group auth-gradient text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                  
                >
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  to="/login" 
                  className="bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:shadow-lg font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2 mb-6 border border-blue-100">
              <SparklesSolid className="w-5 h-5 chillout-text-primary" />
              <span className="text-sm font-medium text-gray-700">Two Powerful Zones</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Academic Focus + Social Joy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Switch seamlessly between focused learning and social activities in one unified platform
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Academic Zone */}
            <div className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:-translate-y-1">
              {/* Header */}
              <div className="relative p-6 -m-6 mb-6 academic-light rounded-3xl border-b academic-border-light">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <AcademicCapSolid className="w-7 h-7 academic-text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Academic Zone</h3>
                    <p className="academic-text-primary font-medium">Focus on Learning</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {academicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300 group/item">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Zone */}
            <div className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:-translate-y-1">
              {/* Header */}
              <div className="relative p-6 -m-6 mb-6 chillout-light rounded-3xl border-b chillout-border-light">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <SparklesSolid className="w-7 h-7 chillout-text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Chillout Zone</h3>
                    <p className="chillout-text-primary font-medium">Connect & Celebrate</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {socialFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors duration-300 group/item">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-2 mb-6 border border-green-100">
              <CheckCircleIcon className="w-5 h-5 status-text-success" />
              <span className="text-sm font-medium text-gray-700">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Get Started in 3 Steps
            </h2>
            <p className="text-lg text-gray-600">
              From setup to collaboration in minutes
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="group text-center">
                <div className={`relative w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 group-hover:rotate-3 ${step.ringColor}`}>
                  <span className="text-2xl font-bold text-white">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-20 chillout-gradient overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute inset-0 bg-white/5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>

        <div className="container mx-auto text-center px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your College Experience?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students creating better connections and academic success
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="group bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
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
              className="group bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-orange-100 text-sm">
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