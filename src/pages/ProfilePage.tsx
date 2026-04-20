// coderabbit full review trigger

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button, Input, Badge, cn } from '../components/UI';
import { DUMMY_BOOKS } from '../constants';
import { User, Mail, School, Shield, LogOut, Edit2, RefreshCw } from 'lucide-react';
import { EditListingModal } from '../components/EditListingModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/Toast';

import { getToken, getCurrentUser, logout, getFullName } from '../lib/auth';
import { CAMPUSES } from '../constants';

export const ProfilePage = () => {
  const { showToast } = useToast();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === 'admin';
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    campus: ''
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user-profile', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Profile fetch failed:", res.status, text);
        showToast('Failed to load profile', 'error');
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Profile data:", data);
      if (data.success) {
        setProfile(data.user);
        setFormData({
          firstName: data.user.first_name || data.user.name?.split(' ')[0] || '',
          lastName: data.user.last_name || data.user.name?.split(' ').slice(1).join(' ') || '',
          phone: data.user.phone || '',
          campus: data.user.campus || ''
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveUpdates = async () => {
    // Validation
    if (!formData.firstName.trim()) {
      showToast('First name cannot be empty', 'error');
      return;
    }
    
    // Allow empty phone or validate format
    if (formData.phone) {
      const phoneRegex = /^\+91\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        showToast('Phone must be in +91XXXXXXXXXX format', 'error');
        return;
      }
    }

    try {
      const res = await fetch('/api/user-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Profile updated successfully!', 'success');
        // Update local storage too if name/campus changed for general UI
        const updatedUser = { 
          ...currentUser, 
          first_name: formData.firstName, 
          last_name: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          campus: formData.campus, 
          phone: formData.phone 
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        fetchProfile();
      } else {
        showToast(data.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    }
    setIsSaveConfirmOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!profile) return null;

  const accountId = isAdmin 
    ? `ADMIN-${profile.id.toString().padStart(3, '0')}` 
    : `USER-${profile.id.toString().padStart(3, '0')}`;

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
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full bg-secondary border-2 border-dark rounded-[25px] flex items-center justify-center text-dark text-xl md:text-2xl font-black shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
                {profile.first_name?.[0]}{profile.last_name?.[0] || profile.name?.[0] || 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-dark rounded-lg flex items-center justify-center text-dark hover:bg-secondary shadow-[2px_2px_0_0_rgba(25,26,35,1)] transition-all">
                <Edit2 size={14} />
              </button>
            </div>
            <h3 className="text-xl font-black text-dark">{getFullName(profile)}</h3>
            <p className="font-bold text-primary text-sm mt-0.5">{isAdmin ? 'System Administrator' : 'Campus Student'}</p>
          </motion.div>
 
          <div className="positivus-card-green space-y-6">
            <h4 className="text-xl font-black text-dark">Quick Info</h4>
            <div className="space-y-4">
              {[
                { icon: Mail, text: profile.email },
                { icon: School, text: `${profile.campus || 'No Campus'} Campus` },
                { icon: Shield, text: isAdmin ? 'Full Admin Access' : `ID: ${profile.usn || 'N/A'}` }
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
                <label className="text-sm font-black text-dark ml-2">First Name</label>
                <Input 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-dark ml-2">Last Name</label>
                <Input 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-dark ml-2">Account ID</label>
                <Input value={accountId} readOnly />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-dark ml-2">Mobile Number</label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91XXXXXXXXXX" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-dark ml-2">Campus</label>
                <select 
                  className="w-full rounded-[25px] border-2 border-dark bg-white px-8 h-16 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-secondary/30"
                  value={formData.campus}
                  onChange={(e) => setFormData({...formData, campus: e.target.value})}
                >
                  <option value="" disabled>Select Campus</option>
                  {CAMPUSES.map(c => (
                    <option key={c.short} value={c.short}>{c.full}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-black text-dark ml-2">Email Address</label>
                <Input value={profile.email} readOnly />
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
