"use client";

import * as React from "react";
import { Activity, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const providers = [
  { name: "LeakOSINT", endpoint: "leak-lookup.top", status: "ONLINE", calls24h: 892, limit: 5000, latency: "0.9s", enabled: true },
  { name: "Snusbase", endpoint: "api.snusbase.com", status: "ONLINE", calls24h: 456, limit: 3000, latency: "1.2s", enabled: true },
  { name: "LeakCheck", endpoint: "leakcheck.io/api/v2", status: "ONLINE", calls24h: 312, limit: 1000, latency: "1.6s", enabled: true },
];

const recentErrors = [
  { time: "10m ago", provider: "Snusbase", error: "429 Rate Limit Exceeded", endpoint: "/search" },
  { time: "2h ago", provider: "LeakCheck", error: "500 Internal Server Error", endpoint: "/lookup" },
  { time: "6h ago", provider: "Snusbase", error: "Timeout after 10s", endpoint: "/search" },
];

export default function AdminApiMonitorPage() {
  const [flags, setFlags] = React.useState<any[]>([]);
  const [limits, setLimits] = React.useState({ free: 3, premium: 100, keys: 3000 });
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/features');
      const data = await res.json();
      if (data.success) {
        setFlags(data.data.filter((f: any) => f.key.startsWith('API_')));
        
        const free = data.data.find((f: any) => f.key === 'LIMIT_FREE_DAILY')?.metadata?.value || 3;
        const premium = data.data.find((f: any) => f.key === 'LIMIT_PREMIUM_DAILY')?.metadata?.value || 100;
        setLimits(prev => ({ ...prev, free, premium }));
      }
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const toggleFlag = async (key: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/features', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, enabled: !currentStatus }),
      });
      if (res.ok) {
        setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !currentStatus } : f));
      }
    } catch (error) {
      console.error('Failed to toggle flag');
    }
  };

  const saveLimits = async () => {
    try {
      await Promise.all([
        fetch('/api/admin/features', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'LIMIT_FREE_DAILY', metadata: { value: Number(limits.free) } }),
        }),
        fetch('/api/admin/features', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'LIMIT_PREMIUM_DAILY', metadata: { value: Number(limits.premium) } }),
        })
      ]);
      alert('Limits saved successfully');
    } catch (error) {
      console.error('Failed to save limits');
    }
  };

  const getProviderInfo = (key: string) => {
    const name = key.replace('API_', '');
    const found = providers.find(p => p.name.toUpperCase() === name);
    return found || { name, endpoint: 'unknown', status: 'UNKNOWN', calls24h: 0, limit: 0, latency: '0s' };
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <Activity className="w-3 h-3" /> Admin // API_Monitor
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">API_Monitor</h1>
        <p className="text-zinc-500 text-sm font-medium">Monitor external provider health, toggle APIs, and manage rate limits.</p>
      </div>

      {/* Provider Cards */}
      <div className="space-y-1">
        {isLoading ? (
          <div className="p-12 text-center brutalist-border bg-zinc-950 animate-pulse">
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Loading_Status...</span>
          </div>
        ) : flags.length === 0 ? (
          <div className="p-8 text-center brutalist-border bg-zinc-950">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_API_Flags_Found</p>
          </div>
        ) : (
          flags.map((flag) => {
            const info = getProviderInfo(flag.key);
            return (
              <div key={flag.key} className="brutalist-border bg-zinc-950 p-6 hover:border-white transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">{info.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 ${flag.enabled ? 'bg-white' : 'bg-zinc-800'}`} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                            {flag.enabled ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[9px] font-mono text-zinc-600">{info.endpoint}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Calls_24h</p>
                      <p className="text-sm font-black text-white">{info.calls24h} / {info.limit}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Latency</p>
                      <p className="text-sm font-black text-white">{info.latency}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-none text-[9px] font-black uppercase tracking-widest h-8 px-4 ${
                        flag.enabled 
                          ? 'border-white text-white hover:bg-white hover:text-black' 
                          : 'border-zinc-800 text-zinc-700 hover:border-zinc-600'
                      }`}
                      onClick={() => toggleFlag(flag.key, flag.enabled)}
                    >
                      {flag.enabled ? "DEACTIVATE" : "ACTIVATE"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Errors */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white">Recent_Errors</h2>
        <div className="space-y-1">
          {recentErrors.map((e, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black border border-zinc-900">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-mono text-zinc-700">{e.time}</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{e.provider}</span>
                <span className="text-[9px] font-mono text-zinc-500">{e.endpoint}</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400">{e.error}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Limit Config */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white">Global_Rate_Limit</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Free_Users (req/day)</label>
            <Input 
              value={limits.free} 
              onChange={(e) => setLimits(prev => ({ ...prev, free: parseInt(e.target.value) || 0 }))}
              className="bg-black border-zinc-800 rounded-none h-10 text-sm font-mono text-white" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Premium_Users (req/day)</label>
            <Input 
              value={limits.premium}
              onChange={(e) => setLimits(prev => ({ ...prev, premium: parseInt(e.target.value) || 0 }))}
              className="bg-black border-zinc-800 rounded-none h-10 text-sm font-mono text-white" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">API_Keys (req/day)</label>
            <Input 
              value={limits.keys}
              onChange={(e) => setLimits(prev => ({ ...prev, keys: parseInt(e.target.value) || 0 }))}
              className="bg-black border-zinc-800 rounded-none h-10 text-sm font-mono text-white" 
            />
          </div>
        </div>
        <Button 
          onClick={saveLimits}
          className="bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest px-8 h-10 rounded-none"
        >
          Save_Limits
        </Button>
      </div>
    </div>
  );
}
