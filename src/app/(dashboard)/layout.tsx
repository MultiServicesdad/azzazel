"use client";

import * as React from "react";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { DashboardTopbar } from "@/components/layout/topbar";
import { GlobalSearch } from "@/components/layout/global-search";
import { useUIStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-black text-white flex">
      <DashboardSidebar />
      <GlobalSearch />
      
      <main 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          "lg:ml-0", // Sidebar is fixed, but we'll use padding instead
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
        )}
      >
        <DashboardTopbar />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-6 md:p-8"
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
