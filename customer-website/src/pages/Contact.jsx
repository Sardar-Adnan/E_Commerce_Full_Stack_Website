import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <span className="text-4xl">📩</span>
        <h1 className="text-4xl font-extrabold text-gray-900">Get in Touch</h1>
        <p className="text-gray-600">Have questions about plant care, orders, or custom planter sets? We'd love to hear from you!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Info */}
        <div className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>

          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <strong className="block text-gray-900 font-semibold">Store Address</strong>
                <p className="text-sm">Main Boulevard, Gulberg III, Lahore, Pakistan</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-xl">📧</span>
              <div>
                <strong className="block text-gray-900 font-semibold">Email Us</strong>
                <p className="text-sm">hello@leafandbloom.pk</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <strong className="block text-gray-900 font-semibold">Call Us</strong>
                <p className="text-sm">+92 300 1234567 (Mon-Sat, 9am - 7pm PKT)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-primary-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
              <p className="text-gray-600 text-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/20 transition-all"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
