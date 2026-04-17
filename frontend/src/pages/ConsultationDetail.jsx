import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  Video,
  CheckCircle,
  XCircle,
  Clock3,
  MessageSquare,
  Headphones,
  MapPin,
  Phone,
  Mail,
  FileText,
  ExternalLink
} from 'lucide-react';

const statusConfig = {
  pending: { 
    icon: Clock3, 
    color: 'text-amber-600', 
    bg: 'bg-amber-100', 
    border: 'border-amber-300',
    label: 'Pending',
    description: 'Your consultation request is being reviewed.'
  },
  confirmed: { 
    icon: CheckCircle, 
    color: 'text-blue-600', 
    bg: 'bg-blue-100', 
    border: 'border-blue-300',
    label: 'Confirmed',
    description: 'Your consultation has been confirmed.'
  },
  completed: { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bg: 'bg-green-100', 
    border: 'border-green-300',
    label: 'Completed',
    description: 'Your consultation has been completed.'
  },
  cancelled: { 
    icon: XCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-100', 
    border: 'border-red-300',
    label: 'Cancelled',
    description: 'This consultation has been cancelled.'
  },
};

export default function ConsultationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const API = import.meta.env.VITE_API_URL;
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultation();
  }, [id]);

  const fetchConsultation = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API}/api/consultation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const consult = data.find(c => c._id === id);
      setConsultation(consult);
    } catch (error) {
      console.error('Error fetching consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelConsultation = async () => {
    if (!confirm('Are you sure you want to cancel this consultation?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/consultation/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchConsultation();
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      alert('Failed to cancel consultation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-16">
        <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Consultation Not Found</h2>
        <p className="text-gray-500 mb-6">The consultation you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/consultation')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Back to Consultations
        </button>
      </div>
    );
  }

  const StatusIcon = statusConfig[consultation.status]?.icon || Clock3;
  const statusColor = statusConfig[consultation.status]?.color || 'text-gray-600';
  const statusBg = statusConfig[consultation.status]?.bg || 'bg-gray-100';
  const statusBorder = statusConfig[consultation.status]?.border || 'border-gray-300';
  const statusLabel = statusConfig[consultation.status]?.label || consultation.status;
  const statusDescription = statusConfig[consultation.status]?.description || '';

  const isUpcoming = ['pending', 'confirmed'].includes(consultation.status);
  const canCancel = consultation.status === 'pending';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/consultation')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Consultations
      </button>

      {/* Status Banner */}
      <div className={`${statusBg} ${statusBorder} border-2 rounded-xl p-6 mb-6`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${statusBg} rounded-full flex items-center justify-center`}>
            <StatusIcon className={`w-7 h-7 ${statusColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium uppercase tracking-wide ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Consultation with {consultation.consultantName}
            </h1>
            <p className="text-gray-600 mt-1">{statusDescription}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Consultant Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Consultant Information
            </h2>
            
            <div className="flex items-start gap-4">
              {consultation.consultantImage ? (
                <img 
                  src={consultation.consultantImage} 
                  alt={consultation.consultantName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{consultation.consultantName}</h3>
                <p className="text-gray-500">Certified Tax Consultant</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-primary-light text-primary text-sm rounded-full">
                    Tax Expert
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Schedule Details
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(consultation.date).toLocaleDateString('en-NG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{consultation.time}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Clock3 className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{consultation.duration} minutes</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Amount</span>
                </div>
                <p className="text-lg font-semibold text-primary">
                  ₦{(consultation.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Topic */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Consultation Topic
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{consultation.topic}</p>
            </div>
          </div>

          {/* Admin Notes */}
          {consultation.notes && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
              <h2 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Message from Admin
              </h2>
              <div className="bg-white rounded-lg p-4">
                <p className="text-purple-800 whitespace-pre-wrap">{consultation.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meeting Link */}
          {isUpcoming && consultation.meetingLink && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Join Meeting
              </h3>
              
              <a
                href={consultation.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Join Video Call
              </a>
              
              <p className="text-sm text-gray-500 mt-3 text-center">
                Link will be active at the scheduled time
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            
            <div className="space-y-3">
              {canCancel && (
                <button
                  onClick={cancelConsultation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Cancel Consultation
                </button>
              )}
              
              <button
                onClick={() => navigate('/consultation')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Headphones className="w-5 h-5" />
                Book Another
              </button>
            </div>
          </div>

          {/* Record Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Booked On</p>
                  <p className="font-medium">
                    {new Date(consultation.createdAt).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">Online Video Call</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-4">
              If you have questions about this consultation, contact our support team.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:support@taxbuddy.com" 
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Mail className="w-4 h-4" />
                support@taxbuddy.com
              </a>
              <a 
                href="tel:+2348001234567" 
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Phone className="w-4 h-4" />
                +234 800 123 4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
