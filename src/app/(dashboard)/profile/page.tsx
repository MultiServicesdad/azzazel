"use client";

import * as React from "react";
import { User, Copy, Check, Shield, Search, Key, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [copied, setCopied] = React.useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(user?.azazelId || "");
    setCopied(true);
    toast.success("ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const isPremium = user?.role === 'PREMIUM' || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <div className="w-2 h-2 bg-white" />
          Node_Profile
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">@{user?.username}</h1>
      </div>

      {/* Identity Card */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
            <img src="/azazel.gif" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{user?.username}</h2>
              <p className="text-[9px] font-mono text-zinc-600 mt-1">{user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 ${
                isPremium ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}>{user?.role || 'FREE'}</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Azazel ID */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Azazel_ID</h2>
          <button onClick={copyId} className="p-2 hover:bg-white hover:text-black transition-colors text-zinc-600">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
        <div className="p-4 bg-black border border-zinc-900 font-mono text-xs text-zinc-500 break-all">
          {user?.azazelId || "0x..."}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total_Searches", value: "—", icon: Search },
          { label: "API_Keys", value: "—", icon: Key },
          { label: "Account_Age", value: "—", icon: Clock },
        ].map((stat) => (
          <div key={stat.label} className="brutalist-border bg-zinc-950 p-6 space-y-4 group hover:border-white transition-colors">
            <stat.icon className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</p>
            <p className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
