import { useState } from "react";
import { Link2, Globe, Check, Copy } from "lucide-react";

export function DynamicLinksPanel() {
  const [projectName, setProjectName] = useState("YEMEN TV");
  const [created, setCreated]         = useState(false);
  const [copying, setCopying]         = useState(false);

  const subdomain = projectName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g,"");
  const generatedUrl = `https://${subdomain}-deeplink.fluxbuilder.com`;

  const handleCopy = () => {
    setCopying(true);
    navigator.clipboard?.writeText(generatedUrl);
    setTimeout(()=>setCopying(false), 1500);
  };

  return (
    <div className="flex-1 flex items-start justify-center overflow-y-auto bg-gray-50 dark:bg-gray-800 p-8">
      {!created ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm w-full max-w-2xl p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Link2 className="w-7 h-7 text-blue-500"/>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
              <p className="text-sm text-gray-500 mt-1">
                Set up a new project to start using Fluxbuilder Dynamic Links.{" "}
                <a href="#" className="text-blue-600 hover:underline font-medium">Refer to this guide</a>{" "}
                for more information.
              </p>
            </div>
          </div>

          {/* Project Name */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
              <Link2 className="w-4 h-4 text-blue-500"/> Project Name
            </label>
            <input
              value={projectName}
              onChange={e=>setProjectName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-1.5">This will be used to identify your project and generate the subdomain</p>
          </div>

          {/* Generated Subdomain */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
              <Link2 className="w-4 h-4 text-blue-500"/> Generated Subdomain
            </label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-white">
              <Globe className="w-4 h-4 text-gray-400 flex-shrink-0"/>
              <span className="flex-1 text-sm text-gray-700 font-mono">{generatedUrl}</span>
              <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                {copying
                  ? <Check className="w-4 h-4 text-green-500"/>
                  : <Copy className="w-4 h-4 text-gray-400"/>}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Your dynamic links will be accessible at this URL</p>
          </div>

          {/* Create button */}
          <button
            onClick={()=>setCreated(true)}
            disabled={!projectName.trim()}
            className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors tracking-wide"
          >
            CREATE PROJECT
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-2xl p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600"/>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Project Created!</h2>
            <p className="text-sm text-gray-500 mt-1">Your dynamic links project <strong>{projectName}</strong> is ready.</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
            <p className="text-xs text-gray-500 mb-1">Your deeplink URL</p>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500"/>
              <span className="text-sm font-mono text-blue-700 flex-1">{generatedUrl}</span>
              <button onClick={handleCopy} className="p-1.5 rounded hover:bg-gray-200 transition-colors">
                {copying ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4 text-gray-400"/>}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
              View Dashboard
            </button>
            <button onClick={()=>setCreated(false)}
              className="py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors">
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
