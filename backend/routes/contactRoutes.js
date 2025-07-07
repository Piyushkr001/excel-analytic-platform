import express from 'express';
import { body } from 'express-validator';
import { sendMessage } from '../controllers/contact.controller.js';

const router = express.Router();

/*  POST /api/contact  */
router.post(
  '/',
  [
    body('firstName').trim().notEmpty().withMessage('First name required'),
    body('lastName').trim().notEmpty().withMessage('Last name required'),
    body('email').isEmail().withMessage('Invalid e-mail'),
    body('message').trim().notEmpty().withMessage('Message required'),
  ],
  sendMessage
);

export default router;
