import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trash2, User, Search } from 'lucide-react';
import { Button, Badge, Input } from '../components/UI';
import { EditListingModal } from '../components/EditListingModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/Toast';
import { getToken } from '../lib/auth';

export const AdminListingsPage = () => {
  const { showToast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [targetBookId, setTargetBookId] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

 const fetchListings = async () => {
  try {
    const response = await fetch('http://localhost:3000/admin/books', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    
    const data = await response.json();
    if (Array.isArray(data)) {
      setListings(data);
    } else {
      showToast('Failed to load listings', 'error');
    }
  } catch (error) {
    showToast('Error connecting to backend', 'error');
  } finally {
    setIsLoading(false);
  }
};

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.seller_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
  if (targetBookId) {
    try {
      const response = await fetch(`http://localhost:3000/admin/books/${targetBookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      
      const data = await response.json();
      if (data.success) {
        setListings(prev => prev.filter(l => l.id !== targetBookId));
        showToast('Listing removed by administrator.', 'info');
      } else {
        showToast(data.message || 'Failed to remove listing', 'error');
      }
    } catch (error) {
      showToast('Error connecting to backend', 'error');
    } finally {
      setIsDeleteConfirmOpen(false);
      setTargetBookId(null);
    }
  }
};

  const handleDeleteClick = (id: string) => {
    setTargetBookId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleEditClick = (book: any) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedBook: any) => {
  try {
    const response = await fetch(`http://localhost:3000/admin/books/${updatedBook.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(updatedBook)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update listing');
    }
    
    const data = await response.json();
    if (data.success) {
      setListings(prev => prev.map(l => l.id === updatedBook.id ? updatedBook : l));
      showToast('Listing details updated.', 'success');
    } else {
      showToast(data.message || 'Failed to update listing', 'error');
    }
  } catch (error) {
    showToast('Error connecting to backend', 'error');
  }
};

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary border-2 border-dark rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-dark tracking-tight">Platform Listings</h2>
              <p className="text-zinc-500 font-medium">Audit and manage every book listed across CampusBook.</p>
            </div>
          </div>
        </div>
        
        <div className="relative w-full md:w-80">
          <Input 
            placeholder="Search by book or seller..." 
            className="pl-14"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <p className="text-zinc-500 font-medium">Loading listings...</p>
        ) : filteredListings.length === 0 ? (
          <p className="text-zinc-500 font-medium">No listings found.</p>
        ) : filteredListings.map((book) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="positivus-card group"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-32 h-40 border-2 border-dark rounded-[25px] overflow-hidden flex-shrink-0 shadow-[6px_6px_0_0_rgba(25,26,35,1)] bg-zinc-50 flex items-center justify-center">
                {book.image_url ? (
                  <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-300 gap-1 text-center p-2">
                    <BookOpen size={32} />
                    <span className="text-[8px] font-black uppercase leading-tight">No photo</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 text-center lg:text-left pt-4 lg:pt-0">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <h3 className="text-xl md:text-2xl font-black text-dark line-clamp-2">{book.title}</h3>
                  <Badge variant={book.status === 'Available' ? 'available' : 'sold'}>
                    {book.status}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 font-bold text-sm text-zinc-500">
                  <span className="flex items-center gap-2">
                    <User size={16} className="text-primary" />
                    Seller: <span className="text-dark">{book.seller_name || book.sellerName}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} className="text-secondary" />
                    Campus: <span className="text-dark">{book.campus}</span>
                  </span>
                  <span className="text-lg text-dark">₹{book.price}</span>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-auto">
                <Button
                  className="flex-1 lg:w-32 h-12 rounded-xl"
                  onClick={() => handleEditClick(book)}
                >
                  Edit Details
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 lg:w-32 h-12 rounded-xl text-red-500 border-red-200 hover:bg-red-50 shadow-[4px_4px_0_0_rgba(25,26,35,1)]"
                  onClick={() => handleDeleteClick(book.id)}
                >
                  <Trash2 size={18} className="mr-2" /> Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <EditListingModal 
        book={selectedBook}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        onDelete={async (id) => {
          try {
            const response = await fetch(`http://localhost:3000/admin/books/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            
            if (!response.ok) {
              throw new Error('Failed to delete listing');
            }
            
            const data = await response.json();
            if (data.success) {
              setListings(prev => prev.filter(l => l.id !== id));
              showToast('Listing removed permanently.', 'info');
              setIsEditModalOpen(false);
            } else {
              showToast(data.message || 'Failed to remove listing', 'error');
            }
          } catch (error) {
            showToast('Error connecting to backend', 'error');
          }
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Admin: Remove Listing?"
        message="This will permanently delete the listing from the marketplace. This action is auditable and final."
        confirmLabel="Yes, Remove Permanently"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};
