"use client";

import * as React from "react";
import { ScrollText, Search, Filter, Download, Clock, Database, User, Key, Terminal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const logs = [
  { id: "1", action: "USER_LOGIN", user: "marina_k", ip: "192.168.1.45", status: "SUCCESS", time: "2 mins ago", details: "Node authenticated via institutional JWT" },
  { id: "2", action: "SEARCH_EXECUTE", user: "juan_carlos", ip: "10.0.0.12", status: "SUCCESS", time: "15 mins ago", details: "Query: example@target.com (EMAIL)" },
  { id: "3", action: "API_KEY_CREATE", user: "admin", ip: "127.0.0.1", status: "SUCCESS", time: "45 mins ago", details: "New institutional relay key generated" },
  { id: "4", action: "USER_BAN", user: "admin", ip: "127.0.0.1", status: "SUCCESS", time: "1 hour ago", details: "Banned node @spammer_bot for abuse" },
  { id: "5", action: "SEARCH_FAILED", user: "shadow_01", ip: "172.16.0.4", status: "FAILED", time: "2 hours ago", details: "Provider 'Snusbase' returned 429 rate limit" },
  { id: "6", action: "SUBSCRIPTION_UPGRADE", user: "intel_pro", ip: "45.12.33.1", status: "SUCCESS", time: "5 hours ago", details: "Upgraded to PREMIUM clearance" },
];

export default function AdminAuditLogPage() {
  const [logList, setLogList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-log');
      const data = await res.json();
      if (data.success) setLogList(data.data);
    } catch (error) {
      console.error('Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <ScrollText className="w-3 h-3" /> Admin // Audit_Trail
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">System_Audit_Trail</h1>
          <Button variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest hover:border-white hover:text-white">
            <Download className="w-3 h-3 mr-2" /> Export_Logs
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <Input placeholder="Search event ID, node, or action..." className="pl-10 bg-black border-zinc-800 rounded-none h-10 text-white" />
        </div>
        <Button variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest">
          <Filter className="w-3 h-3 mr-2" /> Event:All
        </Button>
      </div>

      <div className="space-y-1">
        {isLoading ? (
          <div className="p-12 text-center brutalist-border bg-zinc-950 animate-pulse">
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Compiling_Audit_Data...</span>
          </div>
        ) : logList.length === 0 ? (
          <div className="p-8 text-center brutalist-border bg-zinc-950">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_Events_Recorded</p>
          </div>
        ) : (
          logList.map((log) => (
            <div key={log.id} className="brutalist-border bg-zinc-950 p-6 hover:border-white transition-colors group">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-white transition-colors">
                  {log.action.includes('SEARCH') ? <Database className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" /> : 
                   log.action.includes('USER') ? <User className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" /> :
                   log.action.includes('KEY') ? <Key className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" /> : 
                   <Terminal className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" />}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">{log.action}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ${
                      log.status === 'SUCCESS' ? 'bg-zinc-900 text-zinc-500' : 'bg-white text-black'
                    }`}>{log.status}</span>
                  </div>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{log.details}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">Node </span>
                    <span className="text-[9px] text-zinc-400 font-mono">@{log.user}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">IP </span>
                    <span className="text-[9px] text-zinc-500 font-mono">{log.ip}</span>
                  </div>
                  <span className="text-[8px] text-zinc-700">{getTimeAgo(log.time)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
