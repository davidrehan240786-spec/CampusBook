// coderabbit full review trigger

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button, Input, Select, cn } from '../components/UI';
import { Upload, BookOpen, School, Tag, ChevronDown, Loader2 } from 'lucide-react';
import { BOOK_CATEGORIES, CAMPUSES } from '../constants';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getToken } from '../lib/auth';
import { uploadImages } from '../lib/upload';
import { X } from 'lucide-react';

export const SellBooksPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const currentUser = getCurrentUser();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [otherCampusName, setOtherCampusName] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    purchaseDate: '',
    description: '',
    image_url: '' // Will store the first image URL for backward compatibility
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || (!selectedCampus && !otherCampusName) || !selectedCondition) {
      showToast('Please fill all fields, including category, campus, and condition', 'error');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        showToast('Maximum 5 images allowed', 'error');
        return;
      }

      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirmAdd = async () => {
    setIsConfirmOpen(false);
    setIsLoading(true);

    try {
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        console.log("Starting image uploads for", selectedFiles.length, "files...");
        imageUrls = await uploadImages(selectedFiles);
        console.log("All images uploaded. URLs:", imageUrls);
      }

      console.log("Sending book data to backend...");
      const response = await fetch('/add-book', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrls.length > 0 ? imageUrls[0] : null,
          images: imageUrls.length > 0 ? imageUrls : null,
          campus: selectedCampus === 'Other' ? otherCampusName : selectedCampus,
          category: selectedCategory,
          condition: selectedCondition,
          seller_id: currentUser.id,
          seller_name: getFullName(currentUser)
        })
      });

      const data = await response.json();
      console.log("Backend response:", data);
      if (data.success) {
        showToast('Book listing posted successfully!', 'success');
        navigate('/marketplace');
      } else {
        showToast(data.message || 'Failed to post listing', 'error');
      }
    } catch (error: any) {
      console.error("FULL ERROR DETAILS:", error);
      showToast(error.message || 'Error uploading images or connecting to backend', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-dark mb-4 tracking-tighter">Sell Your Book</h2>
        <p className="text-xl text-zinc-500 font-medium max-w-2xl">Fill out the details below to list your book on the marketplace. Use clear photos to sell faster!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 positivus-card-green relative overflow-hidden"
        >
          <form className="space-y-10 relative z-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-black text-dark ml-2">Book Title</label>
                <Input name="title" value={formData.title} onChange={handleChange} placeholder="Enter book title" required className="h-14" />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-black text-dark ml-2">Author</label>
                <Input name="author" value={formData.author} onChange={handleChange} placeholder="Enter author name" required className="h-14" />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-black text-dark ml-2">Price (₹)</label>
                <Input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0.00" required className="h-14" />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-black text-dark ml-2">Select Campus</label>
                <div className="relative">
                  <Select 
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    required
                    className="h-14 pr-12"
                  >
                    <option value="" disabled>Choose your college...</option>
                    {CAMPUSES.map(campus => (
                      <option key={campus.short} value={campus.short}>{campus.full}</option>
                    ))}
                  </Select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dark" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-lg font-black text-dark ml-2">Date of Purchase</label>
                <Input 
                  name="purchaseDate"
                  type="date" 
                  max={new Date().toISOString().split('T')[0]} 
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required 
                  className="h-14" 
                />
              </div>

              {selectedCampus === 'Other' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 md:col-span-2"
                >
                  <label className="text-lg font-black text-dark ml-2">Enter College Name</label>
                  <Input 
                    placeholder="Enter your custom college/campus name" 
                    required 
                    value={otherCampusName}
                    onChange={(e) => setOtherCampusName(e.target.value)}
                    className="h-14 bg-white" 
                  />
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-lg font-black text-dark ml-2">Category</label>
              <div className="flex flex-wrap gap-3">
                {BOOK_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-6 py-3 rounded-xl border-2 border-dark font-bold text-xs transition-all shadow-[3px_3px_0_0_rgba(25,26,35,1)] active:translate-y-[1px] active:shadow-none",
                      selectedCategory === cat ? "bg-primary text-white" : "bg-white text-dark hover:bg-secondary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-black text-dark ml-2">Condition</label>
              <div className="flex flex-wrap gap-4">
                {['New', 'Like New', 'Good', 'Fair'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setSelectedCondition(cond)}
                    className={cn(
                      "px-8 py-4 rounded-2xl border-2 border-dark font-bold text-sm bg-white hover:bg-dark hover:text-white transition-all shadow-[4px_4px_0_0_rgba(25,26,35,1)] active:translate-y-[2px] active:shadow-none",
                      selectedCondition === cond ? "bg-dark text-white" : "bg-white text-dark"
                    )}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-black text-dark ml-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-[30px] border-2 border-dark bg-white px-8 py-6 text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-secondary/30 min-h-[180px]"
                placeholder="Tell us more about the book... (e.g. edition, highlights, or any marks)"
              />
            </div>

            <div className="pt-6">
              <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-[20px] text-xl bg-dark text-white hover:bg-dark/90 shadow-[6px_6px_0_0_#778667]">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {isLoading ? 'Posting...' : 'Post Marketplace Listing'}
              </Button>
            </div>
          </form>

          {/* Decorative background icon */}
          <BookOpen size={300} className="absolute -right-20 -bottom-20 text-dark/5 pointer-events-none" />
        </motion.div>

        <ConfirmationModal 
          isOpen={isConfirmOpen}
          title="Post Listing?"
          message="Your book will be visible to all students on your campus. Please ensure the price and condition are accurate."
          confirmLabel="Yes, Post Now"
          onConfirm={handleConfirmAdd}
          onCancel={() => setIsConfirmOpen(false)}
        />

        {/* Sidebar / Image Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="positivus-card p-8 space-y-6">
            <h3 className="text-2xl font-black text-dark">Book Photos</h3>
            <label className="aspect-square border-4 border-dashed border-dark/10 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={selectedFiles.length >= 5}
              />
              <div className="w-20 h-20 bg-dark/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Upload size={40} className="text-dark group-hover:text-primary" />
              </div>
              <div className="text-center">
                <p className="text-dark font-bold">Drop your images here</p>
                <p className="text-dark/40 text-sm font-bold">Max 5 photos (JPG, PNG)</p>
              </div>
            </label>
            
            <div className="grid grid-cols-3 gap-3">
              {previews.map((url, i) => (
                <div key={i} className="aspect-square relative group">
                  <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover rounded-2xl border-2 border-dark shadow-[2px_2px_0_0_rgba(25,26,35,1)]" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 3 - previews.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square bg-dark/5 border-2 border-dark/10 rounded-2xl flex items-center justify-center text-dark/20">
                  <Tag size={24} />
                </div>
              ))}
            </div>
          </div>

          <div className="positivus-card p-8 bg-secondary border-2 border-dark">
            <h3 className="text-xl font-black text-dark mb-4">Selling Tips</h3>
            <ul className="space-y-4">
              {[
                'Take photos in good lighting',
                'Mention if there is highlighting',
                'Be clear about the pickup spot',
                'Respond quickly to messages'
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 font-bold text-sm text-dark/70">
                  <div className="w-5 h-5 bg-dark rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[10px]">{idx + 1}</span>
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
