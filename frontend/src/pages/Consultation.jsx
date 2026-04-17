import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Star, ArrowRight, CheckCircle2, Clock, Headphones, Eye, Clock3, CheckCircle, XCircle } from 'lucide-react';

const consultants = [
  {
    id: '1',
    name: 'Dr. Sarah Adeyemi',
    title: 'Chartered Tax Practitioner',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    rating: 4.9,
    reviews: 127,
    specialties: ['Tax Planning', 'Compliance', 'Audit Support'],
    price: 25000,
  },
  {
    id: '2',
    name: 'Mr. Chukwuemeka Okafor',
    title: 'Senior Tax Consultant',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    rating: 4.8,
    reviews: 89,
    specialties: ['Business Tax', 'VAT', 'PAYE'],
    price: 20000,
  },
  {
    id: '3',
    name: 'Mrs. Fatima Ibrahim',
    title: 'Certified Accountant',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    rating: 4.7,
    reviews: 64,
    specialties: ['Personal Tax', 'Financial Planning'],
    price: 15000,
  },
];

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

const statusConfig = {
  pending: { icon: Clock3, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Confirmed' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
};

export default function Consultation() {
  const navigate = useNavigate();
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [topic, setTopic] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [myConsultations, setMyConsultations] = useState([]);
  const [activeTab, setActiveTab] = useState('book'); // 'book' or 'my-consultations'
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMyConsultations();
  }, []);

  const fetchMyConsultations = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API}/api/consultation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyConsultations(data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/consultation`, {
        consultantName: selectedConsultant.name,
        consultantImage: selectedConsultant.image,
        date: new Date(selectedDate),
        time: selectedTime,
        duration: 60,
        topic,
        amount: selectedConsultant.price,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingSuccess(true);
      fetchMyConsultations();
      setTimeout(() => {
        setBookingSuccess(false);
        setShowBooking(false);
        setSelectedConsultant(null);
        setSelectedDate('');
        setSelectedTime('');
        setTopic('');
        setActiveTab('my-consultations');
      }, 2000);
    } catch (error) {
      alert('Error booking consultation');
    }
  };

  const formatCurrency = (amount) => {
    return '₦' + (amount || 0).toLocaleString();
  };

  if (bookingSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500">Your consultation has been scheduled successfully.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Expert Tax Consulting Services</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Book a session with our certified tax professionals for personalized advice.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('book')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'book'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Headphones className="w-5 h-5 inline mr-2" />
          Book New
        </button>
        <button
          onClick={() => setActiveTab('my-consultations')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'my-consultations'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Calendar className="w-5 h-5 inline mr-2" />
          My Consultations
          {myConsultations.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {myConsultations.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'book' ? (
        showBooking ? (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Book Consultation with {selectedConsultant.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                        selectedTime === time
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Tax planning for my business"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span>{formatCurrency(selectedConsultant.price)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(selectedConsultant.price)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowBooking(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleBook}
                  disabled={!selectedDate || !selectedTime || !topic}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {consultants.map((consultant) => (
              <div key={consultant.id} className="bg-white rounded-xl shadow-sm card-hover">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={consultant.image}
                      alt={consultant.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{consultant.name}</h3>
                      <p className="text-sm text-gray-500">{consultant.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{consultant.rating}</span>
                        <span className="text-sm text-gray-500">({consultant.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {consultant.specialties.map((specialty) => (
                      <span key={specialty} className="px-2 py-1 bg-primary-light text-primary text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-bold text-primary">{formatCurrency(consultant.price)}</p>
                      <p className="text-xs text-gray-500">per session</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedConsultant(consultant);
                        setShowBooking(true);
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark flex items-center gap-1"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* My Consultations Tab */
        <div className="bg-white rounded-xl shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : myConsultations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {myConsultations.map((consultation) => {
                const StatusIcon = statusConfig[consultation.status]?.icon || Clock3;
                const statusColor = statusConfig[consultation.status]?.color || 'text-gray-600';
                const statusBg = statusConfig[consultation.status]?.bg || 'bg-gray-100';
                const statusLabel = statusConfig[consultation.status]?.label || consultation.status;
                
                return (
                  <div 
                    key={consultation._id}
                    onClick={() => navigate(`/consultation/${consultation._id}`)}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {consultation.consultantImage ? (
                          <img
                            src={consultation.consultantImage}
                            alt={consultation.consultantName}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center">
                            <Headphones className="w-7 h-7 text-primary" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{consultation.consultantName}</h3>
                          <p className="text-sm text-gray-500">{consultation.topic}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(consultation.date).toLocaleDateString('en-NG', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {consultation.time}
                            </span>
                            <span className="text-gray-500">
                              Amount: <span className="font-medium text-gray-900">{formatCurrency(consultation.amount)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBg} ${statusColor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusLabel}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/consultation/${consultation._id}`);
                          }}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Admin Notes Preview */}
                    {consultation.notes && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-sm text-purple-800">
                          <span className="font-medium">Message from Admin:</span> {consultation.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations yet</h3>
              <p className="text-gray-500 mb-4">Book your first consultation with our tax experts.</p>
              <button
                onClick={() => setActiveTab('book')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Book Consultation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
