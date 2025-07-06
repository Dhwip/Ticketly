import nodemailer from 'nodemailer';

// Create a test account for development (you can replace with real SMTP credentials)
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    throw error;
  }
};

// For production, use real SMTP credentials
const createProductionTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    // Use test account for development, production credentials for production
    const transporter = process.env.NODE_ENV === 'production' 
      ? createProductionTransporter() 
      : await createTestAccount();

    const mailOptions = {
      from: process.env.NODE_ENV === 'production' ? process.env.EMAIL_USER : 'noreply@ticketly.com',
      to: email,
      subject: 'Password Reset Request - Ticketly',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2b2d42; color: #fff; padding: 20px; text-align: center;">
            <h1 style="color: #FFD700; margin: 0;">Ticketly</h1>
            <p style="margin: 10px 0 0 0;">Password Reset Request</p>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Hello!</h2>
            <p style="color: #666; line-height: 1.6;">
              You requested a password reset for your Ticketly account. Click the button below to reset your password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #FFD700; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #333; font-size: 12px; word-break: break-all;">
              ${resetUrl}
            </p>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated email from Ticketly. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    
    // For development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}; 