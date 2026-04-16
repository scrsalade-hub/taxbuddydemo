import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gift, Copy, Share2, Users, TrendingUp, Mail, MessageCircle } from 'lucide-react';

const referralStats = {
  totalReferrals: 12,
  successfulConversions: 8,
  pendingReferrals: 4,
  totalEarnings: 40000,
};

export default function Referral() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = `TB-${user?.id?.slice(0, 6).toUpperCase() || 'REF123'}`;
  const referralLink = `https://taxbuddy-three.vercel.app/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount) => {
    return '₦' + (amount || 0).toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Refer & Earn</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Invite your friends to TaxBuddy and earn ₦5,000 for each friend who subscribes to a paid plan!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-600 mb-1">Total Referrals</p>
          <p className="text-2xl font-bold text-blue-700">{referralStats.totalReferrals}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-sm text-green-600 mb-1">Successful</p>
          <p className="text-2xl font-bold text-green-700">{referralStats.successfulConversions}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-sm text-amber-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-700">{referralStats.pendingReferrals}</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-sm text-purple-600 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-purple-700">{formatCurrency(referralStats.totalEarnings)}</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">Your Referral Link</h2>
          <p className="text-white/80">Share this link with your friends and start earning!</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg pr-24"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white text-primary rounded-lg font-medium hover:bg-gray-100"
            >
              {copied ? 'Copied!' : <><Copy className="w-4 h-4 inline mr-1" /> Copy</>}
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button className="px-4 py-2 bg-white/20 rounded-lg flex items-center gap-2 hover:bg-white/30">
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>
          <button className="px-4 py-2 bg-white/20 rounded-lg flex items-center gap-2 hover:bg-white/30">
            <Mail className="w-5 h-5" />
            <span>Email</span>
          </button>
          <button className="px-4 py-2 bg-white/20 rounded-lg flex items-center gap-2 hover:bg-white/30">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Share2, title: 'Share Your Link', description: 'Copy your unique referral link and share it with friends.' },
            { icon: Users, title: 'Friends Sign Up', description: 'Your friends sign up using your referral link.' },
            { icon: TrendingUp, title: 'Earn Rewards', description: 'Earn ₦5,000 for each successful referral!' },
          ].map((step, index) => (
            <div key={step.title} className="bg-white rounded-xl shadow-sm p-6 text-center card-hover">
              <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                {index + 1}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Referral rewards are paid only when the referred user subscribes to a paid plan</li>
          <li>• Rewards are credited to your account within 7 days of successful conversion</li>
          <li>• There is no limit to the number of referrals you can make</li>
          <li>• Self-referrals are not allowed and will be disqualified</li>
        </ul>
      </div>
    </div>
  );
}
