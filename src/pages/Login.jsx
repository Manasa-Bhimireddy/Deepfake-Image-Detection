import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  const fullText = "Welcome Back";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  /* Typing effect */
  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[index]);
        setIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const restart = setTimeout(() => {
        setDisplayText("");
        setIndex(0);
      }, 2000);
      return () => clearTimeout(restart);
    }
  }, [index]);

  /* Validation */
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email required";
    if (!password) newErrors.password = "Password required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setBackendError("");

    try {
      const res = await fetch("http://127.0.0.1:5002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("isAuthenticated", "true");

        const shouldDownload = sessionStorage.getItem("downloadAfterLogin") === "true";
        const savedReport = sessionStorage.getItem("savedReportData");

        if (shouldDownload && savedReport) {
          navigate("/output", {
            state: {
              ...JSON.parse(savedReport),
              triggerDownload: true,
            },
          });
        } else {
          navigate("/output");
        }
      } else {
        setBackendError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setBackendError("Unable to connect to server. Please try again later.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <NeuralBackground />

      <div className="max-w-md w-full z-10">
        {/* Back + Heading */}
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-gray-900/70 border border-cyan-500/40 text-cyan-300 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:border-cyan-400 transition-all duration-300"
          >
            ←
          </button>

          <h2
            className="text-4xl font-bold text-white"
            style={{
              fontFamily: 'monospace',
              minWidth: `${fullText.length + 2}ch`
            }}
          >
            {displayText}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-900 rounded-2xl border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-900 rounded-2xl border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />

          {backendError && (
            <p className="text-red-500 text-center font-medium">{backendError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00f5ff] to-[#ff2eff] text-black font-semibold py-3 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
          >
            Login
          </button>

          {/* Forgot Password Link - now navigates to new page */}
          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-cyan-400 hover:text-cyan-300 hover:underline text-sm font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-zinc-400">
          New user?
          <Link to="/signup" className="text-[#00f5ff] hover:underline ml-2">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}