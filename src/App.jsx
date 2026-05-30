import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import NeuralBackground from './components/NeuralBackground';

import SignUp from './pages/Signup';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Contact from './pages/Contact';               // Make sure this import is correct
import OutputPage from "./pages/OutputPage";
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('isLoggedIn')
  );

  useEffect(() => {
    const logged = !!localStorage.getItem('isLoggedIn');
    setIsLoggedIn(logged);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Background */}
      <div className="animated-gradient fixed inset-0 z-[-2]" />
      <NeuralBackground />

      {/* Header */}
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* Routes */}
      <Routes>
          <Route
            path="/"
            element={
              <Home
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />

          <Route
            path="/signup"
            element={<SignUp setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/output"
            element={<OutputPage />}
          />

          {/* Contact page */}
          <Route
            path="/contact"
            element={<Contact isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Optional placeholders */}
          <Route
            path="/features"
            element={<div className="pt-32 text-center text-3xl">Features (coming soon)</div>}
          />

          <Route
            path="/technology"
            element={<div className="pt-32 text-center text-3xl">Technology (coming soon)</div>}
          />

          {/* Catch-all - redirect to home */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>

        <Footer />
      </div>
  );
}