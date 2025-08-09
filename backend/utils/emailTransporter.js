const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.error('❌ Email sending failed: Recipient (to) is required');
    return { error: true, message: 'Recipient email is required' };
  }

  console.log('=============================================');
  console.log(`📧 SENDING EMAIL VIA RESEND - ${new Date().toISOString()}`);
  console.log('To:', to);
  console.log('=============================================');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Resend API key is missing. Cannot send email.');
    return { error: true, message: 'Email service is not configured.' };
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Use your verified domain to send emails. This is the correct way.
    const fromAddress = 'SLExplora <noreply@slexplora.com>';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
      // This ensures that if a user replies, it goes to your actual email
      reply_to: 'slexplora@hotmail.com'
    });

    if (error) {
      console.error('❌ Failed to send email via Resend:', error);
      return { error: true, message: error.message, details: error };
    }

    console.log('✅ Email sent successfully via Resend:', data.id);
    return { success: true, data };

  } catch (err) {
    console.error('❌ A critical error occurred during email sending:', err);
    return {
      error: true,
      message: err.message || 'A critical error occurred.',
      details: err
    };
  }
};

module.exports = sendEmail;