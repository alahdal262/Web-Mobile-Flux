import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Bell, User, Menu, Zap,
  AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";
import { Toggle } from "../types";

export function AppBarPanel() {
  const { toast } = useToast();
  const [titleAlign, setTitleAlign]     = useState<"left"|"center"|"right">("center");
  const [showSearch, setShowSearch]     = useState(true);
  const [showNotif, setShowNotif]       = useState(true);
  const [showMenu, setShowMenu]         = useState(false);
  const [showLogo, setShowLogo]         = useState(true);
  const [appBarBg, setAppBarBg]         = useState("#1e3a5f");
  const [titleColor, setTitleColor]     = useState("#ffffff");
  const [iconColor, setIconColor]       = useState("#ffffff");
  const [appBarStyle, setAppBarStyle]   = useState<"filled"|"transparent"|"elevated">("filled");
  const [titleText, setTitleText]       = useState("en.yementv.tv");
  const defaultAppBar = { titleAlign:"center" as const, showSearch:true, showNotif:true, showMenu:false, showLogo:true, appBarBg:"#1e3a5f", titleColor:"#ffffff", iconColor:"#ffffff", appBarStyle:"filled" as const, titleText:"en.yementv.tv" };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">AppBar Designer</h2>
          <p className="text-xs text-gray-500 mt-0.5">Configure the top navigation bar of your app</p>
        </div>

        {/* Live preview */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3" style={{backgroundColor:appBarBg}}>
            {showMenu&&<Menu className="w-5 h-5 flex-shrink-0" style={{color:iconColor}}/>}
            {showLogo&&<div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Zap className="w-3 h-3" style={{color:iconColor}}/></div>}
            <span className={`text-sm font-bold flex-1 ${titleAlign==="center"?"text-center":titleAlign==="right"?"text-right":"text-left"} px-2`} style={{color:titleColor}}>{titleText}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {showSearch&&<Search className="w-4 h-4" style={{color:iconColor}}/>}
              {showNotif&&<Bell className="w-4 h-4" style={{color:iconColor}}/>}
              <User className="w-4 h-4" style={{color:iconColor}}/>
            </div>
          </div>
          <div className="h-16 bg-gray-100 flex items-center justify-center">
            <span className="text-[10px] text-gray-400">App content here</span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          {/* Style */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Style</p>
            <div className="flex gap-2">
              {(["filled","transparent","elevated"] as const).map(s=>(
                <button key={s} onClick={()=>setAppBarStyle(s)}
                  className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border capitalize transition-colors ${appBarStyle===s?"bg-violet-50 border-violet-400 text-violet-700":"border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-gray-600 block">Title Text</label>
              <input value={titleText} onChange={e=>setTitleText(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-400"/>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-gray-600 block">Title Alignment</label>
              <div className="flex gap-1">
                {([["left",<AlignLeft key="l" className="w-3.5 h-3.5"/>],["center",<AlignCenter key="c" className="w-3.5 h-3.5"/>],["right",<AlignRight key="r" className="w-3.5 h-3.5"/>]] as const).map(([a,icon])=>(
                  <button key={a} onClick={()=>setTitleAlign(a as "left"|"center"|"right")}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg border transition-colors ${titleAlign===a?"bg-violet-50 border-violet-400 text-violet-700":"border-gray-200 text-gray-500"}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Colors</p>
            {[
              {label:"Background",val:appBarBg,set:setAppBarBg},
              {label:"Title Color",val:titleColor,set:setTitleColor},
              {label:"Icon Color",val:iconColor,set:setIconColor},
            ].map(({label,val,set})=>(
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">{val}</span>
                  <label className="w-7 h-7 rounded-lg border border-gray-200 overflow-hidden cursor-pointer">
                    <input type="color" value={val} onChange={e=>set(e.target.value)} className="opacity-0 absolute"/>
                    <div className="w-full h-full rounded" style={{backgroundColor:val}}/>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility toggles */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Visible Elements</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {label:"Logo / Icon",   val:showLogo,   set:setShowLogo},
              {label:"Search Button", val:showSearch,  set:setShowSearch},
              {label:"Notifications", val:showNotif,   set:setShowNotif},
              {label:"Hamburger Menu",val:showMenu,    set:setShowMenu},
            ].map(({label,val,set})=>(
              <div key={label} className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-600">{label}</span>
                <Toggle value={val} onChange={()=>set(v=>!v)}/>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={()=>{ setTitleAlign(defaultAppBar.titleAlign); setShowSearch(defaultAppBar.showSearch); setShowNotif(defaultAppBar.showNotif); setShowMenu(defaultAppBar.showMenu); setShowLogo(defaultAppBar.showLogo); setAppBarBg(defaultAppBar.appBarBg); setTitleColor(defaultAppBar.titleColor); setIconColor(defaultAppBar.iconColor); setAppBarStyle(defaultAppBar.appBarStyle); setTitleText(defaultAppBar.titleText); toast({ title:"Reset", description:"AppBar settings restored to defaults." }); }} className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Reset</button>
          <button onClick={()=>toast({ title:"Saved \u2713", description:"AppBar settings have been saved." })} className="px-4 py-2 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
