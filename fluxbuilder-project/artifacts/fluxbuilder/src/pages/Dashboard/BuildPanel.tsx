import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  HelpCircle, ChevronDown, RefreshCw, Check, Upload,
  FolderOpen, Code2, Package, ShieldCheck, Cloud,
  Smartphone, Tablet, Download,
} from "lucide-react";
import { Toggle } from "./types";

type BuildTab = "ios" | "android" | "cloud";

type BuildHistoryEntry = { platform: string; version: string; date: string; status: "success" | "failed" };

const BUILD_STEPS = [
  { label: "Fetching dependencies", icon: FolderOpen },
  { label: "Compiling code", icon: Code2 },
  { label: "Packaging assets", icon: Package },
  { label: "Signing binary", icon: ShieldCheck },
  { label: "Uploading to cloud", icon: Cloud },
];

export function BuildPanel() {
  const { toast } = useToast();
  const [tab, setTab]       = useState<BuildTab>("ios");
  const [email, setEmail]   = useState("");
  const [token, setToken]   = useState("");
  const [lang, setLang]     = useState("English");
  const [building, setBuilding] = useState(false);
  const [built, setBuilt]   = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStep, setBuildStep]         = useState("");
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [cloudPlatform, setCloudPlatform] = useState<"iOS" | "Android" | null>(null);
  const [buildHistory, setBuildHistory]   = useState<BuildHistoryEntry[]>([
    { platform:"iOS",     version:"1.2.3", date:"Mar 20, 2026", status:"success" },
    { platform:"Android", version:"1.2.2", date:"Mar 15, 2026", status:"success" },
    { platform:"Android", version:"1.2.1", date:"Mar 10, 2026", status:"failed"  },
    { platform:"iOS",     version:"1.2.0", date:"Mar 5, 2026",  status:"success" },
  ]);

  const runBuildAnimation = (platform?: "iOS" | "Android") => {
    setBuilding(true);
    setBuilt(false);
    setBuildProgress(0);
    setCurrentStepIdx(0);
    setBuildStep(BUILD_STEPS[0]!.label);
    if (platform) setCloudPlatform(platform);

    const stepDuration = 600;
    BUILD_STEPS.forEach((s, idx) => {
      setTimeout(() => {
        setBuildStep(s.label);
        setCurrentStepIdx(idx);
        setBuildProgress(Math.round(((idx + 1) / BUILD_STEPS.length) * 100));
      }, idx * stepDuration);
    });

    setTimeout(() => {
      setBuilding(false);
      setBuilt(true);
      setBuildProgress(100);
      if (platform) {
        const today = new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
        setBuildHistory(prev => [
          { platform, version:"1.2.4", date: today, status:"success" },
          ...prev.slice(0, 4),
        ]);
      }
    }, BUILD_STEPS.length * stepDuration + 300);
  };

  const startBuild = () => runBuildAnimation();
  const startCloudBuild = (platform: "iOS" | "Android") => runBuildAnimation(platform);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 px-6">
        {([
          { key:"ios",     label:"Test iOS",       icon:"" },
          { key:"android", label:"Test Android",   icon:"" },
          { key:"cloud",   label:"Build On Cloud", icon:"\u2601" },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={()=>{ setTab(t.key); setBuilt(false); }}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {t.key === "ios"     && <span className="text-base">{"\uF8FF"}</span>}
            {t.key === "android" && <span className="text-base">{"\uF8FF"}</span>}
            {t.key === "cloud"   && <span className="text-base">{"\u2601"}</span>}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 max-w-2xl">
        {(tab === "ios" || tab === "android") && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Testing {tab === "ios" ? "iOS" : "Android"} app
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              You will receive a link to open {tab === "ios" ? "iPhone" : "Android"} Simulator. Make sure to{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">install API</a>{" "}
              or install the app on your device.
            </p>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  Email Address <HelpCircle className="w-3.5 h-3.5 text-gray-400"/>
                </label>
                <input
                  value={email} onChange={e=>setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {tab === "ios" && (
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    Your Appetize.Io Token <HelpCircle className="w-3.5 h-3.5 text-gray-400"/>
                  </label>
                  <input
                    value={token} onChange={e=>setToken(e.target.value)}
                    placeholder="Type your Appetize.io token"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Do not have a token?{" "}
                    <a href="#" className="text-blue-600 hover:underline font-medium">Request an API token</a>
                  </p>
                </div>
              )}

              {tab === "android" && (
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    Device Type
                  </label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 bg-white">
                    <option>Samsung Galaxy S21</option>
                    <option>Pixel 6</option>
                    <option>OnePlus 9</option>
                    <option>Xiaomi Mi 11</option>
                  </select>
                </div>
              )}

              {/* Notifications setting */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-100/60">
                  <p className="text-sm font-semibold text-gray-700">Notifications setting</p>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Language</label>
                    <div className="relative">
                      <select value={lang} onChange={e=>setLang(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 bg-white appearance-none">
                        <option>English</option>
                        <option>Arabic</option>
                        <option>French</option>
                        <option>Spanish</option>
                        <option>Turkish</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Select your preferred language for notifications.</p>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-600">Enable push notifications</span>
                    <Toggle value={true} onChange={()=>{}}/>
                  </div>
                </div>
              </div>

              {building && (
                <div className="w-full max-w-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">{buildStep}</span>
                    <span className="text-xs font-semibold text-blue-600">{buildProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${buildProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={startBuild}
                disabled={building}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 text-gray-500 font-bold rounded-xl hover:bg-blue-600 hover:text-white disabled:opacity-70 transition-all text-sm w-full max-w-xs">
                {building
                  ? <><RefreshCw className="w-4 h-4 animate-spin"/> Building...</>
                  : built
                  ? <><Check className="w-4 h-4 text-green-500"/> Test Link Sent!</>
                  : "Create Test"}
              </button>
              {built && (
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <Check className="w-4 h-4"/>
                  Test link sent to <strong>{email}</strong>. Check your inbox!
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "cloud" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Build On Cloud</h2>
            <p className="text-sm text-gray-500 mb-6">Generate and download your production-ready APK or IPA file from the cloud.</p>

            <div className="space-y-4">
              {/* iOS build card */}
              <div className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-xl">{"\uF8FF"}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">iOS App (IPA)</p>
                    <p className="text-xs text-gray-400">Build for iPhone & iPad</p>
                  </div>
                </div>
                <button
                  onClick={() => startCloudBuild("iOS")}
                  disabled={building}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-700 disabled:opacity-60 transition-colors">
                  {building && cloudPlatform==="iOS" ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Upload className="w-3.5 h-3.5"/>}
                  Build IPA
                </button>
              </div>

              {/* Android build card */}
              <div className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xl">{"\u{1F916}"}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Android App (APK)</p>
                    <p className="text-xs text-gray-400">Build for all Android devices</p>
                  </div>
                </div>
                <button
                  onClick={() => startCloudBuild("Android")}
                  disabled={building}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 disabled:opacity-60 transition-colors">
                  {building && cloudPlatform==="Android" ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Upload className="w-3.5 h-3.5"/>}
                  Build APK
                </button>
              </div>

              {/* Stepped build pipeline */}
              {(building || built) && cloudPlatform && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {built ? `${cloudPlatform} Build Complete` : `Building ${cloudPlatform}\u2026`}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      built ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {built ? "Success" : `${buildProgress}%`}
                    </span>
                  </div>
                  <div className="space-y-0">
                    {BUILD_STEPS.map((step, idx) => {
                      const StepIcon = step.icon;
                      const isDone = built || idx < currentStepIdx;
                      const isActive = !built && idx === currentStepIdx;
                      const isPending = !built && idx > currentStepIdx;
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          {/* Step indicator + connector line */}
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                              isDone ? "bg-green-500 text-white"
                              : isActive ? "bg-blue-500 text-white animate-pulse"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                            }`}>
                              {isDone ? <Check className="w-4 h-4"/> : <StepIcon className="w-4 h-4"/>}
                            </div>
                            {idx < BUILD_STEPS.length - 1 && (
                              <div className={`w-0.5 h-6 transition-colors duration-300 ${
                                isDone ? "bg-green-400" : "bg-gray-200 dark:bg-gray-700"
                              }`}/>
                            )}
                          </div>
                          {/* Step label */}
                          <div className="pt-1.5">
                            <p className={`text-sm font-medium transition-colors ${
                              isDone ? "text-green-700 dark:text-green-400"
                              : isActive ? "text-blue-700 dark:text-blue-400 font-semibold"
                              : "text-gray-400 dark:text-gray-500"
                            }`}>
                              {step.label}
                              {isActive && <span className="ml-1.5 text-xs">\u2026</span>}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Build history */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Build History</p>
                  <span className="text-xs text-gray-400">Last 5 builds</span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800">
                  {buildHistory.map((b,i)=>(
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          b.platform==="iOS" ? "bg-gray-900 dark:bg-gray-600" : "bg-green-500"
                        }`}>
                          {b.platform==="iOS"
                            ? <Smartphone className="w-4 h-4 text-white"/>
                            : <Tablet className="w-4 h-4 text-white"/>}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{b.platform} v{b.version}</p>
                          <p className="text-[10px] text-gray-400">{b.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          b.status==="success"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}>{b.status === "success" ? "Success" : "Failed"}</span>
                        {b.status==="success" && (
                          <button onClick={()=>toast({ title:`Downloading ${b.platform} v${b.version}`, description:"This is a demo build \u2014 no real file available." })}
                            className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium transition-colors">
                            <Download className="w-3 h-3"/> Download
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
