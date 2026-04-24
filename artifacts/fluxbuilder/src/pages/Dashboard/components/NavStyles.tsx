import { Search } from "lucide-react";

export function NavClassic({ tabs, active, color }: { tabs:string[]; active:number; color:string }) {
  return (
    <div className="flex items-center justify-around border-t border-gray-100 py-1 bg-white flex-shrink-0">
      {tabs.map((t,i)=>(
        <div key={t} className="flex flex-col items-center gap-0.5">
          <div style={{width:"10px",height:"10px",borderRadius:"3px",background:i===active?color:"#d1d5db"}}/>
          <span style={{fontSize:"4px",color:i===active?"#1c1c1e":"#9ca3af",fontWeight:i===active?"700":"400"}}>{t}</span>
        </div>
      ))}
    </div>
  );
}
export function NavFloating({ tabs, active, accent }: { tabs:string[]; active:number; accent:string }) {
  const bgs: Record<string,string> = { blue:"bg-blue-600",red:"bg-red-600",orange:"bg-orange-500",rose:"bg-rose-600",violet:"bg-violet-600",green:"bg-green-600",indigo:"bg-indigo-600",dark:"bg-gray-900" };
  const bg = bgs[accent] ?? "bg-blue-600";
  return (
    <div className="px-2 pb-1 flex-shrink-0">
      <div className={`flex items-center justify-around ${bg} rounded-full py-1 shadow-lg`}>
        {tabs.map((t,i)=>(
          <div key={t} className={`flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded-full ${i===active?"bg-white/25":""}`}>
            <div className={`w-2 h-2 rounded-sm ${i===active?"bg-white":"bg-white/40"}`}/>
            <span className={`text-[4px] ${i===active?"text-white font-bold":"text-white/50"}`}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export function NavSegmented({ tabs, active, accent }: { tabs:string[]; active:number; accent:string }) {
  const pill: Record<string,string> = { blue:"bg-blue-50 border-blue-200",rose:"bg-rose-50 border-rose-200",violet:"bg-violet-50 border-violet-200",green:"bg-green-50 border-green-200",orange:"bg-orange-50 border-orange-200",indigo:"bg-indigo-50 border-indigo-200" };
  const dot: Record<string,string>  = { blue:"bg-blue-500",rose:"bg-rose-500",violet:"bg-violet-500",green:"bg-green-500",orange:"bg-orange-500",indigo:"bg-indigo-500" };
  const txt: Record<string,string>  = { blue:"text-blue-600",rose:"text-rose-600",violet:"text-violet-600",green:"text-green-600",orange:"text-orange-600",indigo:"text-indigo-600" };
  return (
    <div className="flex items-center justify-around border-t border-gray-100 py-1 px-1 bg-white flex-shrink-0">
      {tabs.map((t,i)=>(
        <div key={t} className={`flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded-full ${i===active?`border ${pill[accent]??"bg-blue-50 border-blue-200"}`:""}`}>
          <div className={`w-2 h-2 rounded-sm ${i===active?(dot[accent]??"bg-blue-500"):"bg-gray-300"}`}/>
          <span className={`text-[4px] font-semibold ${i===active?(txt[accent]??"text-blue-600"):"text-gray-400"}`}>{t}</span>
        </div>
      ))}
    </div>
  );
}
export function NavIconOnly({ tabs, active, accent }: { tabs:string[]; active:number; accent:string }) {
  const cls: Record<string,string> = { blue:"bg-blue-500",violet:"bg-violet-500",rose:"bg-rose-500",green:"bg-green-500",orange:"bg-orange-500",indigo:"bg-indigo-500" };
  const ac = cls[accent] ?? "bg-blue-500";
  return (
    <div className="flex items-center justify-around border-t border-gray-200 py-2 bg-white flex-shrink-0">
      {tabs.map((t,i)=>(
        <div key={t} className={`flex items-center justify-center p-1 rounded-xl ${i===active?"bg-gray-100":""}`}>
          <div className={`w-3 h-3 rounded ${i===active?ac:"bg-gray-300"}`}/>
        </div>
      ))}
    </div>
  );
}
export function NavWave({ tabs, active, accent }: { tabs:string[]; active:number; accent:string }) {
  const cls: Record<string,string> = { blue:"bg-blue-500",red:"bg-red-500",orange:"bg-orange-500",rose:"bg-rose-500",violet:"bg-violet-500",green:"bg-green-500",indigo:"bg-indigo-500" };
  const ac = cls[accent] ?? "bg-blue-500";
  const center = Math.floor(tabs.length / 2);
  return (
    <div className="border-t border-gray-100 bg-white pt-0.5 pb-0.5 flex-shrink-0">
      <div className="flex items-end justify-around">
        {tabs.map((t,i)=> i===center ? (
          <div key={t} className="flex flex-col items-center -mt-3">
            <div className={`w-6 h-6 rounded-full ${ac} shadow-lg flex items-center justify-center`}>
              <div className="w-2.5 h-2.5 rounded-sm bg-white"/>
            </div>
            <span className="text-[4px] text-gray-400 mt-0.5">{t}</span>
          </div>
        ) : (
          <div key={t} className="flex flex-col items-center gap-0.5 pb-0.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${i===active&&i!==center?ac:"bg-gray-200"}`}/>
            <span className={`text-[4px] ${i===active&&i!==center?"text-gray-700 font-bold":"text-gray-400"}`}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export function NavDark({ tabs, active, accent }: { tabs:string[]; active:number; accent:string }) {
  const cls: Record<string,string> = { red:"bg-red-500",violet:"bg-violet-500",blue:"bg-blue-400",green:"bg-green-400",amber:"bg-amber-400",cyan:"bg-cyan-400" };
  const ac = cls[accent] ?? "bg-red-500";
  return (
    <div className="flex items-center justify-around border-t border-white/10 py-1 flex-shrink-0" style={{background:"rgba(0,0,0,0.35)"}}>
      {tabs.map((t,i)=>(
        <div key={t} className="flex flex-col items-center gap-0.5">
          <div className={`w-2.5 h-2.5 rounded-sm ${i===active?ac:"bg-gray-600"}`}/>
          <span className={`text-[5px] ${i===active?"text-gray-200 font-bold":"text-gray-500"}`}>{t}</span>
        </div>
      ))}
    </div>
  );
}

// suppress unused import warning — Search is used by templates that import this module
void Search;
