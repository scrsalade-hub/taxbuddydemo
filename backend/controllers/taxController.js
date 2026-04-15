import TaxRecord from '../models/TaxRecord.js';
import Notification from '../models/Notification.js';

// PIT Tax Brackets (Nigeria)
const PIT_BRACKETS = [
  { limit: 300000, rate: 0.07 },
  { limit: 600000, rate: 0.11 },
  { limit: 1100000, rate: 0.15 },
  { limit: 1600000, rate: 0.19 },
  { limit: 3200000, rate: 0.21 },
  { limit: Infinity, rate: 0.24 },
];

// Calculate PIT
const calculatePIT = (annualIncome, deductibleExpenses = 0) => {
  const taxableIncome = Math.max(0, annualIncome - deductibleExpenses);
  let remainingIncome = taxableIncome;
  let totalTax = 0;
  const breakdown = [];
  let previousLimit = 0;

  for (const bracket of PIT_BRACKETS) {
    if (remainingIncome <= 0) break;
    const bracketSize = bracket.limit === Infinity ? remainingIncome : bracket.limit - previousLimit;
    const taxableInBracket = Math.min(remainingIncome, bracketSize);
    const taxInBracket = taxableInBracket * bracket.rate;
    totalTax += taxInBracket;

    if (taxableInBracket > 0) {
      breakdown.push({
        bracket: bracket.limit === Infinity 
          ? `Above ₦${previousLimit.toLocaleString()}` 
          : `₦${previousLimit.toLocaleString()} - ₦${bracket.limit.toLocaleString()}`,
        amount: Math.round(taxInBracket),
        rate: bracket.rate * 100,
      });
    }
    remainingIncome -= taxableInBracket;
    previousLimit = bracket.limit;
  }

  const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

  return {
    taxableIncome: Math.round(taxableIncome),
    taxAmount: Math.round(totalTax),
    taxRate: PIT_BRACKETS[0].rate * 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    breakdown,
  };
};

// Calculate CIT
const calculateCIT = (annualRevenue, deductibleExpenses = 0, companySize = 'small') => {
  const taxableIncome = Math.max(0, annualRevenue - deductibleExpenses);
  let taxRate = 0.30;
  if (companySize === 'small') taxRate = 0.20;
  else if (companySize === 'medium') taxRate = 0.25;

  const taxAmount = taxableIncome * taxRate;

  return {
    taxableIncome: Math.round(taxableIncome),
    taxAmount: Math.round(taxAmount),
    taxRate: taxRate * 100,
    effectiveRate: taxableIncome > 0 ? Math.round((taxAmount / taxableIncome) * 10000) / 100 : 0,
    breakdown: [{
      bracket: 'Standard Rate',
      amount: Math.round(taxAmount),
      rate: taxRate * 100,
    }],
  };
};

// @desc    Calculate tax
// @route   POST /api/tax/calculate
export const calculateTax = async (req, res) => {
  try {
    const { income, expenses, taxType, year } = req.body;

    let result;
    if (taxType === 'PIT') {
      result = calculatePIT(income, expenses);
    } else {
      let companySize = 'small';
      if (income > 100000000) companySize = 'large';
      else if (income > 25000000) companySize = 'medium';
      result = calculateCIT(income, expenses, companySize);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create tax record
// @route   POST /api/tax/records
export const createTaxRecord = async (req, res) => {
  try {
    const { month, year, income, expenses, taxableIncome, taxAmount, taxRate, taxType, status, notes } = req.body;

    const taxRecord = await TaxRecord.create({
      userId: req.user.id,
      month,
      year,
      income,
      expenses,
      taxableIncome,
      taxAmount,
      taxRate,
      taxType,
      status,
      notes,
    });

    // Create notification
    await Notification.create({
      userId: req.user.id,
      title: 'Tax record saved',
      message: `Tax record for ${month} ${year} saved successfully`,
      type: 'success',
    });

    res.status(201).json(taxRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's tax records
// @route   GET /api/tax/records
export const getTaxRecords = async (req, res) => {
  try {
    const records = await TaxRecord.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tax record
// @route   PUT /api/tax/records/:id
export const updateTaxRecord = async (req, res) => {
  try {
    const record = await TaxRecord.findOne({ _id: req.params.id, userId: req.user.id });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    Object.assign(record, req.body);
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark tax as paid
// @route   PUT /api/tax/records/:id/pay
export const markTaxAsPaid = async (req, res) => {
  try {
    const record = await TaxRecord.findOne({ _id: req.params.id, userId: req.user.id });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    record.status = 'paid';
    record.paymentDate = new Date();
    const updatedRecord = await record.save();

    // Create notification
    await Notification.create({
      userId: req.user.id,
      title: 'Payment marked as paid',
      message: `Tax payment for ${record.month} ${record.year} marked as paid`,
      type: 'success',
    });

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete tax record
// @route   DELETE /api/tax/records/:id
export const deleteTaxRecord = async (req, res) => {
  try {
    const record = await TaxRecord.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tax/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const records = await TaxRecord.find({ userId: req.user.id });
    
    const totalIncome = records.reduce((sum, r) => sum + r.income, 0);
    const totalTaxPaid = records.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.taxAmount, 0);
    const totalTaxDue = records.filter(r => r.status === 'unpaid').reduce((sum, r) => sum + r.taxAmount, 0);
    const avgTaxRate = records.length > 0 ? records.reduce((sum, r) => sum + r.taxRate, 0) / records.length : 0;
    const paidCount = records.filter(r => r.status === 'paid').length;
    const complianceScore = records.length > 0 ? Math.round((paidCount / records.length) * 100) : 100;

    res.json({
      totalIncome,
      totalTaxPaid,
      totalTaxDue,
      taxRate: Math.round(avgTaxRate * 100) / 100,
      complianceScore,
      recentTransactions: records.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
