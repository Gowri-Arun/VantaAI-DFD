import React from "react";
import awarenessCampaigns from "../data/awarenessCampaigns";
import { useNavigate } from "react-router-dom";

function AwarenessCampaigns() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem 1rem",
        fontFamily: "Inter, sans-serif",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        color: "#43016E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      {/* Header */}
      <h2
        style={{
          fontWeight: "bold",
          fontSize: "clamp(22px, 4vw, 32px)",
          marginBottom: "1.2rem",
          textAlign: "center",
        }}
      >
        💡 Featured:{" "}
        <span style={{ fontWeight: "600" }}>
          Join the movement to stop online harassment and build a safer internet for women.
        </span>
      </h2>

      {/* Campaign Cards */}
      <div style={{ width: "100%", maxWidth: "850px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {awarenessCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "16px",
              background: "linear-gradient(to right, #ffe6f0, #f3e8ff)",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              alignItems: "center",
            }}
          >
            {/* Image */}
            <img
              src={campaign.image}
              alt={campaign.title}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            />

            {/* Text Info */}
            <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <h3 style={{ margin: "0", fontSize: "clamp(18px, 2vw, 22px)", color: "#43016E" }}>
                {campaign.title}
              </h3>
              <p style={{ margin: 0, fontSize: "clamp(14px, 1.8vw, 16px)", lineHeight: "1.5" }}>
                {campaign.description}
              </p>
              <p style={{ fontSize: "clamp(12px, 1.5vw, 14px)", fontStyle: "italic", color: "#5E3370" }}>
                📅 {campaign.date} | 📘 {campaign.organizers}
              </p>
              <div style={{ marginTop: "auto" }}>
                <a
                  href={campaign.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    background: "#EEE5F6",
                    color: "#43016E",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                    display: "inline-block",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  🔗 Learn More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem 0",
          width: "100%",
          background: "linear-gradient(to right, #E5C8FF, #D8B4F8)",
          textAlign: "center",
          fontStyle: "italic",
          fontSize: "clamp(14px, 2vw, 18px)",
          color: "#43016E",
          borderRadius: "8px",
        }}
      >
        💡 ...and many more voices and actions leading the way.
      </div>
    </div>
  );
}

export default AwarenessCampaigns;
