// routes/profileRoutes.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { upload } from '../middleware/uploadMiddleware.js'; // ⬅️ import multer config

const router = express.Router();

router
  .route('/profile')
  .get(authenticate, getProfile)
  .put(authenticate, upload.single('image'), updateProfile); // ⬅️ handle profile image

export default router;
