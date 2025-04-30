// src/components/MessageBubble.jsx
import React from "react";
import "../App.css";

const MessageBubble = ({ message, sender }) => {
  return (
    <div className={`message-row ${sender}`}>
      <div className={`message-bubble ${sender}`}>
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
