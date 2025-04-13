import nodemailer from 'nodemailer';
import config from './config';

export type EmailPurpose = 'reset' 

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
  } as Record<EmailPurpose, string>
};

export function getEmailSubject(purpose : EmailPurpose) {
  const subject = mailConfig.subjects[purpose];
  return `${mailConfig.subjectPrefix}${subject}`.trim();
}