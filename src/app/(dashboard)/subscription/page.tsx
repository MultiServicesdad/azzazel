"use client";

import * as React from "react";
import { 
  Check, Search, Database, Globe, 
  CreditCard, ArrowRight, History, Download, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import Link from "next/link";

const tiers = [
  {
    name: "FREE_SUBSYSTEM",
    id: "FREE",
    price: "0€",
    period: "FOREVER",
    features: ["3 daily searches", "Basic data reveal", "Censored results", "Standard support"],
    limit: 3,
  },
  {
    name: "PREMIUM_ACCESS",
    id: "PREMIUM",
    price: "10€",
    period: "/MONTH",
    features: [
      "100 daily searches", 
      "Full intelligence reveal", 
      "Institutional API Access",
      "Unlimited saved results", 
      "Export CSV, JSON & PDF", 
      "Priority support"
    ],
    limit: 100,
    popular: true,
  }
];

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const isPremium = user?.role === 'PREMIUM' || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const currentTier = isPremium ? tiers[1] : tiers[0];

  const handleUpgrade = async (planId: string) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.payLink) {
        window.location.href = data.payLink;
      } else {
        console.error('Checkout error:', data.error);
        alert('Checkout error: ' + (data.message || data.error));
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <div className="w-2 h-2 bg-white" />
          Billing_&_Access
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Institutional_Clearance</h1>
            <p className="text-zinc-500 text-sm font-medium mt-1">Manage your subscription, quotas, and intelligence limits.</p>
          </div>
          <div className="brutalist-border bg-zinc-950 px-6 py-4 flex items-center gap-6">
            <div className="space-y-1">
              <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Active_Plan</p>
              <p className="text-lg font-black text-white uppercase italic tracking-tighter">{currentTier.name}</p>
            </div>
            <div className="h-10 w-[1px] bg-zinc-800" />
            <div className="space-y-1">
              <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Daily_Limit</p>
              <p className="text-lg font-black text-white italic tracking-tighter">{currentTier.limit} Searches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Daily_Searches", value: "0%", desc: "Resetting in ~24 hours", icon: Search, pct: 0 },
          { label: "Saved_Records", value: "0", desc: "Institutional storage capacity", icon: Database, pct: 0 },
          { label: "API_Requests", value: "0 / 3000", desc: "Monthly allocation", icon: Globe, pct: 0 },
        ].map((metric) => (
          <div key={metric.label} className="brutalist-border bg-zinc-950 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-zinc-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{metric.label}</span>
              </div>
              <span className="text-[9px] font-black text-white tracking-widest">{metric.value}</span>
            </div>
            <div className="w-full h-1 bg-zinc-900">
              <div className="h-full bg-white transition-all" style={{ width: `${metric.pct}%` }} />
            </div>
            <p className="text-[8px] text-zinc-700 uppercase tracking-widest">{metric.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Upgrade_Clearance</h2>
          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Select the tier that fits your requirements.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-zinc-800">
          {tiers.map((tier) => {
            const isCurrent = (isPremium && tier.id === 'PREMIUM') || (!isPremium && tier.id === 'FREE');
            
            return (
              <div key={tier.id} className={`p-12 space-y-10 ${tier.popular ? 'bg-white text-black' : 'bg-black text-white border-r border-zinc-800'}`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">{tier.name}</h3>
                    {isCurrent && (
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 ${tier.popular ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter italic">{tier.price}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${tier.popular ? 'text-black/60' : 'text-zinc-600'}`}>{tier.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                      <div className={`w-1.5 h-1.5 ${tier.popular ? 'bg-black' : 'bg-white'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  disabled={isCurrent}
                  onClick={() => tier.id === 'PREMIUM' && handleUpgrade(tier.id)}
                  className={`w-full h-14 rounded-none text-[10px] font-black uppercase tracking-widest ${
                    isCurrent 
                      ? `${tier.popular ? 'bg-black/20 text-black/40' : 'bg-zinc-900 text-zinc-700'} cursor-not-allowed` 
                      : tier.popular 
                        ? 'bg-black text-white hover:bg-zinc-900' 
                        : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {isCurrent ? "Active_Plan" : tier.price === '0€' ? "Initialize" : "Upgrade_System"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      <div className="brutalist-border bg-zinc-950 p-8 space-y-8">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-1">Invoicing_&_History</h2>
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Download your institutional expense reports.</p>
        </div>
        <div className="space-y-1">
          {[
            { id: "INV-2024-001", date: "May 12, 2024", amount: "10€", status: "PAID" },
          ].map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-4 bg-black border border-zinc-900 hover:bg-zinc-900/30 transition-colors">
              <div className="flex items-center gap-4">
                <History className="w-4 h-4 text-zinc-700" />
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">{inv.id}</p>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm font-black text-white">{inv.amount}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{inv.status}</span>
                <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
