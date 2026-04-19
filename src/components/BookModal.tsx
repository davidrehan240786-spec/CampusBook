import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, School, Calendar, User, Mail, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Badge, Button, cn } from './UI';
import { useNavigate } from 'react-router-dom';
import { calculateBookAge } from '../lib/dateUtils';
import { useToast } from './Toast';
import { chatService } from '../services/chatService';
import { getCurrentUser, getToken } from '../lib/auth';
import { Loader2 } from 'lucide-react';

interface Book {
  id: string;
  sellerId?: string;
  title: string;
  author: string;
  category: string;
  price: number;
  campus: string;
  status: string;
  image: string;
  images: string[];
  condition: string;
  purchaseDate: string;
  description: string;
  sellerName: string;
  sellerContact: string;
}

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
}

export const BookModal = ({ book, onClose }: BookModalProps) => {
  const { showToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  if (!book) return null;

  const handleRequestBook = async () => {
    if (!currentUser.id) {
      showToast('Please login to request a book', 'error');
      navigate('/login');
      return;
    }

    if (currentUser.id.toString() === book.sellerId) {
      showToast("You can't request your own book!", 'error');
      return;
    }

    setIsRequesting(true);
    try {
      const response = await fetch('/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ bookId: book.id })
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(`Request sent to ${book.sellerName}!`, 'success');
        onClose();
      } else {
        showToast(data.message || 'Failed to send request', 'error');
      }
    } catch (error) {
      showToast('Error sending request', 'error');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleChatNow = async () => {
    if (!currentUser.id) {
      showToast('Please login to chat', 'error');
      navigate('/login');
      return;
    }

    if (currentUser.id.toString() === book.sellerId) {
      showToast("You can't chat with yourself!", 'error');
      return;
    }

    if (!book.sellerId) {
      showToast("Error: Seller ID missing", 'error');
      return;
    }

    try {
      setIsStartingChat(true);
      await chatService.startChat(
        currentUser.id.toString(),
        currentUser.name || 'Student',
        book.sellerId,
        book.sellerName || 'Seller',
        book.id,
        book.title
      );
      onClose();
      navigate('/chat');
    } catch (error) {
      showToast('Failed to start chat', 'error');
    } finally {
      setIsStartingChat(false);
    }
  };

  const nextImage = () => {
    if (!book.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % book.images.length);
  };

  const prevImage = () => {
    if (!book.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + book.images.length) % book.images.length);
  };

  const date = new Date(book.purchaseDate);

  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return (
    <AnimatePresence>
      {book && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white border-4 border-dark rounded-[40px] shadow-[12px_12px_0_0_rgba(25,26,35,1)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white border-2 border-dark rounded-2xl flex items-center justify-center text-dark hover:bg-secondary transition-all shadow-[4px_4px_0_0_rgba(25,26,35,1)] active:translate-y-[2px] active:shadow-none"
            >
              <X size={24} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-zinc-100 border-b-4 md:border-b-0 md:border-r-4 border-dark relative group flex items-center justify-center">
              {(book.images?.length || book.image) ? (
                <img
                  src={book.images?.[currentImageIndex] || book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-300 gap-4">
                  <BookOpen size={120} />
                  <span className="font-black text-xl uppercase tracking-widest">No photo available</span>
                </div>
              )}
              
              {(book.images?.length || 0) > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-dark rounded-xl flex items-center justify-center text-dark opacity-0 group-hover:opacity-100 transition-opacity shadow-[3px_3px_0_0_rgba(25,26,35,1)]"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-dark rounded-xl flex items-center justify-center text-dark opacity-0 group-hover:opacity-100 transition-opacity shadow-[3px_3px_0_0_rgba(25,26,35,1)]"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {book.images?.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          "w-3 h-3 rounded-full border-2 border-dark transition-all",
                          currentImageIndex === idx ? "bg-primary w-8" : "bg-white"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
              
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge variant={book.status === 'Available' ? 'available' : 'sold'}>
                  {book.status}
                </Badge>
                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-dark/20">
                  {book.category}
                </Badge>
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-dark mb-2 leading-tight">{book.title}</h2>
                <p className="text-xl font-bold text-zinc-500">{book.author}</p>
              </div>

              <div className="flex items-center gap-4 mb-10">
                <span className="text-3xl md:text-4xl font-black text-primary">₹{book.price}</span>
                <div className="h-12 w-[2px] bg-dark/10 mx-2" />
                <div className="flex flex-col gap-2">
                  <div className="px-4 py-2 bg-secondary border-2 border-dark rounded-xl font-bold text-sm">
                    {book.condition}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Purchased</p>
                  <div className="flex items-center gap-2 font-bold text-dark">
                    <Calendar size={16} className="text-primary" />
                    <span>
                      {formattedDate} ({age} year{age !== 1 ? 's' : ''} old)
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Campus</p>
                  <div className="flex items-center gap-2 font-bold text-dark">
                    <School size={16} className="text-primary" />
                    <span>{book.campus}</span>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Description</p>
                <p className="text-zinc-600 font-medium leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="p-6 bg-zinc-50 border-2 border-dark rounded-3xl mb-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Seller Info</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary border-2 border-dark rounded-2xl flex items-center justify-center text-dark">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-black text-dark">{book.sellerName}</p>
                    <div className="flex items-center gap-1 text-sm text-zinc-500 font-bold">
                      <Mail size={14} />
                      <span>{book.sellerContact}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="secondary" 
                  className="flex-1 h-16 text-lg gap-2"
                  disabled={isRequesting}
                  onClick={handleRequestBook}
                >
                  {isRequesting ? <Loader2 className="animate-spin" size={20} /> : <MessageSquare size={20} />}
                  {isRequesting ? 'Requesting...' : 'Request Book'}
                </Button>
                <Button 
                  variant="dark" 
                  className="flex-1 h-16 text-lg gap-2"
                  disabled={isStartingChat}
                  onClick={handleChatNow}
                >
                  {isStartingChat ? <Loader2 className="animate-spin" /> : <MessageSquare size={20} />}
                  {isStartingChat ? 'Starting...' : 'Chat Now'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
