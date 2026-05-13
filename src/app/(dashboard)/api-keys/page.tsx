"use client";

import * as React from "react";
import { Key, Plus, Copy, Trash2, Loader2, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const [keys, setKeys] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [showCreate, setShowCreate] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/api-keys');
      const data = await res.json();
      if (data.success) setKeys(data.data || []);
    } catch { /* silently fail */ }
    finally { setIsLoading(false); }
  };

  React.useEffect(() => { fetchKeys(); }, []);

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, permissions: ['search'] }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('API key created');
        setShowCreate(false);
        setNewKeyName("");
        fetchKeys();
      } else {
        toast.error(data.error || 'Failed to create key');
      }
    } catch { toast.error('Error creating key'); }
    finally { setCreating(false); }
  };

  const deleteKey = async (id: string) => {
    try {
      await fetch('/api/api-keys', {
        method: 'DELETE',
        body: JSON.stringify({ keyId: id }),
      });
      setKeys(prev => prev.filter(k => k.id !== id));
      toast.success('Key revoked');
    } catch { toast.error('Failed to delete'); }
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    toast.success('Key copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <div className="w-2 h-2 bg-white" />
          Institutional_API
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">API_Keys</h1>
          <Button 
            onClick={() => setShowCreate(!showCreate)}
            className="bg-white text-black hover:bg-zinc-200 rounded-none text-[9px] font-black uppercase tracking-widest h-10 px-6"
          >
            <Plus className="w-3 h-3 mr-2" /> Generate_Key
          </Button>
        </div>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">New_API_Key</h2>
          <div className="flex gap-4">
            <Input 
              placeholder="Key name (e.g. Production, Testing)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="bg-black border-zinc-800 rounded-none h-10 flex-1"
            />
            <Button 
              onClick={createKey} 
              disabled={creating || !newKeyName.trim()}
              className="bg-white text-black hover:bg-zinc-200 rounded-none text-[9px] font-black uppercase tracking-widest h-10 px-8"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </Button>
          </div>
          <p className="text-[8px] text-zinc-700 uppercase tracking-widest">
            The full key will only be shown once. Store it securely.
          </p>
        </div>
      )}

      {/* Keys List */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 text-zinc-700 mx-auto animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mt-4">Loading_Keys...</p>
        </div>
      ) : keys.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Key className="w-10 h-10 text-zinc-800 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No_API_Keys</p>
          <p className="text-[9px] text-zinc-600 uppercase">Generate your first API key to integrate Azazel into your workflow.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {keys.map((k: any) => (
            <div key={k.id} className="brutalist-border bg-zinc-950 p-6 hover:border-white transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Key className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{k.name}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-mono text-zinc-600">{k.prefix || k.key?.substring(0, 16)}...</span>
                      <span className="text-[8px] text-zinc-700 uppercase tracking-widest">
                        Created {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : '—'}
                      </span>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${k.active ? 'text-zinc-500' : 'text-zinc-700'}`}>
                        {k.active ? 'ACTIVE' : 'REVOKED'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" variant="outline"
                    onClick={() => copyKey(k.key, k.id)}
                    className="border-zinc-800 text-zinc-600 rounded-none text-[8px] font-black uppercase tracking-widest h-6 px-2 hover:border-white hover:text-white"
                  >
                    {copiedId === k.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                  <Button 
                    size="sm" variant="outline"
                    onClick={() => deleteKey(k.id)}
                    className="border-zinc-800 text-zinc-600 rounded-none text-[8px] font-black uppercase tracking-widest h-6 px-2 hover:border-white hover:text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Info */}
      <div className="bg-white p-8 space-y-4">
        <h3 className="text-lg font-black text-black uppercase italic tracking-tighter">API_Documentation</h3>
        <div className="space-y-2">
          <p className="text-[9px] text-black/60 uppercase font-bold tracking-widest">Authentication Header</p>
          <div className="bg-black p-4 font-mono text-xs text-zinc-400">
            Authorization: Bearer az_live_your_key_here
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[9px] text-black/60 uppercase font-bold tracking-widest">Search Endpoint</p>
          <div className="bg-black p-4 font-mono text-xs text-zinc-400">
            POST /api/v1/search {'{'} "query": "target@email.com", "type": "EMAIL" {'}'}
          </div>
        </div>
      </div>
    </div>
  );
}
