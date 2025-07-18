import React from 'react';

function ChatWindow({ messages, isTyping, messagesEndRef }) {
    const formatTime = (timestamp) =>
        new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div
  style={{
    flex: 1,
    padding: "10px",
    borderRadius: "12px",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",

    maxWidth: "100%",       
    overflowX: "hidden",    
    boxSizing: "border-box" 
  }}
>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            {messages.map((msg, index) => (
                <div
                    key={index}
                    style={{
                        textAlign: msg.role === "user" ? "right" : "left", 
                        margin: "8px 0",
                        animation: "fadeIn 0.4s ease-in-out",
                    }}
                >
                    <div
                        style={{
                            display: "inline-block",
                            padding: "8px 12px",
                            borderRadius: "16px",
                            background: msg.role === "user" ? "#F6E6FA" : "#DAF1FF", 
                            maxWidth: "80%",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere", 
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                            color: "rgba(67, 1, 110, 1)",
                        }}
                    >
                        <div>{msg.content}</div> 
                        <div style={{ fontSize: "10px", marginTop: "4px", opacity: 0.7 }}>
                            {formatTime(msg.timestamp)}
                        </div>
                    </div>
                </div>
            ))}
            {isTyping && (
                <div
                    style={{
                        textAlign: "left",
                        fontStyle: "italic",
                        marginTop: "8px",
                        padding: "8px 12px",
                        borderRadius: "16px",
                        backgroundColor: "#DAF1FF",
                        maxWidth: "fit-content",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        color: "rgba(67, 1, 110, 1)",
                        animation: "fadeIn 0.4s ease-in-out",
                    }}
                >
                    Vanta AI is typing...
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatWindow;
