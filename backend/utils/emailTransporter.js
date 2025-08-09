const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.error('❌ Email sending failed: Recipient (to) is required');
    throw new Error('Recipient email is required');
  }

  console.log('=============================================');
  console.log(`📧 EMAIL SENDING ATTEMPT - ${new Date().toISOString()}`);
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Email environment:', process.env.NODE_ENV);
  console.log('=============================================');

  try {
    // Use Resend as the primary email service
    if (process.env.RESEND_API_KEY) {
      console.log('🔄 Sending email via Resend API...');
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // Always use slexplora@hotmail.com as the sender
      const fromAddress = 'SLExplora <slexplora@hotmail.com>';
      console.log('From address:', fromAddress);
      
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to,
        subject,
        html,
        // Add reply-to header for replies to go to your Hotmail
        reply_to: 'slexplora@hotmail.com'
      });

      if (error) {
        console.error('❌ Failed to send email via Resend:', error);
        throw new Error(error.message);
      }

      console.log('✅ Email sent successfully via Resend:', data);
      return data;
    } 
    // Fallback to SMTP only if Resend isn't available
    else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('🔄 Falling back to SMTP (Hotmail)...');
      
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.office365.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER || 'slexplora@hotmail.com',
          pass: process.env.EMAIL_PASS,
        },
      });
      
      const result = await transporter.sendMail({
        from: 'SLExplora <slexplora@hotmail.com>',
        to,
        subject,
        html,
      });
      
      console.log('✅ Email sent successfully via SMTP:', result.messageId);
      return result;
    } else {
      throw new Error('No email configuration available');
    }
  } catch (err) {
    console.error('❌ Error sending email:', err);
    
    // Log detailed error for debugging
    console.error('Detailed error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      responseCode: err.responseCode,
    });
    
    // Return error object instead of throwing
    return {
      error: true,
      message: err.message || 'Email sending failed',
      details: err
    };
  }
};

module.exports = sendEmail;