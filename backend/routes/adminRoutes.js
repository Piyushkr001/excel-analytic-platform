import express from "express";

import {
  getStats,
  listUsers,
  blockUser,
  deleteUser,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, requireAdmin);          // ⏹️ protect everything below

router.get("/stats",  getStats);
router.get("/users",  listUsers);
router.patch("/users/:id/block", blockUser);
router.delete("/users/:id",      deleteUser);

export default router;
