import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GripVertical } from "lucide-react";
import type { TabKey } from "../types";
import { APP_TABS, Toggle } from "../types";

export function TabBarPanel({ activeTab, onTabChange }: { activeTab: TabKey; onTabChange:(t:TabKey)=>void }) {
  const { toast } = useToast();
  const [tabStyle, setTabStyle]           = useState<"bottom"|"top">("bottom");
  const [activeColor, setActiveColor]     = useState("#f97316");
  const [inactiveColor, setInactiveColor] = useState("#9ca3af");
  const [bgColor, setBgColor]             = useState("#ffffff");
  const [showLabels, setShowLabels]       = useState(true);
  const [showIcons, setShowIcons]         = useState(true);
  const [tabItems, setTabItems]           = useState(APP_TABS.map(t=>({...t,visible:true})));

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">TabBar Designer</h2>
          <p className="text-xs text-gray-500 mt-0.5">Customise the bottom navigation tabs</p>
        </div>

        {/* Live preview */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="h-24 bg-gray-100 flex items-center justify-center">
            <span className="text-[10px] text-gray-400">App content area</span>
          </div>
          <div className="flex items-center justify-around px-2 py-2 border-t" style={{backgroundColor:bgColor}}>
            {tabItems.filter(t=>t.visible).map(tab=>(
              <button key={tab.key} onClick={()=>onTabChange(tab.key)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg">
                {showIcons&&<span className="[&_svg]:w-4 [&_svg]:h-4" style={{color:activeTab===tab.key?activeColor:inactiveColor}}>{tab.icon}</span>}
                {showLabels&&<span className="text-[9px] font-medium" style={{color:activeTab===tab.key?activeColor:inactiveColor}}>{tab.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Position</p>
            <div className="flex gap-2">
              {(["bottom","top"] as const).map(s=>(
                <button key={s} onClick={()=>setTabStyle(s)}
                  className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border capitalize transition-colors ${tabStyle===s?"bg-violet-50 border-violet-400 text-violet-700":"border-gray-200 text-gray-500"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between"><span className="text-xs text-gray-600">Show Icons</span><Toggle value={showIcons} onChange={()=>setShowIcons(v=>!v)}/></div>
              <div className="flex items-center justify-between"><span className="text-xs text-gray-600">Show Labels</span><Toggle value={showLabels} onChange={()=>setShowLabels(v=>!v)}/></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Colors</p>
            {[
              {label:"Active",val:activeColor,set:setActiveColor},
              {label:"Inactive",val:inactiveColor,set:setInactiveColor},
              {label:"Background",val:bgColor,set:setBgColor},
            ].map(({label,val,set})=>(
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono text-[10px]">{val}</span>
                  <label className="w-6 h-6 rounded border border-gray-200 overflow-hidden cursor-pointer relative">
                    <input type="color" value={val} onChange={e=>set(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"/>
                    <div className="w-full h-full rounded" style={{backgroundColor:val}}/>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab items reorder */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Tab Items</p>
          <div className="space-y-1.5">
            {tabItems.map((tab,i)=>(
              <div key={tab.key} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                <GripVertical className="w-4 h-4 text-gray-300 cursor-grab"/>
                <span className="text-gray-400 [&_svg]:w-4 [&_svg]:h-4">{tab.icon}</span>
                <span className="text-xs font-medium text-gray-700 flex-1">{tab.key}</span>
                <Toggle value={tab.visible} onChange={()=>setTabItems(prev=>prev.map((t,j)=>j===i?{...t,visible:!t.visible}:t))}/>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={()=>{ setTabStyle("bottom"); setActiveColor("#f97316"); setInactiveColor("#9ca3af"); setBgColor("#ffffff"); setShowLabels(true); setShowIcons(true); setTabItems(APP_TABS.map(t=>({...t,visible:true}))); toast({ title:"Reset", description:"TabBar settings restored to defaults." }); }} className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Reset</button>
          <button onClick={()=>toast({ title:"Saved \u2713", description:"TabBar settings have been saved." })} className="px-4 py-2 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
