// src/components/ThreeChartWrapper.jsx
import React from 'react';
import ThreeBarChart     from './ThreeBarChart';
import ThreeLineChart    from './ThreeLineChart';
import ThreePieChart     from './ThreePieChart';
import ThreeScatterChart from './ThreeScatterPlot';
import ThreeDoughnutChart from './ThreeDoughnutChart';
import ThreeBubbleChart  from './ThreeBubbleChart';

export default function ThreeChartWrapper({ chartType, data, xField, yField }) {
  if (!data || !xField || !yField) return null;

  switch (chartType) {
    case 'bar':
      return <ThreeBarChart data={data} xField={xField} yField={yField} />;
    case 'line':
    case 'area':
      return <ThreeLineChart data={data} xField={xField} yField={yField} />;
    case 'pie':
      return <ThreePieChart data={data} yField={yField} />;
    case 'doughnut':
      return <ThreeDoughnutChart data={data} yField={yField} />;
    case 'scatter':
      return <ThreeScatterChart data={data} xField={xField} yField={yField} />;
    case 'bubble':
      return (
       <ThreeBubbleChart data={data} xField={xField} yField={yField} />
      );
    default:
      return null;
  }
}
