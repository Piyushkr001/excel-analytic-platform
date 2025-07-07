// backend/controllers/contact.controller.js
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
dotenv.config();                           // ← MUST run **before** we read env vars

import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';

/* ------------------------------------------------------------------ */
/* 1.  Verify required env variables                                  */
/* ------------------------------------------------------------------ */
const { SMTP_USER, SMTP_PASS, CONTACT_RECEIVER } = process.env;

if (!SMTP_USER || !SMTP_PASS) {
  console.error('❌  SMTP CONFIG ERROR → You must set SMTP_USER and SMTP_PASS in .env');
  /*  You can choose to throw here so the app refuses to start:
      throw new Error('Missing SMTP credentials');
  */
}

/* ------------------------------------------------------------------ */
/* 2.  Create Nodemailer transport (Gmail + App-Password)             */
/* ------------------------------------------------------------------ */
const transporter = nodemailer.createTransport({
  service: 'gmail',                      // works for gmail.com
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/* ------------------------------------------------------------------ */
/* 3.  Controller: POST  /api/contact                                 */
/* ------------------------------------------------------------------ */
export const sendMessage = async (req, res) => {
  /* 3-1) Validate body (errors added by express-validator in the route) */
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { firstName, lastName, email, subject = '', message } = req.body;

  try {
    /* 3-2) Persist message in MongoDB */
    const saved = await ContactMessage.create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    /* 3-3) Send notification e-mail */
    await transporter.sendMail({
      from: `"Xcellytics Contact" <${SMTP_USER}>`,
      to:   CONTACT_RECEIVER || SMTP_USER,     // fallback to yourself
      subject: `[Contact] ${subject || '(no subject)'}`,
      html: `
        <h2>New contact submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
        <hr><small>Sent automatically by Xcellytics</small>
      `,
    });

    return res.status(201).json({ message: 'Message sent ✔', saved });
  } catch (err) {
    console.error('❌  SMTP send error:', err);
    return res
      .status(500)
      .json({ error: 'Failed to send message', details: err.message });
  }
};
