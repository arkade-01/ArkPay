import crypto from 'crypto';
import path from 'path';
import ejs from 'ejs';
import { transporter, mailConfig, getEmailSubject } from '../config/nodemailerConfig';
import User from '../models/models'; // Import your User model
import config from '../config/config'; // Import your main config that has templatePath

// Define valid purpose types
type EmailPurpose = 'reset' | 'login' | 'apiKey';

/**
 * Send email with OTP code or API key
 */
const sendEmail = async (email: string, purpose: EmailPurpose, code: string, codeExpiry?: Date, apiKey?: string): Promise<void> => {
  // Determine subject based on purpose
  let subject;
  switch (purpose) {
    case 'reset':
      subject = getEmailSubject('reset');
      break;
    case 'login':
      subject = `${mailConfig.subjectPrefix}Login Verification Code`;
      break;
    case 'apiKey':
      subject = `${mailConfig.subjectPrefix}Welcome to ArkPay - Your API Key`;
      break;
    default:
      subject = `${mailConfig.subjectPrefix}Notification`;
  }

  // Determine which template to use
  let template;
  switch (purpose) {
    case 'login':
      template = 'loginVerification';
      break;
    case 'reset':
      template = 'passwordReset';
      break;
    case 'apiKey':
      template = 'welcome';
      break;
  }

  const templatePath = path.join(config.templatePath, `${template}.ejs`);

  // Calculate hours until expiry (for the template), if applicable
  let expiryHours;
  if (codeExpiry) {
    const now = new Date();
    expiryHours = Math.round((codeExpiry.getTime() - now.getTime()) / (1000 * 60 * 60));
  }

  // Prepare template data
  const templateData = {
    code,
    apiKey,
    codeExpiry,
    expiryTime: expiryHours, // Add this to fix the template error
    userName: email.split('@')[0], // Basic username from email
    companyName: 'ArkPay',
    logoUrl: 'https://res.cloudinary.com/dtpy1fmrg/image/upload/v1744505230/ekhebnyymuh10dvdozfq.png',
    currentYear: new Date().getFullYear(),
    companyAddress: 'Onchain',
    privacyUrl: 'https://yourcompany.com/privacy',
    termsUrl: 'https://yourcompany.com/terms',
    apiDocsUrl: 'https://yourcompany.com/api-docs',
    supportUrl: 'https://yourcompany.com/support'
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

      // Save the updated user
      await user.save();

      // Send email with code
      await sendEmail(email, purpose, code, codeExpiry);
    } else if (purpose === 'login') {
      // For 'login' purpose we don't do anything special
      // This branch is kept for future expansion if needed
      console.log(`Login verification requested for ${email}`);

      // Send email with code
      await sendEmail(email, purpose, code, codeExpiry);
    }

    return code;
  } catch (error) {
    console.error('Error in getOTP:', error);
    throw error;
  }
};

/**
 * Send welcome email with API key
 */
const sendApiKeyEmail = async (email: string, apiKey: string): Promise<void> => {
  if (!email || !apiKey) {
    throw new Error('Email and API key are required');
  }

  try {
    // Find the user by email to verify they exist
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Send welcome email with API key
    await sendEmail(email, 'apiKey', '', undefined, apiKey);

    console.log(`API key email sent to ${email}`);
  } catch (error) {
    console.error('Error sending API key email:', error);
    throw error;
  }
};

export { getOTP, sendEmail, sendApiKeyEmail };