import crypto from 'crypto';
import path from 'path';
import ejs from 'ejs';
import { transporter, mailConfig, getEmailSubject } from '../config/nodemailerConfig';
import User from '../models/models'; // Import your User model
import config from '../config/config'; // Import your main config that has templatePath

// Define valid purpose types
type EmailPurpose = 'reset' | 'login';

/**
 * Send email with OTP code
 */
const sendEmail = async (email: string, purpose: EmailPurpose, code: string, codeExpiry: Date): Promise<void> => {
  // Make sure we're using the correct type for getEmailSubject
  // If getEmailSubject only accepts 'reset', we need to handle that
  const subject = purpose === 'reset'
    ? getEmailSubject('reset')
    : `${mailConfig.subjectPrefix}Login Verification Code`;

  const template = purpose === 'login' ? 'loginVerification' : 'passwordReset';
  const templatePath = path.join(config.templatePath, `${template}.ejs`);

  // Calculate hours until expiry (for the template)
  const now = new Date();
  const expiryHours = Math.round((codeExpiry.getTime() - now.getTime()) / (1000 * 60 * 60));

  // Prepare template data
  const templateData = {
    code,
    codeExpiry,
    expiryTime: expiryHours, // Add this to fix the template error
    userName: email.split('@')[0], // Basic username from email
    companyName: 'ArkPay',
    logoUrl: '../public/ArkPay.png',
    currentYear: new Date().getFullYear(),
    companyAddress: '123 Business St, City, Country',
    privacyUrl: 'https://yourcompany.com/privacy',
    termsUrl: 'https://yourcompany.com/terms',
    resetUrl: `https://yourcompany.com/reset-password?token=${code}`
  };

  const htmlContent = await ejs.renderFile(templatePath, templateData);

  const mailOptions = {
    from: mailConfig.from,
    to: email,
    subject: subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Generate and send OTP for password reset
 * (login verification removed as requested)
 */
const getOTP = async (email: string, purpose: EmailPurpose): Promise<string> => {
  if (!email) {
    throw new Error('Email is required for OTP generation');
  }

  // Generate 6-digit code
  const code = crypto.randomInt(100000, 999999).toString();
  const codeExpiry = new Date(Date.now() + 3600000); // Code expires in 1 hour (3600000 ms)

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Update user with new code - only handle reset tokens now
    if (purpose === 'reset') {
      user.resetToken = code;
      user.resetTokenExpiration = codeExpiry;
    } else {
      // For 'login' purpose we don't do anything special
      // This branch is kept for future expansion if needed
      console.log(`Login verification requested for ${email}`);
    }

    // Save the updated user
    await user.save();

    // Send email with code
    await sendEmail(email, purpose, code, codeExpiry);

    return code;
  } catch (error) {
    console.error('Error in getOTP:', error);
    throw error;
  }
};

export { getOTP, sendEmail };