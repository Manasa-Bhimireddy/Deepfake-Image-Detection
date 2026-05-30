import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });

  const [backendError, setBackendError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Typing effect
  const fullText = "Create Account";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

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

  // Validation (client-side)
  const validateName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Name is required';
    if (trimmed.length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(trimmed)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value.trim())) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (touched[field]) {
      let error = '';
      if (field === 'name') error = validateName(value);
      if (field === 'email') error = validateEmail(value);
      if (field === 'password') error = validatePassword(value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let error = '';
    if (field === 'name') error = validateName(name);
    if (field === 'email') error = validateEmail(email);
    if (field === 'password') error = validatePassword(password);

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormValid = () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError
    });

    return !nameError && !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');

    if (!isFormValid()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:5002/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Success → redirect to login (do NOT auto-login)
        navigate("/login", { replace: true });
      } else {
        // Show specific backend message
        let errorMsg = data.error || 'Signup failed. Please try again.';

        // Make messages more user-friendly
        if (errorMsg.includes('Email already exists') || errorMsg.includes('UNIQUE constraint failed')) {
          errorMsg = 'This email is already registered. Please use a different email or login.';
        } else if (errorMsg === 'All fields required') {
          errorMsg = 'All fields are required.';
        }

        setBackendError(errorMsg);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setBackendError('Unable to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <NeuralBackground />

      <div className="w-full max-w-md mt-24 relative z-10">
        <div className="flex items-center gap-8 mb-10 pl-4">
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

        <p className="text-zinc-400 mb-10 text-center">
          Join the fight against deepfakes
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5ff]"
          />
          {touched.name && errors.name && (
            <p className="text-white-400 text-sm mt-1 pl-2">{errors.name}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5ff]"
          />
          {touched.email && errors.email && (
            <p className="text-white-400 text-sm mt-1 pl-2">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5ff]"
          />
          {touched.password && errors.password && (
            <p className="text-white-400 text-sm mt-1 pl-2">{errors.password}</p>
          )}

          {backendError && (
            <p className="text-white text-center font-medium bg-red-600/30 py-2 px-4 rounded-xl border border-red-500/40 mt-2">
              {backendError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#00f5ff] to-[#ff2eff] text-black font-semibold py-3 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-400">
          Already have an account?
          <Link to="/login" className="text-[#00f5ff] hover:underline ml-2">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}