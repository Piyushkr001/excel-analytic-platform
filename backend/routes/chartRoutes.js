import express from 'express';
import ChartConfig from '../models/ChartConfig.js';
import ExcelRecord from '../models/ExcelRecord.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ✅ GET /api/charts → Return saved chart config + Excel data
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

// ✅ POST /api/charts → Save a new chart config
router.post('/', authenticate, async (req, res) => {
  const { uploadId, xField, yField, chartType } = req.body;
  const userId = req.user.id;

  if (!uploadId || !xField || !yField) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const chart = new ChartConfig({
      uploadId,
      userId,
      xField,
      yField,
      chartType: chartType || 'line',
    });

    await chart.save();
    res.status(201).json({ message: 'Chart saved successfully', chart });
  } catch (err) {
    console.error('❌ Error saving chart config:', err);
    res.status(500).json({ error: 'Server error while saving chart' });
  }
});

export default router;
