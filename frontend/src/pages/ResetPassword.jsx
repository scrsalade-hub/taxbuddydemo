import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const Blob = ({ className, color }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill={color} d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z" transform="translate(100 100)" />
  </svg>
);

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail') || '';
  const code = localStorage.getItem('resetCode') || '';

  useEffect(() => { if (!email || !code) navigate('/forgot-password'); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Min 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL;
      await axios.post(`${API}/api/users/reset-password`, { email, code, password });
      setSuccess(true);
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FFF8] flex flex-col relative overflow-hidden">
      <Blob className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.06]" color="#38B88F" />
      <Blob className="absolute bottom-40 -left-32 w-[300px] h-[300px] opacity-[0.05]" color="#059669" />

      <div className="relative z-10 px-6 pt-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#038C2A] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[420px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">

            {success ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-[#F8FFF8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-[#038C2A]" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">Password Reset!</h3>
                <p className="text-sm text-gray-500 mb-6">Your password has been changed successfully.</p>
                <Link to="/login" className="inline-block w-full bg-[#038C2A] text-white py-3 rounded-xl font-semibold hover:bg-[#026b21] text-sm text-center">
                  Sign In with New Password
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-[1.75rem] font-bold text-[#1a1a1a] mb-2">New Password</h1>
                  <p className="text-gray-500 text-sm">Create a strong password for your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">{error}</div>}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none text-sm"
                        placeholder="Min. 6 characters" required />
                      <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type={show2 ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                        className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#38B88F]/30 focus:border-[#38B88F] outline-none text-sm"
                        placeholder="Repeat password" required />
                      <button type="button" onClick={() => setShow2(!show2)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {show2 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-[#038C2A] text-white py-3.5 rounded-xl font-semibold hover:bg-[#026b21] transition-colors disabled:opacity-50 text-sm">
                    {loading ? 'Updating...' : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
