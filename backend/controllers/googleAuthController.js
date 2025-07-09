import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const issueToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

export const googleAuth = async (req, res) => {
  const { credential, role: requestedRole } = req.body;
  if (!credential || !requestedRole)
    return res.status(400).json({ error: 'Missing credential or role' });

  try {
    /* 1️⃣ Verify Google token */
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    /* 2️⃣ Find or create user */
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: email + process.env.JWT_SECRET, // dummy
        role: requestedRole,                      // first login → chosen role
      });
    }

    /* 3️⃣ Enforce role match both ways */
    if (user.role !== requestedRole) {
      return res
        .status(403)
        .json({ error: `Account is "${user.role}". Please log in as ${user.role}.` });
    }

    /* 4️⃣ JWT */
    res.json({ token: issueToken(user) });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(400).json({ error: 'Invalid Google credential' });
  }
};
