import { Resend } from 'resend';

// Sender address (Resend default for testing — verify your own domain in production)
const DEFAULT_FROM = 'TaxBuddy <onboarding@resend.dev>';

/**
 * Get a fresh Resend instance (reads API key at call time, not module load)
 */
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[EmailService] RESEND_API_KEY is not set in environment');
    return null;
  }
  return new Resend(apiKey);
};

/**
 * Send a single email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const resend = getResend();
    if (!resend) {
      return { success: false, error: 'RESEND_API_KEY not configured. Add it to your .env file.' };
    }

    const fromEmail = DEFAULT_FROM; //process.env.FROM_EMAIL || 

    console.log(`[EmailService] Sending email to: ${to} | Subject: ${subject}`);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[EmailService] Resend API error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[EmailService] Email sent successfully. ID: ${data?.id}`);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('[EmailService] Send email exception:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email to newly registered users
 * Always sends — bypasses user email preference
 * @param {Object} user - User object with firstName, lastName, email
 */
export const sendWelcomeEmail = async (user) => {
  console.log(`[EmailService] Preparing welcome email for: ${user.email}`);

  const subject = 'Welcome to TaxBuddy — Your Tax Journey Starts Here!';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to TaxBuddy</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: #4F46E5; padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1f2937; font-size: 20px; margin: 0 0 20px; }
        .content p { color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
        .features { background: #f9fafb; border-radius: 10px; padding: 24px; margin: 24px 0; }
        .features h3 { color: #1f2937; font-size: 16px; margin: 0 0 16px; }
        .features ul { margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8; }
        .features li { margin-bottom: 6px; }
        .cta { text-align: center; margin: 32px 0 16px; }
        .cta a { display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; }
        .footer { background: #f9fafb; padding: 24px 30px; text-align: center; border-t: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 13px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to TaxBuddy!</h1>
          <p>Your Nigerian tax companion</p>
        </div>
        <div class="content">
          <h2>Hi ${user.firstName || 'there'},</h2>
          <p>Thank you for joining TaxBuddy! We're excited to help you stay on top of your taxes and remain compliant with Nigerian tax regulations.</p>
          <p>Here's what you can do with your new account:</p>
          <div class="features">
            <h3>Your TaxBuddy Toolkit</h3>
            <ul>
              <li><strong>Tax Calculator</strong> — Compute your CIT, VAT, PAYE, and total tax liability</li>
              <li><strong>Book Consultations</strong> — Schedule sessions with expert tax consultants</li>
              <li><strong>Tax History</strong> — Save and track all your tax calculations over time</li>
              <li><strong>Dashboard</strong> — Get a complete overview of your tax activities</li>
              <li><strong>Notifications</strong> — Receive reminders for tax deadlines and updates</li>
            </ul>
          </div>
          <div class="cta">
            <a href="taxbuddy-three.vercel.app">Get Started</a>
          </div>
          <p style="color:#9ca3af; font-size:13px; margin-top:24px;">If you have any questions, simply reply to this email or use the chat feature on our platform.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} TaxBuddy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail(user.email, subject, html);
  if (result.success) {
    console.log(`[EmailService] Welcome email sent to ${user.email}`);
  } else {
    console.error(`[EmailService] Welcome email FAILED for ${user.email}: ${result.error}`);
  }
  return result;
};

/**
 * Send admin broadcast email to multiple users
 * @param {Array} users - Array of user objects { email, firstName, lastName }
 * @param {string} subject - Email subject
 * @param {string} html - HTML content (supports {{firstName}}, {{lastName}}, {{email}} placeholders)
 * @returns {Promise<{success: number, failed: number, errors: Array}>}
 */
export const sendBulkEmail = async (users, subject, html) => {
  const results = { success: 0, failed: 0, errors: [] };

  console.log(`[EmailService] Starting bulk email to ${users.length} users`);

  for (const user of users) {
    const personalizedHtml = html
      .replace(/{{firstName}}/g, user.firstName || 'there')
      .replace(/{{lastName}}/g, user.lastName || '')
      .replace(/{{email}}/g, user.email || '');

    const result = await sendEmail(user.email, subject, personalizedHtml);

    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({ email: user.email, error: result.error });
    }
  }

  console.log(`[EmailService] Bulk email complete: ${results.success} sent, ${results.failed} failed`);
  return results;
};
