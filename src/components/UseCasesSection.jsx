import React from "react";
import NeuralBackground from "../components/NeuralBackground"; // adjust path

const useCases = [
  {
    title: "MIS & DISINFORMATION",
    img: "/demo/mis-disinformation.jpg",
    desc: "Spreading AI-generated misinformation and deepfakes in media.",
  },
  {
    title: "INSURANCE CLAIMS",
    img: "/demo/fake-insurance-claim.jpg",
    desc: "Creating fake insurance claims using manipulated images.",
  },
  {
    title: "FAKE PROFILES",
    img: "/demo/fake-image.jpg",
    desc: "Detect fake profile images on social media platforms.",
  },
  {
    title: "MARKETPLACE SPAM",
    img: "/demo/marketplace-spam.jpg",
    desc: "Prevent fraud in online marketplaces using fake images.",
  },
  {
    title: "FAKE IDS",
    img: "/demo/fake-id.jpg",
    desc: "By-passing KYC/AML checks with fake or spoofed identity documents.",
  },
];

export default function UseCasesSection() {
  const slides = [...useCases, ...useCases]; // duplicate for continuous scroll

  return (
    <section className="relative py-16 text-white overflow-hidden">
      {/* Neural Background behind everything */}
      <div className="absolute inset-0 z-0 opacity-10">
        <NeuralBackground />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Detect manipulation, deepfakes, fraud, abuse, spam...
        </h2>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex gap-6 animate-scroll whitespace-nowrap"
            style={{ minWidth: `${slides.length * 300}px` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] relative rounded-xl overflow-hidden"
              >
                {/* Overlay to block neural background behind card */}
                <div className="absolute inset-0 bg-black/70 z-10 rounded-xl"></div>

                {/* Card content */}
                <div className="relative z-20 p-4 flex flex-col items-center">
                  <span className="inline-block px-2 py-1 mb-2 bg-cyan-500 text-black font-semibold rounded text-sm">
                    {slide.title}
                  </span>
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-[180px] object-cover rounded-lg mb-3"
                  />
                  <p className="text-gray-300 text-sm leading-relaxed text-center">
                    {slide.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scroll Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}