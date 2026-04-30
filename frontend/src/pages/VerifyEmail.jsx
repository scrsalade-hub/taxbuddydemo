import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';

const Blob = ({ className, color }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill={color} d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z" transform="translate(100 100)" />
  </svg>
);

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('No verification token found.'); return; }
    const verify = async () => {
      try {
        const API = import.meta.env.VITE_API_URL;
        await axios.get(`${API}/api/users/verify-email/${token}`);
        setStatus('success');
        setMessage('Email verified successfully!');
        setTimeout(() => navigate('/dashboard'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify email.');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FFF8] flex flex-col relative overflow-hidden">
      <Blob className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.06]" color="#38B88F" />
      <Blob className="absolute bottom-40 -left-32 w-[300px] h-[300px] opacity-[0.05]" color="#059669" />

      <div className="relative z-10 px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#038C2A] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[420px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10 text-center">

            {status === 'loading' && (
              <>
                <Loader2 className="w-12 h-12 text-[#038C2A] animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Verifying...</h2>
                <p className="text-gray-500 text-sm">Please wait while we confirm your email.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-[#F8FFF8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#038C2A]" />
                </div>
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Email Verified!</h2>
                <p className="text-gray-500 text-sm mb-6">{message}</p>
                <p className="text-xs text-gray-400 mb-4">Redirecting to dashboard...</p>
                <Link to="/dashboard" className="inline-block w-full bg-[#038C2A] text-white py-3 rounded-xl font-semibold hover:bg-[#026b21] text-sm">
                  Go to Dashboard
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Verification Failed</h2>
                <p className="text-gray-500 text-sm mb-6">{message}</p>
                <Link to="/login" className="inline-block w-full bg-[#038C2A] text-white py-3 rounded-xl font-semibold hover:bg-[#026b21] text-sm">
                  Sign In to Resend
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
