import React, { useState } from "react";
import WarningPopup from "../components/WarningPopup";
import { analyzeContentTrustScore } from "../utils/contentChecks";

function TakedownForm() {
  const [mode, setMode] = useState("file"); // "file" or "link"
  const [input, setInput] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [trustScore, setTrustScore] = useState(null);

  const handleAnalyze = async () => {
    if (!input) return;

    const score = await analyzeContentTrustScore(input);
    setTrustScore(score);

    // Show popup only if trust score is high (safe content)
    if (score >= 80) {
      setShowPopup(true);
    } else {
      alert("⚠️ This file/link appears suspicious or unverified.");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setMode("file")}>📂 Upload File</button>
        <button onClick={() => setMode("link")}>🔗 Paste Link</button>
      </div>

      {mode === "file" && (
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setInput(e.target.files[0])}
        />
      )}

      {mode === "link" && (
        <input
          type="text"
          placeholder="Enter a link"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      <button onClick={handleAnalyze} style={{ marginTop: "1rem" }}>
        Analyze Content
      </button>

      {showPopup && (
        <WarningPopup
          title="Content Appears Safe"
          message="✅ This file/link appears safe. Are you sure you want to proceed with takedown request?"
          onCancel={() => setShowPopup(false)}
          onProceed={() => {
            setShowPopup(false);
            alert("✔️ Proceeding with takedown...");
          }}
        />
      )}
    </div>
  );
}

export default TakedownForm;
