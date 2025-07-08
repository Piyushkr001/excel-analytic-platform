import React, { useEffect, useRef, forwardRef } from 'react';
import { Line, Bar, Pie, Doughnut, Scatter, Bubble } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

/**
 * A light wrapper that forwards the underlying Chart.js instance upward.
 */
const ChartWrapper = forwardRef(
  ({ id, type, data, options, onChartReady }, ref) => {
    const localRef = useRef(null);

    /* clean-up when chart type swaps */
    useEffect(() => {
      return () => {
        if (localRef.current) {
          localRef.current.destroy();
          localRef.current = null;
        }
      };
    }, [type]);

    /* store + bubble up instance */
    const setInstance = (instance) => {
      localRef.current = instance?.chartInstance || instance;
      if (ref) ref.current = localRef.current;
      if (onChartReady) onChartReady(localRef.current);
    };

    const chartType = type === 'area' ? 'line' : type;
    const common = { id, data, options, ref: setInstance };

    switch (chartType) {
      case 'bar':
        return <Bar {...common} />;
      case 'line':
        return <Line {...common} />;
      case 'pie':
        return <Pie {...common} />;
      case 'doughnut':
      case 'donut':
        return <Doughnut {...common} />;
      case 'scatter':
        return <Scatter {...common} />;
      case 'bubble':
        return <Bubble {...common} />;
      default:
        return <p className="text-red-500">Unsupported chart type: {type}</p>;
    }
  }
);

export default ChartWrapper;
