function Suggestions({ suggestionGroups, handleSend }) {
  return (
    
    <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: "15px" }}>
        <p style={{ color: "rgba(67, 1, 110, 1)", fontSize: "14px", marginBottom: "8px" }}>
        Suggested Questions
      </p>
      {suggestionGroups.map((group, gIndex) => (
        <div key={gIndex} style={{ marginTop: "20px" }}>

          <p style={{ fontWeight: "bold", color: "#2E2E60", marginBottom: "8px" }}>
            {group.title}
          </p>
          {group.items.map((text, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(text)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#EBCBFF",
                color: "#000",
                border: "none",
                borderRadius: "16px",
                padding: "10px 14px",
                margin: "6px 0",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <span role="img" aria-label="search">🔍</span> {text}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
