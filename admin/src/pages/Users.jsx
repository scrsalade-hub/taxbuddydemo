import { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, UserCheck, UserX, Mail, Send } from 'lucide-react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [emailNotifFilter, setEmailNotifFilter] = useState('all');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [sendingNotification, setSendingNotification] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const API = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API}/api/admin/users`, config);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = accountTypeFilter === 'all' || user.accountType === accountTypeFilter;
    const matchesSubscription = subscriptionFilter === 'all' || user.subscription === subscriptionFilter;
    const matchesEmailNotif = emailNotifFilter === 'all' || 
      (emailNotifFilter === 'enabled' && user.emailNotifications !== false) ||
      (emailNotifFilter === 'disabled' && user.emailNotifications === false);
    
    return matchesSearch && matchesType && matchesSubscription && matchesEmailNotif;
  });

  const openNotificationModal = (user) => {
    setSelectedUser(user);
    setNotificationTitle('');
    setNotificationMessage('');
    setNotificationType('info');
    setShowNotificationModal(true);
  };

  const sendNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      alert('Please fill in title and message');
      return;
    }

    setSendingNotification(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post('/api/admin/notifications/send', {
        userId: selectedUser._id,
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType
      }, config);
      
      alert('Notification sent successfully!');
      setShowNotificationModal(false);
    } catch (error) {
      alert('Error sending notification');
    } finally {
      setSendingNotification(false);
    }
  };

  const sendNotificationToAll = async () => {
    if (!notificationTitle || !notificationMessage) {
      alert('Please fill in title and message');
      return;
    }

    setSendingNotification(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const filter = {};
      if (emailNotifFilter === 'enabled') filter.emailNotifications = true;
      if (emailNotifFilter === 'disabled') filter.emailNotifications = false;
      if (accountTypeFilter !== 'all') filter.accountType = accountTypeFilter;
      if (subscriptionFilter !== 'all') filter.subscription = subscriptionFilter;
      
      await axios.post('/api/admin/notifications/send-all', {
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
        filter
      }, config);
      
      alert('Notification sent to all filtered users!');
      setShowNotificationModal(false);
    } catch (error) {
      alert('Error sending notification');
    } finally {
      setSendingNotification(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 mt-1">Manage all registered users</p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setNotificationTitle('');
            setNotificationMessage('');
            setNotificationType('info');
            setShowNotificationModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
          Send Notification to All
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={accountTypeFilter}
          onChange={(e) => setAccountTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="individual">Individual</option>
          <option value="business">Business</option>
        </select>

        <select
          value={subscriptionFilter}
          onChange={(e) => setSubscriptionFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <select
          value={emailNotifFilter}
          onChange={(e) => setEmailNotifFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Email Settings</option>
          <option value="enabled">Email Enabled</option>
          <option value="disabled">Email Disabled</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-600">Total Users</p>
          <p className="text-2xl font-bold text-blue-700">{filteredUsers.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-green-600">Email Enabled</p>
          <p className="text-2xl font-bold text-green-700">
            {filteredUsers.filter(u => u.emailNotifications !== false).length}
          </p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-orange-600">Email Disabled</p>
          <p className="text-2xl font-bold text-orange-700">
            {filteredUsers.filter(u => u.emailNotifications === false).length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-sm text-purple-600">Pro/Enterprise</p>
          <p className="text-2xl font-bold text-purple-700">
            {filteredUsers.filter(u => u.subscription !== 'free').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email Notif</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          {user.businessName && (
                            <p className="text-sm text-gray-500">{user.businessName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.accountType === 'business' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.subscription === 'enterprise' 
                          ? 'bg-orange-100 text-orange-700'
                          : user.subscription === 'pro'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.subscription}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.emailNotifications !== false ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <Mail className="w-4 h-4 mr-1" /> Enabled
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500 text-sm">
                          <Mail className="w-4 h-4 mr-1" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openNotificationModal(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Send Notification"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedUser ? `Send Notification to ${selectedUser.firstName}` : 'Send Notification to All Filtered Users'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notification title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Notification message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="alert">Alert</option>
                  <option value="important">Important</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={selectedUser ? sendNotification : sendNotificationToAll}
                disabled={sendingNotification}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {sendingNotification ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
