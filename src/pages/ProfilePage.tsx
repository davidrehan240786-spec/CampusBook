// coderabbit full review trigger

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button, Input, Badge, cn } from '../components/UI';
import { DUMMY_BOOKS } from '../constants';
import { User, Mail, School, Shield, LogOut, Edit2, RefreshCw } from 'lucide-react';
import { EditListingModal } from '../components/EditListingModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/Toast';

import { getCurrentUser, logout } from '../lib/auth';

export const ProfilePage = () => {
  const { showToast } = useToast();
  const user = getCurrentUser();
  const isAdmin = user.role === 'admin';
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);

  const handleSaveUpdates = () => {
    showToast('Profile updated successfully!', 'success');
    setIsSaveConfirmOpen(false);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-dark mb-2">{isAdmin ? 'Admin Console' : 'User Profile'}</h2>
          <p className="text-zinc-500 font-medium">Manage your campus identity and account preferences.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={logout}
          className="text-red-500 border-red-200 hover:bg-red-50 h-14 px-8 rounded-2xl gap-2 font-black transition-all hover:border-red-500 shadow-[4px_4px_0_0_rgba(239,68,68,0.1)] active:translate-y-[2px] active:shadow-none"
        >
          <LogOut size={20} /> Logout Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="positivus-card text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full bg-secondary border-2 border-dark rounded-[35px] flex items-center justify-center text-dark text-2xl md:text-3xl font-black shadow-[6px_6px_0_0_rgba(25,26,35,1)]">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border-2 border-dark rounded-xl flex items-center justify-center text-dark hover:bg-secondary shadow-[3px_3px_0_0_rgba(25,26,35,1)] transition-all">
                <Edit2 size={16} />
              </button>
            </div>
            <h3 className="text-2xl font-black text-dark">{user.name}</h3>
            <p className="font-bold text-primary mt-1">{isAdmin ? 'System Administrator' : 'Computer Science Major'}</p>
            
            <div className="flex justify-center gap-8 py-8 mt-6 border-t-2 border-dark border-dashed">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-black text-dark">{isAdmin ? '842' : '12'}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{isAdmin ? 'Total Trans.' : 'Books Sold'}</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-black text-dark">{isAdmin ? '24/7' : '4.9'}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{isAdmin ? 'Support' : 'Rating'}</p>
              </div>
            </div>
          </motion.div>

          <div className="positivus-card-green space-y-6">
            <h4 className="text-xl font-black text-dark">Quick Info</h4>
            <div className="space-y-4">
              {[
                { icon: Mail, text: isAdmin ? 'admin@campusbook.com' : 'rehanbusters@gmail.com' },
                { icon: School, text: `${user.campus} Campus` },
                { icon: Shield, text: isAdmin ? 'Full Admin Access' : 'Campus Student ID' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 font-bold text-sm text-dark/70">
                  <div className="w-8 h-8 bg-white border-2 border-dark rounded-lg flex items-center justify-center">
                    <item.icon size={16} />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-10">
          <div className="positivus-card">
            <h4 className="text-lg md:text-xl font-black text-dark mb-8">Personal Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-dark ml-2">Display Name</label>
                <Input defaultValue={user.name} />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-dark ml-2">Account ID</label>
                <Input defaultValue={isAdmin ? 'ADMIN-001' : '20240981'} readOnly />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-dark ml-2">Mobile Number</label>
                <Input defaultValue={(user as any).phone} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-black text-dark ml-2">{isAdmin ? 'Admin Notes' : 'Short Bio'}</label>
                <textarea 
                  className="w-full rounded-[25px] border-2 border-dark bg-white px-8 py-6 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-secondary/30 min-h-[120px]"
                  defaultValue={isAdmin ? "System-wide override permissions enabled." : "Final year CS student. Mostly selling textbooks and tech guides."}
                />
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <Button 
                onClick={() => setIsSaveConfirmOpen(true)}
                className="h-14 px-10 rounded-2xl"
              >
                Save Updates
              </Button>
            </div>
          </div>

        </div>
      </div>

      <ConfirmationModal 
        isOpen={isSaveConfirmOpen}
        title="Update Profile?"
        message="Your updated profile information will be visible to other students you interact with on the platform."
        confirmLabel="Save Changes"
        onConfirm={handleSaveUpdates}
        onCancel={() => setIsSaveConfirmOpen(false)}
      />
    </div>
  );
};
