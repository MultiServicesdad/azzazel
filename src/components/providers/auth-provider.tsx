"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, isLoading } = useAuthStore();

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.data.user);
            setLoading(false);
            return;
          }
        }

        // Try to refresh if session fails
        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success) {
            setUser(refreshData.data.user);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-white flex items-center justify-center animate-pulse">
            <img src="/azazel.gif" alt="Azazel" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 text-zinc-500 animate-spin" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Initializing_Subsystems...</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
