import { useState } from "react";
import {
  Menu, Radio, Bell, Search, Heart, ChevronRight, User,
  Home, FolderOpen,
} from "lucide-react";
import type { TabKey, DynamicTab } from "../types";
import { PHONE_ICON_MAP } from "../types";

/** Realistic iOS-style status bar with proper SVG icons */
function PhoneStatusBar({ time = "9:41", light = false }: { time?: string; light?: boolean }) {
  const fill = light ? "#ffffff" : "#1f2937";
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 ${light ? "" : "bg-white"}`}>
      <span className={`text-[11px] font-semibold tracking-tight ${light ? "text-white" : "text-gray-900"}`}>{time}</span>
      <div className="flex items-center gap-1">
        {/* Signal bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="8" width="3" height="3" rx="0.5" fill={fill} opacity="0.4"/>
          <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" fill={fill} opacity="0.6"/>
          <rect x="9" y="3" width="3" height="8" rx="0.5" fill={fill} opacity="0.8"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill={fill}/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.5a1 1 0 100 2 1 1 0 000-2z" fill={fill}/>
          <path d="M4.93 8.47a4.5 4.5 0 016.14 0" stroke={fill} strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M2.1 5.64a8 8 0 0111.8 0" stroke={fill} strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M.34 2.8a11 11 0 0115.32 0" stroke={fill} strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2" stroke={fill} strokeWidth="1"/>
          <rect x="2" y="2" width="15" height="8" rx="1" fill={fill}/>
          <path d="M22 4v4a1.5 1.5 0 000-4z" fill={fill} opacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

/** The bottom tab bar rendered inside the phone */
function PhoneTabBar({ activeTabId, dynTabs, onDynSelect }: {
  activeTabId: string;
  dynTabs: DynamicTab[];
  onDynSelect: (id: string) => void;
}) {
  const visibleTabs = dynTabs.filter(t => t.visible);
  return (
    <div className="bg-white border-t border-gray-200 flex items-center justify-around px-1 py-1.5">
      {visibleTabs.map(tab=>(
        <button key={tab.id} onClick={()=>onDynSelect(tab.id)}
          className="flex flex-col items-center gap-0.5 min-w-0">
          <span className={tab.id===activeTabId?"text-blue-600":"text-gray-400"}>
            {PHONE_ICON_MAP[tab.iconKey] ?? <Home className="w-[18px] h-[18px]"/>}
          </span>
          <span className={`text-[8px] font-medium truncate max-w-[48px] ${tab.id===activeTabId?"text-blue-600":"text-gray-400"}`}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export function PhonePreview({ activeTab, onTabChange, dynTabs, activeTabId, onDynSelect }: {
  activeTab: TabKey;
  onTabChange:(t:TabKey)=>void;
  dynTabs: DynamicTab[];
  activeTabId: string;
  onDynSelect: (id: string) => void;
}) {
  const [device, setDevice] = useState<"iphone" | "android">("iphone");
  const isIphone = device === "iphone";

  return (
    <div className="flex flex-col items-center justify-center h-full py-4">
      {/* Device switcher */}
      <div className="flex items-center gap-1 mb-3 bg-gray-200/80 dark:bg-gray-700/80 rounded-lg p-0.5">
        <button
          onClick={() => setDevice("iphone")}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${
            isIphone ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
          }`}
        >
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><rect x="1" y="0.5" width="8" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="11.5" r="1" fill="currentColor"/></svg>
          iPhone
        </button>
        <button
          onClick={() => setDevice("android")}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${
            !isIphone ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
          }`}
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><rect x="1" y="2" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="4" cy="1" r="0.7"/><circle cx="8" cy="1" r="0.7"/></svg>
          Android
        </button>
      </div>

      {/* Outer shell -- titanium bezel */}
      <div className={`relative bg-[#1a1a1a] ${isIphone ? "rounded-[50px]" : "rounded-[28px]"}`}
        style={{
          width: 280,
          padding: isIphone ? "12px 10px" : "8px 6px",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 0 0 2px #1a1a1a, 0 25px 60px -12px rgba(0,0,0,0.5), 0 0 100px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}>

        {/* Side buttons */}
        {isIphone ? (
          <>
            {/* Silent switch */}
            <div className="absolute -left-[3px] top-[72px] w-[3px] h-6 bg-[#2a2a2a] rounded-l-sm"/>
            {/* Volume up */}
            <div className="absolute -left-[3px] top-[106px] w-[3px] h-10 bg-[#2a2a2a] rounded-l-sm"/>
            {/* Volume down */}
            <div className="absolute -left-[3px] top-[152px] w-[3px] h-10 bg-[#2a2a2a] rounded-l-sm"/>
            {/* Power */}
            <div className="absolute -right-[3px] top-[110px] w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm"/>
          </>
        ) : (
          <>
            {/* Power + volume on right for Android */}
            <div className="absolute -right-[3px] top-[90px] w-[3px] h-12 bg-[#2a2a2a] rounded-r-sm"/>
            <div className="absolute -right-[3px] top-[130px] w-[3px] h-10 bg-[#2a2a2a] rounded-r-sm"/>
            <div className="absolute -right-[3px] top-[148px] w-[3px] h-10 bg-[#2a2a2a] rounded-r-sm"/>
          </>
        )}

        {/* Screen */}
        <div className={`bg-white ${isIphone ? "rounded-[42px]" : "rounded-[22px]"} overflow-hidden relative`} style={{height: 560}}>
          {/* Dynamic Island (iPhone) or punch-hole camera (Android) */}
          {isIphone ? (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black rounded-full flex items-center justify-center"
              style={{width: 92, height: 28, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)"}}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a3a] border border-[#2a2a4a]" style={{marginLeft: 24}}/>
            </div>
          ) : (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[14px] h-[14px] rounded-full bg-black border-2 border-gray-800"/>
          )}

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <PhoneStatusBar time="9:41"/>
          </div>

          {/* Scrollable content area */}
          <div className="absolute left-0 right-0 bottom-0 overflow-hidden flex flex-col"
            style={{top: 42}}>
            <div className="flex-1 overflow-hidden">
              {activeTab==="HOME"     && <HomeTabContent/>}
              {activeTab==="Category" && <CategoryTabContent/>}
              {activeTab==="Live"     && <LiveTabContent/>}
              {activeTab==="Wishlist" && <WishlistTabContent/>}
              {activeTab==="User"     && <UserTabContent/>}
            </div>
            <PhoneTabBar activeTabId={activeTabId} dynTabs={dynTabs} onDynSelect={onDynSelect}/>
            {/* Home indicator (iPhone) or nav bar (Android) */}
            {isIphone ? (
              <div className="flex items-center justify-center py-1.5 bg-white">
                <div className="w-[36%] h-[5px] rounded-full bg-gray-900/20"/>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-6 py-2 bg-white border-t border-gray-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="5"/></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeTabContent() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto overflow-x-hidden">
      {/* App header */}
      <div className="flex items-center gap-2 px-3 pt-2 pb-2 bg-white border-b border-gray-100">
        <Menu className="w-4 h-4 text-gray-600 flex-shrink-0"/>
        {/* Logo circle */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center flex-shrink-0">
          <Radio className="w-3.5 h-3.5 text-white"/>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-900 leading-none">Yemen TV</p>
          <p className="text-[8px] text-gray-400 leading-none mt-0.5">Live News</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-0.5 bg-red-600 text-white rounded-full px-1.5 py-0.5">
            <span className="text-[7px]">{"\u{1F4E2}"}</span>
            <span className="text-[7px] font-bold">Breaking</span>
          </div>
          <Bell className="w-3.5 h-3.5 text-gray-500"/>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 px-3 py-2 overflow-hidden">
        {["Latest","Arabic","Houthi","INTL"].map((c,i)=>(
          <div key={c} className={`px-2 py-0.5 rounded-full text-[8px] font-semibold whitespace-nowrap flex-shrink-0 ${i===0?"bg-red-600 text-white":"border border-gray-300 text-gray-600"}`}>{c}</div>
        ))}
      </div>

      {/* Breaking News section */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1">
            <span className="text-[10px]">{"\u{1F525}"}</span>
            <span className="text-[10px] font-bold text-gray-900">Breaking News</span>
          </div>
          <div className="flex items-center gap-1 border border-gray-200 rounded-full px-2 py-0.5">
            <Search className="w-2.5 h-2.5 text-gray-400"/>
            <span className="text-[7px] text-gray-500">Search</span>
          </div>
        </div>

        {/* Featured card */}
        <div className="rounded-xl overflow-hidden mb-3 relative" style={{height:90}}>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-700/60 to-gray-500/20"/>
          <div className="absolute inset-0 flex flex-col justify-between p-2">
            <div className="self-start bg-red-600 text-white text-[6px] font-bold px-1.5 py-0.5 rounded">locally</div>
            <div>
              <p className="text-[8px] text-white font-bold leading-tight line-clamp-2">The Hajja governor emphasizes readiness to respond to any escalati...</p>
              <p className="text-[7px] text-white/60 mt-0.5">3h ago</p>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <p className="text-[10px] font-bold text-gray-900 mb-1.5">Latest News</p>
        <div className="space-y-1.5">
          {[
            {cat:"LOCALLY",title:"The Minister of Public Works directs readiness measures to t...",time:"12h ago",hasThumb:false},
            {cat:"LOCALLY",title:"Governor of Hajjah visits families of victims from the Iftar massa...",time:"14h ago",hasThumb:true},
          ].map((item,i)=>(
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-2 flex gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-[6px] font-bold text-red-500 uppercase tracking-wide">{item.cat}</span>
                <p className="text-[8px] font-semibold text-gray-900 leading-tight mt-0.5 line-clamp-2">{item.title}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  <div className="w-2 h-2 rounded-full border border-gray-300 flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"/>
                  </div>
                  <span className="text-[7px] text-gray-400">{item.time}</span>
                </div>
              </div>
              {item.hasThumb ? (
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-5 bg-gray-300 rounded"/>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                  <div className="text-gray-300 text-[14px]">{"\u{1F4F0}"}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryTabContent() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      {/* App bar */}
      <div className="flex items-center gap-2 px-3 pt-2 pb-2 bg-white border-b border-gray-100">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center flex-shrink-0">
          <Radio className="w-3.5 h-3.5 text-white"/>
        </div>
        <span className="text-[10px] font-bold text-gray-900 flex-1">Categories</span>
        <Search className="w-3.5 h-3.5 text-gray-400"/>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        {[
          {label:"Local News",   color:"bg-blue-100",   icon:"\u{1F4F0}"},
          {label:"Arabic",       color:"bg-green-100",  icon:"\u{1F30D}"},
          {label:"Sports",       color:"bg-orange-100", icon:"\u26BD"},
          {label:"Technology",   color:"bg-violet-100", icon:"\u{1F4BB}"},
          {label:"Entertainment",color:"bg-pink-100",   icon:"\u{1F3AC}"},
          {label:"Science",      color:"bg-cyan-100",   icon:"\u{1F52C}"},
        ].map(cat=>(
          <div key={cat.label} className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-100">
            <div className={`w-7 h-7 rounded-lg ${cat.color} flex items-center justify-center text-[12px] flex-shrink-0`}>{cat.icon}</div>
            <span className="text-[9px] font-semibold text-gray-800 flex-1">{cat.label}</span>
            <ChevronRight className="w-3 h-3 text-gray-300"/>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveTabContent() {
  return (
    <div className="bg-gray-900 h-full overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-2 pb-2 bg-black/40">
        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/><span className="text-[8px] text-white font-bold">LIVE</span></div>
        <span className="text-[10px] font-bold text-white flex-1">Live Streams</span>
      </div>
      <div className="p-2.5 space-y-2">
        <div className="rounded-xl overflow-hidden relative" style={{height:100}}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600"/>
          <div className="absolute top-1.5 left-2 flex items-center gap-1 bg-red-600 rounded px-1 py-0.5">
            <div className="w-1 h-1 rounded-full bg-white animate-pulse"/>
            <span className="text-[6px] text-white font-bold">LIVE</span>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="h-1 bg-white/20 rounded-full"><div className="h-full w-2/3 bg-orange-400 rounded-full"/></div>
          </div>
        </div>
        {[
          {title:"Yemen TV \u2014 Live Broadcast",sub:"Started 2h ago"},
          {title:"Al-Masirah Live News",sub:"Started 45m ago"},
        ].map((s,i)=>(
          <div key={i} className="flex gap-2 bg-gray-800 rounded-xl p-2">
            <div className="w-12 h-9 rounded-lg bg-gray-700 flex-shrink-0 flex items-center justify-center">
              <Radio className="w-3.5 h-3.5 text-gray-500"/>
            </div>
            <div>
              <p className="text-[8px] font-semibold text-white">{s.title}</p>
              <p className="text-[7px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WishlistTabContent() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      <div className="px-3 pt-3 pb-2">
        <p className="text-[11px] font-bold text-gray-900">Read Later</p>
        <p className="text-[8px] text-gray-400 mt-0.5">Saved articles</p>
      </div>
      <div className="px-3 space-y-1.5">
        {[
          {title:"Breaking: UN security council meets on Yemen crisis",time:"2h ago",cat:"World"},
          {title:"Economic forum opens in Riyadh with 40 nations",time:"5h ago",cat:"Economy"},
          {title:"New technology breakthrough in solar energy",time:"Yesterday",cat:"Tech"},
        ].map((item,i)=>(
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-2.5 flex gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[6px] font-bold text-blue-500 uppercase">{item.cat}</span>
              <p className="text-[8px] font-semibold text-gray-900 leading-tight mt-0.5 line-clamp-2">{item.title}</p>
              <p className="text-[7px] text-gray-400 mt-1">{item.time}</p>
            </div>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 flex-shrink-0 mt-0.5"/>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserTabContent() {
  return (
    <div className="bg-gray-100 h-full overflow-y-auto">
      {/* Page title */}
      <div className="px-4 pt-3 pb-2 bg-gray-100">
        <p className="text-[13px] font-bold text-gray-900">Settings</p>
      </div>

      {/* PREFERENCES group */}
      <div className="px-3 mb-2">
        <p className="text-[7px] font-semibold text-gray-500 uppercase tracking-wider px-1 mb-1">Preferences</p>
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
          {[
            {bg:"bg-blue-100",  emoji:"\u{1F310}", label:"Language",       sub:"English / \u0627\u0644\u0639\u0631\u0628\u064A\u0629", right:"English"},
            {bg:"bg-red-100",   emoji:"\u{1F514}", label:"Notifications",  sub:"News alerts, Live streams", right:null},
            {bg:"bg-green-100", emoji:"\u229E",  label:"Dashboard Mode", sub:"Switch between Native and Web", right:null},
            {bg:"bg-violet-100",emoji:"\u{1F319}", label:"Appearance",     sub:"System", right:null},
            {bg:"bg-teal-100",  emoji:"Tt", label:"Text Size",      sub:"Change article text size", right:null},
          ].map(row=>(
            <div key={row.label} className="flex items-center gap-2 px-3 py-2">
              <div className={`w-6 h-6 rounded-lg ${row.bg} flex items-center justify-center flex-shrink-0 text-[9px]`}>{row.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-semibold text-gray-900">{row.label}</p>
                <p className="text-[7px] text-gray-400">{row.sub}</p>
              </div>
              {row.right&&<span className="text-[7px] text-gray-400 mr-1">{row.right}</span>}
              <ChevronRight className="w-2.5 h-2.5 text-gray-300 flex-shrink-0"/>
            </div>
          ))}
        </div>
      </div>

      {/* SUPPORT & INFO group */}
      <div className="px-3">
        <p className="text-[7px] font-semibold text-gray-500 uppercase tracking-wider px-1 mb-1">Support &amp; Info</p>
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
          {[
            {bg:"bg-green-100", emoji:"\u2139\uFE0F",label:"About Us"},
            {bg:"bg-orange-100",emoji:"\u2709\uFE0F",label:"Contact Us"},
            {bg:"bg-gray-100",  emoji:"\u{1F512}",label:"Privacy Policy"},
          ].map(row=>(
            <div key={row.label} className="flex items-center gap-2 px-3 py-2">
              <div className={`w-6 h-6 rounded-lg ${row.bg} flex items-center justify-center flex-shrink-0 text-[9px]`}>{row.emoji}</div>
              <p className="text-[9px] font-semibold text-gray-900 flex-1">{row.label}</p>
              <ChevronRight className="w-2.5 h-2.5 text-gray-300 flex-shrink-0"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// suppress unused import warnings
void useState; void User; void FolderOpen;
