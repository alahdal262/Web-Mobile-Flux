import { useState } from "react";
import React from "react";
import { Search, Zap, Smartphone } from "lucide-react";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  TmplNews, TmplDark, TmplMagazine, TmplFood, TmplMinimal,
  TmplShop, TmplSports, TmplTravel, TmplBusiness, TmplMusic,
} from "../components/TemplateScreens";

type TplDef = { id:number; name:string; appType:string; devices:string[]; Preview:React.FC<{name:string}>; footerStyle:string; headerStyle:string; category:string };

const ALL_TEMPLATES: TplDef[] = [
  // ── News & Magazine ──
  { id:0,  name:"News Classic",     appType:"News, Wire Service",       devices:["iOS","Android","PWA"], Preview:TmplNews,     footerStyle:"Classic Tabs",   headerStyle:"Classic",   category:"News" },
  { id:1,  name:"Tech News",        appType:"Technology, Science",      devices:["iOS","Android"],       Preview:TmplDark,     footerStyle:"Wave Center",    headerStyle:"Gradient",  category:"News" },
  { id:2,  name:"Magazine",         appType:"Editorial, Magazine",      devices:["iOS","Android","PWA"], Preview:TmplMagazine, footerStyle:"Segmented Pill", headerStyle:"Drawer",    category:"News" },
  { id:5,  name:"Minimal Reader",   appType:"Minimal News Reader",      devices:["iOS","Android","PWA"], Preview:TmplMinimal,  footerStyle:"Icon Only",      headerStyle:"Minimal",   category:"News" },
  // ── Blog ──
  { id:6,  name:"Personal Blog",    appType:"Blog, Writer",             devices:["iOS","Android","PWA"], Preview:TmplMinimal,  footerStyle:"Icon Only",      headerStyle:"Minimal",   category:"Blog" },
  { id:14, name:"Travel Blog",      appType:"Travel, Photography",      devices:["iOS","Android","PWA"], Preview:TmplTravel,   footerStyle:"Floating Pill",  headerStyle:"Glass",     category:"Blog" },
  { id:4,  name:"Lifestyle Blog",   appType:"Lifestyle, Wellness",      devices:["iOS","Android","PWA"], Preview:TmplFood,     footerStyle:"Floating Pill",  headerStyle:"Classic",   category:"Blog" },
  // ── E-Commerce ──
  { id:20, name:"General Store",    appType:"E-Commerce, Retail",       devices:["iOS","Android","PWA"], Preview:TmplShop,     footerStyle:"Classic Tabs",   headerStyle:"Classic",   category:"E-Commerce" },
  { id:21, name:"Fashion Store",    appType:"Fashion, Clothing",        devices:["iOS","Android","PWA"], Preview:TmplShop,     footerStyle:"Icon Only",      headerStyle:"Minimal",   category:"E-Commerce" },
  { id:22, name:"Grocery",          appType:"Grocery, Delivery",        devices:["iOS","Android","PWA"], Preview:TmplShop,     footerStyle:"Segmented Pill", headerStyle:"Search",    category:"E-Commerce" },
  { id:8,  name:"Digital Products", appType:"Downloads, SaaS",          devices:["iOS","Android","PWA"], Preview:TmplBusiness, footerStyle:"Classic Tabs",   headerStyle:"Gradient",  category:"E-Commerce" },
  // ── Restaurant & Food ──
  { id:9,  name:"Restaurant Menu",  appType:"Restaurant, Cafe",         devices:["iOS","Android","PWA"], Preview:TmplFood,     footerStyle:"Floating Pill",  headerStyle:"Classic",   category:"Restaurant" },
  { id:11, name:"Food Delivery",    appType:"Delivery, Ordering",       devices:["iOS","Android","PWA"], Preview:TmplFood,     footerStyle:"Floating Pill",  headerStyle:"Search",    category:"Restaurant" },
  { id:12, name:"Recipe App",       appType:"Recipes, Cooking",         devices:["iOS","Android","PWA"], Preview:TmplFood,     footerStyle:"Floating Pill",  headerStyle:"Classic",   category:"Restaurant" },
  // ── Portfolio & Creative ──
  { id:30, name:"Clean Portfolio",  appType:"Freelancer, Developer",    devices:["iOS","Android"],       Preview:TmplMinimal,  footerStyle:"Icon Only",      headerStyle:"Minimal",   category:"Portfolio" },
  { id:31, name:"Photography",      appType:"Photographer, Gallery",    devices:["iOS","Android","PWA"], Preview:TmplTravel,   footerStyle:"Floating Pill",  headerStyle:"Glass",     category:"Portfolio" },
  { id:32, name:"Agency",           appType:"Creative Agency",          devices:["iOS","Android","PWA"], Preview:TmplBusiness, footerStyle:"Classic Tabs",   headerStyle:"Gradient",  category:"Portfolio" },
  // ── Education ──
  { id:3,  name:"Online Courses",   appType:"Courses, Learning",        devices:["iOS","Android","PWA"], Preview:TmplBusiness, footerStyle:"Classic Tabs",   headerStyle:"Gradient",  category:"Education" },
  { id:15, name:"School App",       appType:"School, University",       devices:["iOS","Android","PWA"], Preview:TmplNews,     footerStyle:"Classic Tabs",   headerStyle:"Classic",   category:"Education" },
  // ── Service Business ──
  { id:100,name:"Local Service",    appType:"Service, Local Business",  devices:["iOS","Android","PWA"], Preview:TmplBusiness, footerStyle:"Classic Tabs",   headerStyle:"Gradient",  category:"Service" },
  { id:41, name:"Consulting",       appType:"Consulting, B2B",          devices:["iOS","Android","PWA"], Preview:TmplDark,     footerStyle:"Wave Center",    headerStyle:"Gradient",  category:"Service" },
  { id:42, name:"Real Estate",      appType:"Real Estate, Property",    devices:["iOS","Android","PWA"], Preview:TmplTravel,   footerStyle:"Floating Pill",  headerStyle:"Glass",     category:"Service" },
  // ── Entertainment & Media ──
  { id:10, name:"Streaming",        appType:"Video, Movies, TV",        devices:["iOS","Android"],       Preview:TmplDark,     footerStyle:"Dark Tabs",      headerStyle:"Gradient",  category:"Media" },
  { id:40, name:"Podcast",          appType:"Podcast, Audio",           devices:["iOS","Android"],       Preview:TmplMusic,    footerStyle:"Dark Tabs",      headerStyle:"Minimal",   category:"Media" },
  { id:7,  name:"Events",           appType:"Events, Tickets",          devices:["iOS","Android","PWA"], Preview:TmplSports,   footerStyle:"Segmented Pill", headerStyle:"Classic",   category:"Media" },
];

function TemplateLivePreview({ tpl, onApply }: { tpl: TplDef; onApply: (tpl: TplDef) => void }) {
  return (
    <div className="w-[250px] flex-shrink-0 flex flex-col bg-white border-l border-gray-200 overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Live Preview</p>
        <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">{tpl.name}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Phone shell */}
        <div className="px-4 pt-3 flex-shrink-0">
          <div className="mx-auto w-[164px] rounded-[28px] p-[3px] shadow-2xl shadow-black/20" style={{background:"#1c1c1e"}}>
            <div className="rounded-[26px] overflow-hidden p-[2px]" style={{background:"#000"}}>
              {/* Dynamic island */}
              <div className="flex justify-center pt-1.5 pb-0.5">
                <div className="w-12 h-2 rounded-full" style={{background:"#1c1c1e"}}/>
              </div>
              {/* Screen */}
              <div className="rounded-b-[22px] overflow-hidden bg-white" style={{height:"268px"}}>
                {/* Status bar */}
                <div className="flex items-center justify-between px-2.5 pt-1 bg-white text-[6px] font-semibold text-gray-700">
                  <span>9:41</span>
                  <div className="flex items-center gap-0.5">
                    <div className="flex gap-px items-end h-2">
                      <div className="w-0.5 h-0.5 bg-gray-700 rounded-sm"/>
                      <div className="w-0.5 h-1 bg-gray-700 rounded-sm"/>
                      <div className="w-0.5 h-1.5 bg-gray-700 rounded-sm"/>
                      <div className="w-0.5 h-2 bg-gray-700 rounded-sm"/>
                    </div>
                    <div className="w-3 h-1.5 border border-gray-700 rounded-sm relative ml-0.5">
                      <div className="absolute inset-[1px] bg-gray-700 rounded-sm"/>
                    </div>
                  </div>
                </div>
                {/* App content */}
                <div style={{height:"252px",overflow:"hidden"}}>
                  <tpl.Preview name={tpl.name}/>
                </div>
              </div>
              {/* Home indicator */}
              <div className="flex justify-center py-1.5">
                <div className="w-10 h-0.5 bg-gray-600 rounded-full"/>
              </div>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="px-4 pt-3 space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="text-[9px] text-gray-400 w-14 flex-shrink-0 pt-0.5">Devices</span>
            <div className="flex flex-wrap gap-1">
              {tpl.devices.map(d=>(
                <span key={d} className="text-[8px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full font-medium">{d}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400 w-14 flex-shrink-0">Type</span>
            <span className="text-[9px] text-gray-700 font-medium">{tpl.appType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400 w-14 flex-shrink-0">Footer</span>
            <span className="text-[9px] text-gray-700 font-medium">{tpl.footerStyle}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400 w-14 flex-shrink-0">Header</span>
            <span className="text-[9px] text-gray-700 font-medium">{tpl.headerStyle}</span>
          </div>
        </div>

        {/* Footer style options */}
        <div className="px-4 pt-3">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Footer Styles</p>
          <div className="grid grid-cols-3 gap-1">
            {[
              {label:"Classic",  desc:"5 tabs + text"},
              {label:"Floating", desc:"Pill capsule"},
              {label:"Segmented",desc:"Active pill"},
              {label:"Icon Only",desc:"No labels"},
              {label:"Wave",     desc:"Center raised"},
              {label:"Dark",     desc:"Dark theme"},
            ].map((s,i)=>(
              <div key={s.label} className={`rounded-xl p-1.5 border text-center cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 ${i===0?"border-blue-300 bg-blue-50":"border-gray-200 bg-gray-50"}`}>
                <p className="text-[7px] font-bold text-gray-700">{s.label}</p>
                <p className="text-[6px] text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Header style options */}
        <div className="px-4 pt-2 pb-4">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Header Styles</p>
          <div className="grid grid-cols-3 gap-1">
            {[
              {label:"Classic",  desc:"Logo + icons"},
              {label:"Gradient", desc:"Color fill"},
              {label:"Glass",    desc:"Frosted blur"},
              {label:"Drawer",   desc:"Side menu"},
              {label:"Search",   desc:"Search bar"},
              {label:"Minimal",  desc:"Borderless"},
            ].map((s,i)=>(
              <div key={s.label} className={`rounded-xl p-1.5 border text-center cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 ${i===0?"border-blue-300 bg-blue-50":"border-gray-200 bg-gray-50"}`}>
                <p className="text-[7px] font-bold text-gray-700">{s.label}</p>
                <p className="text-[6px] text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply button */}
      <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={() => onApply(tpl)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-200/50 active:scale-[0.97]"
        >
          <Zap className="w-3.5 h-3.5"/> Use This Template
        </button>
      </div>
    </div>
  );
}

function TemplateCard({ tpl, selected, onSelect, onApply }: { tpl:TplDef; selected:boolean; onSelect:(t:TplDef)=>void; onApply:(t:TplDef)=>void }) {
  return (
    <div
      onClick={()=>onSelect(tpl)}
      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer select-none group transition-all duration-200 hover:scale-[1.03] hover:shadow-lg ${selected?"border-blue-400 shadow-lg shadow-blue-100/50 ring-2 ring-blue-100":"border-gray-200 dark:border-gray-700 hover:border-blue-300"}`}
      style={{height:"170px"}}
    >
      {/* Mini preview */}
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{height:"130px"}}>
        <div style={{transform:"scale(0.72)",transformOrigin:"top left",width:"139%",height:"180px"}}>
          <tpl.Preview name={tpl.name}/>
        </div>
      </div>
      {/* Name strip */}
      <div className="absolute bottom-0 inset-x-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-2 py-1.5">
        <p className="text-[9px] font-bold text-gray-800 dark:text-gray-200 truncate">{tpl.name}</p>
        <p className="text-[7px] text-gray-400 dark:text-gray-500 truncate">{tpl.appType}</p>
      </div>
      {/* Hover overlay with "Use Template" button */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <button
          onClick={(e) => { e.stopPropagation(); onApply(tpl); }}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-bold rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 active:scale-[0.95]"
        >
          <Zap className="w-3 h-3"/> Use Template
        </button>
      </div>
      {/* Selected checkmark */}
      {selected&&(
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
          <div className="w-2 h-2 rounded-full bg-white"/>
        </div>
      )}
    </div>
  );
}

const TEMPLATE_CATEGORIES = ["All","News","Blog","E-Commerce","Restaurant","Portfolio","Education","Service","Media"] as const;
type TplCategory = typeof TEMPLATE_CATEGORIES[number];

export function TemplatesPanel({ onApplyTemplate }: { onApplyTemplate?: (templateId: number) => void } = {}) {
  const [category, setCategory] = useState<TplCategory>("All");
  const [selected, setSelected] = useState<TplDef|null>(null);
  const [search, setSearch]     = useState("");
  const [confirmTemplate, setConfirmTemplate] = useState<TplDef|null>(null);

  const filtered = ALL_TEMPLATES.filter(t=>{
    const matchCat = category==="All" || t.category===category;
    const q = search.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.appType.toLowerCase().includes(q) || t.footerStyle.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  const catCounts = Object.fromEntries(
    TEMPLATE_CATEGORIES.map(c=>[c, c==="All" ? ALL_TEMPLATES.length : ALL_TEMPLATES.filter(t=>t.category===c).length])
  );

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Choose a Template</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">{filtered.length} templates \u00B7 click to preview</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl px-2.5 py-1.5 w-40">
            <Search className="w-3 h-3 text-gray-400 flex-shrink-0"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search\u2026" className="bg-transparent text-[10px] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none w-full"/>
            {search && <button onClick={()=>setSearch("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><span className="text-xs font-bold">\u00D7</span></button>}
          </div>
        </div>
        {/* Category pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 overflow-x-auto flex-shrink-0 scrollbar-thin">
          {TEMPLATE_CATEGORIES.map(cat=>(
            <button key={cat} onClick={()=>setCategory(cat)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all duration-150 ${category===cat?"bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm":"bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
              {cat}
              <span className={`text-[8px] rounded-full px-1 ${category===cat?"bg-white/20 dark:bg-black/20 text-white dark:text-gray-900":"bg-gray-200 dark:bg-gray-600 text-gray-400"}`}>{catCounts[cat]}</span>
            </button>
          ))}
        </div>
        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
          {filtered.length===0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"><Search className="w-5 h-5"/></div>
              <p className="text-xs font-medium">No templates found</p>
            </div>
          ) : (
            <div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))"}}>
              {filtered.map(tpl=>(
                <TemplateCard key={tpl.id} tpl={tpl} selected={selected?.id===tpl.id} onSelect={setSelected} onApply={(t) => setConfirmTemplate(t)}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      {selected ? (
        <TemplateLivePreview tpl={selected} onApply={(t) => setConfirmTemplate(t)}/>
      ) : (
        <div className="w-[250px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col items-center justify-center gap-4 text-center px-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-blue-300"/>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Select a template</p>
            <p className="text-[10px] text-gray-400 leading-relaxed mt-1">Click any template to see a real phone preview with footer and header style options</p>
          </div>
          <div className="w-full space-y-1">
            {["Classic Tabs","Floating Pill","Wave Center","Icon Only","Segmented Pill","Dark Tabs"].map(s=>(
              <div key={s} className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-2 h-2 rounded-sm bg-gradient-to-br from-blue-400 to-violet-400 flex-shrink-0"/>
                <span className="text-[9px] text-gray-500 font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation dialog */}
      <AlertDialog open={!!confirmTemplate} onOpenChange={(open) => { if (!open) setConfirmTemplate(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply &ldquo;{confirmTemplate?.name}&rdquo; Template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current widget layout with the {confirmTemplate?.name} template. You can customize it afterwards in the builder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (confirmTemplate && onApplyTemplate) {
                onApplyTemplate(confirmTemplate.id);
              }
              setConfirmTemplate(null);
            }}>
              Apply Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
