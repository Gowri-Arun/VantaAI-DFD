import React from "react";
import legalTips from "../data/legalTips";

function LegalTips() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        color: "#43016E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: "850px", width: "100%" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(24px, 6vw, 36px)",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            {legalTips.title}
          </h2>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "6px 12px",
              fontSize: "clamp(12px, 2vw, 14px)",
              background: "#EEE5F6",
              color: "#43016E",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ← Back to Hub
          </button>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "clamp(14px, 2vw, 18px)",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
          }}
        >
          {legalTips.description}
        </p>

        {/* Categories */}
        {legalTips.categories.map((cat, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "clamp(18px, 2vw, 22px)",
                color: "#43016E",
                marginBottom: "0.75rem",
                borderBottom: "2px solid #43016E",
                paddingBottom: "4px",
              }}
            >
              {cat.category}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {cat.tips.map((tip, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "linear-gradient(to right, #FFC4FB, #EEE5F6)",
                    padding: "16px",
                    borderRadius: "10px",
                    borderLeft: "6px solid #43016E",
                    fontSize: "clamp(14px, 2vw, 17px)",
                    lineHeight: "1.6",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LegalTips;
