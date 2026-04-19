import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input, Button, cn } from '../components/UI';
import { Send, Image, Search, ChevronLeft, MoreVertical, CheckCheck, Loader2 } from 'lucide-react';
import { chatService, Message, Chat } from '../services/chatService';
import { getCurrentUser } from '../lib/auth';
import { useToast } from '../components/Toast';
import { isConfigured } from '../lib/firebase';

export const ChatPage = () => {
  const currentUser = getCurrentUser();
  const { showToast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [onlineStatus, setOnlineStatus] = useState<Record<string, any>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  // 0. Setup Check
  useEffect(() => {
    if (!isConfigured && !hasShownWarning) {
      showToast('Chat system is in demo/placeholder mode. Configure Firebase to enable real messaging.', 'warning');
      setHasShownWarning(true);
    }
  }, [hasShownWarning, showToast]);

  // 1. Subscribe to User's Chats
  useEffect(() => {
    if (!currentUser.id) return;
    
    // Set online status
    chatService.setOnlineStatus(currentUser.id, true);
    
    const unsubscribe = chatService.subscribeToUserChats(currentUser.id, (userChats) => {
      setChats(userChats);
    });

    return () => {
      unsubscribe();
      chatService.setOnlineStatus(currentUser.id, false);
    };
  }, [currentUser.id]);

  // 2. Subscribe to Messages when a chat is selected
  useEffect(() => {
    if (!selectedChat?.id) return;

    // Reset unread for this chat
    chatService.resetUnread(selectedChat.id, currentUser.id);

    const unsubscribe = chatService.subscribeToMessages(selectedChat.id, (msgs) => {
      setMessages(msgs);
    });

    // Subscribe to receiver presence
    const otherParticipant = selectedChat.participants.find(p => p !== currentUser.id.toString());
    let statusUnsubscribe: () => void;
    if (otherParticipant) {
      statusUnsubscribe = chatService.subscribeToUserStatus(otherParticipant, (status) => {
        setOnlineStatus(prev => ({ ...prev, [otherParticipant]: status }));
      });
    }

    return () => {
      unsubscribe();
      if (statusUnsubscribe) statusUnsubscribe();
    };
  }, [selectedChat?.id, currentUser.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedChat?.id) return;

    try {
      const receiverId = selectedChat.participants.find(p => p !== currentUser.id.toString()) || '';
      const msg: Omit<Message, 'timestamp'> = {
        text: newMessage,
        senderId: currentUser.id.toString(),
        receiverId,
        bookId: selectedChat.bookId
      };

      setNewMessage('');
      await chatService.sendMessage(selectedChat.id, msg);
    } catch (error) {
      showToast('Failed to send message', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat?.id) return;

    try {
      setIsUploading(true);
      const imageUrl = await chatService.uploadImage(file);
      const receiverId = selectedChat.participants.find(p => p !== currentUser.id.toString()) || '';
      
      const msg: Omit<Message, 'timestamp'> = {
        imageUrl,
        senderId: currentUser.id.toString(),
        receiverId,
        bookId: selectedChat.bookId
      };

      await chatService.sendMessage(selectedChat.id, msg);
      setIsUploading(false);
    } catch (error) {
      showToast('Image upload failed', 'error');
      setIsUploading(false);
    }
  };

  const getOtherParticipantName = (chat: Chat) => {
    return chat.buyerId === currentUser.id.toString() ? chat.sellerName : chat.buyerName;
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'Just now';
    try {
      const date = timestamp.toDate();
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '...';
    }
  };

  return (
    <div className="h-[calc(100vh-96px)] flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-96 border-r-2 border-dark bg-white flex flex-col z-10",
        selectedChat ? "hidden md:flex" : "flex"
      )}>
        <div className="px-6 py-8 border-b-2 border-dark bg-secondary/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-dark">Messages</h2>
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-dark flex items-center justify-center shadow-[2px_2px_0_0_rgba(25,26,35,1)]">
              <MoreVertical size={20} />
            </div>
          </div>
          <div className="relative">
            <Input placeholder="Search students..." className="h-12 pl-12 bg-white" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-[20px] border-2 border-dark border-dashed flex items-center justify-center mx-auto text-zinc-400">
                <Send size={24} />
              </div>
              <p className="text-sm font-bold text-zinc-500">No active chats yet. Marketplace awaits!</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "w-full px-6 py-5 flex items-start gap-4 transition-all border-b-2 border-dark/5 group",
                  selectedChat?.id === chat.id ? "bg-secondary/20" : "hover:bg-zinc-50"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 bg-white border-2 border-dark rounded-2xl flex items-center justify-center text-dark font-black text-xl shadow-[3px_3px_0_0_rgba(25,26,35,1)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-transform">
                    {getOtherParticipantName(chat)[0]}
                  </div>
                  {onlineStatus[chat.participants.find(p => p !== currentUser.id.toString()) || '']?.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-dark animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-dark truncate">{chat.bookTitle}</span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase whitespace-nowrap ml-2">
                      {chat.lastMessageAt ? formatTime(chat.lastMessageAt) : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-zinc-500 truncate pr-4">
                      {chat.lastMessage || 'Start a conversation'}
                    </p>
                    {Number(chat.unreadCount?.[currentUser.id] || 0) > 0 && (
                      <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-dark shadow-[1px_1px_0_0_rgba(25,26,35,1)] flex-shrink-0">
                        {chat.unreadCount?.[currentUser.id]}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={cn(
        "flex-1 flex flex-col bg-zinc-50/20 relative",
        !selectedChat && "hidden md:flex"
      )}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="h-24 px-6 md:px-10 border-b-2 border-dark bg-white flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden w-10 h-10 border-2 border-dark rounded-xl flex items-center justify-center bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-12 h-12 bg-secondary border-2 border-dark rounded-2xl flex items-center justify-center text-dark font-black shadow-[3px_3px_0_0_rgba(25,26,35,1)]">
                  {getOtherParticipantName(selectedChat)[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Chatting about</p>
                  <h3 className="font-black text-dark text-lg truncate leading-tight">{selectedChat.bookTitle}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      onlineStatus[selectedChat.participants.find(p => p !== currentUser.id.toString()) || '']?.status === 'online' 
                        ? "bg-primary" : "bg-zinc-300"
                    )} />
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      {onlineStatus[selectedChat.participants.find(p => p !== currentUser.id.toString()) || '']?.status === 'online' 
                        ? 'Active now' : 'Away'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <Button variant="outline" className="text-[10px] uppercase font-black tracking-widest px-4 h-10">
                  Book Details
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95">
              <div className="flex justify-center">
                <span className="bg-white border-2 border-dark px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 shadow-[2px_2px_0_0_rgba(25,26,35,1)]">
                  Security Reminder: Meet in public places
                </span>
              </div>
              
              <div className="flex flex-col gap-6">
              {messages.length === 0 && (
  <p className="text-center text-sm font-bold text-zinc-400">
    No messages yet. Start the conversation!
  </p>
)}
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUser.id.toString();
                  return (
                    <div 
                      key={msg.id || idx}
                      className={cn(
                        "flex flex-col gap-2 max-w-[85%] md:max-w-[70%]",
                        isMe ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                          "p-4 md:p-5 rounded-[25px] border-2 border-dark shadow-[4px_4px_0_0_rgba(25,26,35,1)]",
                          isMe 
                            ? "bg-primary text-white rounded-br-none" 
                            : "bg-white text-dark rounded-bl-none"
                        )}
                      >
                        {msg.imageUrl && (
                          <div className="mb-3 rounded-xl overflow-hidden border-2 border-dark/20 cursor-pointer" onClick={() => window.open(msg.imageUrl)}>
                            <img src={msg.imageUrl} alt="Shared" className="max-w-full h-auto max-h-60 object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        {msg.text && (
  <p className="text-sm md:text-base font-bold leading-relaxed">
    {!isMe && <b>{msg.senderName}:</b>} {msg.text}
  </p>
)}
                      </motion.div>
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                          {formatTime(msg.timestamp)}
                        </span>
                        {isMe && <CheckCheck size={14} className="text-primary" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 md:p-8 bg-white border-t-2 border-dark">
              {isUploading && (
                <div className="mb-4 flex items-center gap-3 text-primary animate-pulse">
                  <Loader2 className="animate-spin" size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Uploading Image...</span>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 md:w-14 md:h-14 bg-secondary border-2 border-dark rounded-2xl flex items-center justify-center text-dark hover:scale-105 transition-transform flex-shrink-0"
                >
                  <Image size={24} />
                </button>
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                
                <div className="flex-1 relative">
                  <Input 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="pr-16 h-14 md:h-16 rounded-[20px] text-lg font-bold bg-zinc-50 focus:bg-white"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 bg-dark text-secondary rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:grayscale"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-30">
            <div className="w-40 h-40 bg-zinc-100 rounded-[50px] border-4 border-dark border-dashed flex items-center justify-center mb-8 rotate-3">
              <Send size={64} className="text-dark" strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-black text-dark mb-4">No Conversation Selected</h2>
            <p className="max-w-md font-bold text-zinc-500">Pick a student from the sidebar to start bargaining or bargaining details about your next favorite book.</p>
          </div>
        )}
      </div>
    </div>
  );
};

