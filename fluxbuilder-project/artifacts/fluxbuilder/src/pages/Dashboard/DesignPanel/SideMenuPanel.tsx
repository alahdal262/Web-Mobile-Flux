import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Toggle } from "../types";

const DEFAULT_MENU_ITEMS = [
  {id:1,label:"Home",icon:"Home",visible:true},
  {id:2,label:"My Profile",icon:"User",visible:true},
  {id:3,label:"Settings",icon:"Settings",visible:true},
  {id:4,label:"Notifications",icon:"Bell",visible:true},
  {id:5,label:"Help & Support",icon:"HelpCircle",visible:true},
  {id:6,label:"Privacy Policy",icon:"Shield",visible:false},
  {id:7,label:"Logout",icon:"LogOut",visible:true},
];

export function SideMenuPanel() {
  const { toast } = useToast();
  const nextIdRef = useRef(8);
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS.map(i=>({...i})));
  const [menuBg, setMenuBg]         = useState("#1e293b");
  const [textColor, setTextColor]   = useState("#f8fafc");
  const [accentColor,setAccent]     = useState("#8b5cf6");
  const [showHeader, setShowHeader] = useState(true);
  const [menuWidth, setMenuWidth]   = useState(280);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Side Menu Designer</h2>
          <p className="text-xs text-gray-500 mt-0.5">Configure the slide-out navigation drawer</p>
        </div>

        {/* Live preview */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm flex h-52">
          <div className="w-48 flex-shrink-0 flex flex-col" style={{backgroundColor:menuBg}}>
            {showHeader&&(
              <div className="px-3 py-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-full mb-2" style={{backgroundColor:accentColor}}/>
                <div className="h-2 w-20 rounded bg-white/30 mb-1"/>
                <div className="h-1.5 w-14 rounded bg-white/20"/>
              </div>
            )}
            <div className="flex-1 py-2 overflow-hidden">
              {menuItems.filter(m=>m.visible).slice(0,5).map(item=>(
                <div key={item.id} className="flex items-center gap-2.5 px-3 py-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{backgroundColor:accentColor+"60"}}/>
                  <span className="text-[10px] font-medium" style={{color:textColor}}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <span className="text-[10px] text-gray-400">App content</span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Settings</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-xs text-gray-600">Show Header</span><Toggle value={showHeader} onChange={()=>setShowHeader(v=>!v)}/></div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-1">Menu Width: {menuWidth}px</label>
              <input type="range" min={200} max={340} value={menuWidth} onChange={e=>setMenuWidth(+e.target.value)}
                className="w-full accent-violet-500"/>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Colors</p>
            {[
              {label:"Background",val:menuBg,set:setMenuBg},
              {label:"Text",val:textColor,set:setTextColor},
              {label:"Accent",val:accentColor,set:setAccent},
            ].map(({label,val,set})=>(
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-mono">{val}</span>
                  <label className="w-6 h-6 rounded border border-gray-200 overflow-hidden cursor-pointer relative">
                    <input type="color" value={val} onChange={e=>set(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"/>
                    <div className="w-full h-full" style={{backgroundColor:val}}/>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Menu Items</p>
            <button onClick={()=>{ const id=nextIdRef.current++; setMenuItems(prev=>[...prev,{id,label:"New Item",icon:"Star",visible:true}]); toast({title:"Item Added",description:"New menu item added. Rename it as needed."}); }} className="flex items-center gap-1 text-[10px] text-violet-600 font-medium hover:text-violet-700">
              <Plus className="w-3 h-3"/> Add Item
            </button>
          </div>
          <div className="space-y-1.5">
            {menuItems.map((item,i)=>(
              <div key={item.id} className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${item.visible?"bg-gray-50 border-gray-100":"bg-gray-50/50 border-gray-100 opacity-50"}`}>
                <GripVertical className="w-4 h-4 text-gray-300 cursor-grab flex-shrink-0"/>
                <span className="text-xs font-medium text-gray-700 flex-1">{item.label}</span>
                <Toggle value={item.visible} onChange={()=>setMenuItems(prev=>prev.map((m,j)=>j===i?{...m,visible:!m.visible}:m))}/>
                <button onClick={()=>{ setMenuItems(prev=>prev.filter((_,j)=>j!==i)); toast({title:"Item Removed",description:`"${item.label}" removed from menu.`}); }} className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors">
                  <Trash2 className="w-3 h-3"/>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={()=>{ setMenuItems(DEFAULT_MENU_ITEMS.map(i=>({...i}))); setMenuBg("#1e293b"); setTextColor("#f8fafc"); setAccent("#8b5cf6"); setShowHeader(true); setMenuWidth(280); toast({ title:"Reset", description:"Side menu settings restored to defaults." }); }} className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Reset</button>
          <button onClick={()=>toast({ title:"Saved \u2713", description:"Side menu settings have been saved." })} className="px-4 py-2 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
