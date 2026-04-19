import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_ACTIVITY } from '../constants';
import { Badge, Button, cn } from '../components/UI';
import { Clock, CheckCircle2, ArrowUpRight, ArrowDownLeft, ShoppingCart, Loader2 } from 'lucide-react';
import { getCurrentUser, getToken } from '../lib/auth';
import { useToast } from '../components/Toast';


export const ActivityPage = () => {
  const currentUser = getCurrentUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'sent' | 'received' | 'sold'>('sent');
  const [activity, setActivity] = useState<any>({ sent: [], received: [], sold: [] });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      console.log("TOKEN:", getToken());
      const response = await fetch(`/requests/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActivity(data);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(`Request ${newStatus.toLowerCase()}!`, 'success');
        // Instantly update UI without refetching all
        setActivity((prev: any) => ({
          ...prev,
          received: prev.received.map((req: any) => 
            req.id === id ? { ...req, status: newStatus } : req
          )
        }));
      } else {
        showToast(data.message || 'Failed to update request', 'error');
      }
    } catch (error) {
      showToast('Error updating request status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (currentUser.id) fetchActivity();
  }, [currentUser.id]);

  const tabs = [
    { id: 'sent', label: 'Requests Sent', icon: ArrowUpRight },
    { id: 'received', label: 'Requests Received', icon: ArrowDownLeft },
    { id: 'sold', label: 'Sold Books', icon: ShoppingCart },
  ];

  const currentData = activity[activeTab] || [];

  return (
    <div className="p-10">
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-dark mb-2">Activity Tracker</h2>
        <p className="text-zinc-500 font-medium">Monitor your active requests and sales history.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-dark font-bold transition-all shadow-[4px_4px_0_0_rgba(25,26,35,1)] active:translate-y-[2px] active:shadow-none",
                activeTab === tab.id 
                  ? "bg-secondary text-dark" 
                  : "bg-white text-zinc-500 hover:bg-zinc-50"
              )}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="grid grid-cols-1 gap-8"
        >
          {loading ? (
             <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : currentData.length === 0 ? (
             <div className="text-center py-20 positivus-card bg-zinc-50 border-dashed">
                <p className="font-bold text-zinc-500">No activity to show in this category.</p>
             </div>
          ) : (
            currentData.map((item: any) => (
              <div key={item.id} className={cn(
                "positivus-card flex items-center justify-between",
                activeTab === 'received' && "positivus-card-green",
                activeTab === 'sold' && "positivus-card-dark"
              )}>
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-secondary border-2 border-dark rounded-[25px] flex items-center justify-center text-dark min-w-[5rem]">
                    {activeTab === 'sent' && <Clock size={36} />}
                    {activeTab === 'received' && <CheckCircle2 size={36} />}
                    {activeTab === 'sold' && <ShoppingCart size={36} className="text-dark" />}
                  </div>
                  <div>
                    <h4 className={cn("text-xl md:text-2xl font-black mb-1", activeTab === 'sold' ? "text-white" : "text-dark")}>
                      {activeTab === 'received' ? `${item.user} wants "${item.book}"` : item.book}
                    </h4>
                    <p className={cn("font-bold", activeTab === 'sold' ? "text-zinc-400" : "text-zinc-500")}>
                      {activeTab === 'sold' ? `Sold for ₹${item.price} on ${item.date}` : `Requested on ${item.date}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  {activeTab === 'received' && item.status === 'Pending' && (
                    <>
                      <Button 
                        className="bg-dark text-white rounded-xl"
                        disabled={updatingId === item.id}
                        onClick={() => handleUpdateStatus(item.id, 'Accepted')}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        className="bg-white rounded-xl"
                        disabled={updatingId === item.id}
                        onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {activeTab === 'received' && item.status !== 'Pending' && (
                    <Badge variant={item.status === 'Accepted' ? 'available' : 'sold'}>
                      {item.status}
                    </Badge>
                  )}
                  {activeTab !== 'received' && (
                    <Badge variant={item.status === 'Accepted' || activeTab === 'sold' ? 'available' : 'sold'}>
                      {activeTab === 'sold' ? 'Completed' : item.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
