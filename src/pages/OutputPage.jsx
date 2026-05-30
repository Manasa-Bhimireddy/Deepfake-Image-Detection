import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";

import Header from "../components/Header";
import Footer from "../components/Footer";
import NeuralBackground from "../components/NeuralBackground";

export default function OutputPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const AQUA = "#22d3ee";
  const LIGHT_AQUA = "#67e8f9";
  const DARK_AQUA = "#0891b2";
  const WHITE = "#ffffff";
  const SOFT_GRAY = "#e2e8f0";

  const fullHeading = "Deepfake Detection Report";

  const [showModal, setShowModal] = useState(false);
  const [typedHeading, setTypedHeading] = useState("");
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [hasImage, setHasImage] = useState(false);

  const [data, setData] = useState(() => {
    if (location.state && !location.state.triggerDownload) {
      return location.state;
    }

    const saved = sessionStorage.getItem("savedReportData");
    if (saved) return JSON.parse(saved);

    const last = localStorage.getItem("lastResult");
    if (last) return JSON.parse(last);

    return null;
  });

  useEffect(() => {
    const hasValidData = !!data && !!data.imageUrl && !!data.result && typeof data.confidence === "number";
    setHasImage(hasValidData);
  }, [data]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setTypedHeading(fullHeading.slice(0, index));
      if (index === fullHeading.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem("lastResult", JSON.stringify(data));
    } else {
      navigate("/");
    }
  }, [data, navigate]);

  useEffect(() => {
    if (!location.state?.triggerDownload && sessionStorage.getItem("downloadAfterLogin") === "true") {
      sessionStorage.removeItem("downloadAfterLogin");
      sessionStorage.removeItem("savedReportData");
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.triggerDownload && data && !hasDownloaded && hasImage) {
      const timer = setTimeout(() => {
        downloadReport();
        setHasDownloaded(true);
        sessionStorage.removeItem("downloadAfterLogin");
        sessionStorage.removeItem("savedReportData");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [location.state, data, hasDownloaded, hasImage]);

  if (!data) return null;

  const { imageUrl, result, confidence } = data;
  const safeImageUrl = imageUrl || "https://via.placeholder.com/400x300?text=Image+Not+Available";

  const metricsData = [
    { metric: "Precision", real: 0.99, fake: 0.95 },
    { metric: "Recall",    real: 0.94, fake: 0.99 },
    { metric: "F1-Score",  real: 0.97, fake: 0.97 },
  ];

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sessionStorage.removeItem("downloadAfterLogin");
    e.target.value = "";

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5001/predict_with_cam", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Prediction failed");
        return res.json();
      })
      .then((newData) => {
        const objectUrl = URL.createObjectURL(file);
        const state = { imageUrl: objectUrl, ...newData };
        setUploadedFile(file);
        localStorage.setItem("lastResult", JSON.stringify(state));
        setData(state);
        navigate("/output", { state });
        setHasImage(true);
      })
      .catch((err) => {
        console.error("Upload error:", err);
        alert("Analysis failed. Please try again.");
      });
  };

  const getImageFormat = () => {
    if (!uploadedFile) return "Unknown";
    const ext = uploadedFile.name.split(".").pop()?.toUpperCase() || "Unknown";
    return ext;
  };

  const getDetailedDescription = () => {
    const conf = confidence.toFixed(1);
    const isReal = result === "Real";

    if (isReal) {
      return `This image has been classified as authentic with high confidence. No significant manipulation indicators were detected.`;
    } else {
      return `This image has been classified as manipulated / synthetic with high confidence. Multiple indicators of deepfake or tampering were found.`;
    }
  };

  // ==================== FIXED PDF WITH PROPER SPACING ====================
  const downloadReport = async () => {
  if (!data) {
    alert("No data available.");
    return;
  }

  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 20;
    let y = 20;

    const checkPageBreak = (extra = 10) => {
      if (y + extra > pageHeight - 25) {
        doc.addPage();
        y = 20;
      }
    };

    // ================= HEADER =================
    doc.setFillColor(34, 211, 238);
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255);
    doc.text("Deepfake Detection Report", pageWidth / 2, 22, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setTextColor(240);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      30,
      { align: "center" }
    );

    y = 50;

    // ================= IMAGE =================
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Analyzed Image", margin, y);
    y += 8;

    checkPageBreak(70);

    let imageToUse = imageUrl;
    if (uploadedFile) imageToUse = URL.createObjectURL(uploadedFile);

    if (imageToUse) {
      const img = new Image();
      img.src = imageToUse;

      await new Promise((resolve) => {
        img.onload = () => {
          let imgW = 120;
          let imgH = (img.height / img.width) * imgW;

          if (imgH > 75) {
            imgH = 75;
            imgW = (img.width / img.height) * imgH;
          }

          const x = (pageWidth - imgW) / 2;

          doc.addImage(img, "JPEG", x, y, imgW, imgH);
          y += imgH + 10;

          resolve();
        };
        img.onerror = () => resolve();
      });
    }

    // ================= RESULT =================
    checkPageBreak(20);

    doc.setFontSize(16);
    doc.setTextColor(
      result === "Real" ? 0 : 200,
      result === "Real" ? 150 : 0,
      0
    );
    doc.text(`Result: ${result}`, margin, y);
    y += 7;

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence.toFixed(1)}%`, margin, y);
    y += 10;

    // ================= DESCRIPTION =================
    checkPageBreak(25);

    doc.setFontSize(11);
    const desc = getDetailedDescription();
    const splitDesc = doc.splitTextToSize(desc, pageWidth - 2 * margin);

    doc.text(splitDesc, margin, y);
    y += splitDesc.length * 5 + 8;

    doc.text(`Image Format: ${getImageFormat()}`, margin, y);
    y += 14;

    // ================= METRICS =================
    checkPageBreak(25);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Evaluation Metrics", margin, y);
    y += 10;

    const drawMetric = (label, real, fake) => {
      checkPageBreak(16);

      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(label, margin, y);

      doc.setFillColor(34, 211, 238);
      doc.rect(margin + 40, y - 4, real * 65, 4, "F");

      doc.setFillColor(103, 232, 249);
      doc.rect(margin + 40, y + 2, fake * 65, 4, "F");

      doc.text(real.toFixed(2), margin + 110, y);
      doc.text(fake.toFixed(2), margin + 130, y);

      y += 12;
    };

    drawMetric("Precision", 0.99, 0.95);
    drawMetric("Recall", 0.94, 0.99);
    drawMetric("F1-Score", 0.97, 0.97);

    // ================= SPACE BEFORE CONFUSION MATRIX =================
    y += 8;
    checkPageBreak(30);

    // ================= CONFUSION MATRIX (CLEAN ALIGNMENT) =================
doc.setFontSize(14);
doc.setTextColor(0);
doc.text("Confusion Matrix", margin, y);
y += 8;

// column headers (aligned properly)
doc.setFontSize(10);
doc.text("", margin, y);
doc.text("Pred Fake", margin + 45, y);
doc.text("Pred Real", margin + 85, y);
y += 8;

// row 1
doc.text("Actual Fake", margin, y);
doc.text("190", margin + 50, y);
doc.text("1", margin + 92, y);
y += 8;

// row 2
doc.text("Actual Real", margin, y);
doc.text("6", margin + 50, y);
doc.text("185", margin + 92, y);
y += 12;


// ================= FOOTER (HOME STYLE - MOVED UP 1 LINE) =================
const footerY = 280; // 🔥 moved slightly up from 285

doc.setDrawColor(200);
doc.line(20, footerY - 8, pageWidth - 20, footerY - 8);

doc.setFontSize(11);
doc.setTextColor(34, 211, 238);
doc.text("DeepReveal AI System", pageWidth / 2, footerY, {
  align: "center",
});

doc.setFontSize(9);
doc.setTextColor(120);
doc.text(
  `© ${new Date().getFullYear()} Deepfake Detection System`,
  pageWidth / 2,
  footerY + 6,
  { align: "center" }
);

doc.text(
  "AI-powered deepfake detection for research & educational use",
  pageWidth / 2,
  footerY + 12,
  { align: "center" }
);

doc.save(`Deepfake_Report_${result}.pdf`);
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Failed to generate report.");
  }
};
  const handleDownloadClick = () => {
    if (!hasImage) return;

    const isLoggedIn = sessionStorage.getItem("isAuthenticated") === "true";

    if (!isLoggedIn) {
      sessionStorage.setItem("savedReportData", JSON.stringify(data));
      sessionStorage.setItem("downloadAfterLogin", "true");
      setShowModal(true);
      return;
    }

    downloadReport();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <NeuralBackground className="absolute inset-0 z-0 pointer-events-none" />

      <div className={`relative z-10 max-w-6xl mx-auto px-4 pt-28 pb-20 transition-all duration-500 ${showModal ? "blur-sm pointer-events-none" : ""}`}>
        <Header />

        <div className="flex items-center gap-6 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-gray-900/70 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-400/60 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-300"
          >
            ←
          </button>

          <h1
            className="text-4xl md:text-5xl font-bold text-cyan-300 tracking-tight"
            style={{ fontFamily: "monospace", minWidth: `${fullHeading.length}ch` }}
          >
            {typedHeading}
          </h1>
        </div>

        <div className="bg-gray-900/30 rounded-2xl p-8 shadow-2xl" ref={chartRef}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <img
                src={safeImageUrl}
                alt="Analyzed Image"
                className="rounded-xl object-contain max-h-[400px] w-full shadow-md"
                onError={(e) => (e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available")}
              />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-3">Image Information</h2>
                <p className="text-gray-300"><strong>Format:</strong> {getImageFormat()}</p>
                <p className="text-gray-300 mt-2"><strong>Description:</strong> {getDetailedDescription().split("\n")[0]}</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-3">Result</h2>
                <div className={`text-4xl md:text-5xl font-black ${result === "Real" ? "text-cyan-400" : "text-white"}`}>
                  {result}
                </div>
                <p className="text-xl mt-3 text-cyan-200">
                  Confidence: <strong>{confidence.toFixed(1)}%</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-cyan-300 text-center mb-8">Detection Analysis</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-300 text-center mb-4">Precision, Recall & F1-Score</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={metricsData}>
                    <XAxis dataKey="metric" stroke={SOFT_GRAY} />
                    <YAxis domain={[0, 1]} stroke={SOFT_GRAY} />
                    <Tooltip />
                    <Bar dataKey="real" fill={AQUA} name="Real" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fake" fill={LIGHT_AQUA} name="Fake" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-300 text-center mb-4">Model Accuracy</h3>
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <div className="text-6xl font-bold text-cyan-400 mb-4">97%</div>
                  <p className="text-xl text-white mb-2">Overall Accuracy</p>
                  <p className="text-sm text-gray-400">Tested on 382 balanced samples</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-300 text-center mb-4">Confusion Matrix</h3>
                <div className="flex flex-col items-center justify-center h-[320px]">
                  <div className="grid grid-cols-3 gap-1 text-center text-sm">
                    <div></div>
                    <div className="font-semibold text-gray-400">Predicted Fake</div>
                    <div className="font-semibold text-gray-400">Predicted Real</div>

                    <div className="font-semibold text-gray-400 text-right pr-2">Actual Fake</div>
                    <div className="bg-[#22d3ee]/80 text-white font-bold py-8 rounded-lg flex items-center justify-center text-2xl border border-[#22d3ee]">190</div>
                    <div className="bg-white/10 text-white font-bold py-8 rounded-lg flex items-center justify-center text-2xl border border-white/30">1</div>

                    <div className="font-semibold text-gray-400 text-right pr-2">Actual Real</div>
                    <div className="bg-white/10 text-white font-bold py-8 rounded-lg flex items-center justify-center text-2xl border border-white/30">6</div>
                    <div className="bg-[#22d3ee]/80 text-white font-bold py-8 rounded-lg flex items-center justify-center text-2xl border border-[#22d3ee]">185</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <span className="px-8 py-4 bg-cyan-300 hover:bg-cyan-500 text-black font-bold rounded-xl shadow-lg hover:shadow-2xl transition duration-300 inline-flex items-center justify-center w-full sm:w-auto">
              Upload Another Image
            </span>
          </label>

          <button
            onClick={handleDownloadClick}
            disabled={!hasImage}
            className={`px-8 py-4 font-bold rounded-xl shadow-lg transition duration-300 w-full sm:w-auto ${
              hasImage ? "bg-gray-700 hover:bg-gray-600 text-white hover:shadow-2xl" : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            Download Report
          </button>
        </div>

        <Footer />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
          <NeuralBackground className="absolute inset-0 z-0 pointer-events-none" />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow flex items-center justify-center px-4 py-8">
              <div className="bg-gray-900/90 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-cyan-500/30 relative">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold">×</button>
                <h2 className="text-2xl font-bold text-center text-cyan-300 mb-5">Download Report</h2>
                <p className="text-center text-gray-300 mb-8 text-base">To download your detailed deepfake detection report, please login or create an account.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => navigate("/signup")} className="px-8 py-3 bg-cyan-300 hover:bg-cyan-400 text-black font-bold rounded-xl">Create Account</button>
                  <button onClick={() => navigate("/login")} className="px-8 py-3 bg-gray-500 hover:bg-gray-400 text-white font-bold rounded-xl">Login</button>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}