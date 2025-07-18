import React from "react";
import RightsCard from "./RightsCard";
import rightsData from "../data/rightsData";

const RightsHub = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#2E2E60", marginBottom: "20px" }}>
        Know Your Rights
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {rightsData.map((right, index) => (
          <RightsCard
            key={index}
            title={right.title}
            summary={right.summary}
            category={right.category}
          />
        ))}
      </div>
    </div>
  );
};

export default RightsHub;
