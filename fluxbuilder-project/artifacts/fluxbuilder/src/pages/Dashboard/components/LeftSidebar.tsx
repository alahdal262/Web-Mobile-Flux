import {
  LayoutDashboard, Paintbrush, Grid, SquareStack, Rows3,
  PanelLeft, LayoutTemplate, Puzzle, Hammer, MessageSquare,
  Link2, ShieldCheck, Settings, Sun, Moon,
} from "lucide-react";
import type { SidebarSection, DesignSubItem } from "../types";

export function LeftSidebar({
  activeSection, onSectionChange,
  activeDesignSub, onDesignSubChange,
  isDark, onToggleDark,
}: {
  activeSection: SidebarSection;
  onSectionChange: (s: SidebarSection) => void;
  activeDesignSub: DesignSubItem;
  onDesignSubChange: (s: DesignSubItem) => void;
  isDark: boolean;
  onToggleDark: () => void;
}) {
  const mainNav: { key: SidebarSection; icon: React.ReactNode; label: string }[] = [
    { key:"Dashboard",        icon:<LayoutDashboard className="w-4 h-4"/>, label:"Dashboard" },
    { key:"Design",           icon:<Paintbrush className="w-4 h-4"/>,      label:"Design" },
    { key:"Features",         icon:<Puzzle className="w-4 h-4"/>,          label:"Features" },
    { key:"Build",            icon:<Hammer className="w-4 h-4"/>,          label:"Build" },
    { key:"Chat",             icon:<MessageSquare className="w-4 h-4"/>,   label:"Chat" },
    { key:"Dynamic Links",    icon:<Link2 className="w-4 h-4"/>,           label:"Dynamic Links" },
    { key:"Product License",  icon:<ShieldCheck className="w-4 h-4"/>,     label:"Product License" },
  ];

  const designSubItems: { label: DesignSubItem & string; icon: React.ReactNode }[] = [
    { label:"Templates", icon:<LayoutTemplate className="w-3.5 h-3.5"/> },
    { label:"AppBar",    icon:<SquareStack className="w-3.5 h-3.5"/> },
    { label:"TabBar",    icon:<Rows3 className="w-3.5 h-3.5"/> },
    { label:"Side Menu", icon:<PanelLeft className="w-3.5 h-3.5"/> },
    { label:"Layouts",   icon:<Grid className="w-3.5 h-3.5"/> },
  ];

  return (
    <div className="w-56 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700 flex flex-col h-full select-none">
      {/* User / app header */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-600 underline truncate cursor-pointer hover:text-blue-800">fluxchat.myshopify.com</p>
          </div>
          <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">Free</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Your Task list: 0/4</span>
          <Settings className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600"/>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {mainNav.map(({ key, icon, label }) => (
          <div key={key}>
            <button
              onClick={() => {
                onSectionChange(key);
                if (key !== "Design") {
                  onDesignSubChange(null);
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 text-sm font-medium mb-0.5 hover:translate-x-0.5 ${
                activeSection === key
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border-l-[3px] border-l-blue-500"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100 border-l-[3px] border-l-transparent"
              }`}
            >
              <span className={activeSection===key?"text-blue-600 dark:text-blue-400":"text-gray-400 dark:text-gray-500"}>{icon}</span>
              <span className="flex-1">{label}</span>
            </button>

            {key==="Design" && (
              <div className={`ml-6 mb-1 overflow-hidden transition-all duration-200 ${activeSection==="Design" ? "max-h-64" : "max-h-0"}`}>
                {designSubItems.map(sub=>(
                  <button
                    key={sub.label}
                    onClick={()=>{
                      onSectionChange("Design");
                      onDesignSubChange(activeDesignSub===sub.label ? null : sub.label as DesignSubItem);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 hover:translate-x-0.5 ${
                      activeDesignSub===sub.label && activeSection==="Design"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    <span className={activeDesignSub===sub.label && activeSection==="Design"?"text-blue-500":"text-gray-400 dark:text-gray-500"}>{sub.icon}</span>
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Active plan card */}
      <div className="px-3 pb-2">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <p className="text-sm font-bold text-green-800 dark:text-green-300 mb-0.5">Active plan</p>
          <p className="text-[11px] text-green-600 dark:text-green-400 mb-3">Unlock advance features</p>
          <button className="w-full py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-150">
            Upgrade
          </button>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-[10px] text-gray-400">Mobile-WP v2.4</p>
        <div className="flex gap-2 mt-1.5">
          <button
            onClick={() => isDark && onToggleDark()}
            className={`flex-1 flex items-center justify-center gap-1 text-[10px] py-1 rounded border transition-colors ${
              !isDark
                ? "bg-white border-gray-200 text-gray-700 font-semibold"
                : "bg-transparent border-transparent text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Sun className="w-3 h-3"/> Light
          </button>
          <button
            onClick={() => !isDark && onToggleDark()}
            className={`flex-1 flex items-center justify-center gap-1 text-[10px] py-1 rounded border transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-100 font-semibold"
                : "bg-transparent border-transparent text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Moon className="w-3 h-3"/> Dark
          </button>
        </div>
      </div>
    </div>
  );
}
