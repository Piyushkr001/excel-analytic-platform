import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true },
    subject:   { type: String, default: '' },
    message:   { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactSchema);
