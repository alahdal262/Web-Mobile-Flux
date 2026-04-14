import { useState, useRef, useEffect } from "react";
import { Zap } from "lucide-react";

import type {
  TabKey, DesignLayout, SidebarSection, DesignSubItem,
  DynamicTab, ChatMessage,
} from "./types";
import {
  DEFAULT_DYNAMIC_TABS, INITIAL_CHAT_MESSAGES, FEATURES_DATA,
} from "./types";

import { PhonePreview } from "./components/PhonePreview";
import { PageCardsPanel } from "./components/PageCardsPanel";
import { LeftSidebar } from "./components/LeftSidebar";
import { TopBar } from "./components/TopBar";
import { BottomToolbar } from "./components/BottomToolbar";
import { DashboardRightPanel, RightPanel } from "./components/RightPanel";

import { TemplatesPanel } from "./DesignPanel/TemplatesPanel";
import { AppBarPanel } from "./DesignPanel/AppBarPanel";
import { TabBarPanel } from "./DesignPanel/TabBarPanel";
import { SideMenuPanel } from "./DesignPanel/SideMenuPanel";
import { LayoutsPanel } from "./DesignPanel/LayoutsPanel";
import { WidgetBuilder } from "./WidgetBuilder";
import { getTemplateWidgets, type TemplateWidgetDef } from "./data/templates";
import { useToast } from "@/hooks/use-toast";

import { FeaturesPanel } from "./FeaturesPanel";
import { BuildPanel } from "./BuildPanel";
import { ChatPanel } from "./ChatPanel";
import { DynamicLinksPanel } from "./DynamicLinksPanel";
import { ProductLicensePanel } from "./ProductLicensePanel";
import { DashboardOverviewPanel } from "./DashboardOverviewPanel";

export default function Dashboard() {
  const [isDark, setIsDark]               = useState(false);
  const [activeSection, setActiveSection] = useState<SidebarSection>("Dashboard");
  const [activeTab, setActiveTab]         = useState<TabKey>("User");
  const [activeLayout, setActiveLayout]   = useState<DesignLayout>("Profile");
  const [activeDesignSub, setDesignSub]   = useState<DesignSubItem>(null);
  const [sidebarOpen, setSidebarOpen]     = useState(false);

  // Template → WidgetBuilder state
  const [templateWidgets, setTemplateWidgets] = useState<TemplateWidgetDef[] | undefined>(undefined);
  const [widgetBuilderKey, setWidgetBuilderKey] = useState(0);
  const { toast } = useToast();

  const handleApplyTemplate = (templateId: number) => {
    const widgets = getTemplateWidgets(templateId);
    if (widgets) {
      setTemplateWidgets(widgets);
      setWidgetBuilderKey(prev => prev + 1);
      setDesignSub(null); // Switch to WidgetBuilder view
      toast({ title: "Template applied!", description: "Customize the widgets in the builder." });
    }
  };

  // Dynamic tabs state
  const [dynTabs, setDynTabs] = useState<DynamicTab[]>(DEFAULT_DYNAMIC_TABS);
  const [activeTabId, setActiveTabId] = useState<string>("t5");

  // Lifted state: features & chat persist across section changes
  const [features, setFeatures] = useState(FEATURES_DATA);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const chatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (chatTimerRef.current) clearTimeout(chatTimerRef.current); };
  }, []);

  const handleToggleFeature = (label: string) => {
    setFeatures(prev => prev.map(group => ({
      ...group,
      items: group.items.map(it =>
        it.label === label ? { ...it, enabled: !it.enabled } : it
      ),
    })));
  };

  const handleSendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setChatMessages(prev => [...prev, { from: "user", text: text.trim(), time }]);
    if (chatTimerRef.current) clearTimeout(chatTimerRef.current);
    chatTimerRef.current = setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
      setChatMessages(prev => [...prev, {
        from: "support",
        text: "Thanks for your message! Our team will get back to you shortly. In the meantime, check out our documentation for quick answers.",
        time: replyTime,
      }]);
      chatTimerRef.current = null;
    }, 1500);
  };

  const defaults: Record<TabKey, DesignLayout> = {
    HOME:"Home", Category:"Category", Live:"Page", Wishlist:"Wishlist", User:"Profile",
  };

  // Map dynTab id -> nearest TabKey for phone preview
  const iconToTabKey: Record<string, TabKey> = {
    home:"HOME", category:"Category", live:"Live",
    wishlist:"Wishlist", user:"User",
    search:"HOME", bell:"HOME", settings:"User",
    star:"HOME", globe:"HOME", folder:"Category",
    layers:"HOME", bookmark:"Wishlist", list:"HOME",
    zap:"Live", type:"HOME",
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setActiveLayout(defaults[tab]);
    setDesignSub(null);
  };

  const handleDynSelect = (id: string) => {
    setActiveTabId(id);
    const t = dynTabs.find(t => t.id === id);
    if (t) {
      const key = iconToTabKey[t.iconKey] ?? "HOME";
      handleTabChange(key);
    }
  };

  const handleAddTab = (tab: DynamicTab) => {
    setDynTabs(prev => [...prev, tab]);
  };

  const handleToggleVisible = (id: string) => {
    setDynTabs(prev => prev.map(t => t.id === id ? { ...t, visible: !t.visible } : t));
  };

  const handleDeleteTab = (id: string) => {
    setDynTabs(prev => prev.filter(t => t.id !== id));
    if (activeTabId === id) setActiveTabId(dynTabs[0]?.id ?? "t1");
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden${isDark ? " dark" : ""}`}>
      <TopBar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-200`}>
          <LeftSidebar
            activeSection={activeSection}
            onSectionChange={(s) => { setActiveSection(s); setSidebarOpen(false); }}
            activeDesignSub={activeDesignSub}
            onDesignSubChange={setDesignSub}
            isDark={isDark}
            onToggleDark={() => setIsDark(d => !d)}
          />
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800 overflow-hidden relative min-w-0">
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeSection === "Dashboard"       && <DashboardOverviewPanel/>}
            {activeSection === "Features"        && <FeaturesPanel features={features} onToggleFeature={handleToggleFeature}/>}
            {activeSection === "Build"           && <BuildPanel/>}
            {activeSection === "Chat"            && <ChatPanel messages={chatMessages} onSendMessage={handleSendChatMessage}/>}
            {activeSection === "Dynamic Links"   && <DynamicLinksPanel/>}
            {activeSection === "Product License" && <ProductLicensePanel/>}

            {activeSection === "Design" && (
              <>
                {activeDesignSub === "Templates"  && <TemplatesPanel onApplyTemplate={handleApplyTemplate}/>}
                {activeDesignSub === "AppBar"     && <AppBarPanel/>}
                {activeDesignSub === "TabBar"     && <TabBarPanel activeTab={activeTab} onTabChange={setActiveTab}/>}
                {activeDesignSub === "Side Menu"  && <SideMenuPanel/>}
                {activeDesignSub === "Layouts"    && <LayoutsPanel/>}
                {activeDesignSub === null && (
                  <WidgetBuilder key={widgetBuilderKey} initialWidgets={templateWidgets}/>
                )}
              </>
            )}
          </div>
          {activeSection !== "Dashboard" && <BottomToolbar/>}

          {activeSection === "Dashboard" && (
            <button className="absolute bottom-6 right-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors z-20">
              <Zap className="w-5 h-5"/>
              <span className="absolute -top-1 -right-1 text-[8px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">Beta</span>
            </button>
          )}
        </div>

        {/* Right panel -- hidden on mobile */}
        <div className="hidden lg:block">
          {activeSection === "Dashboard" ? (
            <DashboardRightPanel/>
          ) : (
            <RightPanel
              activeTab={activeTab}
              activeLayout={activeLayout}
              onLayoutChange={setActiveLayout}
            />
          )}
        </div>
      </div>
    </div>
  );
}
