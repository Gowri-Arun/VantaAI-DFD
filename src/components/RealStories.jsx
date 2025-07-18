import React from "react";
import { useNavigate } from "react-router-dom";
import realStories from "../data/realStories";

function groupStoriesByTag(stories) {
  const grouped = {};
  stories.forEach((story) => {
    story.tags.forEach((tag) => {
      if (!grouped[tag]) grouped[tag] = [];
      grouped[tag].push(story);
    });
  });
  return grouped;
}

function RealStories() {
  const navigate = useNavigate();
  const groupedStories = groupStoriesByTag(realStories);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        fontFamily: "Inter, sans-serif",
        color: "#43016E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: "850px", width: "100%", padding: "2rem" }}>
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
            Real Stories
          </h2>
          <button
            onClick={() => navigate("/rights")}
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

        {/* Intro */}
        <p
          style={{
            fontSize: "clamp(14px, 2vw, 18px)",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
          }}
        >
          These real stories reflect the courage of women who stood up against
          abuse, harassment, and cyber threats. Their experiences empower and
          inspire.
        </p>

        {/* Grouped stories */}
        {Object.entries(groupedStories).map(([tag, stories]) => (
          <div key={tag} style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "clamp(18px, 2vw, 22px)",
                color: "#43016E",
                marginBottom: "1rem",
                borderBottom: "2px solid #43016E",
                paddingBottom: "4px",
              }}
            >
              {tag}
            </h3>
            <div style={{ display: "grid", gap: "16px" }}>
              {stories.map((story) => (
                <div
                  key={story.id}
                  style={{
                    background: "linear-gradient(to right, #FFC4FB, #EEE5F6)",
                    padding: "16px",
                    borderRadius: "10px",
                    borderLeft: "6px solid #43016E",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                >
                  <h4 style={{ marginTop: 0 }}>{story.title}</h4>
                  <p
                    style={{
                      fontSize: "clamp(14px, 2vw, 17px)",
                      lineHeight: "1.6",
                    }}
                  >
                    {story.summary}
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 14px)",
                      color: "#5e3370",
                      marginTop: "0.5rem",
                    }}
                  >
                    📍 {story.location} | 🗓 {story.date}
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 14px)",
                      marginTop: "0.2rem",
                      fontStyle: "italic",
                    }}
                  >
                    Tags: {story.tags.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Violet Ending Strip */}
        <div
          style={{
            background: "linear-gradient(to right, #FFC4FB, #EEE5F6)",
            padding: "16px",
            borderRadius: "10px",
            borderLeft: "6px solid #43016E",
            fontStyle: "italic",
            textAlign: "center",
            fontSize: "clamp(14px, 2vw, 18px)",
            color: "#43016E",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            marginTop: "2rem",
          }}
        >
          💬 ...and many more voices that deserve to be heard.
        </div>
      </div>
    </div>
  );
}

export default RealStories;
