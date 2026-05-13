"use client";

import * as React from "react";
import { ToggleLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const flags = [
  { key: "ip_geolocation", label: "IP_Geolocation", desc: "Show geolocation data for IP addresses (Premium only)", enabled: true },
  { key: "password_analysis", label: "Password_Analysis", desc: "Analyze breach passwords for patterns and strength", enabled: true },
  { key: "export_pdf", label: "PDF_Export", desc: "Allow exporting search results as PDF reports", enabled: false },
  { key: "dark_web_monitor", label: "Dark_Web_Monitor", desc: "Real-time monitoring of dark web mentions", enabled: false },
  { key: "api_v2", label: "API_V2_Endpoints", desc: "Enable next-generation API v2 endpoints", enabled: false },
  { key: "batch_search", label: "Batch_Search", desc: "Allow bulk search queries via CSV upload", enabled: false },
  { key: "webhook_notifications", label: "Webhook_Notifications", desc: "Send search results to external webhook endpoints", enabled: false },
  { key: "ai_analysis", label: "AI_Risk_Analysis", desc: "AI-powered analysis of breach data patterns", enabled: true },
];

export default function AdminFeatureFlagsPage() {
  const [flagStates, setFlagStates] = React.useState<Record<string, boolean>>(
    Object.fromEntries(flags.map(f => [f.key, f.enabled]))
  );

  const toggle = (key: string) => {
    setFlagStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <ToggleLeft className="w-3 h-3" /> Admin // Feature_Flags
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Feature_Flags</h1>
          <Button className="bg-white text-black hover:bg-zinc-200 rounded-none text-[9px] font-black uppercase tracking-widest h-10 px-6">
            <Plus className="w-3 h-3 mr-2" /> New_Flag
          </Button>
        </div>
        <p className="text-zinc-500 text-sm font-medium">Toggle platform features and experimental capabilities globally.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <Input placeholder="Search flags..." className="pl-10 bg-black border-zinc-800 rounded-none h-10" />
      </div>

      <div className="space-y-1">
        {flags.map((flag) => (
          <div key={flag.key} className="brutalist-border bg-zinc-950 p-6 hover:border-white transition-colors group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-2 h-2 ${flagStates[flag.key] ? 'bg-white' : 'bg-zinc-800'}`} />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">{flag.label}</h3>
                    <span className="text-[8px] font-mono text-zinc-700">{flag.key}</span>
                  </div>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{flag.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[8px] font-black uppercase tracking-widest ${flagStates[flag.key] ? 'text-white' : 'text-zinc-700'}`}>
                  {flagStates[flag.key] ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <Switch 
                  checked={flagStates[flag.key]}
                  onCheckedChange={() => toggle(flag.key)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button className="bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest px-8 h-10 rounded-none">
          Save_Configuration
        </Button>
      </div>
    </div>
  );
}
