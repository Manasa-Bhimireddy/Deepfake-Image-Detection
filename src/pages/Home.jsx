import NeuralBackground from '../components/NeuralBackground';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import UseCasesSection from '../components/UseCasesSection';
import FeaturesSection from '../components/FeaturesSection';
import SkillsSection from '../components/SkillsSection';
import FAQsSection from '../components/FAQsSection';
import ReviewsSection from '../components/ReviewsSection';
import ScrollProgressBar from "../components/ScrollProgressBar";
export default function Home() {

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white">

      <NeuralBackground />

      <ScrollProgressBar />

      <main className="flex-1 flex flex-col items-center justify-start px-6 pt-20 md:pt-28 space-y-24">

        <HeroSection />

        <HowItWorksSection />

        <UseCasesSection />

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="skills">
          <SkillsSection />
        </section>

        <FAQsSection />

        <ReviewsSection />

      </main>

    </div>
  );
}