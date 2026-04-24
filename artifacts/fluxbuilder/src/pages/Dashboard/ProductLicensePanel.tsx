import { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";

export function ProductLicensePanel() {
  const [licenseKey, setLicenseKey] = useState("");
  const [verified]     = useState(true);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Product License</h2>

      {/* Current Plan */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Current Plan</p>
              <p className="text-2xl font-bold mt-0.5">Regular License</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white"/>
              </div>
              {verified && (
                <span className="flex items-center gap-1 text-[10px] bg-green-400/20 text-green-100 border border-green-300/30 px-2 py-0.5 rounded-full font-bold">
                  <Check className="w-3 h-3"/> Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {[
            { label:"License Type",  value:"Regular" },
            { label:"Purchase Date", value:"January 15, 2026" },
            { label:"Support Until", value:"July 15, 2026" },
            { label:"Updates",       value:"Lifetime updates included" },
          ].map(r=>(
            <div key={r.label} className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-500">{r.label}</span>
              <span className="text-xs font-semibold text-gray-900">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* License Key */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gray-400"/> License Key
        </h3>
        <div className="flex gap-2">
          <input
            value={licenseKey}
            onChange={e=>setLicenseKey(e.target.value)}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <button className="px-5 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-colors">
            Verify
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">Enter your Envato purchase code to activate your license.</p>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Compare Plans</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              name:"Regular", price:"$59", current:true,
              features:["1 App","WordPress Integration","Basic Templates","Email Support","6 Months Updates"],
            },
            {
              name:"Extended", price:"$199", current:false,
              features:["5 Apps","All Integrations","All Templates","Priority Support","Lifetime Updates","Custom Branding"],
            },
            {
              name:"Enterprise", price:"$499", current:false,
              features:["Unlimited Apps","All Integrations","All Templates","24/7 Support","Lifetime Updates","White Label","API Access"],
            },
          ].map(plan=>(
            <div key={plan.name} className={`rounded-xl border-2 p-4 transition-all ${
              plan.current ? "border-violet-500 bg-violet-50/50" : "border-gray-100 hover:border-gray-300"
            }`}>
              <p className="text-sm font-bold text-gray-900">{plan.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{plan.price}</p>
              <p className="text-[10px] text-gray-400 mb-3">one-time payment</p>
              <ul className="space-y-1.5">
                {plan.features.map(f=>(
                  <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0"/> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full mt-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                plan.current
                  ? "bg-violet-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
