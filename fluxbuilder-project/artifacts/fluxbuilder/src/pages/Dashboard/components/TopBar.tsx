import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Menu, HelpCircle, Bell, ChevronDown, Settings, LogOut,
} from "lucide-react";

export function TopBar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return null;
      return res.json() as Promise<{ userId: string; email: string; fullName?: string }>;
    },
    retry: false,
    staleTime: 60_000,
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      queryClient.setQueryData(["me"], null);
      navigate("/login");
    } catch {
      toast({ title: "Error", description: "Failed to log out. Please try again." });
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="h-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex items-center px-4 flex-shrink-0">
      <button onClick={onToggleSidebar} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2">
        <Menu className="w-5 h-5"/>
      </button>
      <div className="flex-1"/>
      <div className="flex items-center gap-3">
        <button onClick={()=>toast({title:"Help & Docs",description:"Visit the Docs page for guides and API reference."})} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <HelpCircle className="w-4 h-4"/>
        </button>
        <button onClick={()=>toast({title:"Notifications",description:"No new notifications."})} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
          <Bell className="w-4 h-4"/>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-[120px] truncate">
              {user?.fullName ?? user?.email ?? "Account"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400"/>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.fullName ?? "User"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); toast({ title: "Settings", description: "Account settings coming soon." }); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400"/> Account Settings
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700"/>
                <button
                  onClick={() => { setShowUserMenu(false); handleLogout(); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4"/> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
