import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { cn, Button } from './UI';
import { Book, Shield, User as UserIcon, LogOut } from 'lucide-react';
import { getCurrentUser, logout } from '../lib/auth';
import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

export const Sidebar = () => {
  const location = useLocation();
  const user = getCurrentUser();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user.id) return;
    const unsubscribe = chatService.subscribeToUserChats(user.id, (chats) => {
      const total = chats.reduce((acc, chat) => acc + (Number(chat.unreadCount?.[user.id]) || 0), 0);
      setTotalUnread(total);
    });
    return unsubscribe;
  }, [user.id]);

  const filteredNav = NAV_ITEMS.filter(item => 
    !item.roles || item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r-2 border-dark bg-white p-8 flex flex-col gap-8 z-50">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary border-2 border-dark rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
          <Book size={28} />
        </div>
        <span className="font-black text-2xl tracking-tighter text-dark hover:text-primary transition-colors">CampusBook</span>
      </Link>

      <nav className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isChat = item.label === 'Chatbox';
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border-2 transition-all font-bold group",
                isActive 
                  ? "bg-secondary border-dark shadow-[4px_4px_0_0_rgba(25,26,35,1)] translate-x-1" 
                  : "border-transparent text-zinc-500 hover:border-dark hover:bg-zinc-50 hover:text-dark"
              )}
            >
              <div className="flex items-center gap-4">
                <Icon size={20} className={cn(isActive ? "text-dark" : "text-zinc-400 group-hover:text-dark")} />
                <span className="text-sm">{item.label}</span>
              </div>
              
              {isChat && totalUnread > 0 && (
                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-dark shadow-[2px_2px_0_0_rgba(25,26,35,1)]">
                  {totalUnread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <div className="p-5 bg-secondary/10 border-2 border-dark border-dashed rounded-[30px]">
          <div className="flex items-center gap-2 mb-2">
            {user.role === 'admin' ? <Shield size={14} className="text-primary" /> : <UserIcon size={14} className="text-zinc-400" />}
            <p className="text-[10px] font-black uppercase tracking-widest text-dark">{user.role} View</p>
          </div>
          <p className="text-xs font-bold truncate">{user.role === 'admin' ? 'admin@campusbook.com' : 'rehan@campus.edu'}</p>
        </div>
      </div>
    </aside>
  );
};

import { User, Bell } from 'lucide-react';
import { Input } from './UI';

export const TopBar = ({ title }: { title: string }) => {
  return (
    <header className="h-24 border-b-2 border-dark bg-white sticky top-0 z-40 px-10 flex items-center justify-between">
      <h1 className="text-3xl font-black tracking-tight text-dark">{title}</h1>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-5">
          <button className="w-12 h-12 border-2 border-dark rounded-2xl flex items-center justify-center text-dark hover:bg-secondary transition-all shadow-[3px_3px_0_0_rgba(25,26,35,1)] active:translate-y-[2px] active:shadow-none">
            <Bell size={22} />
          </button>
          <Link to="/settings" className="w-12 h-12 border-2 border-dark rounded-2xl bg-primary flex items-center justify-center text-white shadow-[3px_3px_0_0_rgba(25,26,35,1)] active:translate-y-[2px] active:shadow-none">
            <User size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
};
