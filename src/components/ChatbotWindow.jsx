// src/components/ChatbotWindow.jsx
import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import "../App.css";
import logo_tb from "../assets/logo_tb.png";

const ChatbotWindow = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message) => {
    try {
      setIsLoading(true);

      // 👇 Send message to Rasa backend (port 5005, not 5055)
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "user1",
          message: message,
        }),
      });

      const data = await response.json();
      console.log("Rasa Response:", data);

      // 👇 Create user message
      const updatedMessages = [
        { sender: "user", text: message }
      ];

      // 👇 Push each Rasa message to chat
      data.forEach((msg) => {
        if (msg.text) {
          updatedMessages.push({ sender: "bot", text: msg.text });
        }
        // Optional: handle images, buttons here if needed
      });

      setChatMessages((prevMessages) => [...prevMessages, ...updatedMessages]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "⚠️ Sorry, something went wrong while processing your message." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (userInput.trim() !== "") {
      sendMessage(userInput);
      setUserInput("");
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-header-full">
        <h2 className="chatbot-header">Hi there! I'm Travel Buddy....</h2>
        <img className= "logo_travel" src={logo_tb} alt="logo"/>
      </div>
      <div className="chatbot-container">
        <div className="chatbot-left">
          <div className="chat-display">
          <div className="chatbot-right">
          <div className="instruction-text">
            <h2>How can I assist your Sri Lankan travel plans today?</h2>
          </div>
        </div>
            {chatMessages.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg.text}
                sender={msg.sender}
              />
            ))}
            {isLoading && <div className="loading">Typing...</div>}
          </div>

          <div className="search-bar">
            <input
              className="chat-input"
              type="text"
              placeholder="Ask me anything about traveling in Sri Lanka..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="search-btn" onClick={handleSend}>
              <span className="material-icons send">send</span>
            </button>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ChatbotWindow;
