// src/components/ChartWrapper.jsx
import React, { useEffect, useRef } from 'react';
import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Scatter,
  Bubble,
} from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function ChartWrapper({ id, type, data, options }) {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [type]);

  const chartType = type === 'area' ? 'line' : type;

  const commonProps = {
    id,
    data,
    options,
    ref: (instance) => {
      chartRef.current = instance?.chartInstance || instance;
    },
  };

  switch (chartType) {
    case 'bar':
      return <Bar {...commonProps} />;
    case 'line':
      return <Line {...commonProps} />;
    case 'pie':
      return <Pie {...commonProps} />;
    case 'doughnut':
    case 'donut':
      return <Doughnut {...commonProps} />;
    case 'scatter':
      return <Scatter {...commonProps} />;
    case 'bubble':
      return <Bubble {...commonProps} />;
    default:
      return <p className="text-red-500">Unsupported chart type: {type}</p>;
  }
}
