import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, MessageCircle, RefreshCcw, Trophy, Package, FileText, PhoneCall } from "lucide-react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome to Sportalon! How can I assist you today?", sender: "bot" },
    { text: "How to Use", sender: "bot", type: "option", icon: "guide" },
    { text: "Equipments", sender: "bot", type: "option", icon: "equipment" },
    { text: "Current Events", sender: "bot", type: "option", icon: "event" },
    { text: "Contact Admin", sender: "bot", type: "option", icon: "contact" },
  ]);
  const [input, setInput] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [awaitingAdminMessage, setAwaitingAdminMessage] = useState(false);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus input when chat opens
    setTimeout(() => {
      if (inputRef.current && !isOpen) {
        inputRef.current.focus();
      }
    }, 300);
  };

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/equipments")
      .then((res) => setEquipments(res.data.data))
      .catch((error) => console.error("API Error (Equipments):", error));

    axios.get("http://localhost:5000/api/admin/events/")
      .then((res) => setEvents(res.data.events))
      .catch((error) => console.error("API Error (Events):", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const getIconComponent = (iconType, size = 16) => {
    switch (iconType) {
      case 'guide':
        return <FileText size={size} className="option-icon" />;
      case 'equipment':
        return <Package size={size} className="option-icon" />;
      case 'event':
        return <Trophy size={size} className="option-icon" />;
      case 'contact':
        return <PhoneCall size={size} className="option-icon" />;
      default:
        return null;
    }
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setInput("");

    if (text === "How to Use") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Welcome to Sportalon! Here's how to get started:",
            sender: "bot"
          },
          {
            text: "• Browse equipment availability and reserve what you need",
            sender: "bot"
          },
          {
            text: "• Check out upcoming sports events and register",
            sender: "bot"
          },
          {
            text: "• Contact admin for any special requests",
            sender: "bot"
          },
          {
            text: "Upcoming PDF Guides",
            sender: "bot"
          },
        ]);
      }, 500);
    }
    else if (text === "Equipments") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Choose equipment to check availability:", sender: "bot" },
          ...equipments.map((eq) => ({
            text: eq.equipmentname,
            sender: "bot",
            type: "option",
            icon: "equipment"
          })),
        ]);
      }, 500);
    }
    else if (text === "Current Events") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Here are the upcoming sports events:", sender: "bot" },
          ...events.map((event) => ({
            text: event.title,
            sender: "bot",
            type: "event",
            id: event._id,
            icon: "event"
          })),
        ]);
      }, 500);
    }
    else if (text === "Contact Admin") {
      setMessages((prev) => [
        ...prev,
        { text: "Type your message for the admin below:", sender: "bot" },
      ]);
      setAwaitingAdminMessage(true);
    }
    else if (awaitingAdminMessage) {
      // Show typing indicator
      setMessages((prev) => [...prev, { text: "Sending message...", sender: "bot", isTyping: true }]);

      // Simulate sending the message to the admin
      axios.post("http://localhost:5000/api/admin/contact", { message: text })
        .then(() => {
          // Remove typing indicator and add success message
          setMessages((prev) => {
            const filtered = prev.filter(msg => !msg.isTyping);
            return [
              ...filtered,
              { text: "✅ Your message has been sent to the admin. They will get back to you soon!", sender: "bot" },
            ];
          });
        })
        .catch(() => {
          // Remove typing indicator and add error message
          setMessages((prev) => {
            const filtered = prev.filter(msg => !msg.isTyping);
            return [
              ...filtered,
              { text: "❌ Failed to send message. Please try again later or contact support directly.", sender: "bot" },
            ];
          });
        });
      setAwaitingAdminMessage(false);
    }
    else {
      const selectedEquipment = equipments.find((eq) => eq.equipmentname === text);
      const selectedEvent = events.find((event) => event.title === text);

      if (selectedEquipment) {
        setTimeout(() => {
          const availability = selectedEquipment.availableQuantity > 0
            ? `Available: ${selectedEquipment.availableQuantity}`
            : "Currently unavailable";

          setMessages((prev) => [
            ...prev,
            {
              text: text,
              sender: "bot",
              isHeader: true
            },
            {
              text: `${availability}`,
              sender: "bot"
            },
            {
              text: "Reserve Equipment",
              sender: "bot",
              type: "action",
              action: "reserve",
              equipmentId: selectedEquipment._id
            }
          ]);
        }, 500);
      }
      else if (selectedEvent) {
        // Show event details before redirecting
        setMessages((prev) => [
          ...prev,
          {
            text: selectedEvent.title,
            sender: "bot",
            isHeader: true
          },
          {
            text: "Redirecting to event details...",
            sender: "bot"
          }
        ]);

        // Delay redirect for better UX
        setTimeout(() => {
          window.location.href = `http://localhost:5173/events/${selectedEvent._id}`;
        }, 1000);
      }
      else {
        setMessages((prev) => [
          ...prev,
          {
            text: "I'm not sure about that. Would you like to:",
            sender: "bot"
          },
          {
            text: "Check Equipment",
            sender: "bot",
            type: "option",
            icon: "equipment"
          },
          {
            text: "View Events",
            sender: "bot",
            type: "option",
            icon: "event"
          },
          {
            text: "Contact Admin",
            sender: "bot",
            type: "option",
            icon: "contact"
          }
        ]);
      }
    }
  };

  const restartChat = () => {
    setMessages([
      { text: "Welcome to Sportalon! How can I assist you today?", sender: "bot" },
      { text: "How to Use", sender: "bot", type: "option", icon: "guide" },
      { text: "Equipments", sender: "bot", type: "option", icon: "equipment" },
      { text: "Current Events", sender: "bot", type: "option", icon: "event" },
      { text: "Contact Admin", sender: "bot", type: "option", icon: "contact" },
    ]);
    setInput("");
    setAwaitingAdminMessage(false);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-button" onClick={toggleChat} aria-label="Open chat assistant">
        <img src="/bot.png" alt="Sportalon Assistant" className="bot-icon" />
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Sportalon Assistant</span>
            <button onClick={toggleChat} aria-label="Close chat">✖</button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {loading && <div className="chat-message bot loading">Loading sports information...</div>}
            {messages.map((msg, index) => {
              if (msg.type === "option") {
                return (
                  <div
                    key={index}
                    className="chat-message bot option"
                    onClick={() => sendMessage(msg.text)}
                  >
                    {msg.icon && getIconComponent(msg.icon)}
                    <span>{msg.text}</span>
                  </div>
                );
              } else if (msg.type === "event") {
                return (
                  <div
                    key={index}
                    className="chat-message bot option"
                    onClick={() => (window.location.href = `http://localhost:5173/events/${msg.id}`)}
                  >
                    <Trophy size={16} className="option-icon" />
                    <span>{msg.text}</span>
                  </div>
                );
              } else if (msg.type === "action") {
                return (
                  <div
                    key={index}
                    className="chat-message bot action"
                    onClick={() => {
                      if (msg.action === "reserve") {
                        window.location.href = `http://localhost:5173/equipment/${msg.equipmentId}`;
                      }
                    }}
                  >
                    {msg.text}
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className={`chat-message ${msg.sender} ${msg.isHeader ? 'header' : ''} ${msg.isTyping ? 'typing' : ''}`}
                  >
                    {msg.isTyping ? (
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                );
              }
            })}
          </div>

          <div className="chat-footer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
            <button
              className="restart-button"
              onClick={restartChat}
              aria-label="Restart conversation"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
