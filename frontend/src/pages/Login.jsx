import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn, ShieldCheck, Clock, Headphones } from 'lucide-react';
import { assets } from '../landing/assets/assets';

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
        <linearGradient id="loginWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8f5f0" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#d4edda" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e8f5f0" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <motion.path
        fill="url(#loginWaveGrad)"
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
  { icon: ShieldCheck, text: "Secure Login" },
  { icon: Clock, text: "24/7 Access" },
  { icon: Headphones, text: "Instant Support" },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FFF8] flex flex-col relative overflow-hidden">
      <WaveBackground />

      {/* Soft floating blobs */}
      <Blob className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.06]" color="#38B88F" />
      <Blob className="absolute bottom-40 -left-32 w-[300px] h-[300px] opacity-[0.05]" color="#059669" />

      {/* Dotted decorations */}
      <div className="absolute top-32 right-[15%] w-24 h-24 opacity-[0.15]"
        style={{ backgroundImage: "radial-gradient(circle, #38B88F 1.5px, transparent 1.5px)", backgroundSize: "12px 12px" }}
      />
      <div className="absolute bottom-60 left-[8%] w-16 h-16 opacity-[0.1]"
        style={{ backgroundImage: "radial-gradient(circle, #059669 1.5px, transparent 1.5px)", backgroundSize: "10px 10px" }}
      />

      {/* Back to home */}
      <div className="relative z-10 px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#038C2A] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[420px]">
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

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-[2rem] font-bold text-[#1a1a1a] mb-2">Welcome Back</h1>
              <p className="text-gray-500 text-sm">Sign in to access your tax dashboard</p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-sm text-[#038C2A] hover:underline font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none transition-all text-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#038C2A] text-white py-3.5 rounded-xl font-semibold hover:bg-[#026b21] transition-all shadow-lg shadow-[#038C2A]/20 disabled:opacity-50 text-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Feature boxes */}
            <div className="flex justify-center gap-3 mb-6">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-[#F8FFF8] px-3 py-1.5 rounded-md text-xs text-gray-600">
                  <f.icon className="w-3 h-3 text-[#038C2A]" />
                  {f.text}
                </div>
              ))}
            </div>

            <p className="text-center text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#038C2A] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>

          {/* Bottom text */}
          <p className="text-center text-gray-400 text-xs mt-6">
            By signing in, you agree to our{' '}
            <Link to="/" className="text-[#038C2A] hover:underline">Terms</Link>
            {' & '}
            <Link to="/" className="text-[#038C2A] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
