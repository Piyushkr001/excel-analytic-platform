import express from 'express';
import ChartConfig from '../models/ChartConfig.js';
import ExcelRecord from '../models/ExcelRecord.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/charts → Return chart config + Excel data
router.get('/', authenticate, async (req, res) => {
  try {
    const charts = await ChartConfig.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const result = await Promise.all(
      charts.map(async (chart) => {
        const records = await ExcelRecord.find({ uploadId: chart.uploadId });
        return {
          _id: chart._id,
          xField: chart.xField,
          yField: chart.yField,
          chartType: chart.chartType,
          data: records, // Include parsed Excel data
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error('❌ Failed to load charts:', err);
    res.status(500).json({ error: 'Failed to load saved charts' });
  }
});

export default router;
