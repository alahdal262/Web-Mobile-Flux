import { Search, Menu, Bell, Radio } from "lucide-react";
import { NavClassic, NavFloating, NavSegmented, NavIconOnly, NavWave, NavDark } from "./NavStyles";

export function TmplNews({ name }: { name: string }) {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-blue-600"/><span className="text-[8px] font-bold text-gray-800 truncate">{name}</span></div>
        <Search className="w-2.5 h-2.5 text-gray-400"/>
      </div>
      <div className="h-14 bg-gradient-to-r from-blue-700 to-blue-500 relative flex-shrink-0 flex items-end p-1.5">
        <div className="space-y-0.5 flex-1"><div className="h-1.5 bg-white/80 rounded w-24"/><div className="h-1 bg-white/50 rounded w-16"/></div>
        <span className="absolute top-1 right-1 text-[6px] bg-red-500 text-white px-1 rounded font-bold">LIVE</span>
      </div>
      <div className="flex gap-1 px-2 py-1 overflow-hidden flex-shrink-0">
        {["All","World","Tech","Sports"].map((c,i)=>(
          <span key={c} className={`text-[5px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap ${i===0?"bg-blue-500 text-white":"bg-gray-100 text-gray-500"}`}>{c}</span>
        ))}
      </div>
      <div className="flex-1 px-1.5 space-y-1 overflow-hidden">
        {[80,65,90].map((w,i)=>(
          <div key={i} className="flex gap-1.5 items-center">
            <div className="w-8 h-6 bg-gray-200 rounded flex-shrink-0"/>
            <div className="flex-1 space-y-0.5"><div className="h-1.5 bg-gray-300 rounded" style={{width:`${w}%`}}/><div className="h-1 bg-gray-200 rounded w-1/2"/></div>
          </div>
        ))}
      </div>
      <NavClassic tabs={["Home","Cat","Live","History","More"]} active={0} color="blue"/>
    </div>
  );
}
export function TmplDark({ name }: { name: string }) {
  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 bg-black/40 border-b border-white/10 flex-shrink-0">
        <span className="text-[8px] font-bold text-white">{name}</span>
        <div className="flex gap-1"><div className="w-2 h-2 rounded-sm bg-gray-600"/><Search className="w-2.5 h-2.5 text-gray-400"/></div>
      </div>
      <div className="mx-1.5 mt-1.5 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
        <div className="absolute top-1 left-1 flex items-center gap-0.5"><div className="w-1 h-1 rounded-full bg-red-500"/><span className="text-[5px] text-red-400 font-bold">LIVE</span></div>
        <div className="absolute bottom-1.5 left-1.5 space-y-0.5"><div className="h-1.5 bg-white/80 rounded w-20"/><div className="h-1 bg-white/40 rounded w-12"/></div>
      </div>
      <div className="flex-1 p-1.5 grid grid-cols-2 gap-1 overflow-hidden">
        {[1,2,3,4].map(i=>(
          <div key={i} className="bg-gray-800 rounded overflow-hidden">
            <div className="h-6 bg-gray-700 relative"><div className="absolute bottom-0.5 right-0.5 text-[4px] bg-black/60 text-white px-0.5 rounded">12:30</div></div>
            <div className="p-0.5 space-y-0.5"><div className="h-1 bg-gray-600 rounded"/><div className="h-0.5 bg-gray-700 rounded w-2/3"/></div>
          </div>
        ))}
      </div>
      <NavWave tabs={["Home","Search","Add","Saved","Me"]} active={0} accent="red"/>
    </div>
  );
}
export function TmplMagazine({ name }: { name: string }) {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-200 flex-shrink-0">
        <Menu className="w-2.5 h-2.5 text-gray-500"/>
        <span className="text-[8px] font-extrabold text-gray-900 italic tracking-tight">{name}</span>
        <Search className="w-2.5 h-2.5 text-gray-400"/>
      </div>
      <div className="h-16 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"/>
        <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-amber-100"/>
        <div className="absolute bottom-1.5 left-2 right-2 z-20 space-y-0.5">
          <span className="text-[5px] bg-rose-500 text-white px-1 rounded font-bold">FEATURE</span>
          <div className="h-1.5 bg-white/90 rounded w-3/4"/>
          <div className="h-1 bg-white/60 rounded w-1/2"/>
        </div>
      </div>
      <div className="flex-1 p-1.5 grid grid-cols-2 gap-1 overflow-hidden">
        {[["bg-blue-100","World"],["bg-rose-100","Style"],["bg-amber-100","Tech"],["bg-emerald-100","Life"]].map(([bg,label],i)=>(
          <div key={i} className="rounded overflow-hidden border border-gray-100">
            <div className={`h-8 ${bg} relative`}><span className="absolute bottom-0.5 left-0.5 text-[4px] font-bold text-gray-600">{label}</span></div>
            <div className="p-0.5"><div className="h-1 bg-gray-200 rounded w-4/5"/></div>
          </div>
        ))}
      </div>
      <NavSegmented tabs={["Home","Cat","Live","Saved","Me"]} active={0} accent="rose"/>
    </div>
  );
}
export function TmplFood({ name }: { name: string }) {
  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 bg-white border-b border-gray-100 flex-shrink-0">
        <span className="text-[8px] font-bold text-gray-800">{name}</span>
        <div className="flex gap-1 items-center"><div className="w-2 h-2 rounded-full bg-orange-100 flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-orange-500"/></div><Search className="w-2.5 h-2.5 text-gray-400"/></div>
      </div>
      <div className="h-10 bg-gradient-to-r from-orange-400 to-red-400 mx-1.5 mt-1.5 rounded-lg relative flex-shrink-0 flex items-center px-2">
        <div className="space-y-0.5"><div className="h-1.5 bg-white/80 rounded w-16"/><div className="h-1 bg-white/50 rounded w-10"/></div>
        <div className="absolute right-2 w-8 h-8 rounded-full bg-white/20 border border-white/40"/>
      </div>
      <div className="flex gap-1 px-1.5 py-1 overflow-hidden flex-shrink-0">
        {["\u{1F355}","\u{1F354}","\u{1F35C}","\u{1F32E}"].map((e,i)=>(
          <span key={i} className={`text-[8px] p-0.5 rounded ${i===0?"bg-orange-100":""}`}>{e}</span>
        ))}
      </div>
      <div className="flex-1 px-1.5 grid grid-cols-2 gap-1 overflow-hidden">
        {[["bg-amber-200"],["bg-red-200"],["bg-orange-200"],["bg-yellow-200"]].map(([hbg],i)=>(
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className={`h-7 ${hbg}`}/>
            <div className="p-0.5 space-y-0.5"><div className="h-1 bg-gray-200 rounded"/><div className="h-0.5 w-1/2 bg-orange-200 rounded"/></div>
          </div>
        ))}
      </div>
      <NavFloating tabs={["Home","Search","Cart","Wishlist","Me"]} active={0} accent="orange"/>
    </div>
  );
}
export function TmplMinimal({ name }: { name: string }) {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 bg-white border-b border-gray-100 flex-shrink-0">
        <span className="text-[8px] font-bold text-gray-800">{name}</span>
        <Bell className="w-2.5 h-2.5 text-gray-400"/>
      </div>
      <div className="mx-1.5 my-1 h-4 bg-gray-100 rounded-full flex items-center px-1.5 gap-1 flex-shrink-0">
        <Search className="w-1.5 h-1.5 text-gray-400"/><div className="h-1 bg-gray-300 rounded w-12"/>
      </div>
      <div className="flex-1 px-1.5 space-y-1 overflow-hidden">
        {[1,2,3,4].map(i=>(
          <div key={i} className="flex gap-1.5 bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
            <div className="w-7 h-7 bg-gray-100 rounded-lg flex-shrink-0"/>
            <div className="space-y-0.5 flex-1 pt-0.5">
              <div className="h-1.5 bg-gray-200 rounded w-4/5"/>
              <div className="h-1 bg-gray-100 rounded w-1/2"/>
            </div>
            <div className="w-1 h-1 rounded-full bg-violet-400 mt-0.5"/>
          </div>
        ))}
      </div>
      <NavIconOnly tabs={["Home","Cat","Read","Save","Me"]} active={0} accent="violet"/>
    </div>
  );
}
export function TmplShop({ name }: { name: string }) {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 bg-white border-b border-gray-100 flex-shrink-0">
        <span className="text-[8px] font-bold text-gray-800">{name}</span>
        <div className="relative"><div className="w-2.5 h-2.5 rounded bg-gray-300"/><div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 flex items-center justify-center"><span className="text-[3px] text-white font-bold">2</span></div></div>
      </div>
      <div className="mx-1.5 my-1 h-4 bg-gray-100 rounded-lg flex items-center px-1.5 gap-1 flex-shrink-0">
        <Search className="w-1.5 h-1.5 text-gray-400"/><div className="h-1 bg-gray-300 rounded w-14"/>
      </div>
      <div className="mx-1.5 h-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg flex items-center px-2 mb-1 flex-shrink-0">
        <div className="space-y-0.5"><div className="h-1.5 bg-white/80 rounded w-14"/><div className="h-1 bg-white/50 rounded w-8"/></div>
      </div>
      <div className="flex gap-1 px-1.5 overflow-hidden flex-shrink-0 mb-1">
        {["All","Women","Men","Kids"].map((c,i)=>(
          <span key={c} className={`text-[5px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap ${i===0?"bg-violet-500 text-white":"bg-gray-100 text-gray-500"}`}>{c}</span>
        ))}
      </div>
      <div className="flex-1 px-1.5 grid grid-cols-2 gap-1 overflow-hidden">
        {["bg-purple-100","bg-fuchsia-100","bg-violet-100","bg-pink-100"].map((bg,i)=>(
          <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
            <div className={`h-8 ${bg}`}/>
            <div className="p-0.5 space-y-0.5"><div className="h-1 bg-gray-200 rounded w-3/4"/><div className="h-1 bg-violet-200 rounded w-1/3"/></div>
          </div>
        ))}
      </div>
      <NavSegmented tabs={["Home","Search","Cart","Wishlist","Me"]} active={0} accent="violet"/>
    </div>
  );
}
export function TmplSocial({ name }: { name: string }) {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 flex-shrink-0">
        <span className="text-[8px] font-bold text-gray-900">{name}</span>
        <div className="flex gap-1"><div className="w-2.5 h-2.5 rounded bg-gray-200"/><div className="w-2.5 h-2.5 rounded bg-gray-200"/></div>
      </div>
      <div className="flex gap-1.5 px-2 py-1.5 border-b border-gray-100 flex-shrink-0 overflow-hidden">
        {[["bg-gradient-to-br from-pink-400 to-orange-400","ring-2 ring-orange-300"],["bg-blue-200",""],["bg-green-200",""],["bg-purple-200",""]].map(([bg,ring],i)=>(
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className={`w-5 h-5 rounded-full ${bg} ${ring}`}/>
            <div className="h-0.5 bg-gray-200 rounded w-5"/>
          </div>
        ))}
      </div>
      <div className="flex-1 space-y-1 overflow-hidden">
        {[1,2].map(i=>(
          <div key={i}>
            <div className="flex items-center gap-1 px-1.5 py-0.5">
              <div className="w-3 h-3 rounded-full bg-gray-200"/><div className="h-1 bg-gray-200 rounded w-10"/>
            </div>
            <div className={`h-14 ${i===1?"bg-gradient-to-br from-purple-100 to-pink-100":"bg-gradient-to-br from-blue-100 to-cyan-100"}`}/>
            <div className="flex gap-2 px-2 py-0.5">
              {[1,2,3].map(j=><div key={j} className="w-2.5 h-2.5 rounded-sm bg-gray-200"/>)}
            </div>
          </div>
        ))}
      </div>
      <NavClassic tabs={["Home","Search","Add","Reels","Me"]} active={0} color="indigo"/>
    </div>
  );
}
export function TmplSports({ name }: { name: string }) {
  return (
    <div className="h-full flex flex-col overflow-hidden" style={{background:"#0d0d0d"}}>
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-sm"/><span className="text-[8px] font-black text-white">{name}</span></div>
        <div className="flex items-center gap-0.5"><div className="w-1 h-1 rounded-full bg-green-400"/><span className="text-[5px] text-green-400 font-bold">LIVE</span></div>
      </div>
      <div className="mx-1.5 mt-1.5 rounded-lg overflow-hidden flex-shrink-0 border border-green-500/30" style={{background:"#111"}}>
        <div className="bg-green-500/20 p-1.5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-0.5"><div className="w-4 h-4 rounded-full bg-blue-500"/><div className="h-0.5 bg-gray-600 rounded w-5"/></div>
            <div className="text-center"><span className="text-[10px] font-black text-white">2 &mdash; 1</span><div className="text-[5px] text-green-400 font-bold">67'</div></div>
            <div className="flex flex-col items-center gap-0.5"><div className="w-4 h-4 rounded-full bg-red-500"/><div className="h-0.5 bg-gray-600 rounded w-5"/></div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-1.5 space-y-1 overflow-hidden">
        {[1,2,3].map(i=>(
          <div key={i} className="flex items-center justify-between rounded p-1" style={{background:"#1a1a1a"}}>
            <div className="h-1 bg-gray-700 rounded w-12"/>
            <div className="text-[7px] font-bold text-green-400">FT</div>
            <div className="h-1 bg-gray-700 rounded w-12"/>
          </div>
        ))}
      </div>
      <NavDark tabs={["Home","Scores","Teams","Videos","Me"]} active={0} accent="green"/>
    </div>
  );
}
export function TmplTravel({ name }: { name: string }) {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="relative flex-shrink-0">
        <div className="h-20 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600">
          <div className="absolute inset-0 flex flex-col justify-between p-2">
            <div className="flex items-center justify-between">
              <span className="text-[7px] font-bold text-white">{name}</span>
              <div className="w-2.5 h-2.5 rounded bg-white/30"/>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg flex items-center gap-1 px-1.5 py-1">
              <Search className="w-1.5 h-1.5 text-white/70"/><div className="h-1 bg-white/50 rounded w-16"/>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1 px-1.5 py-1 overflow-hidden flex-shrink-0">
        {["\u2708\uFE0F Flights","\u{1F3E8} Hotels","\u{1F3AD} Tours"].map((c,i)=>(
          <span key={i} className={`text-[5px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${i===0?"bg-blue-500 text-white":"bg-gray-100 text-gray-600"}`}>{c}</span>
        ))}
      </div>
      <div className="flex-1 px-1.5 grid grid-cols-2 gap-1 overflow-hidden">
        {[["bg-gradient-to-br from-orange-200 to-yellow-200","Paris"],["bg-gradient-to-br from-sky-200 to-cyan-200","Bali"],["bg-gradient-to-br from-rose-200 to-pink-200","Tokyo"],["bg-gradient-to-br from-emerald-200 to-teal-200","NYC"]].map(([bg,city],i)=>(
          <div key={i} className={`${bg} rounded-lg relative overflow-hidden`} style={{height:"40px"}}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
            <span className="absolute bottom-0.5 left-1 text-[5px] font-bold text-white">{city}</span>
          </div>
        ))}
      </div>
      <NavFloating tabs={["Home","Search","Trips","Saved","Me"]} active={0} accent="blue"/>
    </div>
  );
}
export function TmplBusiness({ name }: { name: string }) {
  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 bg-indigo-600 flex-shrink-0">
        <span className="text-[8px] font-bold text-white">{name}</span>
        <div className="w-2.5 h-2.5 rounded bg-white/30"/>
      </div>
      <div className="flex gap-1 p-1.5 flex-shrink-0">
        {[["bg-blue-500","\u21911 2%"],["bg-green-500","\u21918%"],["bg-violet-500","\u219124%"]].map(([bg,val],i)=>(
          <div key={i} className={`flex-1 ${bg} rounded-lg p-1 text-center`}>
            <div className="h-2 bg-white/30 rounded mb-0.5"/>
            <span className="text-[5px] text-white font-bold">{val}</span>
          </div>
        ))}
      </div>
      <div className="mx-1.5 bg-white rounded-lg p-1.5 mb-1 border border-gray-100 flex-shrink-0">
        <div className="h-1 bg-gray-200 rounded w-16 mb-1"/>
        <div className="flex items-end gap-0.5 h-8">
          {[40,65,45,80,55,70,90].map((h,i)=>(
            <div key={i} className={`flex-1 rounded-t ${i===6?"bg-indigo-500":"bg-indigo-100"}`} style={{height:`${h}%`}}/>
          ))}
        </div>
      </div>
      <div className="flex-1 px-1.5 space-y-1 overflow-hidden">
        {[1,2,3].map(i=>(
          <div key={i} className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-gray-100">
            <div className="w-3 h-3 rounded bg-indigo-100 flex-shrink-0"/>
            <div className="flex-1 h-1.5 bg-gray-200 rounded"/>
            <div className="h-1.5 bg-green-200 rounded w-6"/>
          </div>
        ))}
      </div>
      <NavClassic tabs={["Dashboard","Analytics","Tasks","Team","Me"]} active={0} color="indigo"/>
    </div>
  );
}
export function TmplMusic({ name }: { name: string }) {
  return (
    <div className="h-full flex flex-col overflow-hidden" style={{background:"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)"}}>
      <div className="flex items-center justify-between px-2 py-1.5 flex-shrink-0">
        <span className="text-[8px] font-bold text-white">{name}</span>
        <div className="flex gap-1"><div className="w-2 h-2 rounded bg-white/20"/><div className="w-2 h-2 rounded bg-white/20"/></div>
      </div>
      <div className="flex justify-center pt-1 pb-1 flex-shrink-0">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg relative flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white/20 border border-white/30"/>
        </div>
      </div>
      <div className="flex-1 px-2 space-y-1 overflow-hidden">
        <div className="space-y-0.5 text-center"><div className="h-2 bg-white/70 rounded w-20 mx-auto"/><div className="h-1 bg-white/30 rounded w-14 mx-auto"/></div>
        <div className="h-0.5 bg-white/20 rounded-full mx-1 overflow-hidden"><div className="h-full bg-purple-400 rounded-full" style={{width:"40%"}}/></div>
        <div className="flex items-center justify-center gap-3">
          {[1,2,3,4,5].map(i=><div key={i} className={`rounded ${i===3?"w-4 h-4 bg-white":"w-2.5 h-2.5 bg-white/30"}`}/>)}
        </div>
        <div className="space-y-0.5">
          {[1,2,3].map(i=>(
            <div key={i} className="flex items-center gap-1.5 p-0.5 rounded" style={{background:"rgba(255,255,255,0.07)"}}>
              <div className="w-4 h-4 rounded bg-white/10 flex-shrink-0"/>
              <div className="flex-1 space-y-0.5"><div className="h-1 bg-white/30 rounded"/><div className="h-0.5 bg-white/15 rounded w-2/3"/></div>
              <div className="h-1 bg-white/20 rounded w-3"/>
            </div>
          ))}
        </div>
      </div>
      <NavDark tabs={["Home","Search","Library","Radio","Me"]} active={0} accent="violet"/>
    </div>
  );
}

// suppress unused import warnings
void Radio;
