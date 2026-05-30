import { Eye } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = sessionStorage.getItem("isAuthenticated") === "true";

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("savedReportData");
    sessionStorage.removeItem("downloadAfterLogin");
    navigate('/');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#00f5ff]/30 backdrop-blur-xl bg-black/60 shadow-[0_4px_16px_rgba(0,245,255,0.15)]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <Eye className="w-9 h-9 md:w-10 md:h-10 text-[#00f5ff]" />
          <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00f5ff] to-[#ff2eff] bg-clip-text text-transparent">
            DeepReveal
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 md:gap-12 text-base font-medium">

          <button
            onClick={scrollToTop}
            className="hover:text-[#00f5ff] transition-colors"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-[#00f5ff] transition-colors"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("skills")}
            className="hover:text-[#00f5ff] transition-colors"
          >
            Technology
          </button>

          {/* Fixed: Use Link directly instead of button + nested Link */}
          <Link
            to="/contact"
            className="hover:text-[#00f5ff] transition-colors"
          >
            Contact
          </Link>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="ml-6 px-5 py-2 bg-red-600/70 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}