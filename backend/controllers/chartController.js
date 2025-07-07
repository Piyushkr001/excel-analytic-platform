import ChartConfig from '../models/ChartConfig.js';

export const saveChartConfig = async (req, res) => {
  try {
    const { uploadId, xField, yField, chartType } = req.body;
    const userId = req.user.id;

    if (!uploadId || !xField || !yField) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const newChart = await ChartConfig.create({
      uploadId,
      xField,
      yField,
      chartType,
      user: userId,
    });

    res.status(201).json({ message: 'Chart configuration saved ✔', chart: newChart });
  } catch (err) {
    console.error('❌ Save chart failed:', err);
    res.status(500).json({ error: 'Failed to save chart config', details: err.message });
  }
};
