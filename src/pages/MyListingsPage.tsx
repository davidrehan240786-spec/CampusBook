// coderabbit full review trigger

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Badge } from '../components/UI';
import { DUMMY_BOOKS } from '../constants';
import { Edit2, BookOpen, ShoppingBag, Tag, Loader2, Trash2 } from 'lucide-react';
import { EditListingModal } from '../components/EditListingModal';
import { chatService } from '../services/chatService';

import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/Toast';
import { getCurrentUser, getToken } from '../lib/auth';

export const MyListingsPage = () => {
  const { showToast } = useToast();
  const currentUser = getCurrentUser();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSoldConfirmOpen, setIsSoldConfirmOpen] = useState(false);
  const [targetBookId, setTargetBookId] = useState<string | null>(null);

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/my-books/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      setListings(data.map((b: any) => ({
        ...b,
        image: b.image_url || b.image,
        purchaseDate: b.purchase_date || b.purchaseDate,
        condition: b.condition_status || b.condition
      })));
    } catch (error) {
      showToast('Error fetching your listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser.id) fetchMyBooks();
  }, [currentUser.id]);

  const handleEditClick = (book: any) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedBook: any) => {
    setListings(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
    showToast('Listing updated successfully!', 'success');
  };

  const confirmMarkAsSold = async () => {
    if (targetBookId) {
      try {
        const response = await fetch('/update-book-status', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ bookId: targetBookId, status: 'Sold' })
        });
        if (response.ok) {
          const data = await response.json();
          const buyerIds: string[] = data.buyerIds || [];
          // Update UI
          setListings(prev => prev.map(b => b.id === targetBookId ? { ...b, status: 'Sold' } : b));
          showToast('Book marked as sold. Congratulations!', 'success');

          // Send system message to each buyer via Firebase chatService
          const sellerId = currentUser.id;
          const sellerName = currentUser.name || currentUser.email;
          const book = listings.find(b => b.id === targetBookId);
          if (book) {
            for (const buyerId of buyerIds) {
              // Start or get existing chat
              const chatId = await chatService.startChat(
                buyerId,
                '', // buyerName not needed for system message
                sellerId,
                sellerName,
                book.id,
                book.title
              );
              // Send system message
              await chatService.sendMessage(chatId, {
                senderId: 'system',
                receiverId: buyerId,
                bookId: book.id,
                text: '📢 This book has been marked as sold. This listing is now inactive.',
                // type field for system messages
                // @ts-ignore – Firestore allows extra fields
                type: 'system'
              });
            }
          }
        }
      } catch (error) {
        showToast('Error updating status', 'error');
      }
      setIsSoldConfirmOpen(false);
      setTargetBookId(null);
    }
  };

  const handleMarkAsSoldClick = (bookId: string) => {
    setTargetBookId(bookId);
    setIsSoldConfirmOpen(true);
  };

  const handleDelete = (bookId: string) => {
    setListings(prev => prev.filter(b => b.id !== bookId));
    showToast('Listing removed from marketplace.', 'info');
  };

  const formatDateWithAge = (input) => {
  if (!input) return "N/A";

  const date = new Date(input);

  const formatted = date.toLocaleDateString('en-IN', {
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

  return `${formatted} (${age} year${age !== 1 ? 's' : ''} old)`;
};

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary border-2 border-dark rounded-2xl flex items-center justify-center text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-dark leading-none">My Listings</h2>
            <p className="text-zinc-500 font-medium mt-1">Manage all the books you've listed for sale.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {listings.map((book) => (
          <motion.div 
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="positivus-card flex flex-col md:flex-row items-start md:items-center gap-8 p-8"
          >
            <div className="w-24 h-32 border-2 border-dark rounded-[20px] overflow-hidden flex-shrink-0 shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl md:text-2xl font-black text-dark line-clamp-2">{book.title}</h3>
                <Badge variant={book.status === 'Available' ? 'available' : 'sold'}>
                  {book.status}
                </Badge>
              </div>
              <p className="font-bold text-zinc-500">{book.author}</p>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Price</span>
                  <p className="text-xl font-black text-dark">₹{book.price}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Campus</span>
                  <p className="text-lg font-bold text-primary">{book.campus}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Date Listed</span>
                  <p className="text-lg font-bold text-dark">
  {formatDateWithAge(book.purchaseDate)}
</p>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col gap-4 w-full md:w-auto self-stretch justify-center">
              {book.status !== 'Sold' && (
  <button 
    onClick={() => handleEditClick(book)}
    title="Edit Listing"
    className="flex-1 md:w-14 md:h-14 bg-white border-2 border-dark rounded-2xl flex items-center justify-center text-dark hover:bg-secondary transition-all shadow-[4px_4px_0_0_rgba(25,26,35,1)] active:translate-y-[2px] active:shadow-none p-4 md:p-0"
  >
    <Edit2 size={24} />
  </button>
)}
              {book.status === 'Available' && (
                <button 
                  onClick={() => handleMarkAsSoldClick(book.id)}
                  title="Mark as Sold"
                  className="flex-1 md:w-14 md:h-14 bg-primary border-2 border-dark rounded-2xl flex items-center justify-center text-white hover:bg-primary/90 transition-all shadow-[4px_4px_0_0_rgba(25,26,35,1)] active:translate-y-[2px] active:shadow-none p-4 md:p-0"
                >
                  <Tag size={24} />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {listings.length === 0 && (
          <div className="text-center py-20 positivus-card bg-zinc-50 border-dashed">
            <div className="w-20 h-20 bg-zinc-100 border-2 border-dark rounded-[30px] flex items-center justify-center mx-auto mb-6 text-zinc-400">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-2xl font-black text-dark mb-2">No active listings</h3>
            <p className="text-zinc-500 font-medium max-w-xs mx-auto">You haven't listed any books for sale yet. Start selling to see your listings here!</p>
          </div>
        )}
      </div>

      <EditListingModal 
        book={selectedBook}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <ConfirmationModal 
        isOpen={isSoldConfirmOpen}
        title="Mark as Sold?"
        message="This will move the book to your 'Sold' category and inform any interested buyers that it is no longer available."
        confirmLabel="Yes, Mark as Sold"
        variant="secondary"
        onConfirm={confirmMarkAsSold}
        onCancel={() => setIsSoldConfirmOpen(false)}
      />
    </div>
  );
};
