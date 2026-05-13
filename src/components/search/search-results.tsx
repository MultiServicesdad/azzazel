'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Clock, Shield, ShieldAlert, 
  ShieldCheck, ShieldX, ChevronRight, Copy,
  MapPin, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { BreachResult } from '@/types';

interface SearchResultsProps {
  results: BreachResult[];
  view: 'grid' | 'list';
}

export function SearchResults({ results, view }: SearchResultsProps) {
  if (view === 'list') {
    return (
      <div className="space-y-1 brutalist-border bg-zinc-950">
        <div className="grid grid-cols-12 gap-4 p-3 border-b border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-600">
          <div className="col-span-1">ID</div>
          <div className="col-span-3">Breach / Source</div>
          <div className="col-span-5">Identity Data</div>
          <div className="col-span-2 text-center">Severity</div>
          <div className="col-span-1"></div>
        </div>
        {results.map((result, i) => (
          <div key={result.id} className="grid grid-cols-12 gap-4 p-3 hover:bg-zinc-900/50 transition-colors border-b border-zinc-900 last:border-0 group">
            <div className="col-span-1 text-[10px] font-mono text-zinc-700">#{i + 1}</div>
            <div className="col-span-3">
              <p className="text-xs font-bold text-white truncate uppercase tracking-tight">{result.breachName || "PRIVATE_DB"}</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase">{result.source}</p>
            </div>
            <div className="col-span-5 flex flex-wrap gap-x-4 gap-y-1">
              {Object.entries(result.fields).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[9px] text-zinc-700 font-black uppercase tracking-tighter">{key}:</span>
                  <span className="text-[10px] font-mono text-zinc-400">{value || "---"}</span>
                </div>
              ))}
            </div>
            <div className="col-span-2 flex justify-center">
              <SeverityBadge severity={result.severity} />
            </div>
            <div className="col-span-1 flex justify-end">
               <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-700 hover:text-white rounded-none">
                 <ChevronRight className="w-4 h-4" />
               </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result, i) => (
        <IntelligenceCard key={result.id} result={result} index={i} />
      ))}
    </div>
  );
}

function IntelligenceCard({ result, index }: { result: BreachResult; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="bg-zinc-950 border border-zinc-800 hover:border-zinc-500 transition-all group flex flex-col h-full">
        <div className="p-4 border-b border-zinc-900 bg-zinc-900/20 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[150px]">
                {result.breachName || "PRIVATE_DB"}
              </h3>
              <SeverityBadge severity={result.severity} />
            </div>
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">{result.source}</p>
          </div>
          <div className="w-8 h-8 bg-black flex items-center justify-center border border-zinc-800 text-zinc-600">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div className="p-4 flex-1 space-y-4">
          <div className="space-y-3">
            {Object.entries(result.fields).map(([key, value]) => (
              <div key={key} className="group/field">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.2em]">{key}</p>
                  <button 
                    onClick={() => {
                      if (value) {
                        navigator.clipboard.writeText(value);
                        toast.success(`Copied ${key}`);
                      }
                    }} 
                    className="opacity-0 group-hover/field:opacity-100 transition-opacity"
                  >
                    <Copy className="w-3 h-3 text-zinc-700 hover:text-white" />
                  </button>
                </div>
                <div className="p-2 bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 break-all leading-tight">
                  {value || "NULL"}
                </div>
              </div>
            ))}
          </div>

          {Object.keys(result.fields).some(k => k.toLowerCase().includes('ip')) && (
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-900">
              <MapPin className="w-3 h-3 text-zinc-600" />
              <span className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em]">Geodata_Available</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-zinc-900/10 border-t border-zinc-900 flex items-center justify-between">
           <div className="flex items-center gap-3 text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {result.breachDate ? new Date(result.breachDate).toLocaleDateString() : "UNDATED"}</span>
             <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {result.recordCount || "1"} REC</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const configs: any = {
    LOW: { color: "text-zinc-600", border: "border-zinc-800" },
    MEDIUM: { color: "text-zinc-500", border: "border-zinc-700" },
    HIGH: { color: "text-zinc-300", border: "border-zinc-500" },
    CRITICAL: { color: "text-white", border: "border-white" },
  };

  const config = configs[severity] || configs.LOW;

  return (
    <div className={cn("px-1.5 py-0.5 border text-[7px] font-black uppercase tracking-[0.2em]", config.color, config.border)}>
      {severity}
    </div>
  );
}
