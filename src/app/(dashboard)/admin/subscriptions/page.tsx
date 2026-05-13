"use client";

import * as React from "react";
import { CreditCard, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const subs = [
  { user: "marina_k", email: "marina@osint.io", plan: "PREMIUM", status: "ACTIVE", since: "May 12, 2024", amount: "$29.99/mo" },
  { user: "shadow_01", email: "alex@proton.me", plan: "FREE", status: "ACTIVE", since: "May 08, 2024", amount: "$0" },
  { user: "intel_pro", email: "sarah@intel.co", plan: "PREMIUM", status: "ACTIVE", since: "April 28, 2024", amount: "$29.99/mo" },
  { user: "jotaaa", email: "jotadeeloperz@proton.me", plan: "SUPERADMIN", status: "ACTIVE", since: "May 01, 2024", amount: "—" },
];

export default function AdminSubscriptionsPage() {
  const [subList, setSubList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/admin/subscriptions');
      const data = await res.json();
      if (data.success) setSubList(data.data);
    } catch (error) {
      console.error('Failed to fetch subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <CreditCard className="w-3 h-3" /> Admin // Subscriptions
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Subscription_Management</h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <Input placeholder="Search by user or email..." className="pl-10 bg-black border-zinc-800 rounded-none h-10 text-white" />
        </div>
        <Button variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest">
          <Filter className="w-3 h-3 mr-2" /> Filter
        </Button>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-6 gap-4 px-4 py-2 text-[8px] font-black uppercase tracking-widest text-zinc-700">
          <span>User</span><span>Email</span><span>Plan</span><span>Status</span><span>Since</span><span>Amount</span>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center brutalist-border bg-zinc-950 animate-pulse">
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Fetching_Subscriptions...</span>
          </div>
        ) : subList.length === 0 ? (
          <div className="p-8 text-center brutalist-border bg-zinc-950">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_Subscriptions_Found</p>
          </div>
        ) : (
          subList.map((s, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 px-4 py-4 bg-black border border-zinc-900 hover:bg-zinc-900/30 transition-colors items-center group">
              <span className="text-[10px] font-black text-white uppercase tracking-tight">@{s.user}</span>
              <span className="text-[9px] text-zinc-500 font-mono truncate">{s.email}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${s.plan === 'FREE' ? 'text-zinc-600' : 'text-white'}`}>{s.plan}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{s.status}</span>
              <span className="text-[9px] text-zinc-600">{s.since}</span>
              <span className="text-[10px] font-black text-white">{s.amount}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
