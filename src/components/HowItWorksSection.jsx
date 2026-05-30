import React from "react";
import NeuralBackground from "../components/NeuralBackground";
import { UploadCloud, Cpu, Eye, Download } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Step 1: Upload Your File",
    desc: "Click the \"Upload\" button and choose the file you want to check. You can upload images, videos, or audio. We support most formats—JPEG, MP4, MP3, PNG, and more. No sign-up, no fuss. Just pick a file from your device."
  },
  {
    icon: Cpu,
    title: "Step 2: Let AI Do the Work",
    desc: "Once your file is uploaded, our AI-powered system starts analyzing it. We use deep learning and neural networks to scan for signs of deepfake manipulation. It usually takes just 5 seconds. I actually timed it—faster than brewing tea."
  },
  {
    icon: Eye,
    title: "Step 3: View the Results",
    desc: "Boom—results appear! You'll see a clear score showing how \"real\" or \"fake\" your file is. There's also a simple summary and a detailed report for deep dives. You even get some cultural insights if the image matches historical data. Kinda cool, right?"
  },
  {
    icon: Download,
    title: "Step 4: Download or Share",
    desc: "Want to save or share your results? Easy. Click \"Download\" for a full report or \"Copy Link\" to share your deepfake check with friends or your team. And yes—totally free, always. No paywall surprises."
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-16 text-white overflow-hidden">
      
      {/* Neural background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <NeuralBackground />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-14">
        How to Use Deepfake Detection
        </h2>

        {/* Vertical Flowchart */}
        <div className="relative">
          {/* Vertical line slightly left */}
          <div className="absolute left-[18%] h-full w-1 bg-cyan-400/40"></div>

          <div className="flex flex-col space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative flex items-start">

                  {/* Step card: always right of the line */}
                  <div className="w-full md:w-4/5 pl-[23%]">
                    <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 shadow-lg hover:shadow-cyan-500/60 transition duration-300 flex items-start space-x-4">
                      <Icon className="w-10 h-10 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg md:text-xl">{step.title}</h3>
                        <p className="text-gray-300 text-sm md:text-base mt-2">{step.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Circle on line */}
                  <div className="absolute left-[18%] transform -translate-x-1/2 bg-cyan-400 w-12 h-12 rounded-full border-2 border-black z-10 flex items-center justify-center">
                    <span className="text-black font-semibold text-base">{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}