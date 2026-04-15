import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Crown, Zap, Building2 } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for individuals getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Zap,
    features: [
      'Basic tax calculator',
      'Up to 12 tax records/year',
      'Email support',
      'Basic reports',
    ],
    notIncluded: ['PDF downloads', 'Consultation booking', 'API access', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and small businesses',
    monthlyPrice: 5000,
    yearlyPrice: 50000,
    icon: Crown,
    features: [
      'Advanced tax calculator',
      'Unlimited tax records',
      'Priority email support',
      'Advanced analytics',
      'PDF & CSV downloads',
      '2 consultations/month',
    ],
    notIncluded: ['API access', 'Priority support'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    monthlyPrice: 25000,
    yearlyPrice: 250000,
    icon: Building2,
    features: [
      'Advanced tax calculator',
      'Unlimited tax records',
      '24/7 phone & email support',
      'Custom analytics',
      'PDF & CSV downloads',
      'Unlimited consultations',
      'Full API access',
      'Dedicated account manager',
    ],
    notIncluded: [],
  },
];

export default function Subscription() {
  const { user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);

  const handleSubscribe = (planId) => {
    if (planId === 'free') {
      alert('You are already on the Free plan');
      return;
    }
    alert(`Subscribed to ${planId} plan! (Stripe integration needed)`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Select the perfect plan for your tax management needs.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${!isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={`w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-primary' : 'bg-gray-300'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isYearly ? 'translate-x-8' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm ${isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
          Yearly
        </span>
        {isYearly && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Save 17%
          </span>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          const isCurrentPlan = user?.subscription === plan.id;
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div key={plan.id} className={`bg-white rounded-xl shadow-sm relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  plan.popular ? 'bg-primary' : 'bg-primary-light'
                }`}>
                  <PlanIcon className={`w-7 h-7 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>

                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₦{price.toLocaleString()}
                  </span>
                  <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-400">
                      <span className="w-5 h-5 flex items-center justify-center">-</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : `Subscribe to ${plan.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
