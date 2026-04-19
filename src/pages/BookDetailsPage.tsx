import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "../components/UI";

export const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`/books/${id}`);
                const b = await res.json();
                
                let parsedImages = [];
                try {
                  parsedImages = typeof b.images === 'string' ? JSON.parse(b.images) : (Array.isArray(b.images) ? b.images : []);
                } catch (e) {
                  parsedImages = b.image_url ? [b.image_url] : [];
                }

                setBook({
                  ...b,
                  images: parsedImages || (b.image_url ? [b.image_url] : [])
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchBook();
    }, [id]);

    if (!book) {
        return <div className="p-10 text-center">Loading book...</div>;
    }

    return (
  <div className="p-10 flex justify-center">
    <div className="w-full max-w-xl positivus-card p-8">

      {/* TOP */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">{book.title}</h1>
          <p className="text-sm font-bold text-zinc-500">
            {book.seller_name || "Campus User"}
          </p>
        </div>

        <div className="px-4 py-2 border-2 border-dark rounded-xl font-black text-xs">
          {book.status}
        </div>
      </div>

      {/* IMAGE GALLERY */}
      <div className="relative group mb-6 bg-zinc-50 rounded-2xl border-2 border-dark overflow-hidden aspect-video flex items-center justify-center">
        {book.images?.length > 0 ? (
          <>
            <img
              src={book.images[currentImageIndex]}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            {book.images.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev - 1 + book.images.length) % book.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-dark rounded-xl flex items-center justify-center shadow-[2px_2px_0_0_rgba(25,26,35,1)]"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev + 1) % book.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-dark rounded-xl flex items-center justify-center shadow-[2px_2px_0_0_rgba(25,26,35,1)]"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {book.images.map((_: any, i: number) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-2 h-2 rounded-full border border-dark transition-all",
                        currentImageIndex === i ? "bg-dark w-4" : "bg-white/50"
                      )} 
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-300 gap-4">
            <BookOpen size={80} />
            <span className="font-black text-sm uppercase tracking-widest">No photo available</span>
          </div>
        )}
      </div>

      {/* TAGS */}
      <div className="flex gap-3 mb-6">
        <span className="px-3 py-1 bg-secondary rounded-lg text-xs font-black">
          {book.category}
        </span>
        <span className="px-3 py-1 border-2 border-dark rounded-lg text-xs font-black">
          {book.condition_status}
        </span>
      </div>

      {/* PRICE */}
      <div className="text-2xl font-black mb-4">
        ₹{book.price}
      </div>

      {/* DETAILS */}
      <div className="text-sm font-bold text-zinc-600 space-y-1 mb-6">
        <div>🏫 {book.campus}</div>
        <div>📅 {book.purchase_date || "N/A"}</div>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-600">
          {book.description}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button className="flex-1 h-12 bg-dark text-white rounded-xl font-black border-2 border-dark">
          Request
        </button>

        <button className="flex-1 h-12 border-2 border-dark rounded-xl font-black">
          Chat
        </button>
      </div>

    </div>
  </div>
);
};