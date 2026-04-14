import { useState } from "react";
import { Link } from "wouter";
import { Plus, ChevronRight } from "lucide-react";

export function DashboardOverviewPanel() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const successStories = [
    { title:"Success Story: Dermazone Store App #102 #WebToApp", views:"9 views", emoji:"\u{1F680}" },
    { title:"10,000+ DOWNLOADS! JoCell Shopify App Success #...", views:"17 views", emoji:"\u{1F389}" },
    { title:"Success Story: Halwayati WooCommerce App #100 #W...", views:"39 views", emoji:"\u{1F680}" },
    { title:"Latest FluxStore Listing app > Convert Listeo, MyListing, Listi...", views:"65 views", emoji:"" },
    { title:"Massive Speed Boost for Cart & Checkout! > App Performance...", views:"141 views", emoji:"" },
    { title:"Native Modern Payment for WooCommerce", views:"147 views", emoji:"" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
      <div className="max-w-3xl mx-auto px-8 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1">
          Convert your Website to
        </h1>
        <h1 className="text-4xl font-bold leading-tight mb-8">
          <span className="text-blue-500">Flutter app </span>
          <span className="text-pink-500">in minutes</span>
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <input
            value={websiteUrl}
            onChange={e=>setWebsiteUrl(e.target.value)}
            placeholder="Type your Website URL"
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-800 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <Link href="/create" className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4"/> CREATE APP
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-10 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
            <Plus className="w-5 h-5 text-white"/>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Enter a prompt, our AI builds it</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Start with AI</p>
              <span className="text-[9px] px-2 py-0.5 bg-blue-500 text-white rounded-full font-bold">Beta</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Feature update</h3>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl h-64 flex items-center justify-center">
            <p className="text-sm text-gray-300 dark:text-gray-500">No updates yet</p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {successStories.map((story,i)=>(
            <div key={i} className="w-40 flex-shrink-0 cursor-pointer group">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 group-hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-gray-400"/>
                </div>
              </div>
              <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-tight line-clamp-2 font-medium">
                {story.emoji && <span>{story.emoji} </span>}{story.title}
              </p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{story.views}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
