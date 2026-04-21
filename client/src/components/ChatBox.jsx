import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Cpu, User, Sparkles, Image as ImageIcon, Mic } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Converts **bold** markdown tokens in a string into styled JSX spans.
 * Only processes bold markers; everything else is rendered as plain text.
 */
const renderMarkdown = (text) => {
  if (!text) return null;
  // Split on **...** tokens
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const word = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-primary">
          {word}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const ChatBox = () => {
  const { user, activeContext } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello ${user?.name || 'there'}! I am your ArenaSync AI. How can I assist your stadium experience today?`, type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only scroll on new messages, not on initial mount with the greeting
    if (messages.length > 1) scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, type: 'text' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const filteredHistory = newMessages.filter(
        msg =>
          msg.role !== 'assistant' ||
          msg.content !== `Hello ${user?.name || 'there'}! I am your ArenaSync AI. How can I assist your stadium experience today?`
      );

      const historyPayload = filteredHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        text: msg.content,
      }));

      const response = await api.post('/ai/chat', { 
        prompt: input,
        history: historyPayload,
        context: activeContext,
      });
      const aiMessage = { role: 'assistant', content: response.data.text, type: 'text' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      let errorMessage = 'Sorry, I am having trouble connecting to the AI. Please try again later.';
      
      if (error.response?.status === 429) {
        errorMessage = 'AI rate limit exceeded. Please wait a few minutes before trying again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in again to use the AI assistant.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMessages((prevMessages) => [...prevMessages, { 
        role: 'assistant', 
        content: errorMessage, 
        type: 'text' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl h-full flex flex-col border-outline-variant/10 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="w-5 h-5 text-on-primary" />
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold leading-none">AI Assistant</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Powered by Gemini</span>
            </div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-primary opacity-50" />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-secondary-fixed text-on-surface' : 'bg-primary/20 text-primary'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-on-primary rounded-tr-none shadow-lg' 
                  : 'bg-surface-container-highest text-on-surface rounded-tl-none border border-outline-variant/20'
              }`}>
                {msg.role === 'user' ? msg.content : renderMarkdown(msg.content)}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 bg-surface-container-lowest/50 border-t border-outline-variant/20">
        <form onSubmit={handleSend} className="relative group">
           <div className="absolute left-4 inset-y-0 flex items-center gap-2">
              <button type="button" className="p-1 text-on-surface-variant hover:text-primary transition-colors">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button type="button" className="p-1 text-on-surface-variant hover:text-primary transition-colors">
                <Mic className="w-4 h-4" />
              </button>
           </div>
          <input
            type="text"
            className="w-full bg-surface-container text-sm text-on-surface rounded-2xl py-4 pl-20 pr-14 border border-outline-variant/30 focus:outline-hidden focus:border-primary/50 transition-all shadow-inner"
            placeholder="Ask anything about the venue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        {isLoading && (
          <p className="text-center text-sm text-primary mt-2">AI is thinking...</p>
        )}
        <p className="text-[9px] text-center text-on-surface-variant font-bold uppercase tracking-widest mt-4">
          Experimental AI Assistance · Use for guidance only
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
