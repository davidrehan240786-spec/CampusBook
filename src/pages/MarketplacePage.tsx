import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BOOK_CATEGORIES, CAMPUSES } from '../constants';
import { Badge, Button, cn, Input, Select } from '../components/UI';
import { School, SlidersHorizontal, ShoppingBag, ChevronDown } from 'lucide-react';
import { BookModal } from '../components/BookModal';
import { getCurrentUser } from '../lib/auth';
import { BookCard } from '../components/BookCard';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CAMPUS = 'SJCE';

const IS_DEMO_MODE = (import.meta as any).env.VITE_DEMO_MODE === 'true';

const DEMO_BOOKS = [
  {
    id: 'demo-1',
    title: 'Data Structures & Algorithms',
    author: 'Narasimha Karumanchi',
    category: 'Computer Science',
    price: 450,
    campus: 'SJCE',
    status: 'Available',
    image: 'https://picsum.photos/seed/dsa/400/600',
    images: ['https://picsum.photos/seed/dsa/400/600'],
    condition_status: 'Like New',
    condition: 'Like New',
    purchaseDate: '2023-08-15',
    description: 'A comprehensive guide to learning data structures and algorithms.',
    sellerName: 'Varun (Demo Seller)',
    sellerId: '9901',
    sellerContact: 'varun@campus.edu'
  }
];

export const MarketplacePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAdmin = user.role === 'admin';
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [campusSearch, setCampusSearch] = useState<string>(isAdmin ? '' : DEFAULT_CAMPUS);
  const [otherCampusName, setOtherCampusName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 }); // Increased max to avoid hiding listings
  const [condition, setCondition] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/books');
        const data = await response.json();
        console.log("Marketplace received raw data:", data.length);

        const mappedBooks = data.map((b: any) => {
          let parsedImages = [];
          try {
            if (b.images) {
              parsedImages = typeof b.images === 'string' ? JSON.parse(b.images) : (Array.isArray(b.images) ? b.images : []);
            } else {
              parsedImages = b.image_url ? [b.image_url] : [];
            }
          } catch (e) {
            console.warn("Failed to parse images for book", b.id, e);
            parsedImages = b.image_url ? [b.image_url] : [];
          }

          return {
            ...b,
            image: b.image_url || (parsedImages && parsedImages.length > 0 ? parsedImages[0] : null),
            images: parsedImages || (b.image_url ? [b.image_url] : []),
            purchaseDate: b.purchase_date || b.purchaseDate,
            condition: b.condition_status || b.condition,
            sellerName: b.seller_name || 'Campus Student',
            sellerId: String(b.seller_id)
          };
        });

        // Only merge with Demo Books if flag is set or no results found (auto-preview)
        if (IS_DEMO_MODE || (mappedBooks.length === 0 && !campusSearch)) {
          setBooks([...DEMO_BOOKS, ...mappedBooks]);
        } else {
          setBooks(mappedBooks);
        }
        console.log("Marketplace state updated with total:", (IS_DEMO_MODE ? DEMO_BOOKS.length + mappedBooks.length : mappedBooks.length));
        mappedBooks.forEach((b, i) => console.log(`Item ${i}: ID=${b.id}, Title=${b.title}`));
      } catch (error) {
        console.error('Failed to fetch books:', error);
        if (IS_DEMO_MODE) setBooks(DEMO_BOOKS);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [campusSearch]);

  const activeCampus = campusSearch === 'Other' ? otherCampusName : campusSearch;

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Campus filter
      if (activeCampus && book.campus.toLowerCase() !== activeCampus.toLowerCase()) return false;

      // Price filter
      if (book.price < priceRange.min || book.price > priceRange.max) return false;

      // Condition filter
      if (condition.length > 0 && !condition.includes(book.condition)) return false;

      // Category filter
      if (categories.length > 0 && !categories.includes(book.category)) return false;

      return true;
    });
  }, [books, activeCampus, priceRange, condition, categories]);

  const toggleCondition = (c: string) => {
    setCondition(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
  };

  const toggleCategory = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(item => item !== cat) : [...prev, cat]);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-secondary border-2 border-dark rounded-2xl flex items-center justify-center text-dark">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-dark leading-none">Marketplace</h2>
              <p className="text-zinc-500 font-medium mt-1">Available in <span className="text-primary font-bold lowercase">{activeCampus || 'your campus'}</span></p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {IS_DEMO_MODE && (
            <Button
              variant="outline"
              className="gap-2 h-14 px-5 rounded-2xl border-dashed"
              onClick={async () => {
                const res = await fetch('/seed-demo-data', { method: 'POST' });
                if (res.ok) window.location.reload();
              }}
            >
              Seed Data
            </Button>
          )}

          <div className="relative group min-w-[200px]">
            <Select
              value={campusSearch}
              onChange={(e) => setCampusSearch(e.target.value)}
              className="h-14 font-black shadow-[4px_4px_0_0_rgba(25,26,35,1)] pr-12"
            >
              <option value="" disabled>Select Campus</option>
              {CAMPUSES.map(campus => (
                <option key={campus} value={campus}>{campus}</option>
              ))}
            </Select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dark" />
          </div>

          <Button
            variant={showFilters ? "dark" : "secondary"}
            className="gap-2 h-14 px-8 rounded-2xl shadow-[4px_4px_0_0_rgba(25,26,35,1)]"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} /> Advanced Filters
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {(showFilters || campusSearch === 'Other') && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 40 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="positivus-card-green p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
              {campusSearch === 'Other' && (
                <div className="space-y-4 md:col-span-3">
                  <h4 className="text-lg font-black text-dark flex items-center gap-2">
                    <School size={18} className="text-primary" /> Enter Your Campus Name
                  </h4>
                  <Input
                    placeholder="E.g., Your College Name..."
                    value={otherCampusName}
                    onChange={(e) => setOtherCampusName(e.target.value)}
                    className="h-14 bg-white text-lg font-bold"
                  />
                  <p className="text-[10px] font-bold text-zinc-600 italic uppercase tracking-wider">Sharing is caring! Join your campus community.</p>
                </div>
              )}

              {showFilters && (
                <>
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-dark">Price Range (₹)</h4>
                    <div className="flex gap-4">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="h-12 text-center"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        className="h-12 text-center"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 100 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-dark">Condition</h4>
                    <div className="flex flex-wrap gap-2">
                      {['New', 'Like New', 'Good', 'Fair'].map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleCondition(c)}
                          className={cn(
                            "px-4 py-2 rounded-xl border-2 border-dark text-xs font-black transition-all",
                            condition.includes(c) ? "bg-dark text-white" : "bg-white text-dark hover:bg-secondary"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-dark">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {BOOK_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={cn(
                            "px-4 py-2 rounded-xl border-2 border-dark text-xs font-black transition-all",
                            categories.includes(cat) ? "bg-primary text-white" : "bg-white text-dark hover:bg-secondary"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="positivus-card animate-pulse bg-zinc-100 h-[400px]" />
          ))
        ) : (
          filteredBooks.map((book: any, index: number) => {
            // Error-safe rendering wrapper
            try {
              if (!book || !book.id) {
                console.warn("Skipping invalid book record at index", index, book);
                return null;
              }
              
              return (
                <BookCard
                  key={book.id || `fallback-${index}`}
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              );
            } catch (err) {
              console.error("Critical render error for book:", book, err);
              return null;
            }
          })
        )}
      </motion.div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-zinc-100 border-2 border-dark rounded-[35px] flex items-center justify-center mx-auto mb-6 text-zinc-400">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-2xl font-black text-dark mb-2">No books found in this campus</h3>
          <p className="text-zinc-500 font-medium">Try searching for another campus or college.</p>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => {
              setCampusSearch(DEFAULT_CAMPUS);
              setOtherCampusName('');
              setPriceRange({ min: 0, max: 100 });
              setCondition([]);
              setCategories([]);
            }}
          >
            Reset to SJCE Campus
          </Button>
        </div>
      )}
    </div>
  );
};
