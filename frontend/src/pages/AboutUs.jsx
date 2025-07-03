import React from 'react';

export default function AboutUs() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50 px-6 py-12">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-indigo-600">Xcellytics</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
          Discover how Xcellytics empowers users with seamless Excel data analytics, intuitive charting tools, and a user-first design.
        </p>
      </div>

      {/* Info Section */}
      <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto gap-12">
        {/* Image */}
        <div className="flex-1">
          <img
            src="/src/assets/Images/Team Illustration.png"
            alt="Team Illustration"
            className="w-full max-w-md mx-auto md:max-w-full"
          />
        </div>

        {/* Text */}
        <div className="flex-1 space-y-5">
          <h2 className="text-3xl font-bold text-gray-800">
            Our Mission
          </h2>
          <p className="text-gray-600 text-lg">
            At <strong>Xcellytics</strong>, we're passionate about simplifying data. Our goal is to empower professionals, students, and teams to effortlessly analyze and visualize their Excel files through an easy-to-use platform.
          </p>
          <p className="text-gray-600">
            We believe in blending powerful analytics with beautiful design. Whether you're exploring trends, presenting insights, or just trying to make sense of your spreadsheets, Xcellytics is here to help.
          </p>
          <p className="text-gray-600">
            Our team continuously improves the platform to deliver fast, secure, and scalable tools that enhance your productivity.
          </p>
        </div>
      </div>

      {/* Team Section (Optional) */}
      <div className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Meet the Team</h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {[
            { name: 'Piyush Kumar', role: 'Founder & Engineer', img: '/src/assets/Images/team1.png' },
            { name: 'Aisha Mehta', role: 'Product Designer', img: '/src/assets/Images/team2.png' },
            { name: 'Rohan Das', role: 'Data Scientist', img: '/src/assets/Images/team3.png' },
          ].map(({ name, role, img }) => (
            <div
              key={name}
              className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <img src={img} alt={name} className="w-28 h-28 rounded-full object-cover mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
