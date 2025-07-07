import React from 'react';
import ThreeBarChart from './ThreeBarChart';
import ThreeLineChart from './ThreeLineChart';
import ThreePieChart from './ThreePieChart';
import ThreeScatterChart from './ThreeScatterPlot';


export default function ThreeChartWrapper({ chartType, data, xField, yField }) {
  if (!data || !xField || !yField) return null;

  switch (chartType) {
    case 'bar':
      return <ThreeBarChart data={data} xField={xField} yField={yField} />;
    case 'line':
    case 'area':
      return <ThreeLineChart data={data} xField={xField} yField={yField} />;
    case 'pie':
      return <ThreePieChart data={data} yField={yField} doughnut={false} />;
    case 'doughnut':
      return <ThreePieChart data={data} yField={yField} doughnut={true} />;
    case 'scatter':
      return <ThreeScatterChart data={data} xField={xField} yField={yField} bubble={false} />;
    case 'bubble':
      return <ThreeScatterChart data={data} xField={xField} yField={yField} bubble={true} />;
    default:
      return null;
  }
}
