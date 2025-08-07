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
    // Use Hotmail SMTP as primary method since PayHere integration requires a deployed site
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('🔄 Sending email via SMTP (Hotmail)...');
      
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
        from: process.env.EMAIL_FROM || 'SLExplora <slexplora@hotmail.com>',
        to,
        subject,
        html,
      });
      
      console.log('✅ Email sent successfully via SMTP:', result.messageId);
      return result;
    } 
    // Fallback to Resend if SMTP credentials aren't available
    else if (process.env.RESEND_API_KEY) {
      console.log('🔄 Falling back to Resend API...');
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const fromAddress = process.env.EMAIL_FROM || 'SLExplora <info@slexplora.com>';
      
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to,
        subject,
        html,
      });

      if (error) {
        console.error('❌ Failed to send email via Resend:', error);
        throw new Error(error.message);
      }

      console.log('✅ Email sent successfully via Resend:', data);
      return data;
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
    
    throw err;
  }
};

module.exports = sendEmail;