import React from "react";
import sendIcon from "../Images/button.png";

function InputBar({ input, setInput, handleSend, setShowSuggestions, isSending }) {
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim() !== "" && !isSending) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",           
        boxSizing: "border-box",    
        overflowX: "hidden",        
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "19px 23px",
          background: "#FFD7F1",
          borderRadius: "200px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          opacity: isSending ? 0.7 : 1,
          pointerEvents: isSending ? "none" : "auto",
        }}
      >
        <span role="img" aria-label="search">🔍</span>
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything..."
          disabled={isSending}
          style={{
            flexGrow: 1,
            border: "none",
            background: "transparent",
            fontSize: "14px",
            outline: "none",
            color: "rgba(67, 1, 110, 1)",
            caretColor: "#5B2EFF",
            fontFamily: "Inter, sans-serif",
            cursor: isSending ? "not-allowed" : "text",
          }}
          aria-label="Message input"
        />

        <button
          onClick={() => handleSend(input)}
          disabled={isSending || !input.trim()}
          style={{
            border: "none",
            background: "none",
            cursor: isSending || !input.trim() ? "not-allowed" : "pointer",
            fontSize: "18px",
            color: "rgba(67, 1, 110, 1)",
          }}
          aria-label="Send"
        >
          <img
  src={sendIcon}
  alt="Send"
  style={{
    display: "block",
    width: "24px",
    height: "24px",
    maxWidth: "100%",
  }}
/>

        </button>
      </div>
    </div>
  );
}

export default InputBar;
