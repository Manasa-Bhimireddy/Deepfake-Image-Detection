import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HeroSection() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typingForward, setTypingForward] = useState(true);
  const [metrics, setMetrics] = useState({
    f1Score: 0,
    precision: 0,
    recall: 0,
    confusionMatrix: [[0, 0], [0, 0]],
  });

  const fullText = "AI Image Authenticity Detector";

  const imagePairs = [
    { real: "/demo/real3.jpeg", fake: "/demo/fake3.jpeg" },
    { real: "/demo/real4.jpeg", fake: "/demo/fake4.jpeg" },
    { real: "/demo/real2.jpeg", fake: "/demo/fake2.jpeg" },
  ];

  // Typing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTypedText((prev) => {
        if (typingForward) {
          if (prev.length < fullText.length) return fullText.slice(0, prev.length + 1);
          setTypingForward(false);
          return prev;
        } else {
          if (prev.length > 0) return prev.slice(0, -1);
          setTypingForward(true);
          return prev;
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [typingForward]);

  // Auto slide demo images
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagePairs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction failed");

      const backendData = await response.json();

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const stateData = {
          imageUrl: reader.result, // ✅ ALWAYS BASE64
          result: backendData.result,
          confidence: backendData.confidence,
        };

        // Save to localStorage
        localStorage.setItem("lastResult", JSON.stringify(stateData));

        navigate("/output", { state: stateData });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Backend not running or error occurred.");
    }
  };

  // ------------------ LIVE CAMERA ------------------
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Cannot access camera.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        try {
          const formData = new FormData();
          formData.append("file", blob, "capture.jpg");

          const response = await fetch("http://localhost:5001/predict", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Prediction failed");

          const backendData = await response.json();

          const reader = new FileReader();
          reader.onloadend = () => {
            const stateData = {
              imageUrl: reader.result,
              result: backendData.result,
              confidence: backendData.confidence,
            };
            localStorage.setItem("lastResult", JSON.stringify(stateData));
            navigate("/output", { state: stateData });
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error("Camera upload error:", error);
          alert("Backend not running or error occurred.");
        }
      }, "image/jpeg");

      stopCamera();
    }
  };

  // ------------------ RENDER ------------------
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-start px-6 pt-20 relative z-10">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-semibold text-white leading-snug max-w-xl">
            {typedText}
          </h1>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mt-2">
            Detect whether an image is real or AI-generated fake using advanced neural networks.
            <br />
            Upload any image and instantly receive a prediction of its authenticity.
          </p>

          {/* UPLOAD + CAMERA ICON SIDE BY SIDE */}
          <div className="flex items-center space-x-4 mt-4">
            {/* Upload Button */}
            <label className="flex items-center">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <div className="inline-block cursor-pointer px-6 py-3 bg-cyan-300 hover:bg-cyan-400 text-black text-base font-semibold rounded transition transform hover:scale-105">
                Upload Image
              </div>
            </label>

            {/* Camera Icon */}
            <div onClick={startCamera} className="cursor-pointer">
              <Camera className="w-9 h-9 md:w-10 md:h-10 text-white hover:text-gray-300 transition-transform hover:scale-110" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: demo slider */}
        <div className="flex flex-col items-center w-full">
          <p className="text-cyan-400 font-bold text-sm tracking-widest mb-2">REAL vs FAKE</p>
          <div className="w-[520px] h-[340px] relative bg-black/10 overflow-hidden rounded-xl border border-transparent">
            <div className="flex w-full h-full relative">
              <img
                src={imagePairs[index].real}
                className="w-1/2 h-full object-cover rounded-l"
                alt="Demo Real"
              />
              <img
                src={imagePairs[index].fake}
                className="w-1/2 h-full object-cover rounded-r"
                alt="Demo Fake"
              />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-400/30" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- LIVE CAMERA OVERLAY ---------------- */}
{showCamera && (
  <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center z-50">
    {/* Larger camera preview */}
    <video ref={videoRef} autoPlay className="w-[500px] h-[500px] md:w-[900px] md:h-[400px] object-cover rounded-lg shadow-lg" />
    
    <div className="mt-4 flex space-x-4">
      <button
        onClick={capturePhoto}
        className="px-6 py-3 bg-cyan-300 hover:bg-cyan-400 text-black rounded font-semibold text-lg"
      >
        Capture
      </button>
      <button
        onClick={stopCamera}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-lg"
      >
        Cancel
      </button>
    </div>
    <canvas ref={canvasRef} className="hidden" />
  </div>
)}
    </section>
  );
}