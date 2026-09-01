import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello, Forge Member! I’m Eva, the AI Assistant of Forge Vault. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_FEATHERLESS_API_KEY;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
          messages: [
            { role: 'system', content: 'You are Eva, the AI Assistant of Orion Forge. Be helpful and concise.' },
            ...messages.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { role: 'user', content: userMessage.text }
          ],
        })
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error?.message || 'Invalid response from API');
      }

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error: any) {
      console.error('Error fetching AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Error: ${error.message || "Sorry, I'm having trouble connecting right now. Please try again later."}`,
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-24 right-8 z-[10000] w-[400px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border border-slate-100"
          style={{ height: 'calc(100vh - 160px)', maxHeight: '800px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Eva</h3>
                <p className="text-xs text-white/80">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#5B3DF5] text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm px-4 py-4 flex gap-1 items-center h-10">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Eva anything..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-[#5B3DF5] focus:ring-1 focus:ring-[#5B3DF5] transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-1 p-2 bg-[#5B3DF5] text-white rounded-full hover:bg-[#4a2ee0] disabled:opacity-50 disabled:hover:bg-[#5B3DF5] transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
