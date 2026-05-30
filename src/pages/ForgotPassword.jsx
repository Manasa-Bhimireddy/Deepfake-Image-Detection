import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5002/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message || "Reset link sent! Check your email (including spam folder).");
        setEmail("");
        // Optional: auto-redirect to login after 5 seconds
        setTimeout(() => navigate("/login"), 5000);
      } else {
        setError(data.message || "Failed to send reset link. Try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <NeuralBackground />

      <div className="max-w-md w-full z-10 p-8">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          Forgot Password
        </h2>

        <p className="text-gray-300 text-center mb-8">
          Enter your email address and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-900 rounded-2xl border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            required
          />

          {message && (
            <p className="text-pink text-center font-medium">{message}</p>
          )}

          {error && (
            <p className="text-whitetext-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl font-semibold transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#00f5ff] to-[#ff2eff] hover:brightness-110"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:text-cyan-300 hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}