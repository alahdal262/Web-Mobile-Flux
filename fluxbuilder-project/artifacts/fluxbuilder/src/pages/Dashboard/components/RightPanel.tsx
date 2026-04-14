import { useState } from "react";
import {
  ChevronRight, ChevronDown, Monitor, Trash2, Plus,
  HelpCircle, Link2,
} from "lucide-react";
import type { TabKey, DesignLayout } from "../types";
import { DESIGN_LAYOUTS, LAYOUT_ICONS, APP_TABS, Toggle } from "../types";

export function DashboardRightPanel() {
  return (
    <div className="w-56 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
      </div>
      <div className="flex-1 px-4 py-6 border-b border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-300 dark:text-gray-600 text-center">No notifications</p>
      </div>
      <div className="px-4 py-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Documents</h3>
      </div>
      <div className="flex-1 px-4 py-6">
        <p className="text-xs text-gray-300 dark:text-gray-600 text-center">No documents</p>
      </div>
    </div>
  );
}

export function RightPanel({ activeTab, activeLayout, onLayoutChange }: {
  activeTab: TabKey;
  activeLayout: DesignLayout;
  onLayoutChange: (l: DesignLayout) => void;
}) {
  const [itemStyle, setItemStyle]       = useState("listTile");
  const [showBg, setShowBg]             = useState(true);
  const [requiredLogin, setRequired]    = useState(false);
  const [enableForward, setForward]     = useState(false);
  const [enableBackward, setBackward]   = useState(false);
  const [showTabMenu, setShowTabMenu]   = useState(true);

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-y-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Monitor className="w-3.5 h-3.5"/> App Info</span>
        <ChevronRight className="w-3 h-3 text-gray-300"/>
        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{activeTab}</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] bg-red-50 text-red-500 border border-red-200 px-1.5 py-0.5 rounded font-medium">New!</span>
          <Trash2 className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-600"/>
        </div>
      </div>

      {/* Tab thumbnails */}
      <div className="flex gap-2 px-4 py-3 border-b border-gray-100 overflow-x-auto">
        {APP_TABS.map(tab=>(
          <button key={tab.key} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-12 h-16 rounded border-2 transition-colors overflow-hidden ${activeTab===tab.key?"border-blue-500":"border-gray-200"} bg-gray-50 flex items-center justify-center`}>
              <span className="text-gray-400 [&_svg]:w-4 [&_svg]:h-4">{tab.icon}</span>
            </div>
            <span className="text-[9px] text-gray-500 font-medium">{tab.key}</span>
          </button>
        ))}
        <button className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-12 h-16 rounded border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 hover:border-violet-300 transition-colors">
            <Plus className="w-4 h-4 text-gray-300"/>
          </div>
        </button>
      </div>

      {/* Design Layout grid */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            Design Layout <HelpCircle className="w-3 h-3 text-gray-400"/>
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400"/>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {DESIGN_LAYOUTS.map(layout=>(
            <button key={layout} onClick={()=>onLayoutChange(layout)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                activeLayout===layout?"border-blue-500 bg-blue-50 text-blue-600":"border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"}`}>
              <span className={`[&_svg]:w-4 [&_svg]:h-4 ${activeLayout===layout?"text-blue-500":"text-gray-400"}`}>{LAYOUT_ICONS[layout]}</span>
              <span className="text-[8px] font-medium leading-tight text-center">{layout}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style */}
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2.5">Style</span>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Item Style</span>
          <select value={itemStyle} onChange={e=>setItemStyle(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:border-violet-400">
            <option value="listTile">listTile</option>
            <option value="grid">Grid</option>
            <option value="card">Card</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>
      </div>

      {/* Background */}
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2.5">Background</span>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Show Background</span>
          <Toggle value={showBg} onChange={()=>setShowBg(v=>!v)}/>
        </div>
        {showBg&&(
          <>
            <p className="text-xs text-gray-500 mb-2">Background Image</p>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-2 flex flex-col items-end gap-1">
              <div className="flex gap-1">
                <button className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors"><Link2 className="w-3 h-3 text-gray-500"/></button>
                <button className="p-1.5 rounded bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3 text-gray-500"/></button>
              </div>
              <div className="w-full h-16 rounded bg-gradient-to-br from-blue-400 via-violet-400 to-orange-300 opacity-70"/>
            </div>
          </>
        )}
      </div>

      {/* Page settings */}
      {activeLayout==="Page"&&(
        <div className="px-4 py-3 border-b border-gray-100 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Page Title</label>
            <input className="w-full text-xs border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-violet-400 bg-gray-50" placeholder="Enter title..."/>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Website</label>
            <input className="w-full text-xs border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-violet-400 bg-gray-50" defaultValue="https://yementv.tv/live"/>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Script <span className="text-gray-400 font-normal normal-case">optional</span></label>
            <textarea className="w-full text-xs border border-gray-200 rounded px-2.5 py-2 focus:outline-none focus:border-violet-400 bg-gray-50 h-16 resize-none" placeholder="Enter javascript code..."/>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">Settings <HelpCircle className="w-3 h-3 text-gray-400"/></span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400"/>
        </div>
        {[
          {label:"Required Login", val:requiredLogin, set:setRequired},
          {label:"Enable Forward",  val:enableForward, set:setForward},
          {label:"Enable Backward", val:enableBackward,set:setBackward},
        ].map(({label,val,set})=>(
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-gray-600 flex items-center gap-1">{label} <HelpCircle className="w-3 h-3 text-gray-400"/></span>
            <Toggle value={val} onChange={()=>set((v:boolean)=>!v)}/>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 flex items-center gap-1">Show Tab Menu <HelpCircle className="w-3 h-3 text-gray-400"/></span>
          <Toggle value={showTabMenu} onChange={()=>setShowTabMenu(v=>!v)}/>
        </div>
      </div>
    </div>
  );
}
