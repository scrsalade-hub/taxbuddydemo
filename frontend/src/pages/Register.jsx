import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, Building2, Eye, EyeOff, ArrowLeft, CheckCircle, ArrowRight, RefreshCw, ShieldCheck, Clock, Headphones } from 'lucide-react';
import axios from 'axios';
import { assets } from '../landing/assets';

/* Soft floating blob SVG */
const Blob = ({ className, color }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      fill={color}
      d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z"
      transform="translate(100 100)"
    />
  </svg>
);

/* Animated wave SVG for background */
const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={{ height: "40%" }}
    >
      <defs>
        <linearGradient id="regWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8f5f0" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#d4edda" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e8f5f0" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <motion.path
        fill="url(#regWaveGrad)"
        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        animate={{
          d: [
            "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,128L48,154.7C96,181,192,235,288,234.7C384,235,480,181,576,165.3C672,149,768,171,864,192C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

const features = [
  { icon: ShieldCheck, text: "Secure Signup" },
  { icon: Clock, text: "Instant Access" },
  { icon: Headphones, text: "Free Support" },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('individual');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessRegNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResendVerification = async () => {
    if (!registeredUser?._id) return;
    setResending(true);
    setResendSuccess(false);
    try {
      await axios.post(`${API}/api/users/resend-verification`, { userId: registeredUser._id });
      setResendSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (accountType === 'business' && (!formData.businessName || !formData.businessRegNumber)) {
        setError('Business name and registration number are required');
        return;
      }
      setLoading(true);

      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        accountType,
        businessName: accountType === 'business' ? formData.businessName : undefined,
        businessRegNumber: accountType === 'business' ? formData.businessRegNumber : undefined,
      });

      if (result.success) {
        setRegisteredUser(result.data);
        setStep(3);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  /* Step titles */
  const stepTitle = step === 3 ? 'Verify Email' : step === 2 ? 'Account Details' : 'Create Account';
  const stepDesc = step === 3 ? 'Check your inbox for the verification link' : step === 2 ? 'Tell us more about your business' : 'Start your tax management journey';

  return (
    <div className="min-h-screen bg-[#F8FFF8] flex flex-col relative overflow-hidden">
      <WaveBackground />

      {/* Soft floating blobs */}
      <Blob className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.06]" color="#38B88F" />
      <Blob className="absolute bottom-40 -left-32 w-[300px] h-[300px] opacity-[0.05]" color="#059669" />

      {/* Dotted decorations */}
      <div className="absolute top-32 right-[15%] w-24 h-24 opacity-[0.15]"
        style={{ backgroundImage: "radial-gradient(circle, #6b7280 1.5px, transparent 1.5px)", backgroundSize: "12px 12px" }}
      />

      {/* Back to home */}
      <div className="relative z-10 px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#038C2A] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[480px]">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center w-40 gap-3">
              <img src={assets.logo} alt="" />
            </Link>
          </motion.div>

          {/* Register Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10"
          >
            <div className="text-center mb-6">
              <h1 className="text-[1.75rem] font-bold text-[#1a1a1a] mb-1">{stepTitle}</h1>
              <p className="text-gray-500 text-sm">{stepDesc}</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= s
                      ? 'bg-[#038C2A] text-white shadow-md shadow-[#038C2A]/20'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-8 h-0.5 rounded transition-all ${step > s ? 'bg-[#038C2A]' : 'bg-gray-100'}`} />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 3 ? (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="text-center py-2">
                    <div className="w-16 h-16 bg-[#F8FFF8] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-[#038C2A]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">Account Created!</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Welcome, {registeredUser?.firstName || 'there'}! One more step to get started.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1 text-sm">Verify Your Email</h4>
                        <p className="text-xs text-amber-700 mb-2">
                          We sent a link to <strong>{registeredUser?.email || formData.email}</strong>
                        </p>
                        <ul className="text-xs text-amber-700 space-y-1 mb-3">
                          <li className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Tax deadline reminders</li>
                          <li className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Booking confirmations</li>
                          <li className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Account security</li>
                        </ul>
                        <button
                          onClick={handleResendVerification}
                          disabled={resending}
                          className="text-xs text-amber-800 font-medium underline hover:no-underline flex items-center gap-1"
                        >
                          {resending ? (
                            <><RefreshCw className="w-3 h-3 animate-spin" /> Sending...</>
                          ) : (
                            'Resend verification email'
                          )}
                        </button>
                        {resendSuccess && (
                          <p className="text-xs text-green-600 mt-1">Verification email resent!</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-[#038C2A] text-white py-3 rounded-xl font-semibold hover:bg-[#026b21] transition-colors text-sm"
                  >
                    Go to Dashboard
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key={`step${step}`}
                  initial={{ opacity: 0, x: step === 2 ? 20 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {step === 1 && (
                    <>
                      {/* Account Type */}
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <button
                          type="button"
                          onClick={() => setAccountType('individual')}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            accountType === 'individual'
                              ? 'border-[#038C2A] bg-[#F8FFF8] text-[#038C2A]'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <User className="w-6 h-6 mx-auto mb-2" />
                          <span className="font-medium text-sm">Individual</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccountType('business')}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            accountType === 'business'
                              ? 'border-[#038C2A] bg-[#F8FFF8] text-[#038C2A]'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <Building2 className="w-6 h-6 mx-auto mb-2" />
                          <span className="font-medium text-sm">Business</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                            placeholder="+234..."
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                            placeholder="Min. 8 characters"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#038C2A] text-white py-3.5 rounded-xl font-semibold hover:bg-[#026b21] transition-all shadow-lg shadow-[#038C2A]/20 text-sm"
                      >
                        Continue
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      {accountType === 'business' && (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Business Name</label>
                            <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">CAC Registration Number</label>
                            <input
                              type="text"
                              name="businessRegNumber"
                              value={formData.businessRegNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                              required
                            />
                          </div>
                        </>
                      )}

                      <div className="bg-[#F8FFF8] rounded-xl p-4 border border-[#38B88F]/10">
                        <p className="text-[#038C2A] font-medium text-sm">
                          Account Type: {accountType === 'individual' ? 'Individual (PIT)' : 'Business (CIT)'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {accountType === 'individual'
                            ? 'Calculate and track your Personal Income Tax.'
                            : 'Calculate and track Company Income Tax and other business taxes.'}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex-1 border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-[#038C2A] text-white py-3.5 rounded-xl font-semibold hover:bg-[#026b21] transition-all shadow-lg shadow-[#038C2A]/20 disabled:opacity-50 text-sm"
                        >
                          {loading ? 'Creating...' : 'Create Account'}
                        </button>
                      </div>
                    </>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            {step < 3 && (
              <>
                {/* Divider */}
                <div className="flex items-center gap-4 my-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">or</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Feature pills */}
                <div className="flex justify-center gap-3 mb-5">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-[#F8FFF8] px-3 py-1.5 rounded-lg text-xs text-gray-600">
                      <f.icon className="w-3 h-3 text-[#038C2A]" />
                      {f.text}
                    </div>
                  ))}
                </div>

                <p className="text-center text-gray-500 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#038C2A] font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </motion.div>

          {/* Bottom text */}
          <p className="text-center text-gray-400 text-xs mt-6">
            By signing up, you agree to our{' '}
            <Link to="/" className="text-[#038C2A] hover:underline">Terms</Link>
            {' & '}
            <Link to="/" className="text-[#038C2A] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
