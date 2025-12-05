import React, { useState, useRef, useEffect } from 'react';
import { Card3D, Input3D, Button3D } from '../components/UI';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your HyperDash AI assistant. How can I help you analyze your leads or improve your outreach today?', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userMsg.text, history);

      const modelMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong.', timestamp: new Date(), isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100dvh-90px)] md:h-[calc(100vh-140px)] flex flex-col pb-2 md:pb-0">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">AI Assistant</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Powered by Gemini 2.5 Flash</p>
      </div>

      <Card3D className="flex-1 flex flex-col p-0 overflow-hidden !bg-slate-50/50 dark:!bg-slate-900/80 !p-0">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/10
                    ${isUser ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}
                  `}>
                    {isUser ? <User size={18} className="md:w-5 md:h-5" /> : <Bot size={18} className="md:w-5 md:h-5" />}
                  </div>

                  {/* Bubble */}
                  <div className={`
                    p-3 md:p-4 rounded-2xl shadow-md text-sm md:text-base leading-relaxed break-words
                    ${isUser 
                      ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-50 rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }
                  `}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className="mb-1 last:mb-0">{line}</p>
                    ))}
                    <div className="text-[10px] opacity-50 mt-2 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
             <div className="flex justify-start">
               <div className="flex gap-3 md:gap-4 max-w-[90%]">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-emerald-600 text-white shadow-lg border border-white/10">
                   <Bot size={18} className="md:w-5 md:h-5" />
                 </div>
                 <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 md:p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                   <Loader2 size={16} className="animate-spin text-emerald-500 dark:text-emerald-400" />
                   <span className="text-slate-500 dark:text-slate-400 text-sm">Thinking...</span>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-white/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700/50 backdrop-blur-md">
          <div className="flex gap-2 md:gap-3">
            <div className="flex-1">
              <Input3D 
                placeholder="Message AI..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full"
              />
            </div>
            <Button3D 
              variant="primary" 
              onClick={handleSend} 
              disabled={isLoading || !inputValue.trim()}
              className="h-[50px] px-4 md:px-6"
            >
              <Send size={20} />
            </Button3D>
          </div>
        </div>
      </Card3D>
    </div>
  );
};