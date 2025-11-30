import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Signup system
  const handleSignup = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // After successful signup → go to login
      navigate("/login");
    } catch (err) {
      setError("Server not responding");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Let’s get you started
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        {/* Full Name */}
        <label className="text-sm font-medium">Full name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          className="w-full p-3 mt-1 mb-4 border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-black"
          value={form.name}
          onChange={handleChange("name")}
        />

        {/* Email */}
        <label className="text-sm font-medium">Email address</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mt-1 mb-4 border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-black"
          value={form.email}
          onChange={handleChange("email")}
        />

        {/* Phone */}
        <label className="text-sm font-medium">Phone number</label>
        <input
          type="text"
          placeholder="Enter your phone number"
          className="w-full p-3 mt-1 mb-4 border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-black"
          value={form.phone}
          onChange={handleChange("phone")}
        />

        {/* Location */}
        <label className="text-sm font-medium">Location (Optional)</label>
        <input
          type="text"
          placeholder="Enter your location"
          className="w-full p-3 mt-1 mb-4 border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-black"
          value={form.location}
          onChange={handleChange("location")}
        />

        {/* Password */}
        <label className="text-sm font-medium">Create password</label>
        <input
          type="password"
          placeholder="Enter a password"
          className="w-full p-3 mt-1 mb-2 border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-black"
          value={form.password}
          onChange={handleChange("password")}
        />

        {/* Password Rules */}
        <p className="text-xs text-gray-600 mb-4">
          Password must contain a minimum of 8 characters and at least one symbol (e.g., @, !)
        </p>

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-black text-white py-3 rounded-lg 
                     text-lg font-semibold hover:bg-gray-900 transition">
          Sign Up
        </button>

        {/* Link to login */}
        <p className="text-center mt-6 text-sm">
          Already a user?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
