// coderabbit full review trigger

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button, Input, cn } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import { Book, User as UserIcon, Shield } from 'lucide-react';
import { setUserRole, UserRole, getFullName } from '../lib/auth';
import { useToast } from '../components/Toast';

const IS_DEMO_MODE = (import.meta as any).env.VITE_DEMO_MODE === 'true';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [role, setRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Prefill for demo mode
  useEffect(() => {
    if (IS_DEMO_MODE) {
      setEmail('test@example.com');
      setPassword('password123');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      if (data.success) {
        if (role === 'admin' && data.user.role !== 'admin') {
          showToast("Not an admin account", 'error');
          return;
        }

        setUserRole(data.user.role, data.user, data.token);
        showToast(`Welcome back, ${getFullName(data.user)}!`, 'success');

        setTimeout(() => {
          window.location.href = '/marketplace';
        }, 500);
      } else {
        showToast(data.message || 'Invalid credentials', 'error');
      }
    } catch (error) {
      showToast('Connection Refused. Is the backend running?', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl positivus-card"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary border-2 border-dark rounded-[20px] flex items-center justify-center text-white shadow-[4px_4px_0_0_rgba(25,26,35,1)] mb-6">
            <Book size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-dark">Welcome Back</h2>
          <p className="font-bold text-zinc-500 mt-2">Join the campus book community today</p>
        </div>

        <div className="flex p-2 bg-zinc-100 border-2 border-dark rounded-2xl gap-2 mb-10">
          <button 
            type="button"
            onClick={() => setRole('user')}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all",
              role === 'user' ? "bg-white border-2 border-dark shadow-[3px_3px_0_0_rgba(25,26,35,1)] text-dark" : "text-zinc-400"
            )}
          >
            <UserIcon size={20} />
            Student View
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all",
              role === 'admin' ? "bg-white border-2 border-dark shadow-[3px_3px_0_0_rgba(25,26,35,1)] text-dark" : "text-zinc-400"
            )}
          >
            <Shield size={20} />
            Admin Access
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-lg font-black text-dark ml-2">Email</label>
            <Input 
              type="email" 
              placeholder={role === 'admin' ? 'admin@campusbook.com' : 'name@example.com'} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-3">
            <label className="text-lg font-black text-dark ml-2">Secure Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full h-16 rounded-[20px] text-xl bg-dark text-white hover:bg-dark/90 shadow-[6px_6px_0_0_#778667]">
              Sign In as {role === 'admin' ? 'Admin' : 'Student'}
            </Button>
          </div>
        </form>

        <div className="mt-10 text-center flex flex-col items-center gap-3">
          <p className="font-bold text-zinc-500">
            New here? <Link to="/register" className="text-primary hover:underline">Create a student account</Link>
          </p>
          <div className="w-20 h-1 bg-zinc-100 rounded-full"></div>
          <Link to="/" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-dark transition-colors">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

