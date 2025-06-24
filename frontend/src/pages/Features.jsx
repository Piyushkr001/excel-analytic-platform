import React from 'react'
import { FaChartBar, FaClock, FaCogs, FaBolt } from 'react-icons/fa'

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
      "Generate custom, schedule-based reports in minutes, tailored to your specific needs and KPIs. Save time, reduce errors.",
  },
  {
    icon: <FaCogs className="text-white text-2xl" />,
    title: "Customizable Dashboards",
    description:
      "Design personalized dashboards with drag-and-drop simplicity to monitor key metrics at a glance. Your data, your way.",
  },
  {
    icon: <FaBolt className="text-white text-2xl" />,
    title: "Seamless Excel Integration",
    description:
      "Connect effortlessly with your existing Excel files and cloud services for real-time analysis and synchronization.",
  },
]

function Features() {
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-green-100 via-white to-teal-100 px-4 min-h-screen py-16">
      <h2 className="font-bold text-4xl text-center mb-4">
        Unlock Powerful Analytics Capabilities
      </h2>
      <p className="text-lg text-gray-400 text-center max-w-2xl mb-12">
        Everything you need to turn raw data into brilliant business decisions, all in one place.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-10 gap-6 w-full max-w-7xl">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 hover:shadow-lg border h-80 border-slate-700 transform transition-transform duration-300 hover:-translate-y-2  hover:shadow-blue-600/20"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Features
