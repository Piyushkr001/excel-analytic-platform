import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('excel'), (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    res.json({ data });
  } catch (err) {
    console.error('❌ Excel parse error:', err);
    res.status(500).json({ error: 'Failed to parse Excel file' });
  }
});

export default router;
