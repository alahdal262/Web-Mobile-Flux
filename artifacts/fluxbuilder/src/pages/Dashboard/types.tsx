import {
  Home, Grid, Search, Heart, User, Globe, SquareDashed,
  Type, Layers, RefreshCw, Rows3, AlignLeft, FolderOpen,
  Radio, Bell, Settings, Star, Zap,
} from "lucide-react";
import React from "react";

// ---------- core types ----------
export type TabKey = "HOME" | "Category" | "Live" | "Wishlist" | "User";
export type DesignLayout =
  | "Home" | "Category" | "Search" | "Page"
  | "Wishlist" | "Profile" | "Static" | "Html"
  | "Post Screen" | "Dynamic" | "Tab Menu" | "Scrollable";
export type SidebarSection = "Dashboard" | "Design" | "Features" | "Build" | "Chat" | "Dynamic Links" | "Product License";
export type DesignSubItem = "Layouts" | "Templates" | "AppBar" | "TabBar" | "Side Menu" | null;

export type DynamicTab = {
  id: string;
  label: string;
  iconKey: string;
  visible: boolean;
  isDefault?: boolean;
  isStar?: boolean;
};

export type ChatMessage = { from: string; text: string; time: string };

export type FeatureItem = { label: string; enabled: boolean; badge?: string };

// ---------- helpers ----------
export const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`w-10 h-5 rounded-full transition-colors relative flex items-center flex-shrink-0 ${value ? "bg-blue-500" : "bg-gray-200"}`}
  >
    <span className={`w-4 h-4 bg-white rounded-full shadow absolute transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
  </button>
);

// ---------- constants ----------
export const DESIGN_LAYOUTS: DesignLayout[] = [
  "Home","Category","Search","Page",
  "Wishlist","Profile","Static","Html",
  "Post Screen","Dynamic","Tab Menu","Scrollable",
];
export const LAYOUT_ICONS: Record<DesignLayout, React.ReactNode> = {
  "Home":React.createElement(Home, {className:"w-4 h-4"}),"Category":React.createElement(Grid, {className:"w-4 h-4"}),"Search":React.createElement(Search, {className:"w-4 h-4"}),"Page":React.createElement(Globe, {className:"w-4 h-4"}),
  "Wishlist":React.createElement(Heart, {className:"w-4 h-4"}),"Profile":React.createElement(User, {className:"w-4 h-4"}),"Static":React.createElement(SquareDashed, {className:"w-4 h-4"}),"Html":React.createElement(Type, {className:"w-4 h-4"}),
  "Post Screen":React.createElement(Layers, {className:"w-4 h-4"}),"Dynamic":React.createElement(RefreshCw, {className:"w-4 h-4"}),"Tab Menu":React.createElement(Rows3, {className:"w-4 h-4"}),"Scrollable":React.createElement(AlignLeft, {className:"w-4 h-4"}),
};
export const APP_TABS: { key: TabKey; icon: React.ReactNode; label: string }[] = [
  { key:"HOME",  icon:React.createElement(Home, {className:"w-5 h-5"}),     label:"HOME" },
  { key:"Category", icon:React.createElement(FolderOpen, {className:"w-5 h-5"}), label:"Category" },
  { key:"Live",  icon:React.createElement(Radio, {className:"w-5 h-5"}),    label:"Live" },
  { key:"Wishlist", icon:React.createElement(Heart, {className:"w-5 h-5"}), label:"Wishlist" },
  { key:"User",  icon:React.createElement(User, {className:"w-5 h-5"}),     label:"User" },
];

export const ICON_OPTIONS: { key: string; icon: React.ReactNode; label: string }[] = [
  { key:"home",      icon:React.createElement(Home, {className:"w-5 h-5"}),        label:"Home" },
  { key:"category",  icon:React.createElement(Grid, {className:"w-5 h-5"}),        label:"Category" },
  { key:"live",      icon:React.createElement(Radio, {className:"w-5 h-5"}),       label:"Live" },
  { key:"wishlist",  icon:React.createElement(Heart, {className:"w-5 h-5"}),       label:"Wishlist" },
  { key:"user",      icon:React.createElement(User, {className:"w-5 h-5"}),        label:"User" },
  { key:"search",    icon:React.createElement(Search, {className:"w-5 h-5"}),      label:"Search" },
  { key:"bell",      icon:React.createElement(Bell, {className:"w-5 h-5"}),        label:"Notifications" },
  { key:"settings",  icon:React.createElement(Settings, {className:"w-5 h-5"}),    label:"Settings" },
  { key:"star",      icon:React.createElement(Star, {className:"w-5 h-5"}),        label:"Starred" },
  { key:"globe",     icon:React.createElement(Globe, {className:"w-5 h-5"}),       label:"Web" },
  { key:"folder",    icon:React.createElement(FolderOpen, {className:"w-5 h-5"}),  label:"Folder" },
  { key:"layers",    icon:React.createElement(Layers, {className:"w-5 h-5"}),      label:"Layers" },
  { key:"bookmark",  icon:React.createElement(SquareDashed, {className:"w-5 h-5"}),label:"Bookmark" },
  { key:"list",      icon:React.createElement(AlignLeft, {className:"w-5 h-5"}),   label:"List" },
  { key:"zap",       icon:React.createElement(Zap, {className:"w-5 h-5"}),         label:"Lightning" },
  { key:"type",      icon:React.createElement(Type, {className:"w-5 h-5"}),        label:"Text" },
];

export const ICON_MAP: Record<string, React.ReactNode> = Object.fromEntries(
  ICON_OPTIONS.map(o => [o.key, o.icon])
);

export const PHONE_ICON_MAP: Record<string, React.ReactNode> = {
  home:     React.createElement(Home, {className:"w-[18px] h-[18px]"}),
  category: React.createElement(Grid, {className:"w-[18px] h-[18px]"}),
  live:     React.createElement(Radio, {className:"w-[18px] h-[18px]"}),
  wishlist: React.createElement(Heart, {className:"w-[18px] h-[18px]"}),
  user:     React.createElement(User, {className:"w-[18px] h-[18px]"}),
  search:   React.createElement(Search, {className:"w-[18px] h-[18px]"}),
  bell:     React.createElement(Bell, {className:"w-[18px] h-[18px]"}),
  settings: React.createElement(Settings, {className:"w-[18px] h-[18px]"}),
  star:     React.createElement(Star, {className:"w-[18px] h-[18px]"}),
  globe:    React.createElement(Globe, {className:"w-[18px] h-[18px]"}),
  folder:   React.createElement(FolderOpen, {className:"w-[18px] h-[18px]"}),
  layers:   React.createElement(Layers, {className:"w-[18px] h-[18px]"}),
  bookmark: React.createElement(SquareDashed, {className:"w-[18px] h-[18px]"}),
  list:     React.createElement(AlignLeft, {className:"w-[18px] h-[18px]"}),
  zap:      React.createElement(Zap, {className:"w-[18px] h-[18px]"}),
  type:     React.createElement(Type, {className:"w-[18px] h-[18px]"}),
};

export const DEFAULT_DYNAMIC_TABS: DynamicTab[] = [
  { id:"t1", label:"HOME",     iconKey:"home",     visible:true,  isDefault:true, isStar:true },
  { id:"t2", label:"Category", iconKey:"category", visible:true,  isDefault:true },
  { id:"t3", label:"Live",     iconKey:"live",     visible:true,  isDefault:true },
  { id:"t4", label:"Wishlist", iconKey:"wishlist",  visible:true,  isDefault:true },
  { id:"t5", label:"User",     iconKey:"user",     visible:true,  isDefault:true },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  { from:"support", text:"Hi! Welcome to Mobile-WP support. How can I help you today?", time:"10:30 AM" },
  { from:"user",    text:"How do I connect my WordPress site?", time:"10:31 AM" },
  { from:"support", text:"Great question! Go to Server Integration (Step 1 of the Create App wizard) and enter your WordPress URL. Then select WordPress as your integration platform and run the connectivity test.", time:"10:32 AM" },
  { from:"user",    text:"I got 4/5 tests passed. Plugin Activation failed.", time:"10:35 AM" },
  { from:"support", text:"That's the MStore API plugin. You need to install and activate it on your WordPress site. Go to Plugins \u2192 Add New \u2192 Search for \"MStore API\" \u2192 Install & Activate. Then re-run the test.", time:"10:36 AM" },
];

export const FEATURES_DATA = [
  {
    section: "FIREBASE",
    items: [
      { label: "Firebase",                 enabled: true  },
      { label: "Firebase Push Notification", enabled: false },
      { label: "Firebase Remote Config",   enabled: false, badge: "new" as const },
      { label: "Firebase Analytics",       enabled: false },
    ],
  },
  {
    section: "FACEBOOK",
    items: [
      { label: "Facebook",                 enabled: false },
      { label: "Facebook App Events",      enabled: false },
    ],
  },
  {
    section: "TOOLS",
    items: [
      { label: "Import Data",              enabled: false },
      { label: "Export Data",              enabled: false },
      { label: "Cloud Config",             enabled: false },
      { label: "App Performance",          enabled: false },
      { label: "Deploy Stripe Payment",    enabled: false, badge: "new" as const },
    ],
  },
  {
    section: "BRANDING",
    items: [
      { label: "Theme & Logo",             enabled: false },
      { label: "Color Override",           enabled: false },
      { label: "Loading Icon",             enabled: false },
      { label: "Splash Screen",            enabled: false },
      { label: "Onboarding",               enabled: false },
      { label: "Notification Request Screen", enabled: false },
      { label: "Privacy & Security",       enabled: false },
      { label: "Age Restriction",          enabled: false },
      { label: "Smart Chat",               enabled: false },
      { label: "Smart Banner",             enabled: false },
    ],
  },
  {
    section: "GENERAL",
    items: [
      { label: "Languages",                enabled: true  },
      { label: "Translation Override",     enabled: false },
      { label: "Sign In/Sign Up",          enabled: false },
      { label: "Blog Integration",         enabled: false },
      { label: "OneSignal",                enabled: false },
      { label: "Google Maps",              enabled: false },
      { label: "Advertisement",            enabled: false },
      { label: "App Rating",               enabled: false },
      { label: "Product Card",             enabled: false },
      { label: "Product List Screen",      enabled: false },
      { label: "WebView",                  enabled: false },
      { label: "Phone Number Config",      enabled: false },
      { label: "Version Update Alert",     enabled: false },
      { label: "In-app Update (Android only)", enabled: false },
      { label: "Product Review",           enabled: false },
      { label: "Dynamic Link Config",      enabled: false },
      { label: "Offline Mode",             enabled: false, badge: "new" as const },
      { label: "Miscellaneous",            enabled: false },
      { label: "Chat GPT",                 enabled: false, badge: "new" as const },
    ],
  },
  {
    section: "CART & CHECKOUT",
    items: [
      { label: "Currencies",               enabled: false },
      { label: "Shopping Cart",            enabled: false },
      { label: "Coupon",                   enabled: false },
      { label: "Shipping Country",         enabled: false },
      { label: "Checkout Screen",          enabled: false },
      { label: "Order History",            enabled: false },
    ],
  },
  {
    section: "PAYMENT METHODS",
    items: [
      { label: "WebView Payment",          enabled: false },
      { label: "Stripe Payment",           enabled: false, badge: "new" as const },
    ],
  },
  {
    section: "PWA",
    items: [
      { label: "PWA Settings",             enabled: false, badge: "new" as const },
      { label: "Deploy CORS Server",       enabled: false, badge: "new" as const },
    ],
  },
];
