import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, ChevronRight, HelpCircle, Globe, Server,
  Check, X, AlertCircle, RefreshCw, Play, Upload, Image,
  Home, Grid, Search, Heart, User, Radio, Star, Zap,
  Type, Palette, Bold, AlignLeft, Sun, Moon, ChevronDown,
  Plus, Minus, RotateCcw
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;

// ─── Step indicator ──────────────────────────────────────────────────
function StepBar({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Server Integration" },
    { n: 2, label: "Select Template" },
    { n: 3, label: "App Information" },
    { n: 4, label: "Color & Font" },
  ];
  return (
    <div className="flex items-center justify-center gap-0 px-8 py-6 bg-white border-b border-gray-100">
      {steps.map((s, i) => {
        const done    = step > s.n;
        const active  = step === s.n;
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                done   ? "bg-blue-600 border-blue-600 text-white"
                : active ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-200 text-gray-400"
              }`}>
                {done ? <Check className="w-4 h-4"/> : s.n}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${
                active ? "text-blue-600" : done ? "text-blue-500" : "text-gray-400"
              }`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-32 h-0.5 mx-2 mb-5 transition-colors ${done ? "bg-blue-600" : "bg-gray-200"}`}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Mini Phone Preview ──────────────────────────────────────────────
function MiniPhone({ appName, variant = "home" }: { appName?: string; variant?: "home" | "food" | "app" }) {
  return (
    <div className="w-[200px] bg-white rounded-[28px] shadow-2xl border-4 border-gray-900 overflow-hidden flex flex-col flex-shrink-0">
      {/* Status bar */}
      <div className="bg-white flex items-center justify-between px-4 pt-2 pb-1 flex-shrink-0">
        <span className="text-[9px] font-bold text-gray-900">13:49</span>
        <div className="flex items-center gap-0.5">
          <div className="flex gap-px items-end">
            {[3,4,5,4,3].map((h,i)=><div key={i} className="w-0.5 bg-gray-900 rounded-sm" style={{height:h}}/>)}
          </div>
          <svg viewBox="0 0 16 12" className="w-3 h-3 ml-0.5 text-gray-900 fill-current">
            <path d="M8 3a7 7 0 0 0-7 5.2l1.5 1A5.5 5.5 0 0 1 8 5a5.5 5.5 0 0 1 5.5 4.2l1.5-1A7 7 0 0 0 8 3z"/>
            <path d="M8 6a4 4 0 0 0-4 2.9l1.5 1A2.5 2.5 0 0 1 8 8a2.5 2.5 0 0 1 2.5 1.9l1.5-1A4 4 0 0 0 8 6z"/>
            <circle cx="8" cy="11" r="1.5"/>
          </svg>
          <div className="ml-0.5 flex items-center gap-px">
            <div className="w-4.5 h-2 border border-gray-900 rounded-[2px] flex items-center px-px">
              <div className="h-1.5 w-3 bg-gray-900 rounded-[1px]"/>
            </div>
          </div>
        </div>
      </div>

      {/* App header */}
      <div className="bg-white flex items-center justify-between px-3 py-2">
        <div className="w-4 h-4 text-gray-400">
          {variant === "food"
            ? <Grid className="w-4 h-4"/>
            : <AlignLeft className="w-4 h-4"/>}
        </div>
        <span className="text-[12px] font-bold text-gray-900">
          {appName || (variant === "food" ? "Meals Corner" : variant === "app" ? "TasteShare" : "YemenTV")}
        </span>
        <Search className="w-4 h-4 text-gray-400"/>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-gray-50 px-3 py-2 space-y-3">
        {variant === "food" ? (
          <>
            <p className="text-[11px] font-bold text-gray-900">Time for meals</p>
            {["Favourites","Drinks"].map(cat=>(
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-gray-700">{cat}</span>
                  <span className="text-[8px] text-red-500">See All</span>
                </div>
                <div className="flex gap-1">
                  {[
                    "bg-gradient-to-br from-blue-400 to-blue-600",
                    "bg-gradient-to-br from-gray-400 to-gray-600",
                    "bg-red-500",
                  ].map((bg,i)=>(
                    <div key={i} className={`flex-1 h-10 rounded ${bg}`}/>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-gray-700">Explore more</span>
                <span className="text-[8px] text-red-500">See All</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-12 h-10 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"/>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded mb-1 w-3/4"/>
                  <div className="h-1.5 bg-gray-100 rounded w-1/2"/>
                </div>
              </div>
            </div>
          </>
        ) : variant === "app" ? (
          <>
            {["Pasta","Salads"].map((cat, ci)=>(
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-gray-700">{cat}</span>
                  <span className="text-[8px] text-red-500">See All</span>
                </div>
                {ci === 0 ? (
                  <div className="flex gap-1 overflow-hidden">
                    {[
                      "bg-gradient-to-br from-blue-400 to-blue-600",
                      "bg-gradient-to-br from-purple-400 to-purple-600",
                      "bg-red-500",
                      "bg-gray-300",
                    ].map((bg,i)=>(
                      <div key={i} className={`w-12 h-14 rounded-xl ${bg} flex-shrink-0 relative`}>
                        <Heart className="w-2 h-2 text-white absolute top-1 right-1"/>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {[0,1,2].map(i=>(
                      <div key={i} className="flex gap-1.5 items-start">
                        <div className="w-10 h-8 rounded bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0"/>
                        <div className="flex-1">
                          <div className="h-1.5 bg-gray-200 rounded mb-0.5 w-4/5"/>
                          <div className="h-1 bg-gray-100 rounded w-1/2"/>
                          <div className="text-[7px] text-gray-400 mt-0.5">March 2, 2026</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-gray-700">Breaking News</span>
                <span className="text-[8px] text-red-500">See All</span>
              </div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-end p-2">
                <div className="h-2 bg-white/80 rounded w-3/4"/>
              </div>
            </div>
            <div className="space-y-1.5">
              {[0,1,2].map(i=>(
                <div key={i} className="flex gap-1.5">
                  <div className="w-10 h-8 rounded bg-gradient-to-br from-gray-300 to-gray-500 flex-shrink-0"/>
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-200 rounded mb-0.5 w-4/5"/>
                    <div className="h-1 bg-gray-100 rounded w-1/2"/>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tab bar */}
      <div className="bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2 flex-shrink-0">
        {[
          { icon:<Home className="w-3.5 h-3.5"/>, label:"Home", active:true },
          { icon:<Grid className="w-3.5 h-3.5"/>, label:"Category" },
          { icon:<Search className="w-3.5 h-3.5"/>, label:"Search" },
          { icon:<Heart className="w-3.5 h-3.5"/>, label:"Wish List" },
          { icon:<User className="w-3.5 h-3.5"/>, label:"Setting" },
        ].map(t=>(
          <div key={t.label} className={`flex flex-col items-center gap-0.5 ${t.active ? "text-blue-500" : "text-gray-400"}`}>
            {t.icon}
            <span className="text-[7px] font-medium">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 1: Server Integration ──────────────────────────────────────
const PLATFORMS = [
  { id:"shopify",      label:"Shopify",       color:"#96bf48", logo:"🛒" },
  { id:"woocommerce",  label:"Woocommerce",   color:"#7f54b3", logo:"🛍" },
  { id:"wordpress",    label:"Wordpress",     color:"#0073aa", logo:"🔵" },
  { id:"opencart",     label:"Opencart",      color:"#41a8d8", logo:"🛒" },
  { id:"magento",      label:"Magento",       color:"#f26322", logo:"🔶" },
  { id:"strapi",       label:"Strapi",        color:"#4945ff", logo:"🟣" },
  { id:"prestashop",   label:"Prestashop",    color:"#df0067", logo:"🛍" },
  { id:"notion",       label:"Notion",        color:"#000000", logo:"📝" },
  { id:"bigcommerce",  label:"BigCommerce",   color:"#34313f", logo:"🛒" },
  { id:"openai",       label:"Open AI",       color:"#74aa9c", logo:"🤖" },
  { id:"listing",      label:"Listing",       color:"#e54e37", logo:"📍" },
  { id:"manager",      label:"Manager",       color:"#7f54b3", logo:"📊" },
  { id:"deliveryboy",  label:"Delivery Boy",  color:"#f26322", logo:"🚴" },
  { id:"haravan",      label:"Haravan",       color:"#0094d4", logo:"🏪" },
  { id:"webtoapp",     label:"Web To App",    color:"#3b82f6", logo:"🌐" },
];

type TestItem = { label: string; message: string; status: "pass" | "fail" | "pending" };

function Step1({ url, setUrl, platform, setPlatform, dataMode, setDataMode }:{
  url: string; setUrl:(v:string)=>void;
  platform: string; setPlatform:(v:string)=>void;
  dataMode: "website"|"nohosting"; setDataMode:(v:"website"|"nohosting")=>void;
}) {
  const [tested, setTested] = useState(false);
  const [running, setRunning] = useState(false);

  const tests: TestItem[] = [
    { label:"Wordpress Connectivity", message:"We were able to connect to your Wordpress API.",         status: tested ? "pass"    : "pending" },
    { label:"SSL Verification",        message:"The Website SSL certificates is trusted.",                status: tested ? "pass"    : "pending" },
    { label:"Permalink Setting",       message:"The website Permalink setting is valid.",                 status: tested ? "pass"    : "pending" },
    { label:"Post Connectivity",       message:"We were able to connect to your WordPress posts API.",   status: tested ? "pass"    : "pending" },
    { label:"Plugin Activation",       message:"We were not able to connect to the MStore API Plugin.",  status: tested ? "fail"    : "pending" },
  ];

  const passed = tests.filter(t=>t.status==="pass").length;

  const runTest = () => {
    setRunning(true);
    setTimeout(()=>{ setRunning(false); setTested(true); }, 1800);
  };

  return (
    <div className="flex gap-8 h-full overflow-hidden">
      {/* Left form */}
      <div className="flex-1 overflow-y-auto pr-2">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Server Integration</h2>

        {/* Select data */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
            Select data <HelpCircle className="w-3.5 h-3.5 text-gray-400"/>
          </label>
          <div className="flex gap-2">
            <button
              onClick={()=>setDataMode("website")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                dataMode==="website" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}>
              <Globe className="w-4 h-4"/> Website
            </button>
            <button
              onClick={()=>setDataMode("nohosting")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                dataMode==="nohosting" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}>
              <Server className="w-4 h-4"/> No Hosting
            </button>
          </div>
        </div>

        {/* URL */}
        {dataMode === "website" && (
          <>
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
                Website URL <HelpCircle className="w-3.5 h-3.5 text-gray-400"/>
              </label>
              <input
                value={url}
                onChange={e=>setUrl(e.target.value)}
                placeholder="https://yoursite.com/"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Integration platforms */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
                Integration <HelpCircle className="w-3.5 h-3.5 text-gray-400"/>
              </label>
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0"/>
                <p className="text-xs text-blue-700">Please refer to our <a href="#" className="underline font-semibold">guide</a> carefully before integrating with your website.</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {PLATFORMS.map(p=>(
                  <button
                    key={p.id}
                    onClick={()=>setPlatform(p.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      platform===p.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-100 hover:border-gray-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                      style={{background: p.color + "20"}}>
                      {p.id === "wordpress" ? (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:p.color}}>
                          <span className="text-white font-bold text-sm">W</span>
                        </div>
                      ) : p.id === "woocommerce" ? (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:p.color}}>
                          <span className="text-white font-bold text-[10px]">Woo</span>
                        </div>
                      ) : p.id === "shopify" ? (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:p.color}}>
                          <span className="text-white font-bold text-sm">S</span>
                        </div>
                      ) : (
                        <span className="text-xl">{p.logo}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Test results */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Analyze the connectivity and detect the issues.</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-orange-500">{tested ? `${passed}/5` : "0/5"}</span>
                    <span className="text-sm font-semibold text-gray-700">Tests Passed</span>
                    {tested && <span className="text-[10px] bg-orange-100 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded font-medium">🔥 New!</span>}
                  </div>
                </div>
                <button
                  onClick={runTest}
                  disabled={running}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-all"
                >
                  {running
                    ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/>
                    : <Play className="w-3.5 h-3.5"/>}
                  {running ? "Running..." : "RUN TROUBLESHOOT"}
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Test item</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Message</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t,i)=>(
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-2.5 text-xs font-medium text-gray-700 whitespace-nowrap">{t.label}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{tested ? t.message : <span className="text-gray-300 italic">Not tested yet</span>}</td>
                      <td className="px-4 py-2.5">
                        {tested ? (
                          t.status === "pass"
                            ? <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full w-fit">
                                <Check className="w-3 h-3"/> Success
                              </span>
                            : <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full w-fit">
                                <X className="w-3 h-3"/> Failed <HelpCircle className="w-3 h-3"/>
                              </span>
                        ) : (
                          <span className="text-[10px] text-gray-300 italic">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {dataMode === "nohosting" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Server className="w-8 h-8 text-blue-400"/>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">No Hosting Mode</p>
            <p className="text-xs text-gray-400 max-w-xs">Build a standalone app without connecting to an external server. You can add content manually later.</p>
          </div>
        )}
      </div>

      {/* Right: phone preview */}
      <div className="flex-shrink-0 flex items-center justify-center py-6">
        <MiniPhone variant="food"/>
      </div>
    </div>
  );
}

// ─── STEP 2: Select Template ─────────────────────────────────────────
const TEMPLATE_COLORS = [
  ["from-gray-800 to-gray-900","from-pink-500 to-rose-600","from-gray-900 to-black","from-slate-600 to-slate-800","from-amber-400 to-orange-500"],
  ["from-green-400 to-emerald-600","from-gray-100 to-gray-200","from-red-500 to-red-700","from-yellow-300 to-amber-400","from-gray-700 to-gray-900"],
  ["from-blue-400 to-blue-600","from-purple-400 to-purple-600","from-green-300 to-green-500","from-orange-400 to-red-500","from-lime-300 to-green-400"],
  ["from-indigo-400 to-violet-600"],
];

function Step2({ selectedTemplate, setSelectedTemplate }: {
  selectedTemplate: number; setSelectedTemplate:(v:number)=>void;
}) {
  const [tab, setTab] = useState<"News"|"Advanced">("News");

  return (
    <div className="flex gap-8 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-gray-900">Select Template</h2>
          <HelpCircle className="w-4 h-4 text-gray-400"/>
        </div>
        <div className="flex gap-4 border-b border-gray-200 mb-4">
          {(["News","Advanced"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
                tab===t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}>
              {t} {t==="News" ? "(16)" : "①"}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {TEMPLATE_COLORS.map((row, ri) => (
            <div key={ri} className="flex gap-3">
              {row.map((grad, ci) => {
                const idx = ri * 5 + ci;
                return (
                  <button
                    key={ci}
                    onClick={()=>setSelectedTemplate(idx)}
                    className={`flex-1 rounded-xl overflow-hidden transition-all border-2 ${
                      selectedTemplate===idx ? "border-blue-500 shadow-lg scale-[1.02]" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className={`bg-gradient-to-br ${grad} h-36 w-full relative`}>
                      {/* Mini app mockup inside */}
                      <div className="absolute inset-1 bg-white/10 rounded-lg flex flex-col overflow-hidden">
                        <div className="h-4 bg-white/20 flex items-center px-1.5 gap-1">
                          <div className="w-1 h-1 bg-white/60 rounded-full"/>
                          <div className="flex-1 h-1 bg-white/30 rounded"/>
                        </div>
                        <div className="flex-1 p-1 space-y-0.5">
                          <div className="h-8 bg-white/20 rounded"/>
                          <div className="flex gap-0.5">
                            <div className="flex-1 h-4 bg-white/20 rounded"/>
                            <div className="flex-1 h-4 bg-white/15 rounded"/>
                            <div className="flex-1 h-4 bg-white/10 rounded"/>
                          </div>
                          <div className="h-1.5 bg-white/20 rounded w-3/4"/>
                          <div className="h-1.5 bg-white/10 rounded w-1/2"/>
                        </div>
                      </div>
                      {selectedTemplate===idx && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white"/>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center justify-center py-6">
        <MiniPhone variant={selectedTemplate < 5 ? "food" : selectedTemplate < 10 ? "home" : "app"}/>
      </div>
    </div>
  );
}

// ─── STEP 3: App Information ─────────────────────────────────────────
function DropZone({ label, value, onChange }: { label: string; value: string | null; onChange:(v:string)=>void }) {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center gap-3 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer relative group">
      {value ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{value[0]?.toUpperCase()}</span>
          </div>
          <span className="text-xs text-gray-500">{value}</span>
          <button className="text-[10px] text-red-400 hover:text-red-600" onClick={e=>{e.stopPropagation();onChange("");}}>Remove</button>
        </div>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-400"/>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Drag and Drop here<br/>
            <span className="text-[10px] text-gray-400">Supported formats: JPEG, PNG, SVG, ...</span>
          </p>
          <button className="px-4 py-1.5 border border-blue-400 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            Browse File
          </button>
        </>
      )}
      <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
        <Image className="w-4 h-4 text-gray-400"/>
      </span>
    </div>
  );
}

function Step3({ appName, setAppName, desc, setDesc }: {
  appName: string; setAppName:(v:string)=>void;
  desc: string; setDesc:(v:string)=>void;
}) {
  const [lightLogo, setLightLogo] = useState<string|null>(null);
  const [darkLogo,  setDarkLogo]  = useState<string|null>(null);

  return (
    <div className="flex gap-8 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2">
        <h2 className="text-xl font-bold text-gray-900 mb-5">App Information</h2>

        {/* General Information */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">General Information</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">App Name</label>
              <input
                value={appName}
                onChange={e=>setAppName(e.target.value)}
                placeholder="Enter your app name here"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Short description</label>
              <input
                value={desc}
                onChange={e=>setDesc(e.target.value)}
                placeholder="Enter your description here"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Upload Logo */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Upload Logo</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-2">Logo for Light theme</label>
              <DropZone label="Light" value={lightLogo} onChange={setLightLogo}/>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-2">Logo for Dark theme</label>
              <DropZone label="Dark" value={darkLogo} onChange={setDarkLogo}/>
            </div>
          </div>
        </div>

        {/* App Icon */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">App Icon</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-2xl font-bold">{appName?.[0]?.toUpperCase() ?? "A"}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{appName || "App Icon"}</p>
              <p className="text-xs text-gray-400">1024×1024 px recommended</p>
              <button className="mt-1.5 px-3 py-1 border border-blue-400 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Upload Icon
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">Featured Image</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
            <Image className="w-8 h-8 text-gray-300"/>
            <p className="text-xs text-gray-500">Upload a featured image for your app<br/><span className="text-[10px] text-gray-400">Recommended: 1440×900 px</span></p>
            <button className="mt-1 px-3 py-1 border border-blue-400 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors">Browse</button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-center py-6">
        <MiniPhone appName={appName} variant="app"/>
      </div>
    </div>
  );
}

// ─── STEP 4: Color & Font ────────────────────────────────────────────
const COLOR_PRESETS = [
  "#3b82f6","#8b5cf6","#ec4899","#ef4444","#f97316","#f59e0b",
  "#10b981","#06b6d4","#6366f1","#14b8a6","#84cc16","#64748b",
];
const FONT_OPTIONS = ["Roboto","Open Sans","Lato","Montserrat","Poppins","Inter","Nunito","Raleway"];

function Step4() {
  const [primary, setPrimary]     = useState("#3b82f6");
  const [secondary, setSecondary] = useState("#8b5cf6");
  const [font, setFont]           = useState("Roboto");
  const [darkMode, setDarkMode]   = useState(false);

  return (
    <div className="flex gap-8 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Color & Font</h2>

        {/* Colors */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">App Colors</h3>
          <div className="space-y-4">
            {[
              { label:"Primary Color", value:primary, set:setPrimary },
              { label:"Secondary Color", value:secondary, set:setSecondary },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="text-xs text-gray-500 block mb-2">{label}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COLOR_PRESETS.map(c=>(
                    <button key={c} onClick={()=>set(c)}
                      className={`w-8 h-8 rounded-lg transition-all ${value===c ? "ring-2 ring-offset-1 ring-gray-400 scale-110" : "hover:scale-105"}`}
                      style={{background:c}}/>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-gray-200" style={{background:value}}/>
                  <input
                    value={value}
                    onChange={e=>set(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Theme Mode</h3>
          <div className="flex gap-2">
            <button onClick={()=>setDarkMode(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${!darkMode ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}>
              <Sun className="w-4 h-4"/> Light Mode
            </button>
            <button onClick={()=>setDarkMode(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${darkMode ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}>
              <Moon className="w-4 h-4"/> Dark Mode
            </button>
          </div>
        </div>

        {/* Font */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">Typography</h3>
          <label className="text-xs text-gray-500 block mb-2">App Font</label>
          <div className="relative">
            <select value={font} onChange={e=>setFont(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-blue-400 bg-white">
              {FONT_OPTIONS.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
          </div>
          <div className="mt-3 p-4 bg-gray-50 rounded-xl">
            <p className="font-semibold text-gray-900 mb-1" style={{fontFamily:font}}>Aa — {font}</p>
            <p className="text-sm text-gray-500" style={{fontFamily:font}}>The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-center py-6">
        <div className="relative">
          <MiniPhone variant="food"/>
          {/* Color overlay preview */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-around px-2">
            {[0,1,2,3,4].map(i=>(
              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center ${i===0?"":"opacity-40"}`}
                style={{color: i===0 ? primary : undefined}}>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────
export default function CreateApp() {
  const [step, setStep]               = useState<Step>(1);
  const [url, setUrl]                 = useState("https://test.yementv.tv/");
  const [platform, setPlatform]       = useState("wordpress");
  const [dataMode, setDataMode]       = useState<"website"|"nohosting">("website");
  const [selectedTemplate, setTemplate] = useState(0);
  const [appName, setAppName]         = useState("");
  const [desc, setDesc]               = useState("");

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) return selectedTemplate >= 0;
    if (step === 3) return appName.trim().length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <div className="h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-3 flex-shrink-0">
        <Link href="/dashboard"
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4"/> Back to Dashboard
        </Link>
        <div className="h-4 w-px bg-gray-200 mx-1"/>
        <span className="text-sm font-bold text-gray-900">Create New App</span>
      </div>

      {/* Step bar */}
      <StepBar step={step}/>

      {/* Content */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 mx-6 my-6 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden p-8">
            {step === 1 && (
              <Step1
                url={url} setUrl={setUrl}
                platform={platform} setPlatform={setPlatform}
                dataMode={dataMode} setDataMode={setDataMode}
              />
            )}
            {step === 2 && (
              <Step2 selectedTemplate={selectedTemplate} setSelectedTemplate={setTemplate}/>
            )}
            {step === 3 && (
              <Step3 appName={appName} setAppName={setAppName} desc={desc} setDesc={setDesc}/>
            )}
            {step === 4 && <Step4/>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <button
              onClick={()=>setStep(s=>Math.max(1,s-1) as Step)}
              disabled={step===1}
              className="flex items-center gap-1.5 px-5 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4"/> BACK
            </button>

            <div className="flex items-center gap-2">
              {([1,2,3,4] as Step[]).map(n=>(
                <div key={n} className={`w-2 h-2 rounded-full transition-all ${step===n?"bg-blue-600 w-4":"bg-gray-300"}`}/>
              ))}
            </div>

            {step < 4 ? (
              <button
                onClick={()=>setStep(s=>Math.min(4,s+1) as Step)}
                disabled={!canNext()}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                NEXT <ChevronRight className="w-4 h-4"/>
              </button>
            ) : (
              <Link href="/dashboard">
                <button className="flex items-center gap-1.5 px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all">
                  <Check className="w-4 h-4"/> Finish & Open Builder
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
