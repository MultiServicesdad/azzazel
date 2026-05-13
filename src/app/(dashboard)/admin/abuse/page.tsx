"use client";

import * as React from "react";
import { ShieldAlert, Search, Ban, AlertTriangle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const abuseReports = [
  { id: "ABR-001", user: "spam_bot_23", type: "EXCESSIVE_QUERIES", desc: "500+ searches in 1 hour", status: "PENDING", time: "30m ago" },
  { id: "ABR-002", user: "scraper_x", type: "API_ABUSE", desc: "Automated scraping detected", status: "BANNED", time: "2h ago" },
  { id: "ABR-003", user: "anon_user_44", type: "SUSPICIOUS_PATTERN", desc: "Sequential email enumeration", status: "WARNED", time: "5h ago" },
  { id: "ABR-004", user: "test_account", type: "FAKE_REGISTRATION", desc: "Multiple accounts from same IP", status: "PENDING", time: "1d ago" },
];

const bannedUsers = [
  { user: "scraper_x", reason: "Automated API abuse", bannedAt: "May 12, 2024", ip: "45.33.12.99" },
  { user: "spammer_bot", reason: "Mass query flooding", bannedAt: "May 10, 2024", ip: "172.16.0.45" },
];

export default function AdminAbusePage() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAbuseData = async () => {
    try {
      const res = await fetch('/api/admin/abuse');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) {
      console.error('Failed to fetch abuse data');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAbuseData();
  }, []);

  const handleUnban = async (username: string) => {
    // We already have user management for this, but could add here too
    console.log('Unban user:', username);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <ShieldAlert className="w-3 h-3" /> Admin // Abuse_Control
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Abuse_Management</h1>
        <p className="text-zinc-500 text-sm font-medium">Monitor and respond to platform abuse, suspicious activity, and ban management.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Pending_Reports", value: data?.reports.length || "0", icon: AlertTriangle },
          { label: "Banned_Nodes", value: data?.bannedUsers.length || "0", icon: Ban },
          { label: "Under_Watch", value: "0", icon: Eye },
        ].map((s) => (
          <div key={s.label} className="brutalist-border bg-zinc-950 p-6 space-y-3 group hover:border-white transition-colors">
            <s.icon className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{s.label}</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Abuse Reports */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white">Active_Reports</h2>
        <div className="space-y-1">
          <div className="grid grid-cols-6 gap-4 px-4 py-2 text-[8px] font-black uppercase tracking-widest text-zinc-700">
            <span>ID</span><span>User</span><span>Type</span><span className="col-span-2">Description</span><span>Status</span>
          </div>
          {isLoading ? (
            <div className="p-8 text-center animate-pulse">
              <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Scanning_Threats...</span>
            </div>
          ) : data?.reports.length === 0 ? (
            <div className="p-4 text-center text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_Active_Threats</div>
          ) : (
            data?.reports.map((r: any) => (
              <div key={r.id} className="grid grid-cols-6 gap-4 px-4 py-4 bg-black border border-zinc-900 hover:bg-zinc-900/30 transition-colors items-center">
                <span className="text-[9px] font-mono text-zinc-600">{r.id}</span>
                <span className="text-[10px] font-black text-white uppercase tracking-tight">@{r.user}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{r.type}</span>
                <span className="text-[9px] text-zinc-400 col-span-2">{r.desc}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${
                    r.status === 'BANNED' ? 'text-white' : r.status === 'WARNED' ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>{r.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Banned Users */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white">Banned_Nodes</h2>
        <div className="space-y-1">
          {isLoading ? (
            <div className="p-8 text-center animate-pulse">
              <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Awaiting_Sync...</span>
            </div>
          ) : data?.bannedUsers.length === 0 ? (
            <div className="p-4 text-center text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_Nodes_Banned</div>
          ) : (
            data?.bannedUsers.map((b: any) => (
              <div key={b.user} className="flex items-center justify-between p-4 bg-black border border-zinc-900 group">
                <div className="flex items-center gap-6">
                  <Ban className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-tight">@{b.user}</p>
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest">{b.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[9px] font-mono text-zinc-600">{b.ip}</span>
                  <span className="text-[9px] text-zinc-700">{b.bannedAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
