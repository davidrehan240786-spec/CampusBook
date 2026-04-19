// coderabbit full review trigger

import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  ArrowRight, 
  User, 
  ShoppingBag, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  PlusCircle, 
  MessageSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Badge, cn } from '../components/UI';
import { useState, useEffect } from 'react';
import { getToken } from '../lib/auth';

export const AdminActivityPage = () => {
  const [dbStats, setDbStats] = useState({ 
    users: 0, 
    books: 0, 
    sold: 0, 
    pending: 0, 
    accepted: 0, 
    rejected: 0 
  });
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('http://localhost:3000/admin/stats', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        const statsData = await statsRes.json();
        if (statsData.users !== undefined) {
          setDbStats(statsData);
        }

        const logsRes = await fetch('http://localhost:3000/admin/activity', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        const logsData = await logsRes.json();
        if (Array.isArray(logsData)) {
          setActivityLogs(logsData);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Global stats calculation
  const stats = [
    { label: 'Total Users', value: dbStats.users, icon: Users, color: 'bg-primary' },
    { label: 'Total Books', value: dbStats.books, icon: BookOpen, color: 'bg-secondary' },
    { label: 'Books Sold', value: dbStats.sold, icon: CheckCircle2, color: 'bg-green-100' },
    { label: 'Active Requests', value: dbStats.pending, icon: AlertCircle, color: 'bg-orange-100' },
  ];

  const getActivityIcon = (action: string) => {
    if (action.includes('listed')) return { icon: PlusCircle, color: 'text-primary' };
    if (action.includes('request')) return { icon: MessageSquare, color: 'text-secondary' };
    if (action.includes('sold') || action.includes('accept')) return { icon: CheckCircle2, color: 'text-green-500' };
    return { icon: Activity, color: 'text-zinc-500' };
  };

  // Requests overview stats
  const requests = [
    { status: 'Pending', count: dbStats.pending, color: 'bg-orange-100 text-orange-700' },
    { status: 'Accepted', count: dbStats.accepted, color: 'bg-green-100 text-green-700' },
    { status: 'Rejected', count: dbStats.rejected, color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white border-2 border-dark rounded-2xl flex items-center justify-center text-dark shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-dark tracking-tight">Platform Insights</h2>
              <p className="text-zinc-500 font-medium">Global view of campus marketplace dynamics and student activity.</p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="px-4 py-2 border-dashed border-dark/20 text-zinc-400">
          Last Updated: Just Now
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="positivus-card relative overflow-hidden group hover:translate-y-[-4px] transition-all"
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-dark">{stat.value}</p>
              </div>
              <div className={cn("w-12 h-12 rounded-xl border-2 border-dark flex items-center justify-center shadow-[3px_3px_0_0_rgba(25,26,35,1)]", stat.color)}>
                <stat.icon size={20} className="text-dark" />
              </div>
            </div>
            <TrendingUp size={80} className="absolute -right-4 -bottom-4 text-dark/5 group-hover:text-dark/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-black text-dark flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Recent Activity Feed
            </h3>
            <button className="text-xs font-black uppercase text-zinc-400 hover:text-dark transition-colors">View All Logs</button>
          </div>
          
          <div className="space-y-4">
            {activityLogs.length === 0 ? (
                <div className="p-6 bg-white border-2 border-dark border-dashed rounded-[25px] text-center text-zinc-500 font-bold">
                  No recent activity
                </div>
            ) : activityLogs.map((activity, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-6 p-6 bg-white border-2 border-dark rounded-[25px] hover:shadow-[6px_6px_0_0_rgba(25,26,35,1)] transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-zinc-50 border-2 border-dark rounded-xl flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors">
                    <MessageSquare size={20} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-dark leading-tight">
                      {activity.activity}
                    </p>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-zinc-300 group-hover:text-dark group-hover:translate-x-1 transition-all" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-10">
          {/* Requests Overview */}
          <div className="positivus-card space-y-8">
            <h3 className="text-xl font-black text-dark flex items-center gap-2">
              <ShoppingBag size={20} className="text-secondary" />
              Requests Overview
            </h3>
            <div className="space-y-4">
              {requests.map((req, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border-2 border-dark/5 bg-zinc-50/50">
                  <span className="font-bold text-dark">{req.status}</span>
                  <span className={cn("px-4 py-1 rounded-full text-xs font-black border-2 border-dark shadow-[2px_2px_0_0_rgba(25,26,35,1)]", req.color)}>
                    {req.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t-2 border-dark/5">
              <p className="text-xs font-bold text-zinc-400 text-center">Audit trail compliant with campus policy.</p>
            </div>
          </div>

          {/* Listings Pulse */}
          <div className="positivus-card-green space-y-6">
            <h3 className="text-xl font-black text-dark">Listings Pulse</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border-2 border-dark rounded-xl flex items-center justify-center text-primary shadow-[2px_2px_0_0_rgba(25,26,35,1)]">
                  <PlusCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-dark">{dbStats.books} Books</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Total Listings</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border-2 border-dark rounded-xl flex items-center justify-center text-secondary shadow-[2px_2px_0_0_rgba(25,26,35,1)]">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-dark">{dbStats.sold} Books</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Total Sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
