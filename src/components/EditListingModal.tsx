// coderabbit full review trigger
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Trash2, ChevronDown } from 'lucide-react';
import { Button, Input, Select } from './UI';
import { CAMPUSES } from '../constants';
import { ConfirmationModal } from './ConfirmationModal';
import { uploadImages } from '../lib/upload';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from './Toast';

interface Book {
  id: string;
  title: string;
  author: string;
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

interface EditListingModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBook: Book) => void;
  onDelete: (bookId: string) => void;
}

export const EditListingModal = ({ book, isOpen, onClose, onSave, onDelete }: EditListingModalProps) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Book | null>(null);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [otherCampusName, setOtherCampusName] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // New images to upload
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  
  // Existing images (URLs)
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        purchaseDate: book.purchase_date
          ? book.purchase_date.split('T')[0]
          : ''
      });
      
      // Parse images if they come as a JSON string from MySQL
      let parsedImages = [];
      try {
        parsedImages = typeof book.images === 'string' 
          ? JSON.parse(book.images) 
          : (Array.isArray(book.images) ? book.images : []);
      } catch (e) {
        parsedImages = book.image_url ? [book.image_url] : [];
      }
      setExistingImages(parsedImages || []);

      if (CAMPUSES.includes(book.campus)) {
        setSelectedCampus(book.campus);
        setOtherCampusName('');
      } else {
        setSelectedCampus('Other');
        setOtherCampusName(book.campus);
      }
    }
  }, [book]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }) : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (existingImages.length + newFiles.length + files.length > 5) {
        alert('Maximum 5 images allowed');
        return;
      }
      setNewFiles(prev => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setNewPreviews(prev => [...prev, ...previews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData) {
      setIsSaving(true);
      try {
        const finalCampus = selectedCampus === 'Other' ? otherCampusName : selectedCampus;
        
        // Upload new images
        let newlyUploadedUrls: string[] = [];
        if (newFiles.length > 0) {
          console.log("Uploading new images:", newFiles.length);
          newlyUploadedUrls = await uploadImages(newFiles);
          console.log("Newly uploaded URLs:", newlyUploadedUrls);
        }
        
        const finalImages = [...existingImages, ...newlyUploadedUrls];
        console.log("Final images array for update:", finalImages);

        const updatedBook = {
          ...formData,
          campus: finalCampus,
          purchase_date: formData.purchaseDate,
          image: finalImages.length > 0 ? finalImages[0] : null, // cover image
          image_url: finalImages.length > 0 ? finalImages[0] : null,
          images: finalImages.length > 0 ? finalImages : null
        };

        const res = await fetch('/update-book', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedBook)
        });

        const data = await res.json();
        console.log("Update response:", data);
        onSave(data.updatedBook || updatedBook);
        showToast('Book updated successfully!', 'success');
        onClose();
      } catch (err: any) {
        console.error('Update failed with full details:', err);
        showToast(err.message || 'Error uploading images or connecting to backend', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-2xl bg-white border-4 border-dark rounded-[40px] shadow-[12px_12px_0_0_rgba(25,26,35,1)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b-4 border-dark flex items-center justify-between bg-secondary/10">
              <div>
                <h2 className="text-3xl font-black text-dark">Edit Listing</h2>
                <p className="text-sm font-bold text-zinc-500">Update your book details or remove the listing.</p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 bg-white border-2 border-dark rounded-2xl flex items-center justify-center text-dark hover:bg-secondary transition-all shadow-[4px_4px_0_0_rgba(25,26,35,1)] active:translate-y-[2px] active:shadow-none"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-black text-dark ml-2">Book Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. The Great Gatsby"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-dark ml-2">Author</label>
                  <Input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="e.g. F. Scott Fitzgerald"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-dark ml-2">Price (₹)</label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-dark ml-2">Select Campus</label>
                  <div className="relative">
                    <Select
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      required
                      className="pr-12"
                    >
                      <option value="" disabled>Choose your college...</option>
                      {CAMPUSES.map(campus => (
                        <option key={campus} value={campus}>{campus}</option>
                      ))}
                    </Select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dark" />
                  </div>
                </div>

                {selectedCampus === 'Other' && (
                  <div className="space-y-2">
                    <label className="text-sm font-black text-dark ml-2">Enter College Name</label>
                    <Input
                      placeholder="Custom campus name"
                      required
                      value={otherCampusName}
                      onChange={(e) => setOtherCampusName(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-black text-dark ml-2">Condition</label>
                  <div className="relative">
                    <Select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="pr-12"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </Select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dark" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-black text-dark ml-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-[25px] border-2 border-dark bg-white px-8 py-6 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-secondary/30 min-h-[120px]"
                    placeholder="Tell buyers more about the book..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-dark ml-2">Status</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => prev ? ({ ...prev, status: 'Available' }) : null)}
                      className={`flex-1 h-12 rounded-xl border-2 border-dark font-bold text-sm transition-all ${formData.status === 'Available' ? 'bg-primary text-white shadow-[3px_3px_0_0_rgba(25,26,35,1)]' : 'bg-white text-dark'
                        }`}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => prev ? ({ ...prev, status: 'Sold' }) : null)}
                      className={`flex-1 h-12 rounded-xl border-2 border-dark font-bold text-sm transition-all ${formData.status === 'Sold' ? 'bg-red-500 text-white shadow-[3px_3px_0_0_rgba(25,26,35,1)]' : 'bg-white text-dark'
                        }`}
                    >
                      Sold
                    </button>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-sm font-black text-dark ml-2">Book Photos (Max 5)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {/* Existing Images */}
                    {existingImages.map((url, i) => (
                      <div key={`existing-${i}`} className="aspect-square relative group">
                        <img src={url} alt="" className="w-full h-full object-cover rounded-xl border-2 border-dark" />
                        <button 
                          type="button" 
                          onClick={() => removeExistingImage(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {/* New Previews */}
                    {newPreviews.map((url, i) => (
                      <div key={`new-${i}`} className="aspect-square relative group">
                        <img src={url} alt="" className="w-full h-full object-cover rounded-xl border-2 border-primary" />
                        <button 
                          type="button" 
                          onClick={() => removeNewImage(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload Button */}
                    {(existingImages.length + newFiles.length < 5) && (
                      <label className="aspect-square border-2 border-dashed border-dark/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        <Upload size={20} className="text-zinc-400" />
                        <span className="text-[8px] font-black text-zinc-400 uppercase mt-1">Add</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-dark ml-2">Date of Purchase</label>
                  <Input
                    name="purchaseDate"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-16 text-lg gap-2 text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  <Trash2 size={20} /> Delete Listing
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-16 text-lg gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>

            <ConfirmationModal
              isOpen={isDeleteConfirmOpen}
              title="Delete Listing?"
              message="This action cannot be undone. Your book will be removed from the campus marketplace immediately."
              confirmLabel="Yes, Delete"
              variant="danger"
              onConfirm={() => {
                onDelete(formData.id);
                setIsDeleteConfirmOpen(false);
                onClose();
              }}
              onCancel={() => setIsDeleteConfirmOpen(false)}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
