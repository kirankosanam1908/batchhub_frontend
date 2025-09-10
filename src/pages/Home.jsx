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
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  HeartIcon,
  LightBulbIcon,
  DocumentTextIcon,
  CameraIcon,
  TrophyIcon,
  FireIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import {
  AcademicCapIcon as AcademicCapSolid,
  SparklesIcon as SparklesSolid,
  StarIcon as StarSolid,
  HeartIcon as HeartSolid,
  UserGroupIcon as UserGroupSolid
} from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);

  // Animated feature showcase
  const featuredBenefits = [
    "📚 Organize study materials seamlessly",
    "🎉 Plan epic events together", 
    "💬 Get instant doubt resolution",
    "💰 Split expenses effortlessly",
    "🌱 Grow your academic network"
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
      desc: 'Organize PDFs, study materials, and resources by subject with powerful search',
      color: 'text-blue-600'
    },
    { 
      icon: ChatBubbleLeftRightIcon, 
      title: 'Q&A Discussion Forum', 
      desc: 'StackOverflow-style discussions with voting and best answer selection',
      color: 'text-indigo-600'
    },
    { 
      icon: UserGroupIcon, 
      title: 'Collaborative Study Groups', 
      desc: 'Form study circles, share knowledge, and learn together effectively',
      color: 'text-cyan-600'
    },
    { 
      icon: TrophyIcon, 
      title: 'Academic Recognition', 
      desc: 'Teachers and CRs can pin important content and moderate discussions',
      color: 'text-blue-700'
    }
  ];

  const chilloutFeatures = [
    { 
      icon: CalendarIcon, 
      title: 'Event Planning Hub', 
      desc: 'Organize trips, parties, celebrations with collaborative to-do lists',
      color: 'text-purple-600'
    },
    { 
      icon: CurrencyDollarIcon, 
      title: 'Smart Expense Splitting', 
      desc: 'Splitwise-style bill management with automatic calculations and reminders',
      color: 'text-green-600'
    },
    { 
      icon: ChartBarIcon, 
      title: 'Interactive Group Polls', 
      desc: 'Make group decisions with real-time voting and beautiful result visualization',
      color: 'text-amber-600'
    },
    { 
      icon: CameraIcon, 
      title: 'Memory Gallery', 
      desc: 'Create shared albums, upload memories, and preserve your best batch moments',
      color: 'text-pink-600'
    }
  ];

  const testimonials = [
    { 
      name: 'Priya Sharma', 
      role: 'CS Student, IIT Delhi', 
      quote: 'BatchHub transformed our chaotic WhatsApp study groups into an organized knowledge hub. Our exam prep became 10x more efficient!',
      avatar: 'P',
      rating: 5
    },
    { 
      name: 'Rahul Gupta', 
      role: 'ECE Student, NIT Trichy', 
      quote: 'Finally found the perfect balance! Academic zone for serious discussions, chillout zone for planning our weekend adventures.',
      avatar: 'R',
      rating: 5
    },
    { 
      name: 'Sneha Reddy', 
      role: 'IT Student, BITS Pilani', 
      quote: 'Planning our farewell party with 150+ batchmates was seamless. The expense splitting feature saved us hours of calculations!',
      avatar: 'S',
      rating: 5
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Students', icon: UserGroupSolid },
    { number: '25K+', label: 'Study Sessions', icon: AcademicCapSolid },
    { number: '100K+', label: 'Shared Resources', icon: BookOpenIcon },
    { number: '∞', label: 'Memories Created', icon: HeartSolid }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 via-green-50 to-pink-50 dark:from-slate-900 dark:via-blue-900 dark:via-purple-900 dark:to-indigo-900">
      
      {/* Enhanced Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-300/20 to-emerald-300/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-r from-pink-300/20 to-orange-300/20 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-6 py-3 border border-blue-200 dark:border-blue-800 shadow-lg mb-8 animate-in slide-in-from-top duration-500">
            <StarSolid className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">The Ultimate Student Community Platform</span>
            <RocketLaunchIcon className="w-5 h-5 text-blue-500 animate-bounce" />
          </div>

          {/* Main Hero Title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 animate-in slide-in-from-bottom duration-700 delay-200">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 via-green-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:via-green-400 dark:to-pink-400 bg-clip-text text-transparent">
              BatchHub
            </span>
          </h1>
          
          {/* Dynamic Subtitle */}
          <div className="max-w-4xl mx-auto mb-12 animate-in slide-in-from-bottom duration-700 delay-400">
            <p className="text-2xl sm:text-3xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Where <span className="font-bold text-blue-600 dark:text-blue-400">Academic Excellence</span> meets 
              <span className="font-bold text-purple-600 dark:text-purple-400"> Social Celebration</span>
            </p>
            
            {/* Animated Feature Showcase */}
            <div className="h-12 flex items-center justify-center">
              <p className="text-xl text-slate-500 dark:text-slate-400 transition-all duration-500">
                {featuredBenefits[currentFeature]}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-in slide-in-from-bottom duration-700 delay-600">
            {user ? (
              <Link 
                to="/dashboard" 
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3"
              >
                <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                <span className="text-lg">Continue Your Journey</span>
                <span className="text-2xl">🚀</span>
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3"
                >
                  <UserGroupSolid className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-lg">Start Your Journey</span>
                  <span className="text-2xl animate-bounce">✨</span>
                </Link>
                <Link 
                  to="/login" 
                  className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-2 border-slate-200 dark:border-slate-600 hover:border-purple-400 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3"
                >
                  <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="text-lg">Sign In</span>
                </Link>
              </>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-700 delay-800">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-600/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center">
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium text-center">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Overview */}
      <div className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full px-6 py-3 mb-6">
              <LightBulbIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Two Powerful Zones</span>
            </div>
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 dark:from-slate-200 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Academic Excellence <span className="text-4xl">+</span> Social Joy
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Experience the perfect harmony between serious learning and joyful celebrations. 
              One platform, infinite possibilities for your student journey.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            
            {/* Academic Zone Card */}
            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:-translate-y-2">
              {/* Header */}
              <div className="relative p-8 pb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-100 dark:border-blue-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-200/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <AcademicCapSolid className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Academic Zone</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">Your Learning Sanctuary</p>
                  </div>
                  <div className="text-4xl group-hover:animate-bounce">📚</div>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <div className="space-y-6">
                  {academicFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group/item">
                      <div className="p-3 bg-white dark:bg-slate-600 rounded-xl shadow-sm group-hover/item:scale-110 transition-transform duration-300">
                        <feature.icon className={`w-5 h-5 ${feature.color} dark:text-blue-400`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{feature.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                  <p className="text-slate-600 dark:text-slate-400 italic text-center font-medium">
                    "Transform scattered knowledge into organized wisdom" 🌟
                  </p>
                </div>
              </div>
            </div>

            {/* Chillout Zone Card */}
            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-200/50 dark:border-purple-700/50 hover:-translate-y-2">
              {/* Header */}
              <div className="relative p-8 pb-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-b border-purple-100 dark:border-purple-800">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full -translate-y-8 -translate-x-8"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <SparklesSolid className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      Chillout Zone
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold">Your Social Paradise</p>
                  </div>
                  <div className="text-4xl group-hover:animate-bounce">🎉</div>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <div className="space-y-6">
                  {chilloutFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group/item">
                      <div className="p-3 bg-white dark:bg-slate-600 rounded-xl shadow-sm group-hover/item:scale-110 transition-transform duration-300">
                        <feature.icon className={`w-5 h-5 ${feature.color} dark:text-purple-400`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{feature.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50">
                  <p className="text-slate-600 dark:text-slate-400 italic text-center font-medium">
                    "Turn chaotic group chats into organized celebrations" 🎊
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-r from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-blue-900/30 dark:to-purple-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-6 py-3 mb-6 shadow-lg">
              <RocketLaunchIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Simple Process</span>
            </div>
            <h2 className="text-5xl font-bold mb-8 text-slate-800 dark:text-slate-200">
              Get Started in <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From chaos to organization in minutes, not months
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-sm">⚡</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Create or Join</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Start your community in seconds or join using a simple 6-digit code shared by your batchmates
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-sm">🎯</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Choose Your Vibe</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Switch seamlessly between Academic zone for focused learning and Chillout zone for social activities
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-green-500/25 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-2">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center animate-spin">
                  <span className="text-white text-sm">✨</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Collaborate & Celebrate</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Share knowledge, plan events, split expenses, and create unforgettable memories with your batch
              </p>
            </div>
          </div>

          {/* Process Flow Visualization */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full px-8 py-4 shadow-lg border border-slate-200/50 dark:border-slate-600/30">
              <span className="text-2xl">🌱</span>
              <ArrowRightIcon className="w-5 h-5 text-slate-400" />
              <span className="text-2xl">🌿</span>
              <ArrowRightIcon className="w-5 h-5 text-slate-400" />
              <span className="text-2xl">🌳</span>
              <span className="ml-3 font-semibold text-slate-700 dark:text-slate-300">Growth Journey</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Testimonials */}
      <div className="py-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full px-6 py-3 mb-6 shadow-lg">
              <HeartSolid className="w-6 h-6 text-red-500 animate-pulse" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Student Love</span>
            </div>
            <h2 className="text-5xl font-bold mb-8 text-slate-800 dark:text-slate-200">
              Real Stories, <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Real Impact</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover how thousands of students transformed their college experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-slate-600/30 hover:-translate-y-2">
                
                {/* Rating Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarSolid key={i} className="w-5 h-5 text-yellow-400 animate-pulse" style={{animationDelay: `${i * 100}ms`}} />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <div className="absolute -top-2 -left-2 text-4xl text-blue-200 dark:text-blue-800 font-serif">"</div>
                  <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-center relative z-10">
                    {testimonial.quote}
                  </p>
                  <div className="absolute -bottom-2 -right-2 text-4xl text-blue-200 dark:text-blue-800 font-serif">"</div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 animate-ping"></div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="font-medium">Trusted by 50K+ Students</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="font-medium">500+ Colleges</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="font-medium">99% Uptime</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Final CTA */}
      <div className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 via-green-600 to-pink-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
        </div>

        <div className="relative z-10 container mx-auto text-center px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Attention Grabber */}
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8 shadow-lg">
              <FireIcon className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="text-white font-semibold">Join the Revolution</span>
              <RocketLaunchIcon className="w-6 h-6 text-white animate-bounce" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Transform Your <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Student Experience?
              </span>
            </h2>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
              Join thousands of students who've already revolutionized their college journey with BatchHub!
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex -space-x-3">
                {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                  <div key={i} className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 rounded-full flex items-center justify-center text-white font-bold backdrop-blur-sm">
                    {letter}
                  </div>
                ))}
              </div>
              <div className="text-white/80">
                <div className="font-bold">50,000+ Students</div>
                <div className="text-sm">Already on board</div>
              </div>
            </div>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/register" 
                  className="group bg-white hover:bg-gray-100 text-slate-800 font-bold px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3 text-lg"
                >
                  <UserGroupSolid className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>Start Your Free Journey</span>
                  <span className="text-2xl animate-bounce">🚀</span>
                </Link>
                <Link 
                  to="/login" 
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/50 text-white font-semibold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3 text-lg"
                >
                  <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>I Have an Account</span>
                </Link>
              </div>
            ) : (
              <Link 
                to="/dashboard" 
                className="group bg-white hover:bg-gray-100 text-slate-800 font-bold px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3 text-lg"
              >
                <LightBulbIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Continue Your Amazing Journey</span>
                <span className="text-2xl animate-pulse">✨</span>
              </Link>
            )}

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">100% Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">Setup in 2 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;