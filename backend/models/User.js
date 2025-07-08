import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, default: 'user' },       // roles: 'user', 'admin'

    isBlocked: { type: Boolean, default: false },       // ✅ NEW: for admin to block

    image: { type: String, default: '' },



    // 🔐 Password reset fields
    resetPasswordToken:  String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

/* ---------- Instance method to generate token ---------- */
userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash and store
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

  return resetToken;
};

export default mongoose.model('User', userSchema);
