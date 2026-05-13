"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, Search, Database, Lock, Globe, Activity, ArrowRight, 
  CheckCircle2, ChevronRight, Eye, Server, Terminal, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stats = [
  { label: "INDEXED_RECORDS", value: "14.2B+", icon: Database },
  { label: "BREACH_SOURCES", value: "12,000+", icon: Server },
  { label: "ACTIVE_NODES", value: "25K+", icon: Activity },
  { label: "SYSTEM_UPTIME", value: "99.9%", icon: Activity },
];

const features: { icon?: React.ComponentType<{ className?: string }>; image?: string; title: string; description: string }[] = [
  {
    icon: Search,
    title: "DATA_AGGREGATION",
    description: "Institutional aggregation of breach data from global intelligence sources.",
  },
  {
    image: "/azazel.gif",
    title: "SECURITY_PROTOCOLS",
    description: "Hardened infrastructure with JWT rotation, CSRF protection, and audit trails.",
  },
  {
    icon: Eye,
    title: "ASSET_TRACE",
    description: "Automated identification of emails, IPs, domains, and cryptographic identities.",
  },
];

const plans = [
  {
    name: "FREE_SUBSYSTEM",
    price: "$0",
    period: "FOREVER",
    features: ["3 daily searches", "Basic identification", "Censored results", "Standard support"],
    cta: "Initialize",
    popular: false,
  },
  {
    name: "PREMIUM_ACCESS",
    price: "$29.99",
    period: "/MONTH",
    features: ["100 daily searches", "Full intelligence reveal", "Institutional API Access", "Export CSV, JSON & PDF", "Unlimited history", "Priority support"],
    cta: "Upgrade_System",
    popular: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black flex items-center justify-center border border-zinc-800">
              <img src="/azazel.gif" alt="Azazel" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-white">Azazel<span className="text-zinc-600 font-normal ml-1">//OSINT</span></span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/login">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white rounded-none">Sign_In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white hover:bg-zinc-200 text-black text-[10px] font-black uppercase tracking-widest px-6 h-10 rounded-none">Get_Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="absolute inset-0 grid-bg opacity-40" />
        
        <div className="relative max-w-5xl mx-auto">
          <motion.div initial="initial" animate="animate" className="space-y-8">
            <motion.div {...fadeUp} className="inline-flex items-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
              <div className="w-2 h-2 bg-white" />
              Intelligence_Network_v1.0.0
            </motion.div>
            
            <motion.h1 {...fadeUp} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic">
              Institutional
              <br />
              <span className="text-zinc-800">Cyber Intelligence</span>
            </motion.h1>
            
            <motion.p {...fadeUp} className="text-lg md:text-xl text-zinc-500 max-w-2xl font-medium leading-tight">
              Aggregated breach data and threat monitoring for security professionals. 
              Query 14B+ records across the dark intelligence landscape.
            </motion.p>
            
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/register">
                <Button className="bg-white hover:bg-zinc-200 text-black px-10 h-14 text-xs font-black uppercase tracking-widest rounded-none">
                  EXECUTE_INITIALIZATION <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" className="h-14 px-10 text-xs font-black uppercase tracking-widest border-zinc-800 text-zinc-500 hover:text-white hover:border-white rounded-none bg-transparent">
                  Access_Documentation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 px-6 border-y border-zinc-900 bg-zinc-950/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <div key={stat.label} className="space-y-2">
              <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{stat.label}</div>
              <div className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tight">System_Capabilities</h2>
            <div className="w-20 h-1 bg-white" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <div key={feature.title} className="space-y-6 group">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-white transition-colors overflow-hidden">
                  {feature.image ? (
                    <img src={feature.image} alt="" className="w-full h-full object-cover" />
                  ) : feature.icon ? (
                    <feature.icon className="w-6 h-6 text-white" />
                  ) : null}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-widest">{feature.title}</h3>
                  <p className="text-xs text-zinc-600 font-medium leading-relaxed uppercase">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-32 px-6 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tight">Subsystem_Access</h2>
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Select your intelligence tier.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-0 border border-zinc-900">
            {plans.map((plan, i) => (
              <div key={plan.name} className={`p-12 space-y-10 ${plan.popular ? 'bg-white text-black' : 'bg-black text-white border-r border-zinc-900'}`}>
                <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase italic tracking-tighter">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter italic">{plan.price}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${plan.popular ? 'text-black/60' : 'text-zinc-600'}`}>{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                      <div className={`w-1.5 h-1.5 ${plan.popular ? 'bg-black' : 'bg-white'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <Link href="/register" className="block">
                  <Button className={`w-full h-14 rounded-none text-[10px] font-black uppercase tracking-widest ${plan.popular ? 'bg-black text-white hover:bg-zinc-900' : 'bg-white text-black hover:bg-zinc-200'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-900 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-4 opacity-30">
            <div className="w-8 h-8 bg-black border border-zinc-800 flex items-center justify-center overflow-hidden">
              <img src="/azazel.gif" alt="Azazel" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter italic text-white">Azazel_Intelligence</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">
            <Link href="/docs" className="hover:text-white transition-colors underline">Documentation</Link>
            <Link href="/tos" className="hover:text-white transition-colors underline">Legal_Directive</Link>
            <span>© {new Date().getFullYear()} Institutional_Azazel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
