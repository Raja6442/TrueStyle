import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Shield, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I am TrueStyle's Digital Shield AI assistant. How can I help protect your shopping experience today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Trigger simulated response
    setTimeout(() => {
      let botResponseText = "I understand you have questions regarding digital security. You can paste any suspicious e-commerce URL in our 'Verify Product' scanner to perform an instantaneous multi-signal security audit.";
      
      const query = inputValue.toLowerCase();
      if (query.includes('discount') || query.includes('price')) {
        botResponseText = "Our Price Risk Analysis flags item markdowns greater than 50% on unverified platforms. However, under our multi-signal rule, we only trigger a counterfeit alert if at least one other indicator (such as seller score or domain authenticity) is also flagged suspicious.";
      } else if (query.includes('counterfeit') || query.includes('fake') || query.includes('authentic')) {
        botResponseText = "TrueStyle analyzes price drops, seller history, and domain credentials concurrently. Copy any product link, select the brand, and hit Scan. If two or more signals are malicious, we display a Counterfeit Alert.";
      } else if (query.includes('otp') || query.includes('code') || query.includes('register') || query.includes('verify')) {
        botResponseText = "For testing: during registration, an OTP is generated and printed directly on the screen. Type that code in the OTP verification box to complete email verification.";
      } else if (query.includes('admin') || query.includes('role') || query.includes('login')) {
        botResponseText = "TrueStyle supports Admin and User roles. Log in with admin@truestyle.security (pw: AdminPassword123!) to access the administrative terminal containing audit history and seller database controls.";
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        botResponseText = "Greetings! I am standing by to assist with any questions about e-commerce counterfeit protection, security audits, or account preferences.";
      }

      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Floating Circle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-cyber-blue-700 hover:bg-cyber-blue-600 rounded-full shadow-neon-blue transition duration-300 text-white transform hover:scale-105"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-cyber-dark-card border border-cyber-dark-border rounded-xl shadow-glass flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-cyber-blue-900/80 px-4 py-3 border-b border-cyber-dark-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-cyber-blue-600 p-1 rounded-full text-white">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-mono">Digital Shield AI</h4>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] text-gray-400">Monitoring Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`p-1.5 rounded-full ${msg.sender === 'bot' ? 'bg-cyber-blue-900 text-cyber-blue-400' : 'bg-gray-800 text-gray-300'}`}>
                  {msg.sender === 'bot' ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-lg text-xs leading-relaxed ${
                  msg.sender === 'bot' 
                    ? 'bg-cyber-dark-bg text-gray-300 border border-cyber-dark-border' 
                    : 'bg-cyber-blue-700 text-white shadow-neon-blue'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-cyber-dark-border bg-[#0a0b0d] flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about price rules, scanner logic..."
              className="flex-grow glass-input px-3 py-2 rounded-lg text-xs text-white"
            />
            <button
              type="submit"
              className="px-3 bg-cyber-blue-700 hover:bg-cyber-blue-600 text-white rounded-lg transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
