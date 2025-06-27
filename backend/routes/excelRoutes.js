import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import ExcelRecord from '../models/ExcelRecord.js';
import { verifyToken, requireAdmin } from '../middleware/verifyToken.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/excel/upload (Protected)
router.post('/upload', verifyToken, upload.single('excel'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const uploadId = uuidv4();

    const recordsWithMeta = jsonData.map(row => ({
      ...row,
      uploadId,
      uploadedAt: new Date(),
      uploadedBy: req.user.id,
    }));

    await ExcelRecord.insertMany(recordsWithMeta);

    fs.unlink(filePath, err => {
      if (err) console.warn('Temp file not deleted:', filePath);
    });

    // ✅ INCLUDE uploadId in response
    res.status(200).json({
      message: 'File parsed and saved successfully',
      data: recordsWithMeta,
      uploadId, // ✅ this makes Save Chart work
    });
  } catch (error) {
    console.error('Excel parsing error:', error);
    res.status(500).json({ error: 'Failed to parse or save Excel file' });
  }
});


// GET /api/excel/history (Protected)
router.get('/history', verifyToken, async (req, res) => {
  try {
    const grouped = await ExcelRecord.aggregate([
      { $match: { uploadedBy: req.user.id } },
      { $sort: { uploadedAt: -1 } },
      {
        $group: {
          _id: '$uploadId',
          uploadedAt: { $first: '$uploadedAt' },
          uploadedBy: { $first: '$uploadedBy' },
          records: { $push: '$$ROOT' },
        },
      },
      { $sort: { uploadedAt: -1 } },
    ]);

    res.status(200).json(grouped);
  } catch (error) {
    console.error('Failed to fetch upload history:', error);
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
});

// Example Admin-Only Protected Route
router.get('/admin-only', verifyToken, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin 👑' });
});

export default router;
