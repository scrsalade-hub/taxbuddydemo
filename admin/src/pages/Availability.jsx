import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, X, Check } from 'lucide-react';
import axios from 'axios';

const defaultTimeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const consultants = [
  { id: '1', name: 'Dr. Sarah Adeyemi' },
  { id: '2', name: 'Mr. Chukwuemeka Okafor' },
  { id: '3', name: 'Mrs. Fatima Ibrahim' },
];

export default function Availability() {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [customTime, setCustomTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAvailabilities();
  }, [selectedConsultant]);

  const fetchAvailabilities = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedConsultant
        ? `${API}/api/availability/all?consultantId=${selectedConsultant}`
        : `${API}/api/availability/all`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailabilities(data);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimeSlot = (time) => {
    setSelectedTimes(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const addCustomTime = () => {
    if (customTime && !selectedTimes.includes(customTime)) {
      setSelectedTimes(prev => [...prev, customTime]);
      setCustomTime('');
    }
  };

  const saveAvailability = async () => {
    if (!selectedConsultant) {
      setMessage('Please select a consultant');
      return;
    }
    if (!selectedDate || selectedTimes.length === 0) {
      setMessage('Please select a date and at least one time slot');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API}/api/availability`, {
        date: selectedDate,
        timeSlots: selectedTimes,
        consultantId: selectedConsultant
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Availability saved successfully!');
      setSelectedDate('');
      setSelectedTimes([]);
      fetchAvailabilities();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving availability');
    } finally {
      setSaving(false);
    }
  };

  const deleteAvailability = async (id) => {
    if (!confirm('Are you sure you want to remove this availability?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API}/api/availability/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAvailabilities();
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
          <p className="text-gray-500">Set the dates and times you're available for consultations</p>
        </div>
      </div>

      {/* Set New Availability */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add New Availability
        </h2>

        {/* Consultant Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Consultant</label>
          <select
            value={selectedConsultant}
            onChange={(e) => {
              setSelectedConsultant(e.target.value);
              setSelectedDate('');
              setSelectedTimes([]);
            }}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">-- Choose a consultant --</option>
            {consultants.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Available Time Slots
            </label>
            <div className="grid grid-cols-4 gap-3">
              {defaultTimeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => toggleTimeSlot(time)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                    selectedTimes.includes(time)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {selectedTimes.includes(time) && <Check className="w-4 h-4" />}
                  {time}
                </button>
              ))}
            </div>

            {/* Custom Time */}
            <div className="flex items-center gap-3 mt-4">
              <Clock className="w-5 h-5 text-gray-400" />
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                onClick={addCustomTime}
                disabled={!customTime}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
              >
                Add Custom Time
              </button>
            </div>

            {/* Selected Times Display */}
            {selectedTimes.length > 0 && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2">
                  Selected for {formatDate(selectedDate)}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTimes.sort().map(time => (
                    <span
                      key={time}
                      className="px-3 py-1 bg-primary text-white text-sm rounded-full flex items-center gap-1"
                    >
                      {time}
                      <button
                        onClick={() => toggleTimeSlot(time)}
                        className="hover:text-red-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={saveAvailability}
              disabled={saving || selectedTimes.length === 0}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 font-medium"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Availability'}
            </button>

            {message && (
              <p className={`mt-3 text-sm text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Current Availabilities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Availabilities</h2>
          <select
            value={selectedConsultant}
            onChange={(e) => setSelectedConsultant(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="">All Consultants</option>
            {consultants.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {availabilities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No availabilities set yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availabilities.map(avail => (
              <div
                key={avail._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium text-gray-900">{formatDate(avail.date)}</p>
                  <p className="text-sm text-primary mb-2">
                    {consultants.find(c => c.id === avail.consultantId)?.name || 'Unknown Consultant'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {avail.timeSlots.map((slot, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs rounded-full ${
                          slot.isBooked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {slot.time} {slot.isBooked && '(Booked)'}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => deleteAvailability(avail._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Remove availability"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
