import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Percent, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Clock,
  Download,
  Printer,
  Building2,
  User,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { generateTaxReceiptPDF } from '../utils/pdfGenerator';

const statusConfig = {
  paid: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Paid' },
  unpaid: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Unpaid' },
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
};

export default function TaxHistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API}/api/tax/records`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rec = data.find(r => r._id === id);
      setRecord(rec);
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!record) return;
    const doc = generateTaxReceiptPDF(record, user);
    doc.save(`tax-record-${record.month}-${record.year}.pdf`);
  };

  const printRecord = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Record Not Found</h2>
        <p className="text-gray-500 mb-6">The tax record you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Back to Tax History
        </button>
      </div>
    );
  }

  const StatusIcon = statusConfig[record.status]?.icon || Clock;
  const statusColor = statusConfig[record.status]?.color || 'text-gray-600';
  const statusBg = statusConfig[record.status]?.bg || 'bg-gray-100';
  const statusLabel = statusConfig[record.status]?.label || record.status;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/history')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Tax History
      </button>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-5 h-5" />
              <span className="text-white/80">Tax Record</span>
            </div>
            <h1 className="text-3xl font-bold mb-1">
              {record.month} {record.year}
            </h1>
            <p className="text-white/80">
              {record.taxType === 'CIT' ? 'Company Income Tax' : 'Personal Income Tax'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${statusBg}`}>
            <div className={`flex items-center gap-2 ${statusColor}`}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-semibold">{statusLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Financial Summary
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Gross Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(record.income || 0).toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Taxable Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(record.taxableIncome || 0).toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Deductible Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(record.expenses || 0).toLocaleString()}
                </p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-sm text-primary mb-1">Tax Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ₦{(record.taxAmount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Tax Rate Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              Tax Rate Information
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{record.taxRate.toFixed(1) || 0}%</p>
                  <p className="text-xs text-gray-500">Rate</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600">
                  Your tax is calculated based on the Nigerian {record.taxType === 'CIT' ? 'Company' : 'Personal'} Income Tax 
                  regulations for the {record.year} tax year.
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {record.notes && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Notes
              </h2>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
                {record.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Record Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Record Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="font-medium">
                    {new Date(record.createdAt).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Tax Year</p>
                  <p className="font-medium">{record.year}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {record.taxType === 'CIT' ? (
                  <Building2 className="w-5 h-5 text-gray-400" />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Tax Type</p>
                  <p className="font-medium">
                    {record.taxType === 'CIT' ? 'Company Income Tax' : 'Personal Income Tax'}
                  </p>
                </div>
              </div>
              
              {record.status === 'paid' && record.paymentDate && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-medium text-green-600">
                      {new Date(record.paymentDate).toLocaleDateString('en-NG')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={downloadPDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              
              <button
                onClick={printRecord}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print Record
              </button>
            </div>
          </div>

          {/* Help */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-4">
              If you have questions about this tax record, contact our support team.
            </p>
            <button
              onClick={() => navigate('/consultation')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
