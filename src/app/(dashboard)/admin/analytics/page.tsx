"use client";

import * as React from "react";
import { TrendingUp, Users, Search, Database, Activity } from "lucide-react";

const metrics = [
  { label: "Total_Searches_Today", value: "1,284", change: "+12%", period: "vs yesterday" },
  { label: "Active_Users_24h", value: "89", change: "+5%", period: "vs yesterday" },
  { label: "Avg_Response_Time", value: "1.4s", change: "-8%", period: "improvement" },
  { label: "API_Calls_Today", value: "3,201", change: "+22%", period: "vs yesterday" },
];

const topQueries = [
  { query: "target@corp.com", type: "EMAIL", count: 42 },
  { query: "192.168.1.0/24", type: "IP", count: 31 },
  { query: "admin_root", type: "USERNAME", count: 28 },
  { query: "example.com", type: "DOMAIN", count: 19 },
  { query: "john.doe@test.io", type: "EMAIL", count: 15 },
];

const providerStats = [
  { name: "LeakOSINT", requests: 892, success: 98.2, avgTime: "0.9s" },
  { name: "Snusbase", requests: 456, success: 94.1, avgTime: "1.2s" },
  { name: "LeakCheck", requests: 312, success: 91.8, avgTime: "1.6s" },
];

export default function AdminAnalyticsPage() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <TrendingUp className="w-3 h-3" /> Admin // Analytics
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Platform_Analytics</h1>
        <p className="text-zinc-500 text-sm font-medium">Real-time metrics and intelligence platform performance.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="brutalist-border bg-zinc-950 p-6 space-y-4 animate-pulse">
              <div className="h-2 w-20 bg-zinc-800" />
              <div className="h-8 w-24 bg-zinc-800" />
              <div className="h-2 w-16 bg-zinc-900" />
            </div>
          ))
        ) : (
          data?.metrics.map((m: any) => (
            <div key={m.label} className="brutalist-border bg-zinc-950 p-6 space-y-4 group hover:border-white transition-colors">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{m.label}</p>
              <p className="text-3xl font-black text-white italic tracking-tighter">{m.value}</p>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{m.change}</span>
                <span className="text-[8px] text-zinc-700 uppercase">{m.period}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Queries */}
        <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <Search className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Top_Queries_24h</h2>
          </div>
          <div className="space-y-1">
            {isLoading ? (
              <div className="p-8 text-center animate-pulse">
                <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Processing_Logs...</span>
              </div>
            ) : data?.topQueries.length === 0 ? (
              <div className="p-4 text-center text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_Queries_Found</div>
            ) : (
              data?.topQueries.map((q: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black border border-zinc-900">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-zinc-700 w-6">#{i + 1}</span>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tight font-mono">{q.query}</p>
                      <p className="text-[8px] text-zinc-600 uppercase tracking-widest">{q.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-zinc-500">{q.count}x</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Provider Performance */}
        <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <Database className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Provider_Performance</h2>
          </div>
          <div className="space-y-1">
            {isLoading ? (
              <div className="p-8 text-center animate-pulse">
                <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Awaiting_Sync...</span>
              </div>
            ) : (
              data?.providerStats.map((p: any) => (
                <div key={p.name} className="p-4 bg-black border border-zinc-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.name}</span>
                    <span className="text-[9px] font-mono text-zinc-500">{p.requests} req</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] text-zinc-700 uppercase tracking-widest">Success_Rate</p>
                      <p className="text-sm font-black text-white">{p.success}%</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-zinc-700 uppercase tracking-widest">Avg_Response</p>
                      <p className="text-sm font-black text-white">{p.avgTime}</p>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-zinc-900">
                    <div className="h-full bg-white" style={{ width: `${p.success}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
