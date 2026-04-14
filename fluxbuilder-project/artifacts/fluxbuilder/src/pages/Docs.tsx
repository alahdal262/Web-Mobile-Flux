import { useState } from "react";
import { Link } from "wouter";
import { Search, ChevronRight, Book, Layers, Terminal, Zap, ArrowRight } from "lucide-react";

type DocPage = { section: number; item: number };

const DOC_CONTENT: Record<string, { title: string; body: string }> = {
  "Introduction":       { title: "Introduction to Mobile-WP", body: "Welcome to the Mobile-WP documentation. Learn how to visually construct mobile-first applications, connect them to your backend, and publish to the edge. Mobile-WP is a comprehensive visual development platform designed from the ground up for web applications with complex state, routing, and database integrations." },
  "Quick Start":        { title: "Quick Start", body: "Create your first app in minutes. Sign up, click 'Create App', enter your WordPress URL, and follow the setup wizard. Your app will be live on a test link within seconds." },
  "Installation":       { title: "Installation", body: "Mobile-WP runs entirely in the browser — no installation required. For the CLI companion tool, run: npm install -g mobile-wp-cli. Minimum Node.js version: 18." },
  "The Canvas":         { title: "The Canvas", body: "The canvas is your design workspace. Drag components from the left panel onto the canvas, resize them by dragging handles, and configure properties in the right inspector. Use Cmd+Z to undo." },
  "State Management":   { title: "State Management", body: "Every component can bind to application state. Define state variables in the State panel and use {{variableName}} syntax to reference them in text fields or conditionals." },
  "Data Binding":       { title: "Data Binding", body: "Connect components to your API by selecting a component and clicking 'Bind Data'. Choose your endpoint, map JSON fields to component properties, and configure refresh intervals." },
  "Layout":             { title: "Layout Components", body: "Row, Column, Stack, and Grid components control layout. Set flex properties, padding, margin, and gap using the inspector. Responsive breakpoints can be configured per component." },
  "Typography":         { title: "Typography Components", body: "Text, Heading, and Label components support custom fonts, weights, and sizes. Import Google Fonts from the Theme panel." },
  "Forms":              { title: "Form Components", body: "TextInput, Dropdown, Checkbox, Radio, and Button components are available. Wire form submissions to your API endpoints via the Form Actions panel." },
  "Media":              { title: "Media Components", body: "Image, Video, Icon, and Lottie animation components. Images support lazy loading and responsive sizing. Videos support auto-play and loop controls." },
  "REST Integration":   { title: "REST Integration", body: "Add your API base URL in Settings → Integrations. Define endpoints with method, path, headers, and body templates. Use the Test button to verify connectivity before binding." },
  "Auth Hooks":         { title: "Auth Hooks", body: "Use onLogin, onLogout, and onAuthStateChange hooks to respond to authentication events. JWT tokens are automatically managed in secure HttpOnly cookies." },
  "Deployments":        { title: "Deployments", body: "Click Build → Cloud Build to generate a production APK or IPA. Builds are queued and completed within 5 minutes. Download links expire after 24 hours." },
};

export default function Docs() {
  const [activePage, setActivePage] = useState<DocPage>({ section: 0, item: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarLinks = [
    { title: "Getting Started", icon: Zap,      items: ["Introduction", "Quick Start", "Installation"] },
    { title: "Core Concepts",   icon: Book,      items: ["The Canvas", "State Management", "Data Binding"] },
    { title: "Components",      icon: Layers,    items: ["Layout", "Typography", "Forms", "Media"] },
    { title: "API Reference",   icon: Terminal,  items: ["REST Integration", "Auth Hooks", "Deployments"] },
  ];

  const allItems = sidebarLinks.flatMap(s => s.items);
  const filteredLinks = searchQuery.trim()
    ? sidebarLinks.map(s => ({ ...s, items: s.items.filter(it => it.toLowerCase().includes(searchQuery.toLowerCase())) })).filter(s => s.items.length > 0)
    : sidebarLinks;

  const currentItem = sidebarLinks[activePage.section]?.items[activePage.item] ?? "Introduction";
  const content = DOC_CONTENT[currentItem] ?? DOC_CONTENT["Introduction"];

  const currentIndex = allItems.indexOf(currentItem);
  const nextItem = allItems[currentIndex + 1];
  const prevItem = allItems[currentIndex - 1];

  const navigateTo = (itemName: string) => {
    for (let si = 0; si < sidebarLinks.length; si++) {
      const ii = sidebarLinks[si].items.indexOf(itemName);
      if (ii !== -1) { setActivePage({ section: si, item: ii }); break; }
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 pb-24">

        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 md:sticky top-28 h-fit">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>

          <nav className="space-y-8">
            {filteredLinks.map((section, i) => (
              <div key={i}>
                <h4 className="flex items-center gap-2 font-semibold text-slate-900 mb-3">
                  <section.icon className="w-4 h-4 text-violet-600" />
                  {section.title}
                </h4>
                <ul className="space-y-2 border-l border-slate-100 ml-2 pl-4">
                  {section.items.map((item, j) => {
                    const si = sidebarLinks.findIndex(s => s.items.includes(item));
                    const ii = sidebarLinks[si]?.items.indexOf(item) ?? 0;
                    const isActive = activePage.section === si && activePage.item === ii;
                    return (
                      <li key={j}>
                        <button onClick={() => setActivePage({ section: si, item: ii })}
                          className={`text-sm hover:text-violet-600 transition-colors text-left w-full ${isActive ? "text-violet-600 font-medium" : "text-slate-600"}`}>
                          {item}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Docs</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">{currentItem}</span>
          </div>

          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">{content.title}</h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">{content.body}</p>

          <div className="prose prose-slate max-w-none">
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-8">
              <h4 className="flex items-center gap-2 text-violet-900 font-semibold mb-2">
                <Zap className="w-5 h-5 text-violet-600" /> Quick Tip
              </h4>
              <p className="text-violet-800 text-sm">
                If you already have a database, you can connect it instantly using our REST Integration panel. No middleware required.
              </p>
            </div>

            <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="text-slate-500 text-sm">Last updated: Apr 10, 2026</div>
                {prevItem && (
                  <button onClick={() => navigateTo(prevItem)} className="flex items-center gap-1 text-slate-500 text-sm hover:text-violet-600 ml-4 transition-colors">
                    ← {prevItem}
                  </button>
                )}
              </div>
              {nextItem && (
                <button onClick={() => navigateTo(nextItem)} className="flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700 transition-colors">
                  Next: {nextItem} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
