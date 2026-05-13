"use client";

import * as React from "react";
import { Users, Search, Filter, MoreHorizontal, Ban, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const users = [
  { id: "1", username: "jotaaa", email: "jotadeeloperz@proton.me", role: "SUPERADMIN", status: "ACTIVE", searches: 142, joined: "May 01, 2024" },
  { id: "2", username: "marina_k", email: "marina@osint.io", role: "PREMIUM", status: "ACTIVE", searches: 89, joined: "May 12, 2024" },
  { id: "3", username: "shadow_01", email: "alex@proton.me", role: "FREE", status: "ACTIVE", searches: 12, joined: "May 08, 2024" },
  { id: "4", username: "intel_pro", email: "sarah@intel.co", role: "PREMIUM", status: "ACTIVE", searches: 234, joined: "Apr 28, 2024" },
  { id: "5", username: "spammer_bot", email: "spam@fake.co", role: "FREE", status: "BANNED", searches: 0, joined: "May 09, 2024" },
  { id: "6", username: "guest_291", email: "guest291@mail.com", role: "FREE", status: "ACTIVE", searches: 3, joined: "May 11, 2024" },
];

export default function AdminUsersPage() {
  const [userList, setUserList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUserList(data.data);
      } else {
        setError(data.error || 'Failed to load nodes');
      }
    } catch (err) {
      console.error('Failed to fetch users');
      setError('Connection refused by endpoint');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAction = async (userId: string, action: 'BAN' | 'UNBAN' | 'UPDATE_ROLE', role?: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, role }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || 'Action failed');
      }
    } catch (error) {
      console.error('Failed to perform action');
      alert('Network error');
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <Users className="w-3 h-3" /> Admin // User_Management
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Node_Registry</h1>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{userList.length} Total_Nodes</span>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <Input placeholder="Search by username, email, or role..." className="pl-10 bg-black border-zinc-800 rounded-none h-10 text-white" />
        </div>
        <Button variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest">
          <Filter className="w-3 h-3 mr-2" /> Role:All
        </Button>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-4 px-4 py-2 text-[8px] font-black uppercase tracking-widest text-zinc-700">
          <span>Username</span><span className="col-span-2">Email</span><span>Role</span><span>Status</span><span>Searches</span><span>Actions</span>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center brutalist-border bg-zinc-950 animate-pulse">
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Scanning_Registry...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center brutalist-border bg-zinc-950 border-white">
            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Error: {error}</p>
            <Button onClick={fetchUsers} variant="outline" className="text-[8px] font-black uppercase">Retry_Sync</Button>
          </div>
        ) : userList.length === 0 ? (
          <div className="p-8 text-center brutalist-border bg-zinc-950">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No_Nodes_Registered</p>
          </div>
        ) : (
          userList.map((u) => (
            <div key={u.id} className="grid grid-cols-7 gap-4 px-4 py-4 bg-black border border-zinc-900 hover:bg-zinc-900/30 transition-colors items-center group">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src="/azazel.gif" alt="" className="w-full h-full object-cover opacity-50" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-tight">@{u.username}</span>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono truncate col-span-2">{u.email}</span>
              
              <select 
                value={u.role}
                onChange={(e) => handleUserAction(u.id, 'UPDATE_ROLE', e.target.value)}
                className="bg-transparent text-[8px] font-black uppercase tracking-widest border-none outline-none focus:ring-0 text-zinc-400 cursor-pointer hover:text-white transition-colors"
              >
                <option value="USER" className="bg-black">USER</option>
                <option value="PREMIUM" className="bg-black">PREMIUM</option>
                <option value="ADMIN" className="bg-black">ADMIN</option>
                <option value="SUPERADMIN" className="bg-black">SUPERADMIN</option>
              </select>

              <span className={`text-[8px] font-black uppercase tracking-widest ${
                u.status === 'BANNED' ? 'text-white underline' : 'text-zinc-600'
              }`}>{u.status}</span>
              <span className="text-[10px] font-black text-zinc-500">{u.searches}</span>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleUserAction(u.id, u.status === 'BANNED' ? 'UNBAN' : 'BAN')}
                  className={`rounded-none text-[8px] font-black uppercase tracking-widest h-6 px-3 transition-all ${
                    u.status === 'BANNED' 
                      ? 'border-white text-white hover:bg-white hover:text-black' 
                      : 'border-zinc-800 text-zinc-600 hover:border-white hover:text-white'
                  }`}
                >
                  {u.status === 'BANNED' ? 'REINSTATE' : 'REVOKE'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
