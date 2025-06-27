/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Mail as MailIcon, Phone } from 'lucide-react'; // MailIcon alias

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:8000/api/contact', form);
      alert('Message sent! 🎉');
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('❌ Contact error:', err);
      alert(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <section className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-sky-50">
      {/* ---------- Page Header ---------- */}
      <header className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Contact{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-sky-600 to-violet-700">
            Our&nbsp;Team
          </span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          We’re here to help you unlock the power of your data. Reach out with any
          questions or to start your journey with&nbsp;
          <span className="font-semibold">Xcellytics</span>.
        </p>
      </header>

      {/* ---------- Main Grid ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        {/* ======== Contact Cards ======== */}
        <div className="space-y-6 lg:col-span-2">
          {[
            {
              iconBg: 'from-emerald-500 to-emerald-700',
              Icon: MapPin,
              title: 'Our Office',
              lines: ['123 Data Drive, Suite 500', 'Analytics City, AC 12345'],
            },
            {
              iconBg: 'from-sky-400 to-sky-600',
              Icon: MailIcon,
              title: 'Email Us',
              lines: ['support@excelytic.com', 'sales@excelytic.com'],
            },
            {
              iconBg: 'from-indigo-500 to-indigo-700',
              Icon: Phone,
              title: 'Call Us',
              lines: ['Mon–Fri • 8 am – 5 pm', '+1 (555) 123-4567'],
            },
          ].map(({ Icon, iconBg, title, lines }) => (
            <div
              key={title}
              className="flex p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`flex-shrink-0 text-white bg-gradient-to-br ${iconBg} w-12 h-12 mr-4 rounded-xl flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {lines.map((l) => (
                  <p key={l} className="text-gray-600 leading-relaxed">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ======== Contact Form ======== */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-900">
              Send us a Message&nbsp;🚀
            </h3>

            {/* First / Last Name */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Let us know how we can help you"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Leave a comment..."
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-indigo-600 px-6 py-3 text-center text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
