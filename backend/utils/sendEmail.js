// utils/sendEmail.js
import nodemailer from 'nodemailer';

/**
 * Send an HTML email.
 * @param {String} to       – recipient address
 * @param {String} subject  – subject line
 * @param {String} html     – html body
 */
export default async function sendEmail(to, subject, html) {
  // Transporter: Gmail (App-Password) by default
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE ?? 'gmail',  // e.g. “gmail”
    auth: {
      user: process.env.SMTP_USER, // your address
      pass: process.env.SMTP_PASS, // an *app* password
    },
  });

  await transporter.sendMail({
    from: `"Excel Analytics" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
