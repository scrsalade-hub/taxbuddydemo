import { useState } from 'react';
import axios from 'axios';
import { Calculator, Save, ArrowRight, Info } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function TaxCalculator() {
  const [taxType, setTaxType] = useState('PIT');
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCalculate = async () => {
    if (!income || parseFloat(income) <= 0) {
      alert('Please enter a valid income amount');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/tax/calculate', {
        income: parseFloat(income),
        expenses: parseFloat(expenses) || 0,
        taxType,
        year,
      });
      setResult(data);
    } catch (error) {
      alert('Error calculating tax');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;

    setSaving(true);
    try {
      await axios.post('/api/tax/records', {
        month,
        year,
        income: parseFloat(income),
        expenses: parseFloat(expenses) || 0,
        taxableIncome: result.taxableIncome,
        taxAmount: result.taxAmount,
        taxRate: result.taxRate,
        taxType,
        status: 'unpaid',
      });
      alert('Tax record saved successfully!');
      setIncome('');
      setExpenses('');
      setResult(null);
    } catch (error) {
      alert('Error saving tax record');
    }
    setSaving(false);
  };

  const formatCurrency = (amount) => {
    return '₦' + (amount || 0).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Calculator</h1>
        <p className="text-gray-500">Calculate your tax liability based on Nigerian tax regulations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Enter Your Details</h2>
          </div>

          <div className="space-y-6">
            {/* Tax Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tax Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTaxType('PIT')}
                  className={`p-4 border-2 rounded-xl text-center transition-colors ${
                    taxType === 'PIT' 
                      ? 'border-primary bg-primary-light text-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">Personal Income Tax</span>
                  <span className="block text-xs text-gray-500 mt-1">For Individuals</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTaxType('CIT')}
                  className={`p-4 border-2 rounded-xl text-center transition-colors ${
                    taxType === 'CIT' 
                      ? 'border-primary bg-primary-light text-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">Company Income Tax</span>
                  <span className="block text-xs text-gray-500 mt-1">For Businesses</span>
                </button>
              </div>
            </div>

            {/* Period */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {[2023, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {taxType === 'PIT' ? 'Annual Income (₦)' : 'Annual Revenue (₦)'}
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg"
                placeholder="0.00"
              />
            </div>

            {/* Expenses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deductible Expenses (₦)
              </label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="0.00"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Calculating...' : <>
                Calculate Tax
                <ArrowRight className="w-4 h-4" />
              </>}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Tax Calculation Result</h2>

          {result ? (
            <div className="space-y-6">
              {/* Main Result */}
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 text-white text-center">
                <p className="text-white/80 mb-2">Tax Amount</p>
                <p className="text-4xl font-bold">{formatCurrency(result.taxAmount)}</p>
                <p className="text-white/80 mt-2">
                  Effective Rate: {result.effectiveRate}%
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Gross Income</span>
                  <span className="font-medium">{formatCurrency(parseFloat(income))}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Deductible Expenses</span>
                  <span className="font-medium">{formatCurrency(parseFloat(expenses) || 0)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Taxable Income</span>
                  <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Tax Rate</span>
                  <span className="font-medium">{result.taxRate}%</span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? 'Saving...' : <>
                  <Save className="w-4 h-4" />
                  Save to Tracker
                </>}
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
              <Calculator className="w-16 h-16 mb-4" />
              <p>Enter your details and click Calculate</p>
              <p className="text-sm">Your tax calculation will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Personal Income Tax (PIT)</h3>
          <p className="text-sm text-blue-700">
            Progressive tax rates from 7% to 24% based on income brackets.
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-semibold text-green-900 mb-2">Company Income Tax (CIT)</h3>
          <p className="text-sm text-green-700">
            30% for large companies, 20% for medium, 0% for small companies.
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-2">Tax Deadlines</h3>
          <p className="text-sm text-purple-700">
            PIT: January 31st annually. CIT: 6 months after financial year end.
          </p>
        </div>
      </div>
    </div>
  );
}
