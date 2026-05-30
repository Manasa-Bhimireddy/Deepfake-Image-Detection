import { FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-4 text-center text-zinc-500 text-sm">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <span>
          © 2026 DeepReveal • Built to fight deepfakes with{" "}
          <span className="text-cyan-400">❤️</span> & AI
        </span>

        <div className="flex gap-5 mt-2 md:mt-0 text-lg">
          <a
            href="https://github.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 hover:scale-110 transition-all"
          >
            <FaGithub />
          </a>

          <a
            href="https://twitter.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 hover:scale-110 transition-all"
          >
            <FaTwitter />
          </a>

          <a
            href="https://facebook.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 hover:scale-110 transition-all"
          >
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}