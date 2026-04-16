import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Megaphone,
  Calendar,
  Check,
  Trash2
} from 'lucide-react';

const typeIcons = {
  reminder: Clock,
  alert: AlertCircle,
  success: CheckCircle2,
  info: Info,
  important: Megaphone,
};

const typeColors = {
  reminder: 'bg-amber-100 text-amber-700',
  alert: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700',
  info: 'bg-blue-100 text-blue-700',
  important: 'bg-purple-100 text-purple-700',
};

const typeLabels = {
  reminder: 'Reminder',
  alert: 'Alert',
  success: 'Success',
  info: 'Information',
  important: 'Important',
};

const API = import.meta.env.VITE_API_URL;

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const fetchNotification = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const notif = data.find(n => n._id === id);
      if (notif) {
        setNotification(notif);
        // Mark as read if unread
        if (!notif.isRead) {
          markAsRead(notif._id);
        }
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async () => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/notifications');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Notification Not Found</h2>
        <p className="text-gray-500 mb-6">The notification you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/notifications')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Back to Notifications
        </button>
      </div>
    );
  }

  const TypeIcon = typeIcons[notification.type] || Info;
  const isImportant = notification.type === 'important';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/notifications')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Notifications
      </button>

      {/* Notification Card */}
      <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${isImportant ? 'border-2 border-purple-500' : ''}`}>
        {/* Header */}
        <div className={`p-6 ${typeColors[notification.type]}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center">
              <TypeIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-medium opacity-80">{typeLabels[notification.type]}</span>
              <h1 className="text-2xl font-bold">{notification.title}</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Received: {new Date(notification.createdAt).toLocaleDateString('en-NG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{new Date(notification.createdAt).toLocaleTimeString('en-NG', {
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            {!notification.isRead && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Unread
              </span>
            )}
          </div>

          {/* Message */}
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Message</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>

          {/* Additional Details based on type */}
          {notification.type === 'reminder' && notification.dueDate && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Due Date:</span>
                <span>{new Date(notification.dueDate).toLocaleDateString('en-NG')}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification._id)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <Check className="w-4 h-4" />
                Mark as Read
              </button>
            )}
            <button
              onClick={deleteNotification}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Related Info */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Need Help?</h4>
            <p className="text-sm text-blue-700 mt-1">
              If you have any questions about this notification, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
