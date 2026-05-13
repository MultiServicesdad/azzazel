"use client";

import * as React from "react";
import { FileSearch, Search, Filter, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const searchLogs = [
  { id: "S001", user: "marina_k", query: "target@corp.com", type: "EMAIL", results: 14, duration: "1.2s", time: "2m ago", status: "SUCCESS" },
  { id: "S002", user: "jotaaa", query: "192.168.1.1", type: "IP", results: 0, duration: "0.8s", time: "5m ago", status: "SUCCESS" },
  { id: "S003", user: "shadow_01", query: "admin_pwn", type: "USERNAME", results: 124, duration: "2.1s", time: "12m ago", status: "SUCCESS" },
  { id: "S004", user: "intel_pro", query: "example.com", type: "DOMAIN", results: 5, duration: "1.5s", time: "1h ago", status: "SUCCESS" },
  { id: "S005", user: "shadow_01", query: "root@target.io", type: "EMAIL", results: 0, duration: "3.2s", time: "2h ago", status: "FAILED" },
  { id: "S006", user: "marina_k", query: "john.doe", type: "USERNAME", results: 42, duration: "1.8s", time: "3h ago", status: "SUCCESS" },
];

export default function AdminSearchesPage() {
  const [searches, setSearches] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchSearches = async () => {
    try {
      const res = await fetch('/api/admin/searches');
      const data = await res.json();
      if (data.success) setSearches(data.data);
    } catch (error) {
      console.error('Failed to fetch searches');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSearches();
  }, []);

  const formatDuration = (ms: number) => {
    return ms > 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
  };

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
          <FileSearch className="w-3 h-3" /> Admin // Search_Logs
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Search_Intelligence</h1>
          <Button variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest">
            <Download className="w-3 h-3 mr-2" /> Export_CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <Input placeholder="Search by query, user, or type..." className="pl-10 bg-black border-zinc-800 rounded-none h-10 text-white" />
        </div>
        <Button variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest">
          <Filter className="w-3 h-3 mr-2" /> Filter
        </Button>
        <Button variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest">
          <Clock className="w-3 h-3 mr-2" /> Last_24h
        </Button>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-8 gap-4 px-4 py-2 text-[8px] font-black uppercase tracking-widest text-zinc-700">
          <span>ID</span><span>User</span><span className="col-span-2">Query</span><span>Type</span><span>Results</span><span>Duration</span><span>Status</span>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center brutalist-border bg-zinc-950 animate-pulse">
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Retrieving_Logs...</span>
          </div>
        ) : searches.length === 0 ? (
          <div className="p-8 text-center brutalist-border bg-zinc-950">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_Search_Operations_Found</p>
          </div>
        ) : (
          searches.map((log) => (
            <div key={log.id} className="grid grid-cols-8 gap-4 px-4 py-4 bg-black border border-zinc-900 hover:bg-zinc-900/30 transition-colors items-center group">
              <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">#{log.id.slice(-4)}</span>
              <span className="text-[10px] font-black text-white uppercase tracking-tight">@{log.user.username}</span>
              <span className="text-[9px] font-mono text-zinc-400 col-span-2 truncate">{log.query}</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{log.searchType}</span>
              <span className="text-[10px] font-black text-white">{log.resultCount}</span>
              <span className="text-[9px] font-mono text-zinc-600">{formatDuration(log.duration)}</span>
              <span className={`text-[8px] font-black uppercase tracking-widest ${log.status === 'COMPLETED' ? 'text-zinc-500' : 'text-white underline'}`}>
                {log.status === 'COMPLETED' ? 'SUCCESS' : log.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
