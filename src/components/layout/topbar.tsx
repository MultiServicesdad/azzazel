"use client";

import * as React from "react";
import { Search, Bell, Menu, User, Settings, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DashboardTopbar() {
  const { user, logout } = useAuthStore();
  const { setMobileNavOpen, setGlobalSearchOpen } = useUIStore();

  return (
    <header className="h-20 border-b border-zinc-900 bg-black sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-zinc-500 hover:text-white rounded-none"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="hidden md:flex items-center">
          <Button
            variant="outline"
            className="w-72 justify-start text-zinc-600 border-zinc-900 bg-zinc-950 hover:border-zinc-500 rounded-none h-10 px-4"
            onClick={() => setGlobalSearchOpen(true)}
          >
            <Search className="w-4 h-4 mr-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global_Search</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 bg-zinc-900 px-2 font-mono text-[9px] font-black text-zinc-600">
              CMD+K
            </kbd>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white rounded-none relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-white" />
        </Button>

        <div className="h-8 w-[1px] bg-zinc-900 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-10 px-2 flex items-center gap-3 hover:bg-zinc-900 transition-colors outline-none border border-transparent hover:border-zinc-800">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white uppercase tracking-tight">{user?.username}</p>
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{user?.role}</p>
            </div>
            <div className="h-8 w-8 bg-black border border-zinc-800 overflow-hidden shrink-0">
              <img src="/azazel.gif" alt="Azazel" className="w-full h-full object-cover" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-black border-zinc-800 rounded-none p-0" align="end">
            <DropdownMenuLabel className="p-4 bg-zinc-950 border-b border-zinc-800">
              <div className="flex flex-col space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{user?.username}</p>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <div className="p-2">
              <div className="px-2 py-2 mb-2 bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 mr-2" />
                {user?.role === 'SUPERADMIN' || user?.role === 'ADMIN' ? 'ADMIN_ACCESS' : user?.role === 'PREMIUM' ? 'PREMIUM_ACCESS' : 'FREE_SUBSYSTEM'}
              </div>
              
              <DropdownMenuItem className="rounded-none focus:bg-zinc-900 focus:text-white text-zinc-500 text-[10px] font-bold uppercase tracking-wider p-3" render={
                <Link href="/profile" className="cursor-pointer flex items-center">
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile_Config</span>
                </Link>
              } />
              <DropdownMenuItem className="rounded-none focus:bg-zinc-900 focus:text-white text-zinc-500 text-[10px] font-bold uppercase tracking-wider p-3" render={
                <Link href="/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>System_Settings</span>
                </Link>
              } />
              
              <DropdownMenuSeparator className="bg-zinc-900 my-2" />
              
              <DropdownMenuItem 
                className="rounded-none focus:bg-white focus:text-black text-zinc-700 text-[10px] font-black uppercase tracking-widest p-3 cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>TERMINATE_SESSION</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
