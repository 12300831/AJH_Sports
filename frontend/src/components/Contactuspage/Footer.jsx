export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      
      {/* Newsletter Section */}
      <div className="bg-black py-10 px-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Join Our Newsletter</h2>
        <p className="text-gray-300 mb-6">
          Subscribe to be the first to know about new sessions, competitions and events.
        </p>

        <div className="max-w-lg mx-auto flex items-center">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 p-3 rounded-l-lg bg-gray-800 text-white border border-gray-700 outline-none"
          />
          <button className="bg-white text-black px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-200 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-gray-300">

        {/* Column 1 */}
        <div>
          <h3 className="font-bold mb-4">Why Choose Us?</h3>
          <ul className="space-y-2">
            <li>Featured</li>
            <li>Partnership</li>
            <li>Our Team</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-bold mb-4">About</h3>
          <ul className="space-y-2">
            <li>Events</li>
            <li>Blog</li>
            <li>Podcast</li>
            <li>Invite a friend</li>
            <li>Community</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li>ajhsports.com.au</li>
            <li>+61 0412345678</li>
            <li>123 Ave, Sydney, NSW</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Contact Support</li>
            <li>FAQs</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6 px-6 text-center text-gray-400 text-sm">
        ©2025 Company Name. All rights reserved.
        <div className="mt-2">
          Privacy & Policy • Terms & Condition
        </div>
      </div>

    </footer>
  );
}
