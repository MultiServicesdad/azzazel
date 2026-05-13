'use client';

import * as React from 'react';
import { Bookmark, Search, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SavedPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchSaved = async () => {
    try {
      const res = await fetch('/api/saved');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error('Failed to fetch saved results');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => { fetchSaved(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/saved', { method: 'DELETE', body: JSON.stringify({ id }) });
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Result removed');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = items.filter(item => 
    item.search?.query?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <div className="w-2 h-2 bg-white" />
          Intelligence_Archive
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Saved_Results</h1>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{items.length} Items</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <Input 
          placeholder="Filter saved results..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-black border-zinc-800 rounded-none h-10" 
        />
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 text-zinc-700 mx-auto animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mt-4">Loading_Archive...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <FolderOpen className="w-10 h-10 text-zinc-800 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No_Saved_Results</p>
          <p className="text-[9px] text-zinc-600 uppercase">
            {items.length === 0 ? "Save search results to access them later." : "No results match your filter."}
          </p>
          <Link href="/search">
            <Button className="bg-white text-black hover:bg-zinc-200 rounded-none text-[9px] font-black uppercase tracking-widest h-10 px-6 mt-4">
              New_Search
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((item: any) => (
            <div key={item.id} className="brutalist-border bg-zinc-950 p-6 hover:border-white transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Bookmark className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest font-mono">
                      {item.search?.query || item.name || 'Unknown Query'}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                        {item.search?.type || 'AUTO'}
                      </span>
                      <span className="text-[8px] text-zinc-700">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                      </span>
                      <span className="text-[8px] text-zinc-700">
                        {item.search?.resultsCount || 0} results
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" variant="outline" 
                    onClick={() => handleDelete(item.id)}
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
    </div>
  );
}
