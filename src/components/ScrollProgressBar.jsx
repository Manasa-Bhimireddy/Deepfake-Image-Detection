import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const percent = (scrollTop / height) * 100;
      setScrollPercent(percent);
    };

    window.addEventListener("scroll", updateScroll);

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="fixed right-0 top-0 h-full w-1 bg-white/10 z-50">
      <div
        className="bg-cyan-400 w-full transition-all duration-150 shadow-lg shadow-cyan-400/40"
        style={{ height: `${scrollPercent}%` }}
      />
    </div>
  );
}