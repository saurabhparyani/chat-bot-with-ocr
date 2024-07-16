import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePaperClip, AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const introMessage = {
      type: "text",
      content:
        "Beep, boop 🤖. I'm a bot used to analyze text and images! If you're sending an image, make sure to send it as a png or jpg.",
    };
    setMessages([introMessage]);
  }, []);

  useEffect(() => {
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
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        alert("Only JPG/PNG files are allowed");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadingImage(true);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadingImage(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputText && !uploadingImage) {
      const userMessage = { type: "text", content: inputText, isUser: true };
      const botMessage = {
        type: "text",
        content: (
          <div>
            Beep, boop 🤖. The analyzed text is:
            <br></br>
            <span style={{ color: "blueviolet", fontWeight: "bold" }}>
              {inputText}
            </span>
          </div>
        ),
        isUser: false,
      };
      setMessages([...messages, userMessage, botMessage]);
      setInputText("");
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
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        const botMessage = {
          type: "text",
          content: (
            <div>
              Beep, boop 🤖. The analyzed text is:
              <br></br>
              <span style={{ color: "blueviolet", fontWeight: "bold" }}>
                {data.imageText}
              </span>
            </div>
          ),
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-transparent rounded-full flex items-center justify-center">
            <span className="text-gray-900">🤖</span>
          </div>
          <h1 className="text-lg font-bold">ChatBotOCR </h1>
          <span>by </span>
          <a
            className="text-red-300"
            href="https://www.saurabhparyani.dev/"
            target="_blank"
          >
            Saurabh Paryani
          </a>
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
          {uploadingImage ? (
            <div className="flex items-center w-full border border-gray-300 rounded p-2 pl-10 h-40">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800"
                onClick={handleCancelUpload}
              >
                <AiOutlineCloseCircle size={20} />
              </button>
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full object-contain rounded mr-2 max-h-full w-24"
              />
            </div>
          ) : (
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
                disabled={uploadingImage}
              />
            </div>
          )}
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
