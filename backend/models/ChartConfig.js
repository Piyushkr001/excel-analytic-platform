import mongoose from 'mongoose';

const chartConfigSchema = new mongoose.Schema(
  {
    uploadId:  { type: String, required: true },
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    xField:    { type: String, required: true },
    yField:    { type: String, required: true },
    chartType: {
      type: String,
      enum: [
        'line',
        'area',
        'bar',
        'pie',
        'doughnut',
        'scatter',
        'bubble',
      ],
      default: 'line',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ChartConfig', chartConfigSchema);
