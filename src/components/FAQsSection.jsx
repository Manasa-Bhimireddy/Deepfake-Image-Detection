import { useState } from "react";
import NeuralBackground from "../components/NeuralBackground";

const faqs = [
  {
    question: "Which file formats are supported?",
    answer:
      "You can upload images (JPEG, PNG). Most common formats are supported.",
  },
  {
    question: "How fast is the AI detection?",
    answer:
      "Files are analyzed instantly — usually within 5 seconds — using advanced deep learning and neural networks.",
  },
  {
    question: "Is my file secure?",
    answer:
      "Absolutely. All uploaded files are processed securely and are not shared with third parties.",
  },
  {
    question: "Can I download the results?",
    answer:
      "Yes! You can download a full report or copy a link to share the results with others.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No sign-up is required. Upload and check files immediately without creating an account.",
  },
];

export default function FAQsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 text-white overflow-hidden">
      {/* Neural background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <NeuralBackground />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col items-center space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="w-full max-w-[1500px] bg-black/30 backdrop-blur-md rounded-xl px-8 py-4 shadow-lg cursor-pointer transition-shadow hover:shadow-cyan-500/50"
              onClick={() => toggle(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg md:text-xl text-left">
                  {faq.question}
                </h3>
                <span className="text-cyan-400 font-bold text-2xl">
                  {openIndex === index ? "-" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-3 text-gray-300 text-sm md:text-base leading-relaxed text-left">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}