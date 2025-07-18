import React, { useState } from "react";
import WarningPopup from "../components/WarningPopup";
import { analyzeContentTrust } from "../utils/contentChecks";

function InstantTakedownTool() {
  const [mode, setMode] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [trustScore, setTrustScore] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [warning, setWarning] = useState("");
  const [platformInstructions, setPlatformInstructions] = useState(null);

  const getInstructions = (content = "") => {
    if (content.includes("instagram")) {
      return {
        platform: "Instagram",
        steps: [
          "Go to the post/profile in question.",
          "Tap the three-dot menu > Report.",
          "Choose appropriate reason (e.g., Intellectual Property, Abuse).",
          "Follow prompts or visit: https://help.instagram.com/",
        ],
      };
    } else if (content.includes("facebook")) {
      return {
        platform: "Facebook",
        steps: [
          "Visit the offending post/profile.",
          "Click the three dots > Report Post/Profile.",
          "Select a reason and follow steps.",
          "Visit https://www.facebook.com/help/ for more options.",
        ],
      };
    } else if (content.includes("twitter") || content.includes("x.com")) {
      return {
        platform: "Twitter (X)",
        steps: [
          "Click the '...' icon on the tweet or profile.",
          "Select 'Report Tweet/Account'.",
          "Choose appropriate reason and submit.",
          "Use https://help.twitter.com/forms for legal requests.",
        ],
      };
    } else if (content.includes("youtube")) {
      return {
        platform: "YouTube",
        steps: [
          "Click the three-dot menu > Report.",
          "Use 'Infringes my rights' or 'Sexual content'.",
          "For legal takedown: https://support.google.com/youtube/answer/2807622",
        ],
      };
    } else {
      return {
        platform: "General",
        steps: [
          "Take screenshots and gather URLs.",
          "Visit the platform’s Help/Report Center.",
          "Use grievance or abuse reporting forms.",
          "If urgent, contact local cyber cell or CERT-In.",
        ],
      };
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const score = analyzeContentTrust(text);
      setTrustScore(score);
      const instructions = getInstructions(text);
      setPlatformInstructions(instructions);
      if (score >= 75) {
        setShowPopup(true);
        setWarning("");
      } else {
        setShowPopup(false);
        setWarning("⚠️ This file appears suspicious.");
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleLinkAnalyze = () => {
    const score = analyzeContentTrust(link);
    setTrustScore(score);
    const instructions = getInstructions(link);
    setPlatformInstructions(instructions);
    if (score >= 75) {
      setShowPopup(true);
      setWarning("");
    } else {
      setShowPopup(false);
      setWarning("⚠️ This link appears suspicious.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        fontFamily: "Inter, sans-serif",
        color: "#43016E",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "bold", marginBottom: "2rem" }}>
        Instant Takedown Tool
      </h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => {
            setMode("file");
            setTrustScore(null);
            setFile(null);
            setLink("");
            setWarning("");
            setPlatformInstructions(null);
          }}
          style={buttonStyle}
        >
          📂 Upload File
        </button>
        <button
          onClick={() => {
            setMode("link");
            setTrustScore(null);
            setFile(null);
            setLink("");
            setWarning("");
            setPlatformInstructions(null);
          }}
          style={buttonStyle}
        >
          🔗 Paste Link
        </button>
      </div>

      {mode === "file" && (
        <>
          <input type="file" onChange={handleFileUpload} />
          {warning && <p style={warningStyle}>{warning}</p>}
        </>
      )}

      {mode === "link" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "400px" }}>
          <input
            type="url"
            placeholder="Enter URL"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleLinkAnalyze} style={buttonStyle}>Analyze</button>
          {warning && <p style={warningStyle}>{warning}</p>}
        </div>
      )}

      {showPopup && (
        <WarningPopup
          message="✅ This appears to be safe. Are you sure you want to proceed?"
          onCancel={() => setShowPopup(false)}
          onProceed={() => {
            setShowPopup(false);
            alert("✔️ Proceeding with platform takedown steps below.");
          }}
        />
      )}

      {platformInstructions && !showPopup && trustScore >= 75 && (
        <div style={instructionBoxStyle}>
          <h3>{platformInstructions.platform} – Takedown Steps</h3>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {platformInstructions.steps.map((step, idx) => (
              <li key={idx} style={{ marginBottom: "0.5rem" }}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Styles
const buttonStyle = {
  padding: "10px 16px",
  background: "#EEE5F6",
  color: "#43016E",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const warningStyle = {
  color: "#b30000",
  marginTop: "10px",
  fontWeight: "500",
};

const instructionBoxStyle = {
  marginTop: "2rem",
  padding: "1rem",
  background: "#f4eaff",
  borderRadius: "10px",
  maxWidth: "700px",
  width: "100%",
  color: "#43016E",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

export default InstantTakedownTool;
