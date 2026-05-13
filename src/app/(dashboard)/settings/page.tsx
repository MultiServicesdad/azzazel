"use client";

import * as React from "react";
import { 
  User, Lock, Bell, Eye,
  Save, RefreshCw, Smartphone, Globe, 
  Trash2, Fingerprint, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Configuration updated");
    }, 1000);
  };

  const copyId = () => {
    navigator.clipboard.writeText(user?.azazelId || "");
    setCopied(true);
    toast.success("Azazel ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-10 pb-20">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          <div className="w-2 h-2 bg-white" />
          System_Configuration
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Settings</h1>
        <p className="text-zinc-500 text-sm font-medium">Configure your account, security, and notification preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-black border border-zinc-800 p-0 h-12 rounded-none gap-0">
          <TabsTrigger value="profile" className="px-6 rounded-none text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black text-zinc-600 h-full">
            <User className="w-3 h-3 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="px-6 rounded-none text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black text-zinc-600 h-full">
            <Lock className="w-3 h-3 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-6 rounded-none text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black text-zinc-600 h-full">
            <Bell className="w-3 h-3 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="institutional" className="px-6 rounded-none text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black text-zinc-600 h-full">
            <Fingerprint className="w-3 h-3 mr-2" /> Identity
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 brutalist-border bg-zinc-950 p-8 space-y-8">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white mb-1">Personal_Information</h2>
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Profile details visible on the institutional network.</p>
              </div>

              <div className="flex items-center gap-6 pb-6 border-b border-zinc-900">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src="/azazel.gif" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-[9px] font-black uppercase tracking-widest rounded-none h-8">Change_Avatar</Button>
                    <Button size="sm" variant="outline" className="border-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-none h-8">Remove</Button>
                  </div>
                  <p className="text-[8px] text-zinc-700 uppercase font-bold tracking-widest">400x400 • PNG/JPG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Username</Label>
                  <Input defaultValue={user?.username} className="bg-black border-zinc-800 rounded-none focus:border-white h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Email_Address</Label>
                  <Input defaultValue={user?.email} className="bg-black border-zinc-800 rounded-none focus:border-white h-10 text-sm" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Bio / Mission</Label>
                <textarea 
                  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:outline-none focus:border-white min-h-[100px] resize-none"
                  placeholder="Describe your institutional mission..."
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-900">
                <Button onClick={handleSave} disabled={loading} className="bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest px-8 h-10 rounded-none">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save_Changes"}
                </Button>
              </div>
            </div>

            <div className="brutalist-border bg-zinc-950 p-8 space-y-6 h-fit">
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Privacy_Config</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Public_Activity</p>
                    <p className="text-[8px] text-zinc-700 uppercase">Show search count on profile</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reveal_Clearance</p>
                    <p className="text-[8px] text-zinc-700 uppercase">Display your tier publicly</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Security Tab ── */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="brutalist-border bg-zinc-950 p-8 space-y-8">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white mb-1">Update_Password</h2>
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Ensure your account is secured with a strong passphrase.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Current_Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-black border-zinc-800 rounded-none h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">New_Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-black border-zinc-800 rounded-none h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Confirm_Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-black border-zinc-800 rounded-none h-10" />
                </div>
              </div>
              <Button className="w-full bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest h-12 rounded-none">
                Update_Access_Credentials
              </Button>
            </div>

            <div className="space-y-8">
              <div className="brutalist-border bg-zinc-950 p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-zinc-500" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">Two_Factor_Auth</h2>
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Authenticator_App</p>
                    <p className="text-[8px] text-zinc-700 uppercase tracking-wide leading-relaxed max-w-[200px]">
                      Use Google Authenticator or Authy for secure codes.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest">Setup</Button>
                </div>
              </div>

              <div className="border border-zinc-800 bg-black p-8 space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-zinc-500" /> Danger_Zone
                </h2>
                <p className="text-[8px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                  Permanently destroy your Azazel node and all associated intelligence data. This is irreversible.
                </p>
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-500 hover:text-white hover:border-white h-10 rounded-none text-[10px] font-black uppercase tracking-widest">
                  Terminate_Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Notifications Tab ── */}
        <TabsContent value="notifications">
          <div className="brutalist-border bg-zinc-950 p-8 space-y-8">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white mb-1">Notification_Preferences</h2>
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Control which alerts and notifications you receive.</p>
            </div>

            <div className="space-y-1">
              {[
                { id: "search_complete", title: "Search_Complete", desc: "Notify when a search query finishes processing" },
                { id: "new_breach", title: "New_Breach_Alert", desc: "Alert when new breach data matches your monitored queries" },
                { id: "security_alerts", title: "Security_Alerts", desc: "Login attempts, password changes, and suspicious activity" },
                { id: "system_updates", title: "System_Updates", desc: "Platform maintenance, downtime, and feature announcements" },
                { id: "api_usage", title: "API_Usage_Warnings", desc: "Alerts when approaching API call limits" },
                { id: "weekly_digest", title: "Weekly_Digest", desc: "Summary of your intelligence activity and platform metrics" },
              ].map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-4 bg-black border border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{notif.title}</p>
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest">{notif.desc}</p>
                  </div>
                  <Switch defaultChecked={notif.id !== 'weekly_digest'} />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-900">
              <Button onClick={handleSave} disabled={loading} className="bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest px-8 h-10 rounded-none">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save_Preferences"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── Institutional ID Tab ── */}
        <TabsContent value="institutional">
          <div className="brutalist-border bg-zinc-950 p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-6 h-6 text-zinc-500" />
                  <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">Azazel_Institutional_ID</h2>
                </div>
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Your immutable node identifier on the Azazel OSINT network.</p>
              </div>
              <div className="bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1">
                Primary_Identity
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Unique Identifier (HEX)</p>
              <div className="p-6 bg-black border border-zinc-800 font-mono text-xs break-all leading-relaxed text-zinc-400 relative group">
                {user?.azazelId || "0x..."}
                <button
                  onClick={copyId}
                  className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-black border border-zinc-900">
                <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest mb-1">Clearance_Level</p>
                <p className="text-sm font-black text-white uppercase">{user?.role || 'FREE'}</p>
              </div>
              <div className="p-4 bg-black border border-zinc-900">
                <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest mb-1">Node_Type</p>
                <p className="text-sm font-black text-white uppercase">Full_Relay</p>
              </div>
              <div className="p-4 bg-black border border-zinc-900">
                <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest mb-1">Encryption</p>
                <p className="text-sm font-black text-white uppercase">AES-256-GCM</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
              <p className="text-[8px] text-zinc-700 uppercase tracking-widest">This ID is cryptographic evidence of your platform access.</p>
              <Button variant="outline" className="border-zinc-800 text-zinc-500 rounded-none text-[9px] font-black uppercase tracking-widest gap-2 hover:border-white hover:text-white">
                <Globe className="w-3 h-3" /> Public_Identity
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
