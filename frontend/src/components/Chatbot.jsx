import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import axios from "axios";

const Chatbot = () => {
  // State for chatbot
  const [isChatOpen, setIsChatOpen] = useState(false); // Toggle Chat
  const [chatInput, setChatInput] = useState(""); // User Input
  const [chatResponse, setChatResponse] = useState("");

  const toggleChat = () => setIsChatOpen((prev) => !prev);

  const handleSendMessage = async () => {
    if (!chatInput) return;
    try {
      const API_KEY =import.meta.env.VITE_GEMINI_API_KEY;
      console.log(import.meta.env.VITE_API_KEY); // Replace with Gemini API key
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: chatInput }] }],
        }
      );
      setChatResponse(
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sorry, I couldn't understand."
      );
    } catch (error) {
      console.error("Error fetching Gemini API:", error);
      setChatResponse("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      {/* Chatbot Icon */}
      <div
        onClick={toggleChat}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition"
      >
        <FaRobot size={24} />
      </div>

      {/* Chatbot Popup */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-8 w-80 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Healthcare Assistant
          </h2>
          <div className="h-32 overflow-y-auto border p-2 rounded text-sm text-gray-600">
            {chatResponse ||
              "Hi! How can I assist you with your health-related questions?"}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              className="flex-grow border rounded-l p-2 focus:outline-none"
              placeholder="Ask me anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
