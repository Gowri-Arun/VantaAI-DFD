import React from "react";

function WarningPopup({ message, onCancel, onProceed }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFEAF1",
          border: "2px solid #43016E",
          padding: "24px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontFamily: "Inter, sans-serif",
          color: "#43016E",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "bold" }}>
          ⚠️ Potential Risk Detected
        </h3>
        <p style={{ marginBottom: "24px", fontSize: "15px", lineHeight: "1.5" }}>
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              backgroundColor: "#F7CFC7",
              color: "#43016E",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            style={{
              flex: 1,
              backgroundColor: "#94D6FF",
              color: "#43016E",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningPopup;
