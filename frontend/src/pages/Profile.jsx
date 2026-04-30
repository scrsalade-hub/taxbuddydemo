import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Building2, Camera, Save, Bell, Shield, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, updateUser, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    taxId: user?.taxId || '',
  });

  // Sync form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        businessName: user.businessName || '',
        taxId: user.taxId || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResendVerification = async () => {
    if (!user?._id || resending) return;
    setResending(true);
    setResendMsg('');
    try {
      await axios.post(`${API}/api/users/resend-verification`, { userId: user._id });
      setResendMsg('Verification email sent! Check your inbox.');
      setTimeout(() => setResendMsg(''), 5000);
    } catch (error) {
      setResendMsg(error.response?.data?.message || 'Failed to send. Try again.');
    } finally {
      setResending(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateUser(formData);
    setSaving(false);
    if (result.success) {
      setIsEditing(false);
      alert('Profile updated successfully!');
    } else {
      alert(result.message || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                isEditing 
                  ? 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50' 
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
                  {user?.accountType === 'business' ? 'Business Account' : 'Individual Account'}
                </span>
                {user?.emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" /> Email Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    <AlertCircle className="w-3 h-3" /> Email Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {user?.accountType === 'business' && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID (TIN)</label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Card */}
        <div className="space-y-6">
          {/* Email Verification Card */}
          <div className={`rounded-xl shadow-sm p-6 ${user?.emailVerified ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              {user?.emailVerified ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
              <h3 className="font-semibold">Email Verification</h3>
            </div>
            {user?.emailVerified ? (
              <>
                <p className="text-sm text-green-700 mb-2">Your email is verified.</p>
                <p className="text-xs text-green-600">You'll receive all tax reminders, booking confirmations, and security alerts.</p>
              </>
            ) : (
              <>
                <p className="text-sm text-amber-700 mb-2">Your email is not verified yet.</p>
                <p className="text-xs text-amber-600 mb-3">
                  Verifying your email ensures you receive tax deadline reminders, booking confirmations, and protects your account from unauthorized access.
                </p>
                <button
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resending ? (
                    <><RefreshCw className="w-3 h-3 animate-spin" /> Sending...</>
                  ) : (
                    <><Mail className="w-3 h-3" /> Resend Verification Email</>
                  )}
                </button>
                {resendMsg && (
                  <p className={`text-xs mt-2 ${resendMsg.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
                    {resendMsg}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Email Notifications', checked: true },
                { label: 'SMS Notifications', checked: false },
                { label: 'Deadline Reminders', checked: true },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 text-primary rounded" />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Security</h3>
            </div>
            <button className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Change Password
            </button>
          </div>

          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-2">Current Plan</h3>
            <p className="text-2xl font-bold capitalize mb-1">{user?.subscription}</p>
            <p className="text-white/80 text-sm">
              {user?.subscription === 'free' 
                ? 'Basic tax calculation and tracking' 
                : 'Advanced features and priority support'}
            </p>
            <button className="mt-4 w-full bg-white text-primary py-2 rounded-lg font-medium hover:bg-gray-100">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
