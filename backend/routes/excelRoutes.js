import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import ExcelRecord from '../models/ExcelRecord.js';
import { verifyToken, requireAdmin } from '../middleware/verifyToken.js'; // 👈 import middleware

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 👇 POST /api/excel/upload (Authenticated users only)
router.post('/upload', verifyToken, upload.single('excel'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    await ExcelRecord.insertMany(jsonData);

    fs.unlink(filePath, (err) => {
      if (err) console.warn('⚠️ Temp file not deleted:', filePath);
    });

    res.status(200).json({ message: 'File parsed and saved successfully', data: jsonData });
  } catch (error) {
    console.error('❌ Excel parsing error:', error);
    res.status(500).json({ error: 'Failed to parse or save Excel file' });
  }
});

// 👇 GET /api/excel/history (Authenticated users only)
router.get('/history', verifyToken, async (req, res) => {
  try {
    const records = await ExcelRecord.find().sort({ _id: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error('❌ Failed to fetch history:', error);
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
});

// 👇 Optional Admin-Only Example
router.get('/admin-only', verifyToken, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin 👑' });
});

export default router;
