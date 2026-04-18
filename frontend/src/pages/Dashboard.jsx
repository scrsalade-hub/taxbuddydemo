import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, TrendingDown, Wallet, Percent, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, recordsRes] = await Promise.all([
          axios.get(`${API}/api/tax/dashboard`, { headers }),
          axios.get(`${API}/api/tax/records`, { headers }),
        ]);
        setStats(statsRes.data);
        setAllRecords(recordsRes.data);
        setRecords(recordsRes.data.slice(0, 5));

        // Extract unique years from records
        const years = [...new Set(recordsRes.data.map(r => r.year))].sort((a, b) => b - a);
        setAvailableYears(years);

        // Generate chart data from real records
        const monthlyData = generateChartData(recordsRes.data, 'all');
        setChartData(monthlyData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Regenerate chart data when year filter changes
  useEffect(() => {
    if (allRecords.length > 0) {
      const monthlyData = generateChartData(allRecords, selectedYear);
      setChartData(monthlyData);
    }
  }, [selectedYear, allRecords]);

  // Generate chart data from user's tax records, filtered by year
  const generateChartData = (records, yearFilter) => {
    if (!records || records.length === 0) {
      // Return empty months if no records
      return monthNames.map(month => ({ month, income: 0 }));
    }

    // Filter records by year if a specific year is selected
    let filteredRecords = records;
    if (yearFilter !== 'all') {
      filteredRecords = records.filter(r => r.year === parseInt(yearFilter));
    }

    if (filteredRecords.length === 0) {
      return monthNames.map(month => ({ month, income: 0 }));
    }

    // Group records by month using the record's month field
    const monthlyIncome = {};

    filteredRecords.forEach(record => {
      const monthIndex = monthNames.indexOf(record.month);
      const monthKey = monthIndex >= 0 ? monthNames[monthIndex] : record.month;

      if (!monthlyIncome[monthKey]) {
        monthlyIncome[monthKey] = 0;
      }
      monthlyIncome[monthKey] += (record.income || 0);
    });

    // Create chart data array for all months
    return monthNames.map(month => ({
      month,
      income: monthlyIncome[month] || 0
    }));
  };

  const formatCurrency = (amount) => {
    return '₦' + (amount || 0).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back!</h2>
            <p className="text-white/80">Here's what's happening with your taxes today.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/calculator" className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
              Calculate Tax
            </Link>
            <Link to="/history" className="border border-white/30 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10">
              View History
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Income', value: formatCurrency(stats?.totalIncome), icon: Wallet, color: 'bg-blue-500', trend: '+12.5%' },
          { title: 'Tax Payable', value: formatCurrency(stats?.totalTaxDue), icon: TrendingDown, color: 'bg-orange-500', trend: '-5.2%' },
          { title: 'Tax Rate', value: (stats?.taxRate || 0) + '%', icon: Percent, color: 'bg-purple-500', trend: 'Effective' },
          { title: 'Net Income', value: formatCurrency((stats?.totalIncome || 0) - (stats?.totalTaxPaid || 0)), icon: TrendingUp, color: 'bg-green-500', trend: '+8.3%' },
        ].map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-500 mt-1">{stat.trend}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Income Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Income Overview</h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <option value="all">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="income" fill="#0c8a5a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Compliance Status</h3>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="#0c8a5a" 
                  strokeWidth="12" 
                  fill="none"
                  strokeDasharray={`${(stats?.complianceScore || 0) * 3.52} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{stats?.complianceScore || 0}%</span>
              </div>
            </div>
            <p className="text-gray-500">Compliance Score</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Link to="/history" className="text-primary hover:underline flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {records.length > 0 ? records.map((record) => (
            <div key={record._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  record.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {record.status === 'paid' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{record.month} {record.year}</p>
                  <p className="text-sm text-gray-500">{record.taxType} Tax</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(record.taxAmount)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  record.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500">
              <p>No transactions yet</p>
              <Link to="/calculator" className="text-primary hover:underline mt-2 inline-block">
                Calculate your first tax
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
