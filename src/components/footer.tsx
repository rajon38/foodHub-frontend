import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            FoodHub 🍔
          </h3>
          <p className="text-sm text-gray-400">
            Discover meals from the best restaurants around you.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/meals" className="hover:text-white">Meals</Link></li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link href="/providers" className="hover:text-white">Restaurants</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold text-white mb-3">Follow Us</h4>
          <p className="text-sm text-gray-400">
            Facebook • Instagram • Twitter
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} FoodHub. All rights reserved.
      </div>
    </footer>
  );
}
