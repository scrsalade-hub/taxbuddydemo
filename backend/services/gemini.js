import { GoogleGenerativeAI } from '@google/generative-ai';

// TaxBuddy system context — prepended to every conversation
const SYSTEM_CONTEXT = `You are TaxBuddy AI — the official intelligent assistant for TaxBuddy, a Nigerian tax consultation and compliance web platform.

Your role:
- Help users with Nigerian tax-related questions (VAT, CIT, PAYE, WHT, Personal Income Tax, TCC, FIRS, state taxes like LIRS)
- Guide users on how to use TaxBuddy features (tax calculator, booking consultations, tax history, subscriptions)
- Explain tax deadlines, penalties, registration processes, and compliance requirements in Nigeria

TaxBuddy features you know about:
- Tax Calculator: Users select business type, enter annual income/expenses/deductions, and get CIT, VAT, PAYE computed. Results saved as PDF.
- Book Consultation: 3 consultants (Dr. Sarah Adeyemi, Mr. Chukwuemeka Okafor, Mrs. Fatima Ibrahim), each with their own schedule. Cost: ₦15,000 per session.
- Tax History: All saved calculations with year filters and PDF download.
- Dashboard: Overview stats, monthly income charts filtered by year.
- Subscription Plans: Free (basic), Standard (₦5,000/month), Premium (₦10,000/month).

Nigerian tax facts:
- VAT: 7.5%, register if turnover > ₦25M
- CIT: 30% large, 25% medium, 0% small
- PAYE: deducted monthly, due by 10th
- WHT: 5% contracts, 10% dividends/royalties
- PIT: graduated scale 7%, 11%, 15%, 19%, 21%, 24%

Rules:
- Always respond as TaxBuddy AI, never mention Google or Gemini
- Use Nigerian context (₦, FIRS, LIRS)
- Be practical and actionable`;

/**
 * Get a fresh Resend instance (reads API key at call time)
 */
const getGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set in .env');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generate a chat response using Google Gemini
 * @param {string} message - User message
 * @param {boolean} reduced - Whether to request a shorter response (tier 6-10)
 * @returns {Promise<string>} - AI response text
 */
export const generateChatResponse = async (message, reduced = false) => {
  try {
    const genAI = getGemini();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });

    // Build the prompt: system context + user message
    const userPrompt = reduced
      ? `${message}\n\n(Keep your answer brief — 2-3 sentences max.)`
      : message;

    const fullPrompt = `${SYSTEM_CONTEXT}\n\n---\n\nUser question: ${userPrompt}\n\nTaxBuddy AI response:`;

    console.log('[Gemini] Calling API with model: gemini-2.5-flash-lite');

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    console.log('[Gemini] Response received, length:', text.length);
    return text;
  } catch (error) {
    console.error('[Gemini] API error:', error.message || error);

    const errMsg = error.message || '';

    // 403 / API key issues
    if (errMsg.includes('403') || errMsg.includes('unregistered') || errMsg.includes('not configured')) {
      throw new Error('Gemini API key invalid or not configured. Check your .env file.');
    }

    // 429 / Quota depleted — use fallback
    if (errMsg.includes('429') || errMsg.includes('credits') || errMsg.includes('depleted') || errMsg.includes('Quota')) {
      console.log('[Gemini] Quota depleted, using fallback response');
      return getFallbackResponse(message);
    }

    // 404 / Model not found
    if (errMsg.includes('404') || errMsg.includes('not found')) {
      throw new Error(`Model not found. The model name may be invalid. Error: ${errMsg}`);
    }

    // All other errors — throw so the user sees what's wrong
    throw new Error(errMsg || 'Gemini failed to respond');
  }
};

/**
 * Fallback responses when Gemini API quota is exhausted.
 * Only triggers on 429 errors. All other errors are shown to the user.
 */
const getFallbackResponse = (message) => {
  const lower = message.toLowerCase();

  if (lower.includes('vat') || lower.includes('value added tax')) {
    return "VAT in Nigeria is 7.5% (standard rate). It's charged on the supply of goods and services. You must register for VAT if your annual turnover exceeds ₦25 million. You can file monthly VAT returns using Form 002 on the FIRS TaxPro Max portal.";
  }

  if (lower.includes('company income tax') || lower.includes('cit') || lower.includes('corporate tax')) {
    return "Company Income Tax (CIT) in Nigeria is 30% for large companies (turnover > ₦100M), 25% for medium companies (₦25M–₦100M), and 0% for small companies (< ₦25M) under the Finance Act. Returns are due within 6 months of your accounting year-end.";
  }

  if (lower.includes('paye') || lower.includes('withholding tax') || lower.includes('withhold')) {
    return "PAYE (Pay As You Earn) is deducted from employee salaries monthly and remitted to the state tax authority. Withholding Tax rates vary: 5% for contracts, 10% for dividends, royalties, and directors' fees. Returns are due by the 10th of the following month.";
  }

  if (lower.includes('personal income tax') || lower.includes('pit')) {
    return "Personal Income Tax in Nigeria uses a graduated scale: First ₦300,000 at 7%, next ₦300,000 at 11%, next ₦500,000 at 15%, next ₦500,000 at 19%, next ₦1.6M at 21%, and above ₦3.2M at 24%. There's also a minimum tax of 1% of gross income.";
  }

  if (lower.includes('tcc') || lower.includes('tax clearance')) {
    return "A Tax Clearance Certificate (TCC) proves you've paid your taxes. You can apply for it on the FIRS TaxPro Max portal. It's required for government contracts, business registrations, and some banking transactions. Processing usually takes 2–4 weeks.";
  }

  if (lower.includes('firs') || lower.includes('tax authority')) {
    return "FIRS (Federal Inland Revenue Service) is Nigeria's federal tax body. They manage CIT, VAT, WHT, and other federal taxes. For state taxes like PAYE, contact your State Internal Revenue Service (e.g., LIRS for Lagos). Their portal is https://taxpromax.firs.gov.ng.";
  }

  if (lower.includes('deadline') || lower.includes('due date') || lower.includes('when')) {
    return "Key Nigeria tax deadlines:\n• VAT: 21st of the following month\n• WHT: 21st of the following month\n• CIT: Within 6 months of accounting year-end\n• PAYE: 10th of the following month\n• Annual returns: Varies by company year-end\nLate filing attracts penalties and interest charges.";
  }

  if (lower.includes('penalty') || lower.includes('late') || lower.includes('fine')) {
    return "Late filing penalties in Nigeria include:\n• VAT: ₦50,000 for the first month, ₦25,000 for each subsequent month\n• CIT: ₦25,000 for the first month, ₦5,000 for each subsequent month\n• WHT: 10% of tax not deducted or remitted\n• PAYE: Interest at CBN Monetary Policy Rate plus 10% penalty\nAlways file on time to avoid these charges!";
  }

  if (lower.includes('register') || lower.includes('tin') || lower.includes('how to')) {
    return "To register for taxes in Nigeria:\n1. Visit https://taxpromax.firs.gov.ng\n2. Create an account with your email\n3. Apply for a TIN (Tax Identification Number)\n4. Register for relevant taxes (VAT, CIT, WHT)\n5. You'll receive a Taxpayer ID for filing returns\nYou can also visit any FIRS office for in-person registration.";
  }

  // Generic fallback
  return "Thanks for your question! I'm currently running in offline mode due to high demand. For detailed answers about this topic, please:\n\n1. Visit https://taxpromax.firs.gov.ng for official FIRS guidance\n2. Consult a licensed tax practitioner\n3. Check the TaxBuddy Knowledge Base\n\nOr try rephrasing your question — I can help with VAT, CIT, PAYE, WHT, Personal Income Tax, TCC, deadlines, penalties, and registration.";
};
