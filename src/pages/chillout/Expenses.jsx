import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  CurrencyDollarIcon,
  PlusIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ChevronRightIcon,
  DocumentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  SparklesIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  UsersIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  CurrencyDollarIcon as CurrencyDollarSolid
} from '@heroicons/react/24/solid';
import { format, formatDistanceToNow } from 'date-fns';

const Expenses = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [community, setCommunity] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetchCommunityAndExpenses();
  }, [communityId]);

  const fetchCommunityAndExpenses = async () => {
    try {
      const communityRes = await api.get(`/api/communities/${communityId}`);
      setCommunity(communityRes.data);

      const expensesRes = await api.get(`/api/expenses?communityId=${communityId}`);
      setExpenses(expensesRes.data || []);

      const summaryRes = await api.get(`/api/expenses/summary?communityId=${communityId}`);
      setSummary(summaryRes.data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
      console.error('Expenses fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (expenseId, userId) => {
    try {
      await api.put(`/api/expenses/${expenseId}/pay/${userId}`);
      toast.success('Marked as paid!');
      fetchCommunityAndExpenses();
    } catch (error) {
      toast.error('Failed to mark as paid');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
            <CurrencyDollarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          {/* Breadcrumbs */}
          <div className="breadcrumbs text-sm mb-6 overflow-x-auto">
            <ul className="flex-nowrap">
              <li>
                <Link 
                  to="/chillout" 
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-300"
                >
                  Chillout
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-none">
                  {community?.name}
                </span>
              </li>
              <li className="text-purple-600 dark:text-purple-400 font-semibold">Expenses</li>
            </ul>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full px-6 py-3 border border-purple-200 dark:border-purple-800 shadow-lg mb-6">
              <CurrencyDollarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
                Expense Tracker
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
              Split expenses fairly and keep track of group spending
            </p>
          </div>

          {/* Add Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-3">
                <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline text-lg">Add Expense</span>
                <span className="sm:hidden">Add</span>
              </div>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <SummaryCard
              title="You Paid"
              amount={summary.totalPaid}
              icon={ArrowTrendingUpIcon}
              type="success"
              description="Total amount you've contributed"
            />
            <SummaryCard
              title="You Owe"
              amount={summary.totalOwed}
              icon={ArrowTrendingDownIcon}
              type="warning"
              description="Amount you need to settle"
            />
            <SummaryCard
              title="Net Balance"
              amount={Math.abs(summary.netBalance || 0)}
              icon={ArrowPathIcon}
              type={summary.netBalance >= 0 ? "info" : "error"}
              description={summary.netBalance >= 0 ? "You'll receive" : "You owe overall"}
              isBalance={true}
              netBalance={summary.netBalance}
            />
          </div>
        )}

        {/* Recent Expenses */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-xl border border-purple-100 dark:border-purple-800">
          <div className="p-6 border-b border-purple-100 dark:border-purple-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <BanknotesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Recent Expenses
              </h2>
              {expenses.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <ClipboardDocumentListIcon className="w-4 h-4" />
                  <span>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-0">
            {expenses.length === 0 ? (
              <div className="flex justify-center p-8 sm:p-16">
                <div className="max-w-md w-full text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <CurrencyDollarSolid className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full flex items-center justify-center">
                      <SparklesIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                    No expenses yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Start tracking your group expenses and split costs fairly among members.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    Add First Expense
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-purple-100 dark:divide-purple-800">
                {expenses.map((expense) => (
                  <ExpenseCard 
                    key={expense._id} 
                    expense={expense} 
                    onMarkPaid={markAsPaid}
                    onClick={() => setSelectedExpense(expense)}
                    currentUser={user}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddExpenseModal
          communityId={communityId}
          community={community}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchCommunityAndExpenses();
            setShowAddModal(false);
          }}
        />
      )}

      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onMarkPaid={markAsPaid}
          currentUser={user}
        />
      )}
    </div>
  );
};

const SummaryCard = ({ title, amount, icon: Icon, type, description, isBalance, netBalance }) => {
  const configs = {
    success: {
      gradient: "from-green-400 to-emerald-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700 dark:text-green-300",
      iconBg: "bg-green-100 dark:bg-green-900/30"
    },
    warning: {
      gradient: "from-yellow-400 to-orange-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-700 dark:text-yellow-300",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    info: {
      gradient: "from-blue-400 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-300",
      iconBg: "bg-blue-100 dark:bg-blue-900/30"
    },
    error: {
      gradient: "from-red-400 to-pink-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-700 dark:text-red-300",
      iconBg: "bg-red-100 dark:bg-red-900/30"
    }
  };

  const config = configs[type];

  return (
    <div className={`card ${config.bg} ${config.border} border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <div className="card-body p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`font-semibold text-base mb-2 ${config.text}`}>{title}</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              ₹{amount?.toFixed(2) || '0.00'}
            </p>
            {isBalance && (
              <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                {netBalance >= 0 ? '(you get back)' : '(you owe)'}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${config.iconBg}`}>
            <Icon className={`w-6 h-6 ${config.text}`} />
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{description}</p>
      </div>
    </div>
  );
};

const ExpenseCard = ({ expense, onMarkPaid, onClick, currentUser }) => {
  const userSplit = expense.splitBetween?.find(split => 
    split.user._id === currentUser?._id || split.user === currentUser?._id
  );
  const isPaidByUser = expense.paidBy._id === currentUser?._id || expense.paidBy === currentUser?._id;

  // Category emoji mapping
  const categoryEmojis = {
    food: '🍽️',
    transport: '🚗',
    accommodation: '🏠',
    entertainment: '🎬',
    other: '📦'
  };

  return (
    <div 
      className="group p-6 hover:bg-purple-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left Section - Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-xl text-white text-xl shrink-0">
                {categoryEmojis[expense.category] || '📦'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                  {expense.title}
                </h3>
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 lg:hidden">
                  ₹{expense.amount?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          {expense.notes && (
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
              {expense.notes}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                <UserIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span>Paid by {isPaidByUser ? 'You' : expense.paidBy?.name}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                <CalendarIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span>{formatDistanceToNow(new Date(expense.createdAt))} ago</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                <UsersIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span>{expense.splitBetween?.length || 0} people</span>
            </div>
          </div>

          {expense.receipt && (
            <div className="mb-4">
              <a 
                href={expense.receipt} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <DocumentIcon className="w-4 h-4" />
                View Receipt
              </a>
            </div>
          )}

          {userSplit && !isPaidByUser && (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105">
              {userSplit.isPaid ? (
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg">
                  <CheckCircleSolid className="w-4 h-4" />
                  <span>Paid</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-lg">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span>You owe ₹{userSplit.amount?.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Section - Amount */}
        <div className="hidden lg:flex flex-col items-end shrink-0">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            ₹{expense.amount?.toFixed(2)}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Split {expense.splitBetween?.length} ways
          </div>
        </div>
      </div>
    </div>
  );
};

const AddExpenseModal = ({ communityId, community, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food',
    notes: ''
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && community?.members) {
      setSelectedMembers([user._id]);
    }
  }, [user, community]);

  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length === 0) {
      toast.error('Select at least one member');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('amount', formData.amount);
      uploadData.append('category', formData.category);
      uploadData.append('notes', formData.notes);
      uploadData.append('communityId', communityId);
      
      const splitAmount = parseFloat(formData.amount) / selectedMembers.length;
      const splitBetween = selectedMembers.map(memberId => ({
        user: memberId,
        amount: splitAmount,
        isPaid: memberId === user._id
      }));
      uploadData.append('splitBetween', JSON.stringify(splitBetween));

      if (receipt) {
        uploadData.append('receipt', receipt);
      }

      await api.post('/api/expenses/create', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Expense added successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'food', label: '🍽️ Food & Drinks', desc: 'Meals, snacks, beverages' },
    { value: 'transport', label: '🚗 Transport', desc: 'Taxi, bus, train, flights' },
    { value: 'accommodation', label: '🏠 Accommodation', desc: 'Hotels, rentals, stays' },
    { value: 'entertainment', label: '🎬 Entertainment', desc: 'Movies, games, activities' },
    { value: 'other', label: '📦 Other', desc: 'Miscellaneous expenses' }
  ];

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Add New Expense</h3>
              <p className="text-slate-600 dark:text-slate-400">Split costs fairly among group members</p>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-circle bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600 hover:rotate-90 transition-all duration-300" 
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expense Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Expense Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What was this expense for?"
              required
            />
          </div>

          {/* Amount and Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Amount (₹)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Category</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {categoryOptions.map(option => (
                  <label 
                    key={option.value}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.category === option.value 
                        ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      checked={formData.category === option.value}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{option.label.split(' ')[0]}</span>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {option.label.substring(2)}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {option.desc}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Notes</span>
            </label>
            <textarea
              className="textarea textarea-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional details about this expense..."
              rows={3}
            />
          </div>

          {/* Receipt Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">Receipt</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:file-input-primary rounded-xl"
              accept="image/*"
              onChange={(e) => setReceipt(e.target.files[0])}
            />
            <label className="label">
              <span className="label-text-alt text-slate-500 dark:text-slate-400">
                Upload an image of the receipt (optional)
              </span>
            </label>
          </div>

          {/* Split Between Members */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                Split between ({selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''})
              </span>
            </label>
            <div className="border border-slate-300 dark:border-slate-600 rounded-2xl p-4 max-h-64 overflow-y-auto bg-slate-50 dark:bg-slate-700/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {community?.members?.map((member) => (
                  <label 
                    key={member._id} 
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                      selectedMembers.includes(member._id) 
                        ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600' 
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={selectedMembers.includes(member._id)}
                      onChange={() => handleMemberToggle(member._id)}
                    />
                    <div className="avatar placeholder">
                      <div className="bg-gradient-to-br from-purple-400 to-fuchsia-400 text-white rounded-full w-8 h-8 text-sm font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {member.name}
                      </span>
                      {member._id === user._id && (
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium ml-2">
                          (You)
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Split Calculation */}
            {selectedMembers.length > 0 && formData.amount && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Split Calculation</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Total: ₹{parseFloat(formData.amount).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      ₹{(parseFloat(formData.amount) / selectedMembers.length).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">per person</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="button" 
              className="flex-1 btn btn-ghost bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl order-2 sm:order-1" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`flex-1 btn border-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 order-1 sm:order-2 ${loading ? 'loading' : ''}`}
              disabled={loading || !formData.title || !formData.amount || selectedMembers.length === 0}
            >
              {loading ? 'Adding...' : (
                <>
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  Add Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ExpenseDetailModal = ({ expense, onClose, onMarkPaid, currentUser }) => {
  const isPaidByUser = expense.paidBy._id === currentUser?._id || expense.paidBy === currentUser?._id;
  const totalPaid = expense.splitBetween?.filter(s => s.isPaid).length || 0;
  const totalMembers = expense.splitBetween?.length || 0;

  const categoryEmojis = {
    food: '🍽️',
    transport: '🚗',
    accommodation: '🏠',
    entertainment: '🎬',
    other: '📦'
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl h-[90vh] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800 p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-xl text-white text-2xl">
              {categoryEmojis[expense.category] || '📦'}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 truncate">
                {expense.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                <span className="capitalize">{expense.category}</span>
                <span>•</span>
                <span>{format(new Date(expense.createdAt), 'MMM dd, yyyy')}</span>
                {expense.receipt && (
                  <>
                    <span>•</span>
                    <a 
                      href={expense.receipt} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <DocumentIcon className="w-3 h-3" />
                      Receipt
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-circle bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600 hover:rotate-90 transition-all duration-300 shrink-0" 
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Expense Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <div className="card-body p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BanknotesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Total Amount
                </h3>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  ₹{expense.amount?.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Paid by {isPaidByUser ? 'You' : expense.paidBy?.name}
                </div>
              </div>
            </div>

            <div className="card bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <div className="card-body p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Split Details
                </h3>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  ₹{totalMembers > 0 ? (expense.amount / totalMembers).toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  per person ({totalMembers} people)
                </div>
              </div>
            </div>

            <div className="card bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <div className="card-body p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <ReceiptPercentIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Payment Status
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {totalPaid}/{totalMembers}
                  </span>
                  <div className="flex-1">
                    <progress 
                      className="progress progress-primary w-full h-3" 
                      value={totalPaid} 
                      max={totalMembers}
                    />
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {totalPaid === totalMembers ? 'Fully settled' : `${totalMembers - totalPaid} pending`}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {expense.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Notes</h3>
              <div className="card bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="card-body p-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{expense.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Split Breakdown */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Payment Breakdown
            </h3>
            <div className="grid gap-4">
              {expense.splitBetween?.map(split => {
                const isCurrentUser = split.user._id === currentUser?._id || split.user === currentUser?._id;
                const canMarkPaid = isPaidByUser || isCurrentUser;
                
                return (
                  <div 
                    key={split._id || split.user} 
                    className={`flex items-center justify-between p-6 rounded-2xl transition-all duration-300 ${
                      split.isPaid 
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' 
                        : 'bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="avatar placeholder">
                        <div className={`rounded-full w-12 h-12 text-white font-semibold ${
                          split.isPaid 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-br from-purple-400 to-fuchsia-400'
                        }`}>
                          {(split.user?.name || 'Unknown').charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {isCurrentUser ? 'You' : split.user?.name || 'Unknown User'}
                          </span>
                          {isPaidByUser && isCurrentUser && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                              Paid by you
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          ₹{split.amount?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {split.isPaid ? (
                        <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <CheckCircleSolid className="w-6 h-6" />
                          </div>
                          <span className="font-semibold">Paid</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                              <ExclamationTriangleIcon className="w-6 h-6" />
                            </div>
                            <span className="font-medium">Pending</span>
                          </div>
                          {canMarkPaid && (
                            <button
                              onClick={() => onMarkPaid(expense._id, split.user._id || split.user)}
                              className="btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              Mark Paid
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal backdrop */}
      <div className="modal-backdrop bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};

export default Expenses;