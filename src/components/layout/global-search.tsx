"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Shield, Database, LayoutDashboard, 
  User, Settings, Bookmark, Key, Bell, 
  CreditCard, Command, Sparkles
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useUIStore } from "@/stores/ui.store";

export function GlobalSearch() {
  const router = useRouter();
  const { globalSearchOpen, setGlobalSearchOpen } = useUIStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setGlobalSearchOpen(false);
      command();
    },
    [setGlobalSearchOpen]
  );

  return (
    <CommandDialog open={globalSearchOpen} onOpenChange={setGlobalSearchOpen}>
      <CommandInput placeholder="Type a command or search intelligence..." />
      <CommandList className="bg-[#0f0f13] border-zinc-800">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Intelligence">
          <CommandItem onSelect={() => runCommand(() => router.push("/search"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Records</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/saved"))}>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Intelligence Vault</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator className="bg-zinc-800" />
        <CommandGroup heading="Institutional">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/profile"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/api-keys"))}>
            <Key className="mr-2 h-4 w-4" />
            <span>API Keys</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/subscription"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Subscription</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator className="bg-zinc-800" />
        <CommandGroup heading="System">
          <CommandItem onSelect={() => runCommand(() => router.push("/docs"))}>
            <Database className="mr-2 h-4 w-4" />
            <span>API Documentation</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/notifications"))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
