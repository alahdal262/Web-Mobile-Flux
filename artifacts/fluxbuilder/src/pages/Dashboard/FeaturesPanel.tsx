import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Search, Settings, Zap, Check } from "lucide-react";
import type { FeatureItem } from "./types";
import { Toggle, FEATURES_DATA } from "./types";

function FeatureDetailPanel({ item, onToggleEnabled }: { item: FeatureItem | null; onToggleEnabled?: (label: string) => void }) {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (item) setEnabled(item.enabled);
  }, [item]);

  const handleToggle = () => {
    setEnabled(v => !v);
    if (item && onToggleEnabled) onToggleEnabled(item.label);
  };

  if (!item) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-gray-300"/>
        </div>
        <p className="text-sm font-semibold text-gray-500">Select a feature</p>
        <p className="text-xs text-gray-400 mt-1">Click any feature on the left to configure it</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{item.label}</h2>
          <p className="text-xs text-gray-400 mt-0.5">Configure and enable this feature for your app</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{enabled ? "Enabled" : "Disabled"}</span>
          <Toggle value={enabled} onChange={handleToggle}/>
        </div>
      </div>

      {!enabled ? (
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center bg-gray-50">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
            <Zap className="w-6 h-6 text-gray-400"/>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Enable {item.label}</p>
          <p className="text-xs text-gray-500 mb-4 max-w-xs">Toggle the switch above to enable this feature and access its configuration options.</p>
          <button onClick={handleToggle}
            className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">
            Enable Feature
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"/>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Configuration</span>
            </div>
            {item.label.toLowerCase().includes("firebase") && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Project ID</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="your-firebase-project-id"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">API Key</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="AIzaSy..."/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">App ID</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="1:123456789:android:abc..."/>
                </div>
              </div>
            )}
            {item.label === "Languages" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Default Language</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white">
                    <option>English</option>
                    <option>Arabic</option>
                    <option>French</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option>Turkish</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">RTL Support</span>
                  <Toggle value={false} onChange={()=>{}}/>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Auto-detect language</span>
                  <Toggle value={true} onChange={()=>{}}/>
                </div>
              </div>
            )}
            {item.label === "OneSignal" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">App ID</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">REST API Key</label>
                  <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"/>
                </div>
              </div>
            )}
            {!item.label.toLowerCase().includes("firebase") && item.label !== "Languages" && item.label !== "OneSignal" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-600">Enable for iOS</span>
                  <Toggle value={true} onChange={()=>{}}/>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-600">Enable for Android</span>
                  <Toggle value={true} onChange={()=>{}}/>
                </div>
                {item.label.includes("Stripe") && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Publishable Key</label>
                      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="pk_live_..."/>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Secret Key</label>
                      <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="sk_live_..."/>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button onClick={()=>toast({ title:"Saved \u2713", description:`${item?.label} settings have been saved.` })} className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type FeaturesPanelProps = {
  features: typeof FEATURES_DATA;
  onToggleFeature: (label: string) => void;
};

export function FeaturesPanel({ features, onToggleFeature }: FeaturesPanelProps) {
  const [selected, setSelected] = useState<FeatureItem | null>(null);
  const [search, setSearch]     = useState("");

  const toggleFeature = (label: string) => {
    onToggleFeature(label);
    if (selected?.label === label) {
      setSelected(prev => prev ? { ...prev, enabled: !prev.enabled } : null);
    }
  };

  const filtered = features.map(group => ({
    ...group,
    items: group.items.filter(it =>
      it.label.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(g => g.items.length > 0);

  return (
    <div className="flex-1 flex overflow-hidden bg-white dark:bg-gray-800">
      <div className="w-64 border-r border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search features..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-violet-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.map(group => (
            <div key={group.section} className="mb-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1">{group.section}</p>
              {group.items.map(item => (
                <button
                  key={item.label}
                  onClick={()=>setSelected(item)}
                  className={`w-full flex items-center gap-2 px-4 py-1.5 text-xs transition-colors text-left ${
                    selected?.label === item.label
                      ? "bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.enabled ? "bg-green-400" : "bg-gray-200"}`}/>
                  <span className="flex-1">{item.label}</span>
                  {item.enabled && <Check className="w-3 h-3 text-green-500 flex-shrink-0"/>}
                  {item.badge === "new" && (
                    <span className="text-[8px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded font-bold flex-shrink-0">NEW</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <FeatureDetailPanel item={selected} onToggleEnabled={toggleFeature}/>
    </div>
  );
}
