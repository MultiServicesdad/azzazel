'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, Activity, AlertTriangle, 
  Globe, Lock, BarChart3, MapPin, Info,
  Terminal, Server, Fingerprint
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SearchAnalysis({ results }: { results: any }) {
  const riskScore = results.insights?.riskScore || 0;
  const geodata = results.insights?.geodata || [];
  const passwordInsights = results.insights?.passwordInsights || [];

  // country distribution
  const countryCounts: Record<string, number> = {};
  geodata.forEach((g: any) => {
    countryCounts[g.country] = (countryCounts[g.country] || 0) + 1;
  });

  const sortedCountries = Object.entries(countryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const totalGeo = geodata.length || 1;
  const lastGeo = geodata[0];

  const avgEntropy = passwordInsights.length > 0
    ? Math.round(passwordInsights.reduce((acc: number, p: any) => acc + p.analysis.entropy, 0) / passwordInsights.length)
    : 0;

  const weakPasswords = passwordInsights.filter((p: any) => p.analysis.strength === 'WEAK').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Risk Score */}
        <div className="brutalist-border bg-zinc-950 p-6 flex flex-col items-center justify-center space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Exposure_Level</div>
          <div className="text-7xl font-black text-white tracking-tighter italic">
            {riskScore}<span className="text-zinc-800">%</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 overflow-hidden border border-zinc-800">
             <div className="h-full bg-white" style={{ width: `${riskScore}%` }} />
          </div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-center">
             {riskScore > 70 ? "CRITICAL_THREAT_DETECTED" : "PROFILE_WITHIN_STABLE_LIMITS"}
          </div>
        </div>

        {/* Intelligence Timeline */}
        <div className="lg:col-span-3 brutalist-border bg-zinc-950 p-6 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-white" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Temporal_Distribution</span>
              </div>
              <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">Archive_Scan_v1.2</span>
           </div>
           
           <div className="h-32 flex items-end justify-between gap-2">
              {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((year) => {
                const count = results.results.filter((r: any) => r.breachDate && new Date(r.breachDate).getFullYear() === year).length;
                const height = Math.max((count / 10) * 100, 2);
                return (
                  <div key={year} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-zinc-900 border-x border-t border-zinc-800 relative group">
                       <div className="w-full bg-white transition-all" style={{ height: `${height}%` }} />
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100">{count}</div>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-600 font-bold">{year}</span>
                  </div>
                );
              })}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credential Data */}
        <div className="brutalist-border bg-zinc-950 p-6 space-y-6">
           <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Identity_Verification</span>
           </div>
           
           <div className="space-y-3">
              {[
                { label: "Vulnerability_Pattern", value: weakPasswords > 0 ? "VULN" : "SECURE" },
                { label: "Complexity_Entropy", value: `${avgEntropy} BIT` },
                { label: "Compromised_Nodes", value: results.results.length },
                { label: "Top_Entry_Vector", value: results.results[0]?.source || "N/A" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 border border-zinc-900 bg-zinc-950 group hover:border-zinc-700 transition-colors">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{item.label}</span>
                  <span className="text-[10px] font-mono font-black text-white">{item.value}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Geo Nodes */}
        <div className="brutalist-border bg-zinc-950 p-6 space-y-6">
           <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Geospatial_Nodes</span>
           </div>

           <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                 {sortedCountries.length > 0 ? sortedCountries.map(([country, count]) => (
                   <div key={country} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                         <span className="text-zinc-400">{country}</span>
                         <span className="text-white">{Math.round((count / totalGeo) * 100)}%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 overflow-hidden">
                         <div className="h-full bg-white" style={{ width: `${(count / totalGeo) * 100}%` }} />
                      </div>
                   </div>
                 )) : (
                   <div className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic">Insufficient geographic data</div>
                 )}
              </div>
              
              <div className="flex-1 bg-zinc-900 p-4 border border-zinc-800 flex flex-col justify-center items-center text-center space-y-2">
                 <MapPin className="w-5 h-5 text-zinc-700" />
                 <div className="text-[9px] font-mono text-zinc-500 uppercase leading-relaxed">
                    {lastGeo ? (
                      <>
                        {lastGeo.city} // {lastGeo.countryCode}<br />
                        LAT: {lastGeo.lat.toFixed(4)}<br />
                        LON: {lastGeo.lon.toFixed(4)}
                      </>
                    ) : "COORDINATES_NULL"}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white p-4 text-black flex items-start gap-4">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional_Directive</p>
          <p className="text-[11px] font-bold leading-tight uppercase">
            {riskScore > 70 
              ? "Immediate asset rotation required. Profile exhibits critical level of identity degradation. Enforce isolation protocols."
              : "Stability verified. Monitoring remains active at baseline sensitivity level."}
          </p>
        </div>
      </div>
    </div>
  );
}
