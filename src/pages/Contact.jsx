import Header from "../components/Header";
import NeuralBackground from "../components/NeuralBackground";
import { Mail, User, MessageSquare, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function Contact({ isLoggedIn, setIsLoggedIn }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Thank you! Your message has been sent successfully. We'll get back to you soon.");
        e.target.reset();
      } else {
        setSubmitMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // You can change these coordinates to your actual location
  const mapLocation = {
    lat: 16.5062,   // Example: Visakhapatnam / Vijayawada area
    lng: 80.6480,
    zoom: 14,
    title: "DeepReveal Office",
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      {/* Background */}
      <NeuralBackground className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <main className="pt-28 pb-16 px-6 md:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-animate">
                Get in Touch
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Have questions, feedback, or just want to say hello? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              {/* Left - Contact Info + Map */}
              <div className="space-y-10">
                {/* Info Cards */}
                <div className="grid gap-6">
                  {/* Location */}
                  <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-cyan-500/10 rounded-lg">
                        <MapPin className="w-6 h-6 text-[#00f5ff]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Our Location</h3>
                        <p className="text-zinc-400">
                          Vijayawada / Visakhapatnam Region<br />
                          Andhra Pradesh, India
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-cyan-500/10 rounded-lg">
                        <Mail className="w-6 h-6 text-[#00f5ff]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
                        <p className="text-zinc-400">
                          <a href="mailto:support@deepreveal.ai" className="hover:text-cyan-400 transition-colors">
                            support@deepreveal.ai
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone (optional) */}
                  <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-cyan-500/10 rounded-lg">
                        <Phone className="w-6 h-6 text-[#00f5ff]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                        <p className="text-zinc-400">
                          +91 98765 43210<br />
                          <span className="text-sm">(Mon–Fri, 10 AM – 6 PM IST)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-900/20">
                  <iframe
                    title="DeepReveal Location"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${mapLocation.zoom * 2000}!2d${mapLocation.lng}!3d${mapLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${mapLocation.lat.toFixed(6)}%2C${mapLocation.lng.toFixed(6)}!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin`}
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* Right - Contact Form */}
              <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 lg:p-10 shadow-2xl shadow-cyan-900/20">
                <h2 className="text-3xl font-bold mb-2 gradient-text-animate">
                  Send Us a Message
                </h2>
                <p className="text-zinc-400 mb-8">
                  We typically respond within 24–48 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block mb-2 text-sm text-zinc-300 font-medium">
                      Your Name
                    </label>
                    <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-[#00f5ff] transition-all">
                      <User className="w-5 h-5 text-[#00f5ff]" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 text-sm text-zinc-300 font-medium">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-[#00f5ff] transition-all">
                      <Mail className="w-5 h-5 text-[#00f5ff]" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="your@email.com"
                        className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block mb-2 text-sm text-zinc-300 font-medium">
                      Your Message
                    </label>
                    <div className="flex gap-3 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-[#00f5ff] transition-all">
                      <MessageSquare className="w-5 h-5 text-[#00f5ff] mt-1" />
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder="How can we help you today?"
                        className="bg-transparent outline-none w-full resize-none text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-[#00f5ff] to-[#ff2eff] text-black hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>

                {submitMessage && (
                  <div className={`mt-4 p-4 rounded-xl text-center ${
                    submitMessage.includes("successfully")
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                      : "bg-pink-500/10 border border-pink-500/20 text-pink-400"
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}