"use client";

import * as React from "react";
import { Bell, Check, CheckCheck, Loader2, Trash2, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) setNotifications(data.data || []);
    } catch { /* silently fail */ }
    finally { setIsLoading(false); }
  };

  React.useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH', body: JSON.stringify({ action: 'markAllRead' }) });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed to update'); }
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <div className="w-2 h-2 bg-white" />
          System_Alerts
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Notifications</h1>
            {unread > 0 && (
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">{unread} Unread</p>
            )}
          </div>
          {notifications.length > 0 && (
            <Button 
              onClick={markAllRead}
              variant="outline" 
              className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest hover:border-white hover:text-white"
            >
              <CheckCheck className="w-3 h-3 mr-2" /> Mark_All_Read
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 text-zinc-700 mx-auto animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mt-4">Loading...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <BellOff className="w-10 h-10 text-zinc-800 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No_Notifications</p>
          <p className="text-[9px] text-zinc-600 uppercase">System alerts and updates will appear here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n: any) => (
            <div 
              key={n.id} 
              className={`brutalist-border p-6 hover:border-white transition-colors group ${
                n.read ? 'bg-zinc-950' : 'bg-zinc-950 border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 mt-1.5 shrink-0 ${n.read ? 'bg-zinc-800' : 'bg-white'}`} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{n.title}</p>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wide">{n.message}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">{n.type}</span>
                      <span className="text-[8px] text-zinc-700">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
