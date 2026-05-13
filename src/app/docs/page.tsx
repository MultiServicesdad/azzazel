"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Key, Globe, Code2, Terminal, Copy, Check,
  ArrowRight, ShieldCheck, Zap, Database, Lock,
  ChevronRight, BookOpen, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const endpoints = [
  { 
    method: "POST", 
    path: "/api/v1/search", 
    desc: "Perform a global intelligence search across all providers.",
    params: [
      { name: "query", type: "string", desc: "The value to search for (email, IP, etc.)" },
      { name: "type", type: "string", desc: "The search type (EMAIL, IP, USERNAME, AUTO)" }
    ]
  },
  { 
    method: "GET", 
    path: "/api/v1/status", 
    desc: "Check system health and provider availability.",
    params: []
  },
  { 
    method: "GET", 
    path: "/api/v1/me", 
    desc: "Retrieve current authenticated user profile and subscription stats.",
    params: []
  }
];

const pythonExample = `import requests

API_KEY = "az_live_..."
url = "https://azazel-osint.com/api/v1/search"

payload = {
    "query": "john.doe@example.com",
    "type": "EMAIL"
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;

const nodeExample = `const axios = require('axios');

const API_KEY = 'az_live_...';

async function search() {
  const { data } = await axios.post('https://azazel-osint.com/api/v1/search', {
    query: 'john.doe@example.com',
    type: 'EMAIL'
  }, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log(data);
}

search();`;

const curlExample = `curl -X POST https://azazel-osint.com/api/v1/search \\
  -H "Authorization: Bearer az_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "john.doe@example.com",
    "type": "EMAIL"
  }'`;

export default function ApiDocsPage() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation - Sidebar */}
        <div className="lg:col-span-3 space-y-8 hidden lg:block sticky top-24 self-start">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Introduction</h3>
            <ul className="space-y-3">
              <li><button className="text-sm text-violet-400 font-medium flex items-center gap-2"><BookOpen className="w-4 h-4" /> Getting Started</button></li>
              <li><button className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"><Lock className="w-4 h-4" /> Authentication</button></li>
              <li><button className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"><Activity className="w-4 h-4" /> Rate Limits</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Endpoints</h3>
            <ul className="space-y-3">
              {endpoints.map(e => (
                <li key={e.path}>
                  <button className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                    <Badge variant="outline" className="px-1 py-0 text-[10px] bg-zinc-900 border-zinc-800 text-zinc-500">{e.method}</Badge>
                    {e.path.replace('/api/v1', '')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-16">
          <section className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
              Integrate Azazel OSINT intelligence directly into your security stack. Our REST API provides programmatic access to 14B+ records with institutional-grade reliability.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Button className="bg-violet-600 hover:bg-violet-500 text-white border-0">
                Generate API Key <Key className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
                View GitHub SDK
              </Button>
            </div>
          </section>

          <div className="h-[1px] bg-zinc-900" />

          {/* Authentication Section */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Lock className="w-6 h-6 text-violet-500" />
                Authentication
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Azazel API uses Bearer token authentication. Your API keys are institutional credentials and should be handled with absolute security. Never expose keys in client-side code.
              </p>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase font-bold tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Security Note
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Premium keys support CIDR allowlisting and granular endpoint permissions.
                </p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Header Example</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500" onClick={() => copy("Authorization: Bearer az_live_...", "auth-header")}>
                  {copied === 'auth-header' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <div className="p-4 font-mono text-sm text-violet-300">
                Authorization: Bearer <span className="text-zinc-500">az_live_...</span>
              </div>
            </div>
          </section>

          {/* Endpoint Documentation */}
          <section className="space-y-12">
            <h2 className="text-2xl font-bold">Search Endpoints</h2>
            
            {endpoints.map((endpoint, i) => (
              <div key={endpoint.path} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-violet-600 text-white border-0 font-bold">{endpoint.method}</Badge>
                      <span className="font-mono text-sm text-zinc-300">{endpoint.path}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{endpoint.desc}</p>
                  </div>

                  {endpoint.params.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Parameters</h4>
                      <div className="space-y-2">
                        {endpoint.params.map(p => (
                          <div key={p.name} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-white font-mono">{p.name}</span>
                              <span className="text-[10px] text-zinc-500 uppercase">{p.type}</span>
                            </div>
                            <p className="text-xs text-zinc-500">{p.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#0f0f13] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[400px]">
                  <Tabs defaultValue="python" className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-b border-zinc-800">
                      <TabsList className="bg-transparent border-0 h-8 gap-4 p-0">
                        <TabsTrigger value="python" className="text-[10px] uppercase font-bold text-zinc-500 data-[state=active]:text-white p-0 bg-transparent border-0">Python</TabsTrigger>
                        <TabsTrigger value="node" className="text-[10px] uppercase font-bold text-zinc-500 data-[state=active]:text-white p-0 bg-transparent border-0">Node.js</TabsTrigger>
                        <TabsTrigger value="curl" className="text-[10px] uppercase font-bold text-zinc-500 data-[state=active]:text-white p-0 bg-transparent border-0">cURL</TabsTrigger>
                      </TabsList>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500">
                         <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed">
                      <TabsContent value="python" className="m-0 focus-visible:ring-0">
                        <pre className="text-blue-300">{pythonExample}</pre>
                      </TabsContent>
                      <TabsContent value="node" className="m-0 focus-visible:ring-0">
                        <pre className="text-emerald-300">{nodeExample}</pre>
                      </TabsContent>
                      <TabsContent value="curl" className="m-0 focus-visible:ring-0">
                        <pre className="text-amber-300">{curlExample}</pre>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
