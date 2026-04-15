import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileText, CheckCircle2, XCircle, Search } from 'lucide-react';
import jsPDF from 'jspdf';

const statusColors = {
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
};

export default function TaxHistory() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchQuery, statusFilter]);

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get('/api/tax/records');
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = records;
    
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.taxType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    setFilteredRecords(filtered);
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await axios.put(`/api/tax/records/${id}/pay`);
      fetchRecords();
    } catch (error) {
      alert('Error marking as paid');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`/api/tax/records/${id}`);
      fetchRecords();
    } catch (error) {
      alert('Error deleting record');
    }
  };

  const downloadPDF = (record) => {
    const doc = new jsPDF();
    
    doc.setFillColor(12, 138, 90);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TaxBuddy', 20, 25);
    
    doc.setFontSize(12);
    doc.text('Tax Payment Receipt', 20, 35);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text('Tax Payment Details', 20, 60);
    
    const details = [
      `Period: ${record.month} ${record.year}`,
      `Tax Type: ${record.taxType}`,
      `Income: ₦${record.income.toLocaleString()}`,
      `Taxable Income: ₦${record.taxableIncome.toLocaleString()}`,
      `Tax Amount: ₦${record.taxAmount.toLocaleString()}`,
      `Tax Rate: ${record.taxRate}%`,
      `Status: ${record.status.toUpperCase()}`,
    ];
    
    let y = 80;
    details.forEach(detail => {
      doc.setFontSize(11);
      doc.text(detail, 20, y);
      y += 10;
    });
    
    doc.save(`Tax-Receipt-${record.month}-${record.year}.pdf`);
  };

  const formatCurrency = (amount) => {
    return '₦' + (amount || 0).toLocaleString();
  };

  const stats = {
    total: filteredRecords.length,
    paid: filteredRecords.filter(r => r.status === 'paid').length,
    unpaid: filteredRecords.filter(r => r.status === 'unpaid').length,
    totalPaid: filteredRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.taxAmount, 0),
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax History</h1>
          <p className="text-gray-500">Track and manage your tax payment records</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <p className="text-sm text-orange-600 mb-1">Total Records</p>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-sm text-green-600 mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-700">{stats.paid}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm text-red-600 mb-1">Unpaid</p>
          <p className="text-2xl font-bold text-red-700">{stats.unpaid}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-600 mb-1">Paid Amount</p>
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.totalPaid)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl shadow-sm">
        {filteredRecords.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredRecords.map((record) => (
              <div key={record._id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      record.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {record.status === 'paid' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.month} {record.year}</h3>
                      <p className="text-sm text-gray-500">{record.taxType} Tax • Tax Rate: {record.taxRate}%</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        <span className="text-gray-500">
                          Income: <span className="font-medium text-gray-900">{formatCurrency(record.income)}</span>
                        </span>
                        <span className="text-gray-500">
                          Tax: <span className="font-medium text-gray-900">{formatCurrency(record.taxAmount)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[record.status]}`}>
                      {record.status.toUpperCase()}
                    </span>
                    
                    {record.status === 'unpaid' && (
                      <button
                        onClick={() => handleMarkAsPaid(record._id)}
                        className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark"
                      >
                        Mark Paid
                      </button>
                    )}
                    
                    <button
                      onClick={() => downloadPDF(record)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      title="Download Receipt"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Start by calculating your first tax'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
