import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { DesignLayout } from "../types";
import { DESIGN_LAYOUTS, LAYOUT_ICONS, Toggle } from "../types";

export function LayoutsPanel() {
  const { toast } = useToast();
  const [selectedLayout, setSelectedLayout] = useState<DesignLayout>("Home");
  const [colCount, setColCount]             = useState(2);
  const [spacing, setSpacing]               = useState(8);
  const [showTitle, setShowTitle]           = useState(true);
  const [showThumb, setShowThumb]           = useState(true);
  const [showDesc, setShowDesc]             = useState(false);
  const [cardRadius, setCardRadius]         = useState(8);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Layout Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Configure how content is displayed in each section</p>
        </div>

        {/* Layout picker */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Design Layout</p>
          <div className="grid grid-cols-4 gap-2">
            {DESIGN_LAYOUTS.map(layout=>(
              <button key={layout} onClick={()=>setSelectedLayout(layout)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                  selectedLayout===layout?"border-violet-500 bg-violet-50 text-violet-700":"border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"}`}>
                <span className={`[&_svg]:w-5 [&_svg]:h-5 ${selectedLayout===layout?"text-violet-500":"text-gray-400"}`}>{LAYOUT_ICONS[layout]}</span>
                <span className="text-[9px] font-semibold leading-tight text-center">{layout}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Display options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Grid Options</p>
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-1">Columns: {colCount}</label>
              <input type="range" min={1} max={4} value={colCount} onChange={e=>setColCount(+e.target.value)} className="w-full accent-violet-500"/>
              <div className="flex justify-between text-[9px] text-gray-400 mt-0.5"><span>1</span><span>2</span><span>3</span><span>4</span></div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-1">Spacing: {spacing}px</label>
              <input type="range" min={0} max={24} value={spacing} onChange={e=>setSpacing(+e.target.value)} className="w-full accent-violet-500"/>
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-1">Card Radius: {cardRadius}px</label>
              <input type="range" min={0} max={24} value={cardRadius} onChange={e=>setCardRadius(+e.target.value)} className="w-full accent-violet-500"/>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Visibility</p>
            {[
              {label:"Show Thumbnail",val:showThumb,set:setShowThumb},
              {label:"Show Title",    val:showTitle,set:setShowTitle},
              {label:"Show Description",val:showDesc,set:setShowDesc},
            ].map(({label,val,set})=>(
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{label}</span>
                <Toggle value={val} onChange={()=>set(v=>!v)}/>
              </div>
            ))}

            {/* Mini preview */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 mb-2">Preview</p>
              <div className="grid gap-1" style={{gridTemplateColumns:`repeat(${colCount},1fr)`,gap:`${spacing/4}px`}}>
                {Array.from({length:colCount*2}).map((_,i)=>(
                  <div key={i} className="bg-gray-100 overflow-hidden" style={{borderRadius:`${cardRadius}px`}}>
                    {showThumb&&<div className="bg-gray-300 h-8"/>}
                    {showTitle&&<div className="px-1 py-0.5"><div className="h-1.5 bg-gray-400/50 rounded"/></div>}
                    {showDesc&&<div className="px-1 pb-0.5"><div className="h-1 bg-gray-300 rounded w-3/4"/></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={()=>{ setSelectedLayout("Home"); setColCount(2); setSpacing(8); setShowTitle(true); setShowThumb(true); setShowDesc(false); setCardRadius(8); toast({ title:"Reset", description:"Layout settings restored to defaults." }); }} className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Reset</button>
          <button onClick={()=>toast({ title:"Saved \u2713", description:"Layout settings have been saved." })} className="px-4 py-2 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
