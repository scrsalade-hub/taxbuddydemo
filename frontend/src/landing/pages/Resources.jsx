import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Dowmloads from '../components/ResourcesComp/Dowmloads';
import UsefulLinks from '../components/ResourcesComp/UsefulLinks';
import { ExternalLink, BookOpen } from "lucide-react";

const Resources = () => {
  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#F8FFF8] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.06]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#38B88F" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link to="/" className="hover:text-[#038C2A] transition-colors">Homepage</Link>
              <span>/</span>
              <span className="text-[#038C2A]">Resources</span>
            </div>
            <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-bold text-[#1a1a1a] leading-tight mb-4">
              Tax <span className="text-[#038C2A]">Resources</span>
            </h1>
            <p className="text-gray-500 text-base lg:text-lg max-w-2xl">
              Free guides, templates, and useful links to help you navigate Nigerian business taxes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Downloads & Links */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <Dowmloads />
          <UsefulLinks />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 lg:py-28 bg-[#038C2A] relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] opacity-[0.08]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M39.9,-65.7C54.3,-60.5,70.7,-55.4,79.6,-39.8C86.9,-25.3,89.9,-15.3,87.4,1.4C84.9,18.1,78.5,34,68.6,46.5C58.7,59,45.3,68.5,32.3,74.6C19.1,81.1,4.3,83,-14.3,78.6C-29.3,76.2,-43.7,69.5,-55.6,59.3C-67.5,49.1,-76.9,35.4,-81.3,19.8C-85.7,4.2,-85.1,-0.3,-82.8,-14.2C-79.7,-28.1,-69.7,-40.7,-58.3,-49.8C-46.9,-58.9,-34.1,-64.5,-21.1,-68.1C-8.1,-71.7,0.7,-73.3,14.7,-71.2C28.7,-69.1,42.3,-63.2,54.3,-54.3C66.3,-45.4,76.7,-33.5,81.4,-19.8C86.1,-6.1,85.1,9.7,79.6,23.5C74.1,37.3,64.1,49.1,52.3,58.3C40.5,67.5,26.9,74.1,12.3,77.1C-2.3,80.1,-17.9,79.5,-32.3,74.8C-46.7,70.1,-59.9,61.3,-69.7,49.1C-79.5,36.9,-85.9,21.3,-86.3,5.6C-86.7,-10.1,-81.1,-25.9,-71.4,-38.5C-61.7,-51.1,-47.9,-60.5,-34.1,-65.7C-20.3,-70.9,-6.5,-71.9,7.1,-72.3C20.7,-72.7,34.1,-72.5,39.9,-65.7Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <BookOpen className="w-12 h-12 text-white/80 mb-6" />
              <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-white leading-tight mb-4">
                Stay Updated with<br />Tax News & Tips
              </h2>
              <p className="text-white/80 text-base leading-relaxed">
                Subscribe to our newsletter and get the latest tax updates, compliance reminders, and expert tips delivered straight to your inbox.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <NewsletterForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL;
      const { default: axios } = await import('axios');
      const { data } = await axios.post(`${API}/api/users/newsletter`, { email });
      setMessage(data.message);
      setIsError(false);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 rounded-xl bg-white text-[#038C2A] font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-sm ${isError ? 'text-red-300' : 'text-green-300'}`}>
          {message}
        </p>
      )}
      <p className="mt-4 text-white/60 text-xs">
        By subscribing, you agree to receive tax-related emails. Unsubscribe anytime.
      </p>
    </form>
  );
};

export default Resources;
