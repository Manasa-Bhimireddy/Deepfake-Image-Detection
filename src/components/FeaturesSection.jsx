import { Eye, UploadCloud, Cpu, Save } from "lucide-react";
import NeuralBackground from "../components/NeuralBackground";

export default function FeaturesSection({ id = "features" }) {
  return (
    <section id={id} className="relative py-16 text-white overflow-hidden">

      {/* Neural Background behind Features */}
      <div className="absolute inset-0 z-0 opacity-10">
        <NeuralBackground />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 z-10 text-center">

        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">
          Key Features
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Feature Card 1 */}
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300">
            <UploadCloud className="w-14 h-14 text-cyan-400 mb-4 drop-shadow-lg" />
            <h3 className="font-semibold text-lg mb-2">Upload Any File</h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Easily upload images, videos, or audio in common formats like JPEG, PNG, MP4, and MP3. No signup needed.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300">
            <Cpu className="w-14 h-14 text-cyan-400 mb-4 drop-shadow-lg" />
            <h3 className="font-semibold text-lg mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Deep learning algorithms scan files for manipulation and AI-generated patterns within seconds.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300">
            <Eye className="w-14 h-14 text-cyan-400 mb-4 drop-shadow-lg" />
            <h3 className="font-semibold text-lg mb-2">Instant Insights</h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Get immediate feedback showing whether a file is real or AI-generated, plus a confidence score.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300">
            <Save className="w-14 h-14 text-cyan-400 mb-4 drop-shadow-lg" />
            <h3 className="font-semibold text-lg mb-2">Secure Save & Share</h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Save your results locally or share them securely with friends, colleagues, or on social platforms.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}