"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Search, Bookmark, Key, Bell, 
  CreditCard, Settings, ChevronLeft, Shield, LogOut,
  BarChart3, Users, ShieldAlert, Activity,
  FileSearch, ToggleLeft, Server, ScrollText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui.store";
import { DASHBOARD_NAV, ADMIN_NAV } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth.store";

const iconMap: Record<string, any> = {
  LayoutDashboard, Search, Bookmark, Key, Bell, CreditCard, Settings,
  BarChart3, Users, ShieldAlert, Activity, FileSearch, ToggleLeft, Server, ScrollText
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapse, mobileNavOpen, setMobileNavOpen } = useUIStore();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setIsAdmin(user.role === 'ADMIN' || user.role === 'SUPERADMIN');
      console.log(`[Azazel_Sidebar] Authenticated as: ${user.username} (Role: ${user.role})`);
      console.log(`[Azazel_Sidebar] Admin access: ${user.role === 'ADMIN' || user.role === 'SUPERADMIN'}`);
    }
  }, [user]);

  const NavItem = ({ item, collapsed }: { item: any, collapsed: boolean }) => {
    const router = useRouter();
    const Icon = iconMap[item.icon] || LayoutDashboard;
    const isActive = pathname === item.href;

    const handleNavigate = (e: React.MouseEvent) => {
      e.preventDefault();
      console.log(`[Sidebar] Force navigating to: ${item.href}`);
      router.push(item.href);
    };

    return (
      <a
        href={item.href}
        onClick={handleNavigate}
        className={cn(
          "flex items-center gap-3 px-3 py-3 transition-none group relative border border-transparent cursor-pointer",
          isActive 
            ? "bg-white text-black font-black" 
            : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
        )}
      >
        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-black" : "group-hover:text-white")} />
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
            {item.label}
          </div>
        )}
      </a>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ 
          width: sidebarCollapsed ? 64 : 240,
          x: mobileNavOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -240 : 0)
        }}
        className={cn(
          "fixed top-0 left-0 h-screen z-50 bg-black border-r border-zinc-900 flex flex-col transition-all duration-300",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-zinc-900">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-black flex items-center justify-center shrink-0 overflow-hidden border border-zinc-800">
              <img src="/azazel.gif" alt="Azazel" className="w-full h-full object-cover" />
            </div>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-black tracking-tighter text-white uppercase italic"
              >
                Azazel
              </motion.span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex text-zinc-700 hover:text-white shrink-0 hover:bg-zinc-900"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-6 scrollbar-hide">
          <div className="space-y-1">
            {!sidebarCollapsed && <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 mt-2 px-2">Subsystems</p>}
            {DASHBOARD_NAV.map((item) => (
              <NavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
            ))}
          </div>

          {isAdmin && (
            <div className="space-y-1">
              {!sidebarCollapsed && <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 mt-2 px-2">Institutional_Admin</p>}
              {ADMIN_NAV.map((item) => (
                <NavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-zinc-900">
          <Button
            variant="ghost"
            onClick={() => logout()}
            className={cn(
              "w-full flex items-center gap-3 text-zinc-700 hover:text-white hover:bg-zinc-900 rounded-none",
              sidebarCollapsed ? "justify-center px-0" : "justify-start px-2"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Terminate_Session</span>}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
