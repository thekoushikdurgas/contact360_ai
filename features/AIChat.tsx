
import React, { useState, useRef, useEffect, memo } from 'react';
import { Card3D, Input3D, Button3D } from '../components/UI';
import { Send, Bot, User, Loader2, Plus, MessageSquare, Trash2, Menu, X, Sparkles, ChevronRight, Copy, Check } from 'lucide-react';
import { useAiChat } from '../hooks/useAiChat';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Memoized Message Bubble Component ---
const ChatMessageBubble = memo(({ msg, onCopy, copiedId, idx }: { msg: ChatMessage, onCopy: (text: string, id: string) => void, copiedId: string | null, idx: number }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 group/message`}>
      <div className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[80%] items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/10 mt-1
          ${isUser ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'}
        `}>
          {isUser ? <User size={18} className="md:w-5 md:h-5" /> : <Bot size={18} className="md:w-5 md:h-5" />}
        </div>

        {/* Bubble */}
        <div className={`
           group relative p-4 md:p-5 rounded-2xl shadow-md text-sm md:text-base leading-relaxed break-words transition-all
           ${isUser 
             ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-none shadow-indigo-500/20' 
             : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm hover:shadow-md'}
        `}>
          {/* Message Content with Markdown */}
          <div className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text}
            </ReactMarkdown>
          </div>
          
          {/* Timestamp & Meta */}
          <div className={`text-[10px] mt-2 flex items-center gap-2 ${isUser ? 'text-indigo-200 justify-end' : 'text-slate-400 justify-start'}`}>
             {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             {msg.isError && <span className="text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/20 px-1.5 rounded">Error</span>}
          </div>
          
          {/* 3D Depth Edge */}
          <div className={`absolute inset-x-0 -bottom-1 h-2 rounded-b-2xl opacity-20 ${isUser ? 'bg-black' : 'bg-slate-900/10'}`} />
        </div>

        {/* Copy Button (only for AI) */}
        {!isUser && (
          <button
            onClick={() => onCopy(msg.text, idx.toString())}
            className="opacity-0 group-hover/message:opacity-100 transition-all duration-200 p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/50 mt-1 self-start shrink-0 ml-2 transform hover:scale-105 active:scale-95 focus:opacity-100 focus:outline-none"
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
          >
            {copiedId === idx.toString() ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
});

export const AIChat: React.FC = () => {
  const { 
    chats, 
    currentChat, 
    currentChatId, 
    setCurrentChatId, 
    createChat, 
    deleteChat, 
    sendMessage, 
    isSending,
    isLoading: isChatsLoading 
  } = useAiChat();

  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;
    const msg = inputValue;
    setInputValue('');
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-4 md:gap-6 animate-enter">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed bottom-20 right-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar: Chat History */}
      <div 
        className={`
          fixed md:relative inset-y-0 left-0 z-40 w-[280px] bg-white/95 dark:bg-slate-900/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none
          transition-transform duration-300 ease-in-out md:translate-x-0 border-r md:border-none border-slate-200 dark:border-slate-700
          flex flex-col h-full
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="md:h-full perspective-container flex flex-col">
          <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-3d-light dark:shadow-3d h-full flex flex-col p-4">
             {/* New Chat Button */}
             <Button3D 
               variant="primary" 
               className="w-full mb-4 shadow-indigo-500/20" 
               onClick={createChat}
               iconName="plus"
             >
               New Chat
             </Button3D>

             <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
               {isChatsLoading ? (
                 <div className="flex justify-center p-4">
                   <Loader2 className="animate-spin text-slate-400" />
                 </div>
               ) : chats.length === 0 ? (
                 <div className="text-center p-4 text-slate-500 dark:text-slate-400 text-sm">
                   <MessageSquare className="mx-auto mb-2 opacity-50" size={32} />
                   <p>No conversations yet.</p>
                   <p className="text-xs mt-1">Start a new chat to begin.</p>
                 </div>
               ) : (
                 chats.map(chat => (
                   <div 
                     key={chat.id}
                     onClick={() => { setCurrentChatId(chat.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                     className={`
                       group relative p-3 rounded-xl cursor-pointer transition-all duration-300
                       border hover:shadow-md
                       ${currentChatId === chat.id 
                         ? 'bg-indigo-50/80 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-500/30 shadow-sm translate-x-1' 
                         : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-100 dark:hover:border-slate-700'}
                     `}
                   >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className={`
                             w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                             ${currentChatId === chat.id ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}
                           `}>
                              <MessageSquare size={14} />
                           </div>
                           <div className="min-w-0">
                              <h4 className={`text-sm font-semibold truncate ${currentChatId === chat.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                {chat.title}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {chat.updatedAt.toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md transition-all"
                        >
                           <Trash2 size={14} />
                        </button>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 h-full perspective-container">
         <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-3d-light dark:shadow-3d h-full flex flex-col overflow-hidden relative">
            
            {/* Chat Header */}
            {currentChat ? (
               <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <Bot size={20} />
                     </div>
                     <div>
                        <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                           NexusAI <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">Gemini 2.5 Flash</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Always active • Stream enabled</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button3D variant="ghost" className="hidden md:flex text-xs h-8" onClick={() => deleteChat(currentChat.id)}>
                       <Trash2 size={14} className="mr-2" /> Clear Chat
                    </Button3D>
                  </div>
               </div>
            ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-6 animate-in zoom-in duration-500">
                     <Bot size={48} />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Welcome to NexusAI</h1>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
                     Your intelligent assistant for lead generation, data analysis, and crafting perfect outreach campaigns.
                  </p>
                  <Button3D variant="primary" className="px-8 py-4 text-lg shadow-indigo-500/30" onClick={createChat}>
                     Start New Conversation
                  </Button3D>
                  
                  {/* Floating capabilities */}
                  <div className="mt-12 grid grid-cols-2 gap-4 max-w-lg w-full">
                     {['Find Leads', 'Analyze Risk', 'Draft Emails', 'Company Intel'].map((cap, i) => (
                        <div key={i} className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 justify-center shadow-sm">
                           <Sparkles size={14} className="text-indigo-500" /> {cap}
                        </div>
                     ))}
                  </div>
               </div>
            )
            }

            {/* Messages Area */}
            {currentChat && (
               <div 
                 ref={scrollContainerRef}
                 className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth custom-scrollbar relative z-0"
               >
                  {currentChat.messages.map((msg, idx) => (
                    <ChatMessageBubble 
                      key={idx} 
                      msg={msg} 
                      idx={idx} 
                      onCopy={handleCopy} 
                      copiedId={copiedId} 
                    />
                  ))}
                  
                  {isSending && currentChat.messages[currentChat.messages.length - 1]?.role === 'user' && (
                     <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                       <div className="flex gap-3 md:gap-4 max-w-[90%]">
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg border border-white/10 mt-1">
                           <Bot size={18} className="md:w-5 md:h-5" />
                         </div>
                         <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-sm">
                           <div className="flex gap-1">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                           </div>
                           <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">NexusAI is thinking...</span>
                         </div>
                       </div>
                     </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
               </div>
            )}

            {/* Input Area */}
            <div className="p-4 md:p-5 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-700/50 backdrop-blur-md z-20">
               <div className="flex gap-3 items-end max-w-4xl mx-auto">
                  <div className="flex-1 relative group">
                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 -z-10" />
                     <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner-3d-light dark:shadow-inner-3d flex items-center p-1">
                        <textarea 
                           placeholder={currentChat ? "Ask NexusAI anything..." : "Start a new conversation..."}
                           value={inputValue}
                           onChange={(e) => setInputValue(e.target.value)}
                           onKeyDown={handleKeyDown}
                           disabled={isSending || !currentChat}
                           rows={1}
                           className="w-full bg-transparent border-none outline-none px-3 py-2.5 max-h-32 min-h-[44px] resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 disabled:opacity-50"
                           style={{ height: 'auto', overflow: 'hidden' }}
                           onInput={(e) => {
                             e.currentTarget.style.height = 'auto';
                             e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                           }}
                        />
                     </div>
                  </div>
                  <Button3D 
                     variant="primary" 
                     onClick={handleSend} 
                     disabled={isSending || !inputValue.trim() || !currentChat}
                     className="h-[52px] w-[52px] rounded-xl flex items-center justify-center p-0 shadow-indigo-500/30"
                  >
                     {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className="ml-0.5" />}
                  </Button3D>
               </div>
               <div className="text-center mt-2">
                 <p className="text-[10px] text-slate-400 dark:text-slate-500">
                   NexusAI can make mistakes. Consider checking important information.
                 </p>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};
