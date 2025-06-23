import mongoose from 'mongoose';

const excelRecordSchema = new mongoose.Schema({}, { strict: false });

const ExcelRecord = mongoose.model('ExcelRecord', excelRecordSchema);
export default ExcelRecord;
