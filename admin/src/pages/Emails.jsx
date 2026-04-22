import { useEffect, useState } from 'react';
import { Mail, Send, Users, Filter, CheckCircle, AlertCircle, Loader2, Search } from 'lucide-react';
import axios from 'axios';

export default function Emails() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, subscribedCount: 0, unsubscribedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [emailNotifFilter, setEmailNotifFilter] = useState('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');

  // Email composition
  const [sendMode, setSendMode] = useState('all'); // 'all' | 'filtered' | 'specific'
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [result, setResult] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUsers();
  }, [emailNotifFilter, accountTypeFilter, subscriptionFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (emailNotifFilter !== 'all') params.append('emailNotifications', emailNotifFilter === 'enabled');
      if (accountTypeFilter !== 'all') params.append('accountType', accountTypeFilter);
      if (subscriptionFilter !== 'all') params.append('subscription', subscriptionFilter);

      const { data } = await axios.get(`${API}/api/admin/emails/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data.users || []);
      setStats(data.stats || { totalUsers: 0, subscribedCount: 0, unsubscribedCount: 0 });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      u.firstName?.toLowerCase().includes(search) ||
      u.lastName?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search)
    );
  });

  const toggleUserSelection = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const selectAllFiltered = () => {
    setSelectedUserIds(filteredUsers.map(u => u._id));
  };

  const clearSelection = () => {
    setSelectedUserIds([]);
  };

  const insertTemplate = (type) => {
    const templates = {
      welcome: `<p>Hi {{firstName}},</p><p>Welcome to TaxBuddy! We're thrilled to have you on board.</p><p>Start exploring our tax calculator, book a consultation with our experts, and stay compliant with ease.</p><p>Best,<br>TaxBuddy Team</p>`,
      deadline: `<p>Hi {{firstName}},</p><p>This is a friendly reminder that your tax filing deadline is approaching.</p><p>Use TaxBuddy's calculator to estimate your liability and book a consultation if you need help.</p><p>Don't miss the deadline!</p>`,
      promo: `<p>Hi {{firstName}},</p><p>We've got something special for you! For a limited time, get 20% off your next consultation.</p><p>Book now and save on expert tax advice.</p>`,
      blank: '',
    };
    setHtmlContent(templates[type] || '');
  };

  const sendEmails = async () => {
    if (!subject.trim()) { alert('Please enter a subject'); return; }
    if (!htmlContent.trim()) { alert('Please enter email content'); return; }

    let confirmMsg = '';
    if (sendMode === 'all') confirmMsg = `Send to ALL ${users.length} users?`;
    else if (sendMode === 'filtered') confirmMsg = `Send to ${filteredUsers.length} filtered users?`;
    else if (sendMode === 'specific') confirmMsg = `Send to ${selectedUserIds.length} selected users?`;

    if (!confirm(confirmMsg)) return;

    setSending(true);
    setResult(null);

    try {
      const token = localStorage.getItem('adminToken');
      const filter = {};

      if (sendMode === 'filtered') {
        if (emailNotifFilter !== 'all') filter.emailNotifications = emailNotifFilter === 'enabled';
        if (accountTypeFilter !== 'all') filter.accountType = accountTypeFilter;
        if (subscriptionFilter !== 'all') filter.subscription = subscriptionFilter;
      } else if (sendMode === 'specific') {
        filter.userIds = selectedUserIds;
      }

      const { data } = await axios.post(`${API}/api/admin/emails/send-all`, {
        subject: subject.trim(),
        html: htmlContent,
        filter: Object.keys(filter).length > 0 ? filter : undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResult({
        success: true,
        sent: data.sent,
        failed: data.failed,
        total: data.total,
      });
    } catch (error) {
      console.error('Send email error:', error);
      setResult({
        success: false,
        error: error.response?.data?.message || 'Failed to send emails',
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
        <p className="text-gray-500 mt-1">Send emails to users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-blue-600">Total Users</p>
            <p className="text-2xl font-bold text-blue-700">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
          <Mail className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-green-600">Email Enabled</p>
            <p className="text-2xl font-bold text-green-700">{stats.subscribedCount}</p>
          </div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-orange-600" />
          <div>
            <p className="text-sm text-orange-600">Email Disabled</p>
            <p className="text-2xl font-bold text-orange-700">{stats.unsubscribedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-5 h-5 text-gray-400" />
          <select value={emailNotifFilter} onChange={e => setEmailNotifFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">All Email Settings</option>
            <option value="enabled">Email Enabled Only</option>
            <option value="disabled">Email Disabled Only</option>
          </select>
          <select value={accountTypeFilter} onChange={e => setAccountTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
          <select value={subscriptionFilter} onChange={e => setSubscriptionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search users..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <span className="text-sm text-gray-500">{filteredUsers.length} users</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Selection */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recipients</h2>
            <div className="flex gap-2">
              {sendMode === 'specific' && (
                <>
                  <button onClick={selectAllFiltered} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    Select All
                  </button>
                  <button onClick={clearSelection} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Send Mode Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { key: 'all', label: `All (${users.length})` },
              { key: 'filtered', label: `Filtered (${filteredUsers.length})` },
              { key: 'specific', label: `Selected (${selectedUserIds.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setSendMode(tab.key)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${sendMode === tab.key ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* User List */}
          <div className="max-h-[400px] overflow-y-auto">
            {filteredUsers.map(user => (
              <div key={user._id}
                onClick={() => sendMode === 'specific' && toggleUserSelection(user._id)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  sendMode === 'specific' && selectedUserIds.includes(user._id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                } ${sendMode !== 'specific' ? 'cursor-default' : ''}`}>
                {sendMode === 'specific' && (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    selectedUserIds.includes(user._id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}>
                    {selectedUserIds.includes(user._id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                )}
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xs font-medium">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.emailNotifications !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {user.emailNotifications !== false ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-center text-gray-400 py-8">No users match the filters</p>
            )}
          </div>
        </div>

        {/* Email Composer */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Compose Email</h2>
          </div>

          <div className="p-4 space-y-4">
            {/* Templates */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {[{ key: 'welcome', label: 'Welcome' }, { key: 'deadline', label: 'Deadline' }, { key: 'promo', label: 'Promo' }, { key: 'blank', label: 'Clear' }].map(t => (
                  <button key={t.key} onClick={() => insertTemplate(t.key)}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="Email subject..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {/* HTML Content */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Message (HTML)</label>
              <textarea value={htmlContent} onChange={e => setHtmlContent(e.target.value)}
                placeholder="<p>Hi {{firstName}},</p><p>Your message here...</p>"
                rows="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm" />
              <p className="text-xs text-gray-400 mt-1">
                Placeholders: {'{{firstName}}'} {'{{lastName}}'} {'{{email}}'}
              </p>
            </div>

            {/* Preview */}
            {htmlContent && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Preview</label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{ __html: htmlContent.replace(/{{firstName}}/g, 'John').replace(/{{lastName}}/g, 'Doe').replace(/{{email}}/g, 'john@example.com') }} />
              </div>
            )}

            {/* Result */}
            {result && (
              <div className={`p-3 rounded-lg text-sm ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {result.success
                  ? `Sent to ${result.sent} users${result.failed > 0 ? `, ${result.failed} failed` : ''}`
                  : result.error}
              </div>
            )}

            {/* Send Button */}
            <button onClick={sendEmails} disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                : <><Send className="w-4 h-4" /> Send Email</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
