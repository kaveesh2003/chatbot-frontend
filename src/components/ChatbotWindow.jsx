// src/components/ChatbotWindow.jsx
import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import "../App.css";

const ChatbotWindow = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: "user1",
          message: message,
        }),
      });

      const data = await response.json();
      console.log(data);

      const botReply = data.length > 0 ? data[0].text : "Sorry, I couldn't understand that.";

      setChatMessages(prevMessages => [
        ...prevMessages,
        { sender: "user", text: message },
        { sender: "bot", text: botReply }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
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
      <h2 className="chatbot-header">Hi there! I'm Travel Buddy</h2>
      <div className="chatbot-container">
        <div className="chatbot-left">
          <div className="chat-display">
            {chatMessages.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg.text}
                sender={msg.sender}
              />
            ))}
            {isLoading && <div className="loading">Loading...</div>}
          </div>

          <div className="search-bar">
            <input
              className="chat-input"
              type="text"
              placeholder="Ask me anything about traveling in Sri Lanka..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="search-btn" onClick={handleSend}>
              <span className="material-icons send">send</span>
            </button>
          </div>
        </div>

        <div className="chatbot-right">
          <div className="info-box">
            <p>
              Ask me about beautiful destinations, top hotels, visa info, travel tips, and more. <br />
              Let’s plan your perfect Sri Lankan getaway together!
            </p>
          </div>
          <div className="instruction-text">
            <h2>How can I assist your Sri Lanka travel plans today?</h2>
            <p>Choose a topic below or type your question</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWindow;
