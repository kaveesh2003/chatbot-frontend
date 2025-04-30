// src/components/OptionButton.jsx
import React, { useState } from "react";
import "../App.css";

const OptionButton = () => {
  const [botResponse, setBotResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Map display labels to clean backend messages
  const options = [
    { label: "Popular Destinations", message: "popular destinations" },
    { label: "Hotel Recommendations", message: "hotel recommendations" },
    { label: "Visa & Entry Guidelines", message: "visa & entry guidelines" },
    { label: "Travel Tips & Safety Info", message: "travel tips & safety info" },
  ];

  async function sendMessage(message) {
    setLoading(true);
    setBotResponse("");

    try {
      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: "user1",
          message: message
        })
      });

      const data = await response.json();
      console.log(data);

      if (Array.isArray(data) && data.length > 0) {
        const allMessages = data.map(d => d.text).filter(Boolean).join('\n\n');
        setBotResponse(allMessages || "No response from bot.");
      } else {
        setBotResponse("No response from bot.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setBotResponse("❌ Error connecting to the chatbot server.");
    }

    setLoading(false);
  }

  const handleButtonClick = (message) => {
    sendMessage(message);
  };

  return (
    <div className="button-grid">
      {options.map((option, index) => (
        <button
          key={index}
          className="option-button"
          onClick={() => handleButtonClick(option.message)}
          disabled={loading}
        >
          {option.label}
        </button>
      ))}

      <div className="bot-response">
        {loading ? (
          <p>Loading...</p>
        ) : botResponse && (
          <div className="bot-response-box">
            <h3>Bot Reply:</h3>
            <p>{botResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionButton;
