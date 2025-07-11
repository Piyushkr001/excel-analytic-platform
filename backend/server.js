import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import excelRoutes from './routes/excelRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import chartRoutes from './routes/chartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config(); 
const app = express();

// CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// JSON body
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/charts', chartRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/user', profileRoutes);
app.use('/uploads', express.static('uploads'));


// DB & Server
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server @ http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB error:', err));
