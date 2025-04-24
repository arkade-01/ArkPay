import nodemailer from 'nodemailer';
import config from './config';

// Update EmailPurpose to include the new type
export type EmailPurpose = 'reset' | 'login' | 'apiKey'

export const transporter = nodemailer.createTransport({
  service: config.emailService.service,
  auth: {
    user: config.emailService.auth.user,
    pass: config.emailService.auth.pass
  }
})

export const mailConfig = {
  from: process.env.EMAIL_FROM,
  subjectPrefix: process.env.EMAIL_SUBJECT_PREFIX || '',
  subjects: {
    reset: 'Password Reset Code',
    login: 'Login Verification Code',
    apiKey: 'Welcome to ArkPay - Your API Key'
  } as Record<EmailPurpose, string>
};

export function getEmailSubject(purpose: EmailPurpose) {
  const subject = mailConfig.subjects[purpose];
  return `${mailConfig.subjectPrefix}${subject}`.trim();
}