import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Trash2, Mail, School, FileText, Phone } from 'lucide-react';
import { Button, Badge } from '../components/UI';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/Toast';
import { getToken } from '../lib/auth';

export const AdminUsersPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

 const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/admin/users', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    console.log("Admin Users Data:", data);
    if (Array.isArray(data)) {
      setUsers(data);
    } else {
      showToast('Failed to load users', 'error');
    }
  } catch (error) {
    showToast('Error connecting to backend', 'error');
  } finally {
    setIsLoading(false);
  }
};

  const confirmDelete = async () => {
  if (targetUserId) {
    try {
      const response = await fetch(`http://localhost:3000/admin/users/${targetUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== targetUserId));
        showToast('User account successfully removed.', 'info');
      } else {
        showToast(data.message || 'Failed to remove user', 'error');
      }
    } catch (error) {
      showToast('Error connecting to backend', 'error');
    } finally {
      setIsDeleteConfirmOpen(false);
      setTargetUserId(null);
    }
  }
};

  const handleDeleteClick = (id: string) => {
    setTargetUserId(id);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-secondary border-2 border-dark rounded-2xl flex items-center justify-center text-dark shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-dark tracking-tight">User Management</h2>
            <p className="text-zinc-500 font-medium">Manage and monitor student accounts across all campuses.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <p className="text-zinc-500 font-medium">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-zinc-500 font-medium">No users found.</p>
        ) : users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="positivus-card flex items-center justify-between gap-8 p-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white border-2 border-dark rounded-[20px] flex items-center justify-center text-2xl font-black shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
                {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl md:text-2xl font-black text-dark">{user.name}</h3>
                  <Badge variant={user.role === 'admin' ? 'sold' : 'available'}>
                    {user.role?.toUpperCase()}
                  </Badge>
                  {user.usn && (
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded-md border border-dark/5">
                      ID: {user.usn}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-zinc-500 font-bold text-sm">
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} className="text-primary" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <School size={14} className="text-secondary" /> {user.campus}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-lg text-dark">
                    <Phone size={14} className="text-primary" /> {user.phone || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user.role !== 'admin' && (
                <Button
                  variant="outline"
                  className="h-12 w-12 p-0 rounded-xl text-red-500 border-red-200 hover:bg-red-50 shadow-[3px_3px_0_0_rgba(25,26,35,1)]"
                  onClick={() => handleDeleteClick(user.id)}
                >
                  <Trash2 size={18} />
                </Button>
              )}
              <Button variant="outline" className="h-12 px-6 rounded-xl hidden sm:flex items-center gap-2">
                <FileText size={18} /> View Docs
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Remove User Account?"
        message="This will permanently revoke this student's access to the campus marketplace. All their active listings will also be hidden."
        confirmLabel="Yes, Remove Account"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

// ADD THIS LINE TO FIX THE BLANK PAGE ISSUE:
export default AdminUsersPage;
