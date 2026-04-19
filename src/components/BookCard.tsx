// coderabbit full review trigger
import React from 'react';
import { motion } from 'motion/react';
import { School, BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { Badge, cn } from './UI';
import { calculateBookAge } from '../lib/dateUtils';

interface BookCardProps {
  book: any;
  onClick: () => void;
  className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, className }) => {
  // Safety first: handle potential JSON parsing or data issues
  let images = [];
  try {
    if (book.images) {
      images = typeof book.images === 'string' ? JSON.parse(book.images) : (Array.isArray(book.images) ? book.images : []);
    }
  } catch (err) {
    console.error("BookCard: Failed to parse images JSON for", book.title, err);
    images = [];
  }

  // Fallback for primary image
  const displayImage = book.image || (images && images.length > 0 ? images[0] : null);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      onClick={onClick}
      className={cn(
        "positivus-card group flex flex-col h-full cursor-pointer bg-white overflow-hidden",
        className
      )}
    >
      {/* Header Section: Title, Category and Status */}
      <div className="flex justify-between items-start mb-6 h-24 overflow-hidden">
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg md:text-xl font-black leading-tight px-2 rounded-lg inline-block bg-secondary text-dark line-clamp-2 max-h-[3.2rem]">
              {book.title || 'Untitled Book'}
            </h3>
            <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-dark/20 flex-shrink-0">
              {book.category || 'General'}
            </Badge>
          </div>
          <p className="font-bold text-zinc-500 text-sm truncate">
            {book.author || 'Unknown Author'}
          </p>
        </div>
        <Badge variant={book.status?.toLowerCase() === 'available' ? 'available' : 'sold'} className="flex-shrink-0">
          {book.status || 'Available'}
        </Badge>
      </div>

      {/* Image Container: Fixed Aspect Ratio */}
      <div className="aspect-[4/3] w-full rounded-[30px] overflow-hidden border-2 border-dark mb-6 relative bg-zinc-50 shrink-0 flex items-center justify-center">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={book.title || 'Book Image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
            <BookOpen size={48} />
            <span className="font-black text-xs uppercase tracking-widest">No photo available</span>
          </div>
        )}
      </div>
      
      {/* Footer Section: Price, Campus and Action */}
      <div className="mt-auto flex justify-between items-end gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xl md:text-2xl font-black mb-2 truncate text-dark">₹{book.price || 0}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 truncate">
              <School size={14} className="flex-shrink-0 text-primary" />
              <span className="truncate">{book.campus || 'Any Campus'}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary truncate">
              <Calendar size={12} className="flex-shrink-0" />
              <span className="truncate">
                {(() => {
                  try {
                    return calculateBookAge(book.purchaseDate);
                  } catch (e) {
                    return 'Age unknown';
                  }
                })()}
              </span>
            </div>
          </div>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all border-2 border-dark shadow-[3px_3px_0_0_rgba(25,26,35,1)] bg-dark text-secondary flex-shrink-0 group-hover:bg-primary group-hover:text-white"
        >
          <ArrowRight size={24} className="md:w-7 md:h-7" />
        </motion.div>
      </div>
    </motion.div>
  );
};
