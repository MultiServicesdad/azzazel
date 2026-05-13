import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  globalSearchOpen: boolean;
  mobileNavOpen: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setGlobalSearchOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  globalSearchOpen: false,
  mobileNavOpen: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (sidebarOpen) =>
    set({ sidebarOpen }),

  toggleSidebarCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (sidebarCollapsed) =>
    set({ sidebarCollapsed }),

  setGlobalSearchOpen: (globalSearchOpen) =>
    set({ globalSearchOpen }),

  setMobileNavOpen: (mobileNavOpen) =>
    set({ mobileNavOpen }),
}));
