import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Blob = ({ className, color }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill={color} d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z" transform="translate(100 100)" />
  </svg>
);

export default function VerifyResetCode() {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail') || '';

  useEffect(() => { inputRefs[0].current?.focus(); }, []);
  useEffect(() => { if (countdown > 0) { const t = setTimeout(() => setCountdown(c => c - 1), 1000); return () => clearTimeout(t); } }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    if (value && index < 3) inputRefs[index + 1].current?.focus();
    if (index === 3 && value) {
      const full = [...newCode.slice(0, 3), value].join('');
      if (full.length === 4) setTimeout(() => handleVerify(full), 200);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs[index - 1].current?.focus();
  };

  const handleVerify = async (fullCode) => {
    const c = fullCode || code.join('');
    if (c.length !== 4) { setError('Enter all 4 digits'); return; }
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL;
      await axios.post(`${API}/api/users/verify-reset-code`, { email, code: c });
      localStorage.setItem('resetCode', c);
      navigate('/reset-password');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      const API = import.meta.env.VITE_API_URL;
      await axios.post(`${API}/api/users/forgot-password`, { email });
      setCountdown(60);
    } catch { setError('Failed to resend'); }
  };

  return (
    <div className="min-h-screen bg-[#F8FFF8] flex flex-col relative overflow-hidden">
      <Blob className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.06]" color="#38B88F" />
      <Blob className="absolute bottom-40 -left-32 w-[300px] h-[300px] opacity-[0.05]" color="#059669" />

      <div className="relative z-10 px-6 pt-6">
        <Link to="/forgot-password" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#038C2A] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[420px]">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#038C2A] flex items-center justify-center mx-auto shadow-lg shadow-[#038C2A]/20 mb-4">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Verify Code</h1>
            <p className="text-gray-500 text-sm mt-1">Sent to {email}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
            {error && <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">{error}</div>}

            <div className="flex justify-center gap-4 my-8">
              {code.map((digit, i) => (
                <input key={i} ref={inputRefs[i]} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-14 h-16 rounded-2xl border-2 text-center text-2xl font-bold outline-none transition-all
                    ${digit ? 'border-[#038C2A] bg-[#F8FFF8] text-[#038C2A]' : 'border-gray-200 text-gray-900 focus:border-[#038C2A] focus:ring-2 focus:ring-[#38B88F]/20'}`}
                />
              ))}
            </div>

            <button onClick={() => handleVerify()} disabled={loading || code.join('').length !== 4}
              className="w-full bg-[#038C2A] text-white py-3.5 rounded-xl font-semibold hover:bg-[#026b21] transition-colors disabled:opacity-50 text-sm">
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="mt-5 text-center">
              <p className="text-xs text-gray-500">
                Didn't receive it?{' '}
                {countdown > 0 ? (
                  <span className="text-gray-400">Resend in {countdown}s</span>
                ) : (
                  <button onClick={handleResend} className="text-[#038C2A] font-medium hover:underline inline-flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Resend
                  </button>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
