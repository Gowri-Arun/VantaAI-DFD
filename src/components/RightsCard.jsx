import React from "react";
import { useNavigate } from "react-router-dom";

function RightsCard({ title, description, bgColor, icon }) {
  const navigate = useNavigate();

  // Convert title to a slug like: "Real Stories" → "real-stories"
  const slug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        color: "#43016E",
        textAlign: "center",
        minHeight: "220px",
        transition: "transform 0.2s",
        cursor: "pointer", // ✅ indicates clickable
      }}
      onClick={() => navigate(`/rights/${slug}`)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ marginBottom: "12px" }}>
        {typeof icon === "string" && icon.startsWith("/") ? (
          <img
            src={icon}
            alt="icon"
            style={{
              width: "64px",
              height: "64px",
              objectFit: "contain",
              margin: "0 auto",
            }}
          />
        ) : (
          <span style={{ fontSize: "48px" }}>{icon}</span>
        )}
      </div>

      <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: "0 0 10px" }}>
        {title}
      </h3>

      <p style={{ fontSize: "14px", lineHeight: "1.5" }}>{description}</p>
    </div>
  );
}

export default RightsCard;
