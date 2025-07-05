import React from 'react';

export default function AboutUs() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50 px-6 py-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-20 animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-indigo-600">Xcellytics</span>
        </h1>
        <p className="mt-5 text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          Empowering individuals and organizations with smart Excel analytics. Visualize, interpret, and share your data effortlessly.
        </p>
      </div>

      {/* Mission Section */}
      <div className="flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto gap-12 animate-fadeIn">
        {/* Text */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At <strong>Xcellytics</strong>, our mission is to simplify data visualization for everyone. Whether you’re a student, a data analyst, or a business professional, our tools make working with spreadsheets easier and more powerful.
          </p>
          <p className="text-gray-700">
            We focus on clean UI, seamless integration, and real-time analytics to ensure your data speaks volumes without technical friction.
          </p>
          <p className="text-gray-700">
            Innovation and user-experience are at the core of everything we build.
          </p>
        </div>

        {/* Image */}
        <div className="flex-1">
          <img
            src="/src/assets/Images/Team Illustration.png"
            alt="Our Team Illustration"
            className="w-full max-w-md mx-auto md:max-w-full rounded-xl shadow-md"
          />
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto mt-24 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet the Team</h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              name: 'Piyush Kumar',
              role: 'Web Developer (Full Stack)',
              img: '/src/assets/Images/team1.png',
              email: 'piyushthegreat2305@gmail.com',
            },
            {
              name: 'Rajashree',
              role: 'Frontend Developer',
              img: '/src/assets/Images/team2.png',
              email: 'rajashree@example.com',
            },
            {
              name: 'Jayanth',
              role: 'Frontend Developer',
              img: '/src/assets/Images/team3.png',
              email: 'jayanth@example.com',
            },
          ].map(({ name, role, img, email }) => (
            <div
              key={name}
              className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
            >
              <img src={img} alt={name} className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" />
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              <p className="text-sm text-gray-500 mb-4">{role}</p>
              <a
                href={`mailto:${email}`}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm transition"
              >
                <button className='cursor-pointer'> Contact Me </button>
              </a>
            </div>
          ))}
        </div>
      </div>


      {/* CTA */}
      <div className="text-center mt-24">
        <p className="text-gray-700 text-lg">Ready to experience smarter Excel analytics?</p>
        <a
          href="/register"
          className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
