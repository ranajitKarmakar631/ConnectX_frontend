import React, { useState, useRef, useEffect } from 'react';
import { Input, Avatar, Badge, Button, Dropdown } from 'antd';
import { 
  SendOutlined, 
  SmileOutlined, 
  PaperClipOutlined,
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

const ChatMessage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I've been thinking about that project we discussed. Have you had a chance to look into it?",
      sender: 'contact',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    {
      id: '2',
      text: "Yes! I spent the whole morning reviewing the requirements. It looks really exciting.",
      sender: 'user',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read'
    },
    {
      id: '3',
      text: "That's great to hear! What are your initial thoughts?",
      sender: 'contact',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read'
    },
    {
      id: '4',
      text: "I think we should start with the core features first, then build out from there. The architecture seems solid.",
      sender: 'user',
      timestamp: new Date(Date.now() - 3300000),
      status: 'read'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          "That's a great idea! Let's move forward with that approach.",
          "I completely agree. When can we get started?",
          "Interesting perspective. I hadn't thought about it that way.",
          "Perfect! I'll prepare the initial documentation.",
          "Sounds good to me. Let's schedule a meeting to discuss details.",
          "Absolutely! I'm excited to see how this develops."
        ];
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'contact',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '😍', '🤔', '👋', '🙏', '✨', '🔥', '💯'];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        
        .chat-container {
          font-family: 'DM Sans', sans-serif;
        }
        
        .chat-header-title {
          font-family: 'Playfair Display', serif;
        }
        
        .message-bubble {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .typing-indicator {
          animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .typing-dot {
          animation: typing 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        
        .message-user .message-bubble {
          background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
          box-shadow: 0 4px 20px rgba(249, 115, 22, 0.25);
        }
        
        .message-contact .message-bubble {
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
        
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.25);
        }
        
        .input-glow:focus-within {
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
        }
        
        .ant-input {
          font-family: 'DM Sans', sans-serif !important;
        }
        
        .backdrop-blur-glass {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.85);
        }
      `}</style>

      <div className="chat-container w-full max-w-4xl h-[90vh] backdrop-blur-glass rounded-3xl shadow-2xl overflow-hidden border border-white/50">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 shadow-lg">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge dot status="success" offset={[-5, 45]}>
                <Avatar 
                  size={56} 
                  className="bg-white text-orange-500 font-bold shadow-lg"
                  style={{ fontSize: '24px', border: '3px solid white' }}
                >
                  AS
                </Avatar>
              </Badge>
              <div>
                <h2 className="chat-header-title text-2xl font-bold mb-1">Alex Smith</h2>
                <p className="text-sm text-white/90 font-medium">Active now</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                type="text" 
                icon={<PhoneOutlined />} 
                className="text-white hover:bg-white/20 border-0 transition-all"
                size="large"
              />
              <Button 
                type="text" 
                icon={<VideoCameraOutlined />} 
                className="text-white hover:bg-white/20 border-0 transition-all"
                size="large"
              />
              <Button 
                type="text" 
                icon={<MoreOutlined />} 
                className="text-white hover:bg-white/20 border-0 transition-all"
                size="large"
              />
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-custom bg-gradient-to-b from-white/50 to-purple-50/30" style={{ height: 'calc(90vh - 180px)' }}>
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-end gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse message-user' : 'message-contact'
              }`}
            >
              {message.sender === 'contact' && (
                <Avatar 
                  size={36} 
                  className="bg-gradient-to-br from-orange-400 to-rose-400 text-white flex-shrink-0 shadow-md"
                >
                  AS
                </Avatar>
              )}
              
              <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div
                  className={`message-bubble px-5 py-3 rounded-3xl ${
                    message.sender === 'user'
                      ? 'text-white rounded-br-md'
                      : 'text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed font-medium">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1.5 px-2 font-medium">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-end gap-3 typing-indicator">
              <Avatar 
                size={36} 
                className="bg-gradient-to-br from-orange-400 to-rose-400 text-white flex-shrink-0 shadow-md"
              >
                AS
              </Avatar>
              <div className="px-5 py-4 rounded-3xl rounded-bl-md bg-white shadow-md border border-gray-100">
                <div className="flex gap-1.5">
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white/90 backdrop-blur-md border-t border-gray-200/50">
          <div className="flex items-end gap-3">
            <Dropdown
              menu={{
                items: emojis.map((emoji, idx) => ({
                  key: idx,
                  label: <span className="text-xl">{emoji}</span>,
                  onClick: () => setInputValue(inputValue + emoji)
                }))
              }}
              trigger={['click']}
              placement="topLeft"
            >
              <Button
                type="text"
                icon={<SmileOutlined />}
                className="text-gray-500 hover:text-orange-500 hover:bg-orange-50 border-0 transition-all"
                size="large"
              />
            </Dropdown>

            <Button
              type="text"
              icon={<PaperClipOutlined />}
              className="text-gray-500 hover:text-orange-500 hover:bg-orange-50 border-0 transition-all"
              size="large"
            />

            <div className="flex-1 relative">
              <Input.TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="rounded-2xl input-glow transition-all duration-200 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-400 px-5 py-3 text-[15px] font-medium resize-none"
              />
            </div>

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none flex items-center justify-center"
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;