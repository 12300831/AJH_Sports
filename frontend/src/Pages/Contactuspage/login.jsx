import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Login system
  const handleLogin = async () => {
  setError("");

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // Save token and user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");

  } catch (err) {
    setError("Server not responding");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Sign in
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <label className="text-sm font-medium">E-mail</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mt-1 mb-4 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 mt-1 mb-4 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold"
        >
          Sign in
        </button>

        <p className="text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Create now
          </Link>
        </p>
      </div>
    </div>
  );
}