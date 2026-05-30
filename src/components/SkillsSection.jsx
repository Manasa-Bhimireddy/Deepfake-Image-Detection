import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "Python", percent: 90 },
  { name: "React.js", percent: 80 },
  { name: "Tailwind CSS", percent: 85 }
];

// Theme colors for gradient
const themeColors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#0ea5e9"];

export default function SkillsSection({ id = "skills" }) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  // Trigger animation once when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) setInView(true);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [inView]);

  return (
    <section id={id} ref={containerRef} className="relative py-20 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">
          Technologies Used
        </h2>

        <div className="flex flex-wrap justify-center gap-16">
          {skills.map((skill, index) => {
            const radius = 60;
            const strokeWidth = 12;
            const circumference = 2 * Math.PI * radius;
            const offset = inView
              ? circumference - (circumference * skill.percent) / 100
              : circumference;

            const gradientId = `grad-${index}`; // unique gradient per skill

            return (
              <div key={skill.name} className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full rotate-[-90deg]">
                    {/* Define gradient */}
                    <defs>
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        {themeColors.map((color, i) => (
                          <stop
                            key={i}
                            offset={`${(i / (themeColors.length - 1)) * 100}%`}
                            stopColor={color}
                          />
                        ))}
                      </linearGradient>
                    </defs>

                    {/* Background Circle */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r={radius}
                      stroke="#333"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />

                    {/* Animated Stroke */}
                    {inView && (
                      <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={`url(#${gradientId})`}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{
                          transformOrigin: "50% 50%",
                          animation: "rotateGradient 6s linear infinite",
                        }}
                      />
                    )}
                  </svg>

                  {/* Center Percentage */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-semibold">{skill.percent}%</span>
                  </div>
                </div>
                <p className="mt-4 text-xl font-medium">{skill.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradient rotation animation */}
      <style>{`
        @keyframes rotateGradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}