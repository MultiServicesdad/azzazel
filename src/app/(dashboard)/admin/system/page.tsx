"use client";

import * as React from "react";
import { Server, Cpu, HardDrive, Clock, RefreshCw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSystemPage() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchSystemData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/system');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) {
      console.error('Failed to fetch system data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchSystemData();
  }, []);

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <Server className="w-3 h-3" /> Admin // System
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">System_Health</h1>
          <Button onClick={fetchSystemData} variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest hover:border-white hover:text-white">
            <RefreshCw className={`w-3 h-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> {isRefreshing ? 'Syncing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "CPU_Usage", value: data?.cpuUsage || "...", icon: Cpu, bar: parseInt(data?.cpuUsage) || 0 },
          { label: "Memory", value: data?.memoryUsage || "...", icon: Server, bar: 30 },
          { label: "Disk_Usage", value: data?.diskUsage || "...", icon: HardDrive, bar: 24 },
          { label: "Uptime", value: data?.uptime || "...", icon: Clock, bar: 100 },
        ].map((m) => (
          <div key={m.label} className="brutalist-border bg-zinc-950 p-6 space-y-4 group hover:border-white transition-colors">
            <m.icon className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{m.label}</p>
            <p className="text-2xl font-black text-white italic tracking-tighter">{m.value}</p>
            <div className="w-full h-1 bg-zinc-900">
              <div className="h-full bg-white transition-all" style={{ width: `${m.bar}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white">Service_Status</h2>
        <div className="space-y-1">
          {isLoading ? (
            <div className="p-8 text-center animate-pulse">
              <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Awaiting_Response...</span>
            </div>
          ) : (
            data?.services.map((s: any) => (
              <div key={s.name} className="flex items-center justify-between p-4 bg-black border border-zinc-900 hover:bg-zinc-900/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-white group-hover:animate-pulse" />
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{s.name}</p>
                    <p className="text-[8px] text-zinc-700 font-mono">v{s.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[8px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">:{s.port}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{s.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Environment */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white">Environment_Config</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {[
            { key: "NODE_ENV", val: "production" },
            { key: "DATABASE_URL", val: "postgresql://****" },
            { key: "REDIS_URL", val: "redis://****:6379" },
            { key: "JWT_SECRET", val: "••••••••••••" },
            { key: "SNUSBASE_API_KEY", val: "sb_live_••••" },
            { key: "LEAKCHECK_API_KEY", val: "lc_••••" },
          ].map((e) => (
            <div key={e.key} className="flex items-center justify-between p-3 bg-black border border-zinc-900">
              <span className="text-[9px] font-mono font-bold text-zinc-500">{e.key}</span>
              <span className="text-[9px] font-mono text-zinc-700">{e.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
