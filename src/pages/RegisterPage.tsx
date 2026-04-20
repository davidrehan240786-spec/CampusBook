// coderabbit full review trigger

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button, Input, cn } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import { Book, User as UserIcon, GraduationCap, School, Mail, Lock, ShieldCheck, Phone, Loader2 } from 'lucide-react';
import { setUserRole } from '../lib/auth';
import { useToast } from '../components/Toast';
import { CAMPUSES } from '../constants';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    campus: 'KLE',
    usn: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (data.success) {
        showToast("Account created successfully! Please login.", 'success');
        navigate('/login');
      } else {
        showToast(data.message || "Registration failed", 'error');
      }
    } catch (error) {
      showToast("Error connecting to backend", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-0"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl positivus-card relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-secondary border-2 border-dark rounded-[20px] flex items-center justify-center text-dark shadow-[4px_4px_0_0_rgba(25,26,35,1)] mb-6">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-dark text-center leading-tight">
            Create Student <br />
            <span className="bg-primary px-2 rounded-xl text-white">Account</span>
          </h2>
          <p className="font-bold text-zinc-500 mt-4 text-center max-w-md">
            The exclusive platform for students to buy, sell, and trade books within their campus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-dark ml-2 flex items-center gap-2">
                <UserIcon size={16} /> First Name
              </label>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required className="h-14 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-dark ml-2 flex items-center gap-2">
                <UserIcon size={16} /> Last Name
              </label>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required className="h-14 font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-dark ml-2 flex items-center gap-2">
                <GraduationCap size={16} /> USN / Student ID
                <span className="text-zinc-400 font-bold ml-auto text-[10px] uppercase tracking-wider">(Optional)</span>
              </label>
              <Input name="usn" value={formData.usn} onChange={handleChange} placeholder="4SJ21CS001" className="h-14 font-bold uppercase" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-dark ml-2 flex items-center gap-2">
                <School size={16} /> Campus Name
              </label>
              <div className="relative">
                <select 
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  className="w-full h-14 bg-white border-2 border-dark rounded-2xl px-6 font-bold shadow-[4px_4px_0_0_rgba(25,26,35,1)] focus:outline-none appearance-none"
                >
                  {CAMPUSES.map(campus => (
                    <option key={campus.short} value={campus.short}>{campus.full}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <School size={18} className="text-zinc-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-dark ml-2 flex items-center gap-2">
              <Mail size={16} /> Email
            </label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required className="h-14 font-bold" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-dark ml-2 flex items-center gap-2">
              <Phone size={16} /> Mobile Number
            </label>
            <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required className="h-14 font-bold" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-dark ml-2 flex items-center gap-2">
              <Lock size={16} /> Create Password
            </label>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="h-14 font-bold" />
          </div>

          <div className="flex items-start gap-3 p-4 bg-background border-2 border-dark rounded-2xl mt-8">
            <ShieldCheck className="text-primary flex-shrink-0" size={24} />
            <p className="text-xs font-bold text-zinc-600 leading-relaxed">
              By creating an account, you agree to comply with our campus-conduct policies and ensure safe meet-ups within college premises.
            </p>
          </div>

          <div className="pt-6">
            <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-[20px] text-xl bg-dark text-white hover:bg-dark/90 shadow-[6px_6px_0_0_#778667] transition-all flex items-center justify-center gap-3 group">
              {isLoading ? 'Registering...' : 'Register Account'}
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-dark group-hover:scale-110 transition-transform">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Book size={16} />}
              </div>
            </Button>
          </div>
        </form>

        <div className="mt-10 text-center flex flex-col items-center gap-3">
          <p className="font-bold text-zinc-500">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
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
