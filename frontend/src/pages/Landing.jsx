import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Calculator, Shield, Bell, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-emerald-900">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src={assets.logo} 
            alt="TaxBuddy" 
            className="w-10 h-10 object-contain bg-white rounded-lg p-1"
          />
          <span className="text-white font-bold text-xl">TaxBuddy</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-white hover:text-gray-200 px-4 py-2">
            Login
          </Link>
          <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simplify Your Tax Compliance with TaxBuddy
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Track, calculate, and manage your taxes effortlessly. Stay compliant with Nigerian tax regulations.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Calculator, title: 'Tax Calculator', desc: 'Accurate PIT & CIT calculations' },
            { icon: Shield, title: 'Compliance Tracking', desc: 'Monitor your tax status' },
            { icon: Bell, title: 'Smart Reminders', desc: 'Never miss a deadline' },
            { icon: FileText, title: 'PDF Reports', desc: 'Download tax records' },
          ].map((feature) => (
            <div key={feature.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <feature.icon className="w-10 h-10 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-16 text-white text-center">
          <div>
            <p className="text-4xl font-bold">10k+</p>
            <p className="text-white/70">Active Users</p>
          </div>
          <div>
            <p className="text-4xl font-bold">₦2B+</p>
            <p className="text-white/70">Taxes Processed</p>
          </div>
          <div>
            <p className="text-4xl font-bold">99.9%</p>
            <p className="text-white/70">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-white/60">
          <p>© 2025 TaxBuddy. All Rights Reserved. Built for Nigerian Tax Compliance.</p>
        </div>
      </footer>
    </div>
  );
}
