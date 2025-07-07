// controllers/authController.js
import bcrypt  from 'bcryptjs';
import jwt     from 'jsonwebtoken';
import crypto  from 'crypto';

import User    from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';   // ⬅️ new helper

/* ──────────────────────────────────────────────
 * Helper – sign a JWT
 * ──────────────────────────────────────────── */
const issueToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

/* ──────────────────────────────────────────────
 * 1)  POST  /api/auth/register
 * ──────────────────────────────────────────── */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    res.status(201).json({ token: issueToken(user) });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/* ──────────────────────────────────────────────
 * 2)  POST  /api/auth/login
 * ──────────────────────────────────────────── */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: issueToken(user) });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

/* ──────────────────────────────────────────────
 * 3)  POST  /api/auth/forgot-password   { email }
 *     – generate token, e-mail reset link
 * ──────────────────────────────────────────── */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    // Always respond OK to avoid revealing accounts
    if (!user) return res.json({ message: 'Reset link sent if email exists' });

    const resetToken = user.getResetToken();        // defined in model
    await user.save({ validateBeforeSave: false });

    // Build URL (use ENV for prod, fallback to localhost for dev)
    const baseURL  = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    const resetURL = `${baseURL}/reset-password/${resetToken}`;

    /* ───── send e-mail ───── */
    const html = `
      <h2>Hello, ${user.name}</h2>
      <p>You requested a password reset for your Excel Analytics account.</p>
      <p>
        <a href="${resetURL}" style="
            display:inline-block;
            padding:10px 16px;
            background:#10b981;
            color:#fff;
            border-radius:6px;
            text-decoration:none;">
          Reset Password
        </a>
      </p>
      <p>This link will expire in 10&nbsp;minutes.</p>
    `;
    await sendEmail(user.email, 'Password Reset – Excel Analytics', html);

    res.json({ message: 'Reset link sent if email exists' });
  } catch (err) {
    console.error('❌ Forgot-password error:', err);
    res.status(500).json({ error: 'Email could not be sent' });
  }
};

/* ──────────────────────────────────────────────
 * 4)  POST  /api/auth/reset-password/:token   { password }
 * ──────────────────────────────────────────── */
export const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken : hashedToken,
      resetPasswordExpire: { $gt: Date.now() },     // still valid?
    });

    if (!user)
      return res.status(400).json({ error: 'Invalid or expired token' });

    user.password            = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: 'Password reset successful. Please log in.' });
  } catch (err) {
    console.error('❌ Reset-password error:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
};
