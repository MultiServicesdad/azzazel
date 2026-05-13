"use client";

import * as React from "react";
import { 
  Users, Search, CreditCard, Activity, 
  TrendingUp, ShieldAlert, FileText, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total_Users", value: "1,284", change: "+12%", icon: Users },
  { label: "Queries_24h", value: "8,421", change: "+5%", icon: Search },
  { label: "Premium_Nodes", value: "432", change: "+8%", icon: CreditCard },
  { label: "API_Uptime", value: "99.98%", change: "Stable", icon: Activity },
];

export default function AdminOverviewPage() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const stats = [
    { label: "Total_Users", value: data?.totalUsers || "...", change: "Nodes", icon: Users },
    { label: "Queries_24h", value: data?.queries24h || "...", change: "Live", icon: Search },
    { label: "Premium_Nodes", value: data?.premiumUsers || "...", change: "Active", icon: CreditCard },
    { label: "API_Uptime", value: data?.apiUptime || "...", change: "Stable", icon: Activity },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <TrendingUp className="w-3 h-3" />
          Intelligence_Control // Overview
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Institutional Dashboard</h1>
        <p className="text-zinc-500 font-medium">Monitoring global asset distribution and system operational status.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className="brutalist-border bg-zinc-950 p-6 space-y-4 group hover:border-white transition-colors">
            <div className="flex items-center justify-between">
              <stat.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
              <span className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">{stat.change}</span>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</p>
              <p className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT SEARCHES */}
        <div className="lg:col-span-2 brutalist-border bg-zinc-950 p-8 space-y-8">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white flex items-center justify-center">
                 <Search className="w-5 h-5 text-black" />
               </div>
               <h2 className="text-sm font-black uppercase tracking-widest text-white">Recent_Operations</h2>
             </div>
             <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white">View_All_Logs</Button>
           </div>

           <div className="space-y-1">
             {isLoading ? (
               <div className="p-12 text-center animate-pulse">
                 <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Awaiting_Sync...</span>
               </div>
             ) : data?.recentSearches.length === 0 ? (
               <div className="p-8 text-center text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_Operations_Logged</div>
             ) : (
               data?.recentSearches.map((log: any, i: number) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-black border border-zinc-900 group hover:bg-zinc-900/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-white opacity-20" />
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-tight">@{log.user}</p>
                        <p className="text-[9px] font-bold text-zinc-600 font-mono italic">{log.query}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${log.status === 'SUCCESS' ? 'text-zinc-500' : 'text-white underline'}`}>{log.status}</span>
                      <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">{getTimeAgo(log.time)}</span>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* SECURITY ALERTS */}
        <div className="brutalist-border bg-black p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Abuse_Monitor</h2>
          </div>

          <div className="space-y-4">
             {[
               { title: "SYSTEM_NOMINAL", desc: "No high-priority threats detected in the last 24h." },
               { title: "RATE_LIMIT_STABLE", desc: "Average system load within expected parameters." },
             ].map((alert, i) => (
               <div key={i} className="p-4 border border-zinc-900 bg-zinc-950 space-y-2">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-white" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-white">{alert.title}</span>
                  </div>
                  <p className="text-[9px] text-zinc-600 font-medium uppercase leading-tight">{alert.desc}</p>
               </div>
             ))}
          </div>

          <Button className="w-full bg-transparent border border-zinc-800 text-zinc-500 hover:border-white hover:text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-none transition-all">
            Open_Security_Console
          </Button>
        </div>
      </div>
    </div>
  );
}

