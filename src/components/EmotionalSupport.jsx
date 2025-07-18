import { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import Suggestions from "./Suggestions";
import InputBar from "./InputBar";

function EmotionalSupport() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const suggestionGroups = [
    {
      title: "🛡️ Safety & Prevention",
      items: [
        "How do I know if my personal data is being misused?",
        "Can someone post my pictures without asking me?",
        "What should I do if someone threatens me online?",
      ],
    },
    {
      title: "⚖️ Legal Rights",
      items: [
        "Do I have the right to ask for content takedown?",
        "Can I take action if my pictures are used without consent?",
      ],
    },
    {
      title: "🧠 Mental Health & Support",
      items: [
        "I feel overwhelmed, what can I do right now?",
        "I’m scared to speak up, what are my options?",
      ],
    },
  ];

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setIsUserAtBottom(scrollHeight - scrollTop - clientHeight < 80);
  };

  useEffect(() => {
    if (!isUserAtBottom || !messagesEndRef.current) return;
    const timeout = setTimeout(() => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping, isUserAtBottom]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role || (msg.type === "user" ? "user" : "assistant"),
            content: msg.content || msg.text,
          })),
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedResponse = "";
      let botMessageIndex = -1;

      setMessages((prev) => {
        const newMessages = [...prev, { role: "assistant", content: "", timestamp: new Date() }];
        botMessageIndex = newMessages.length - 1;
        return newMessages;
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n").filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          try {
            const jsonData = JSON.parse(line.substring(5));
            const token = jsonData.token || jsonData.message?.content;
            if (token) {
              accumulatedResponse += token;
              setMessages((prev) => {
                const updated = [...prev];
                if (botMessageIndex !== -1 && updated[botMessageIndex]) {
                  updated[botMessageIndex].content = accumulatedResponse;
                }
                return updated;
              });
            }
            if (jsonData.done) {
              reader.cancel();
              setIsTyping(false);
              return;
            }
            if (jsonData.error) {
              setMessages((prev) => {
                const updated = [...prev];
                if (botMessageIndex !== -1 && updated[botMessageIndex]) {
                  updated[botMessageIndex].content += `\n\nError: ${jsonData.error}`;
                } else {
                  updated.push({
                    role: "assistant",
                    content: `Error: ${jsonData.error}`,
                    timestamp: new Date(),
                  });
                }
                return updated;
              });
              setIsTyping(false);
              reader.cancel();
              return;
            }
          } catch {}
        }
      }

      setIsTyping(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Network or internal server error. Please check server console.",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <>
      <div
  ref={containerRef}
  onScroll={handleScroll}
  style={{
        height: "calc(100vh - 80px)", 

    width: "100vw", 
    overflowY: "auto",           
    overflowX: "hidden",
    position: "relative",         
    boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
    color: "rgba(67, 1, 110, 1)",
    background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
    paddingBottom: "110px", 
    display: "flex",               
    flexDirection: "column",      
  }}
>


        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
            boxSizing: "border-box",
            flexGrow: 1,  
          }}
        >
          <h2 style={{ fontWeight: "bold", color: "#2E2E60", marginBottom: "10px" }}>
            Chat with Vanta AI
          </h2>

          {showSuggestions ? (
            <Suggestions suggestionGroups={suggestionGroups} handleSend={handleSend} />
          ) : (
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>
      </div>
      <div
  style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "11px 21px",
    background:"#E5C8FF",
    boxSizing: "border-box",     
    width: "100%",           
    overflowX: "hidden",         
    borderTop: "none",
    boxShadow: "none",
    zIndex: 1000,
  }}
>
        <InputBar
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          setShowSuggestions={setShowSuggestions}
          isSending={isTyping}
        />
      </div>
    </>
  );
}

export default EmotionalSupport;
