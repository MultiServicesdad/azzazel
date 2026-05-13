"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Search, Database, Activity, ArrowRight, 
  Clock, Zap, ChevronRight, Bookmark, Key,
  TrendingUp, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [searches, setSearches] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState({ searchesUsed: 0, dailyLimit: 3, savedCount: 0 });

  React.useEffect(() => {
    // Fetch user's own recent searches
    const fetchData = async () => {
      try {
        const res = await fetch('/api/search?limit=5');
        if (res.ok) {
          const data = await res.json();
          setSearches(data.data || []);
        }
      } catch (e) { /* silently fail */ }
    };
    fetchData();
  }, []);

  const isPremium = user?.role === 'PREMIUM' || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const dailyLimit = isPremium ? 100 : 3;

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <div className="w-2 h-2 bg-white" />
          Intelligence_Dashboard // {user?.role || 'FREE'}
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">
            Welcome, {user?.username}
          </h1>
          <Link href="/search">
            <Button className="bg-white hover:bg-zinc-200 text-black text-[10px] font-black uppercase tracking-widest px-8 h-12 rounded-none">
              New_Search <ArrowRight className="ml-3 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Searches_Today", value: String(stats.searchesUsed), sub: `/ ${dailyLimit}`, icon: Search },
          { label: "Clearance", value: isPremium ? "PREMIUM" : "FREE", sub: null, icon: Shield },
          { label: "Intel_Records", value: "14.2B+", sub: "indexed", icon: Database },
          { label: "Saved_Results", value: String(stats.savedCount), sub: null, icon: Bookmark },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="brutalist-border bg-zinc-950 p-6 space-y-4 group hover:border-white transition-colors"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
              {stat.sub && (
                <span className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">{stat.sub}</span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</p>
              <p className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Searches - USER'S OWN ONLY */}
        <div className="lg:col-span-2 brutalist-border bg-zinc-950 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white flex items-center justify-center">
                <Clock className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Your_Recent_Queries</h2>
            </div>
            <Link href="/saved">
              <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white rounded-none">
                View_All
              </Button>
            </Link>
          </div>

          <div className="space-y-1">
            {searches.length === 0 ? (
              <div className="p-8 text-center space-y-4">
                <Search className="w-8 h-8 text-zinc-800 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No_Queries_Yet</p>
                <p className="text-[9px] text-zinc-600 uppercase">Execute your first intelligence search to populate this feed.</p>
              </div>
            ) : (
              searches.slice(0, 5).map((search: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black border border-zinc-900 group hover:bg-zinc-900/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-white opacity-20" />
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tight">{search.query}</p>
                      <p className="text-[9px] font-bold text-zinc-600 font-mono italic">{search.type} • {new Date(search.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{search.resultsCount || 0} hits</span>
                    <ChevronRight className="w-3 h-3 text-zinc-700" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Status + Quick Actions */}
        <div className="space-y-8">
          <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white flex items-center justify-center">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">System_Status</h2>
            </div>

            <div className="space-y-4">
              {[
                { name: "LeakOSINT", status: "ONLINE" },
                { name: "Snusbase", status: "ONLINE" },
                { name: "LeakCheck", status: "ONLINE" },
              ].map((provider) => (
                <div key={provider.name} className="flex items-center justify-between p-3 border border-zinc-900 bg-black">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{provider.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{provider.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API CTA */}
          <div className="bg-white p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-black uppercase italic tracking-tighter">Institutional_API</h3>
              <p className="text-[9px] text-black/60 uppercase font-bold tracking-widest leading-relaxed">
                Integrate Azazel intelligence into your platform. Programmatic access to all search capabilities.
              </p>
            </div>
            <Link href="/api-keys">
              <Button className="w-full bg-black text-white hover:bg-zinc-900 font-black uppercase text-[10px] tracking-widest h-12 rounded-none">
                Get_API_Credentials
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
