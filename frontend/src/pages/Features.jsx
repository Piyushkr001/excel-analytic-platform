import React from 'react';
import { FaChartBar, FaClock, FaCogs, FaBolt } from 'react-icons/fa';

const features = [
  {
    icon: <FaChartBar className="text-white text-2xl" />,
    title: "Advanced Data Visualization",
    description:
      "Create stunning, interactive charts and graphs directly from your Excel data to tell your data's story.",
  },
  {
    icon: <FaClock className="text-white text-2xl" />,
    title: "Automated Reporting",
    description:
      "Generate custom, schedule-based reports in minutes, tailored to your specific needs and KPIs.",
  },
  {
    icon: <FaCogs className="text-white text-2xl" />,
    title: "Customizable Dashboards",
    description:
      "Design personalized dashboards with drag-and-drop simplicity to monitor key metrics at a glance.",
  },
  {
    icon: <FaBolt className="text-white text-2xl" />,
    title: "Seamless Excel Integration",
    description:
      "Connect effortlessly with your existing Excel files and cloud services for real-time analysis.",
  },
];

export default function Features() {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-teal-100 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4">
          Unlock Powerful Analytics Capabilities
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Everything you need to turn raw data into brilliant business decisions, all in one place.
        </p>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
               className="bg-white rounded-3xl p-6 flex flex-col shadow-md hover:shadow-xl hover:shadow-green-300/30 border border-gray-200 hover:border-green-400 h-80 transform transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-teal-400 w-14 h-14 rounded-xl flex items-center justify-center shadow-md mb-6 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
