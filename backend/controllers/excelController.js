import xlsx from 'xlsx';
import ExcelData from '../models/ExcelRecord.js';

export const uploadExcel = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const inserted = await ExcelData.insertMany(data);
    res.json({ message: 'Upload successful', data: inserted });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
};
