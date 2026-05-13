"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Shield, Database, Activity, Clock, 
  Mail, User, Globe, Phone, Hash, Wallet,
  AlertCircle, ChevronRight, Filter, Download,
  Share2, Bookmark, LayoutGrid, List, SlidersHorizontal,
  Loader2, Sparkles, ShieldAlert, ShieldCheck, ShieldX,
  MapPin, Eye, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { SearchResults } from "@/components/search/search-results";
import { SearchAnalysis } from "@/components/search/search-analysis";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SEARCH_TYPE_LABELS, SEARCH_TYPE_ICONS } from "@/lib/constants";
import type { SearchTypeEnum, SearchResponse, BreachResult } from "@/types";

const iconMap: Record<string, any> = {
  EMAIL: Mail, USERNAME: User, IP: Globe, DOMAIN: Database,
  PHONE: Phone, NAME: User, HASH: Hash, CRYPTO: Wallet, AUTO: Activity
};

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<SearchTypeEnum>("AUTO");
  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState<SearchResponse | null>(null);
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults(null);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, type }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "QUERY_FAILURE: Verification required");
        return;
      }

      setResults(data.data);
      toast.success(`INTEL_RECOVERED: ${data.data.resultCount} records`);
    } catch {
      toast.error("SYSTEM_OFFLINE: Gateway timeout");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20 pt-6">
      {/* ── Search Header ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">
          <div className="w-2 h-2 bg-white" />
          Azazel Intelligence Subsystem // v1.0.0
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
          Data Aggregator
        </h1>
        <p className="text-zinc-500 max-w-2xl font-medium">
          Querying global breach data for institutional asset verification. 
          Unauthorized access is strictly monitored.
        </p>
      </div>

      {/* ── Search Bar ── */}
      <div className="space-y-4">
        <div className="brutalist-border bg-zinc-950 p-1 flex items-center gap-1">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH_TERM (EMAIL, IP, USER, HASH...)"
              className="w-full bg-transparent border-none h-12 pl-12 pr-4 text-sm font-mono focus-visible:ring-0 text-white placeholder:text-zinc-700 uppercase"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 px-4 flex items-center gap-2 text-zinc-400 hover:text-white bg-zinc-900 transition-colors outline-none border-l border-zinc-800">
              {React.createElement(iconMap[type] || Activity, { className: "w-3 h-3" })}
              <span className="text-[10px] font-bold uppercase tracking-wider">{SEARCH_TYPE_LABELS[type]}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-zinc-800 w-48 rounded-none" align="end">
              {Object.entries(SEARCH_TYPE_LABELS).map(([key, label]) => (
                <DropdownMenuItem 
                  key={key} 
                  onClick={() => setType(key as SearchTypeEnum)}
                  className="text-zinc-500 focus:text-black focus:bg-white cursor-pointer rounded-none text-[10px] font-bold uppercase"
                >
                  {React.createElement(iconMap[key] || Activity, { className: "w-3 h-3 mr-2" })}
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="bg-white hover:bg-zinc-200 text-black font-black uppercase text-xs h-10 px-8 rounded-none"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "EXECUTE_QUERY"}
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
          <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> SECURED_CHANNEL</span>
          <span className="flex items-center gap-2"><Database className="w-3 h-3" /> 14.2B_RECORDS</span>
          <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> REALTIME_INGEST</span>
        </div>
      </div>

      {/* ── Results Section ── */}
      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 space-y-4"
          >
            <div className="w-16 h-1 bg-zinc-900 overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Processing intelligence...</p>
          </motion.div>
        )}

        {results && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Results Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-4 brutalist-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Recovered Data</h3>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{results.resultCount} valid records</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-black border-zinc-800 hover:border-white text-zinc-500 hover:text-white text-[10px] font-bold uppercase rounded-none"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/saved', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ searchId: results.id })
                      });
                      const data = await res.json();
                      if (data.success) toast.success("VAULT_ARCHIVED");
                      else toast.error(data.error);
                    } catch {
                      toast.error("VAULT_FAILURE");
                    }
                  }}
                >
                  <Bookmark className="w-3 h-3 mr-2" />
                  Save to Vault
                </Button>
                <div className="h-6 w-px bg-zinc-800 mx-2" />
                <div className="flex bg-zinc-900 p-1 border border-zinc-800">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-7 w-7 rounded-none", view === "grid" ? "bg-white text-black" : "text-zinc-600")}
                    onClick={() => setView("grid")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-7 w-7 rounded-none", view === "list" ? "bg-white text-black" : "text-zinc-600")}
                    onClick={() => setView("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="results" className="w-full">
                <TabsList className="bg-zinc-950 border border-zinc-800 h-10 p-0 rounded-none mb-8">
                  <TabsTrigger value="results" className="px-8 text-[10px] font-black uppercase tracking-widest rounded-none data-[state=active]:bg-white data-[state=active]:text-black border-r border-zinc-800 last:border-0">
                    <FileText className="w-3 h-3 mr-2" />
                    Source Data
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="px-8 text-[10px] font-black uppercase tracking-widest rounded-none data-[state=active]:bg-white data-[state=active]:text-black">
                    <Eye className="w-3 h-3 mr-2" />
                    Visual Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="mt-0 outline-none">
                  <SearchResults results={results.results} view={view} />
                </TabsContent>
                
                <TabsContent value="analysis" className="mt-0 outline-none">
                  <SearchAnalysis results={results} />
                </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {!isSearching && !results && !query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
          >
             {[
               { icon: Mail, label: 'Email Scan', desc: 'Identify leaked credentials associated with any email identity.' },
               { icon: Globe, label: 'Asset Trace', desc: 'Map IP addresses and domains to known threat actors or botnets.' },
               { icon: ShieldX, label: 'Risk Audit', desc: 'Evaluate organizational exposure across global databases.' },
             ].map((feature, i) => (
               <div key={i} className="p-6 brutalist-border bg-zinc-950/50 space-y-4">
                 <feature.icon className="w-6 h-6 text-white" />
                 <h3 className="font-black text-sm uppercase tracking-tight text-white">{feature.label}</h3>
                 <p className="text-xs text-zinc-500 leading-relaxed font-medium">{feature.desc}</p>
               </div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
