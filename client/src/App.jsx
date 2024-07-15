import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import "./index.css";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  useEffect(() => {
    // Add introductory message when the component mounts
    const introMessage = {
      type: "text",
      content: "Hi there, what can I do for you?",
    };
    setMessages([introMessage]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTextChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputText) {
      const userMessage = { type: "text", content: inputText, isUser: true };
      const botMessage = { type: "text", content: inputText, isUser: false };
      setMessages([...messages, userMessage, botMessage]);
      setInputText(""); // Clear the input box
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const userMessage = {
        type: "image",
        content: previewUrl,
        isUser: true,
      };
      setMessages([...messages, userMessage]);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        const botMessage = {
          type: "text",
          content: `Okay, here's the recognized text from the image: ${data.imageText}`,
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-gray-900">🤖</span>
          </div>
          <h1 className="text-lg font-bold">Chatbot</h1>
        </div>
      </header>
      <main className="flex-1 bg-gray-100 p-4 overflow-auto">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-[70%] ${
                  message.isUser
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {message.type === "text" ? (
                  <p>{message.content}</p>
                ) : (
                  <img
                    src={message.content}
                    alt="User upload"
                    className="max-w-full"
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </main>
      <footer className="bg-white border-t p-4 flex items-center gap-2">
        <form
          className="relative flex-1 flex items-center"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="file-input"
            className="absolute left-3 cursor-pointer z-10"
          >
            <AiOutlinePaperClip size={20} />
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <div
            className={`flex items-center w-full border border-gray-300 rounded p-2 pl-10 ${
              previewUrl ? "h-40" : "h-12"
            }`}
          >
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full object-cover rounded mr-2 max-h-full w-24"
              />
            )}
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none h-full"
              value={inputText}
              onChange={handleTextChange}
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white p-2 rounded ml-2"
          >
            <IoMdSend size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}
