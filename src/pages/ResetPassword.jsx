// src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or missing reset link. Please request a new one.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5002/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Password has been reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Failed to reset password. The link may be invalid or expired.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <NeuralBackground />

      <div className="max-w-md w-full z-10 px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-3">
            Reset Password
          </h1>
          <p className="text-gray-400 text-lg">
            Choose a strong new password for your account
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-5 py-4 rounded-2xl mb-8 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-900/40 border border-green-500/50 text-green-200 px-5 py-4 rounded-2xl mb-8 text-center">
            {message}
          </div>
        )}

        {(!token || !email) ? (
          <div className="text-center text-gray-400">
            <p className="mb-6">This reset link is invalid or has expired.</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              Request a new reset link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              required
              minLength={6}
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              required
              minLength={6}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-pink-500 hover:brightness-110 hover:shadow-xl hover:shadow-cyan-500/30"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                  </svg>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:text-cyan-300 hover:underline text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}