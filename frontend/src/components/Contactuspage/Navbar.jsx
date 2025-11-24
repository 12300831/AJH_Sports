import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold">
          AJH Sports
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/dashboard" className="hover:text-blue-600">Home</Link>
          <Link to="/events" className="hover:text-blue-600">Events</Link>
          <Link to="/clubs" className="hover:text-blue-600">Clubs</Link>
          <Link to="/coaches" className="hover:text-blue-600">Coaches</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
        </div>

        {/* Auth Buttons (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/signup"
            className="px-4 py-2 border border-black rounded-lg hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Log In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col p-4 gap-4 text-sm font-medium">
            <Link to="/dashboard" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/events" onClick={() => setOpen(false)}>Events</Link>
            <Link to="/clubs" onClick={() => setOpen(false)}>Clubs</Link>
            <Link to="/coaches" onClick={() => setOpen(false)}>Coaches</Link>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="block w-full py-2 border border-black rounded-lg text-center"
            >
              Sign Up
            </Link>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block w-full py-2 bg-black text-white rounded-lg text-center"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
