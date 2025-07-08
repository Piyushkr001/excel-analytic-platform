// controllers/userController.js
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/* ────────── GET  /api/user/profile ────────── */
export const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

  const { _id, name, email, role, image } = req.user;   // ← include image
  res.json({ _id, name, email, role, image });
});

/* ────────── PUT  /api/user/profile ────────── */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, email, password } = req.body;

  /* --- duplicate-email guard --- */
  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });
    user.email = email;
  }

  if (name) user.name = name;

  /* --- optional password change --- */
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  /* --- ✅ NEW: save uploaded image, if any --- */
  if (req.file) {
    // store relative URL so you can serve it via /uploads
    user.image = `/uploads/${req.file.filename}`;
  }

  const updatedUser = await user.save();

  res.json({
    _id:   updatedUser._id,
    name:  updatedUser.name,
    email: updatedUser.email,
    role:  updatedUser.role,
    image: updatedUser.image,          // ← return image to frontend
  });
});
