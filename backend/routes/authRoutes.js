// routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { googleAuth } from '../controllers/googleAuthController.js';

const router = express.Router();

router.post('/register',            register);
router.post('/login',               login);
router.post('/google',              googleAuth);
router.post('/forgot-password',     forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
