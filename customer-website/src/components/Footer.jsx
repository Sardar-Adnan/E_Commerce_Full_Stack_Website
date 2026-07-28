import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-lg font-bold text-white">Leaf & Bloom</span>
            </div>
            <p className="text-sm text-gray-400">Your one-stop shop for premium indoor plants, planters, and gardening supplies.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link to="/products" className="text-sm hover:text-primary-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?is_pet_safe=true" className="text-sm hover:text-primary-400 transition-colors">Pet-Safe Plants</Link></li>
              <li><Link to="/products?is_featured=true" className="text-sm hover:text-primary-400 transition-colors">Featured</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm">📧 hello@leafandbloom.pk</span></li>
              <li><span className="text-sm">📞 03001234567</span></li>
              <li><span className="text-sm">📍 Attock, Pakistan</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Leaf & Bloom. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
