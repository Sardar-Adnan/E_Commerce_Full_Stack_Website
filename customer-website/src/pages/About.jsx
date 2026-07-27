import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-5xl">🌿</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Bringing Nature Into Every Home
        </h1>
        <p className="text-lg text-gray-600">
          At Leaf & Bloom, we believe everyone deserves a thriving green space. We curate healthy indoor plants, hand-selected planters, and pet-friendly greenery delivered straight to your door.
        </p>
      </section>

      {/* Grid Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">
            🌱
          </div>
          <h3 className="text-xl font-bold text-gray-900">Sustainably Grown</h3>
          <p className="text-sm text-gray-500">
            Our plants are sourced from certified nurseries using eco-friendly growing methods and minimal plastic packaging.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">
            🐾
          </div>
          <h3 className="text-xl font-bold text-gray-900">Pet-Safe Priority</h3>
          <p className="text-sm text-gray-500">
            We clearly label non-toxic plants so animal lovers can create green spaces without worrying about their furry family members.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">
            💚
          </div>
          <h3 className="text-xl font-bold text-gray-900">Lifetime Support</h3>
          <p className="text-sm text-gray-500">
            Every plant comes with detailed care guides. Have questions later? Our plant experts are always just a message away.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-900 text-white rounded-3xl p-10 md:p-14 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Plant Journey?</h2>
        <p className="text-primary-100 max-w-xl mx-auto">
          Explore our collection of indoor plants, pots, and gardening tools designed for every plant parent stage.
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-4 bg-white text-primary-900 font-bold rounded-2xl hover:bg-primary-50 transition-colors shadow-lg"
        >
          Explore Collection
        </Link>
      </section>
    </div>
  );
}
