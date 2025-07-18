import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import lawsAndRights from "../data/LawsAndRights";

function RightsDetail() {
  const { section } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (section !== "laws-&-rights") {
      navigate("/rights", { replace: true });
    }
  }, [section, navigate]);


  if (section !== "laws-&-rights") return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        fontFamily: "Inter, sans-serif",
        color: "#43016E",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: "850px", width: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 6vw, 36px)",
              fontWeight: "bold",
              marginBottom: "0.8rem",
            }}
          >
            {lawsAndRights.title}
          </h2>
          <button
            onClick={() => navigate(-1)}
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

        <p
          style={{
            fontSize: "clamp(14px, 2vw, 18px)",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
          }}
        >
          {lawsAndRights.description}
        </p>

        {/* Content Sections */}
        {lawsAndRights.categories.map((category, idx) => (
          <div key={idx} style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#43016E",
                marginBottom: "0.75rem",
              }}
            >
              {category.sectionTitle}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {category.laws.map((law, lawIdx) => (
                <div
                  key={lawIdx}
                  style={{
                    background: "linear-gradient(to right, #FFC4FB, #EEE5F6)",
                    borderRadius: "10px",
                    padding: "16px",
                    borderLeft: "6px solid #43016E",
                    fontSize: "clamp(14px, 2vw, 17px)",
                    lineHeight: "1.6",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                >
                  {typeof law === "object" ? (
                    <>
                      <strong>{law.code}:</strong> {law.text}
                    </>
                  ) : (
                    law
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightsDetail;
