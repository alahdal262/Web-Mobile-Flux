import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  Image,
  LayoutGrid,
  List,
  Search,
  Type,
  Play,
  MousePointerClick,
  Minus,
  Code2,
  FileText,
  MapPin,
  Trash2,
  GripVertical,
  ChevronRight,
  ChevronDown,
  ArrowDown,
  Star,
  Sliders,
  X,
  ImageIcon,
} from "lucide-react";
import { Toggle } from "./types";

// ─── Types ─────────────────────────────────────────────────────
type WidgetType =
  | "banner"
  | "imageSlider"
  | "productGrid"
  | "categoryList"
  | "searchBar"
  | "textBlock"
  | "videoPlayer"
  | "button"
  | "divider"
  | "htmlBlock"
  | "blogPosts"
  | "map";

interface Widget {
  id: string;
  type: WidgetType;
  config: Record<string, unknown>;
}

interface WidgetDefinition {
  type: WidgetType;
  label: string;
  icon: React.ReactNode;
}

// ─── Default configs ───────────────────────────────────────────
const DEFAULT_CONFIGS: Record<WidgetType, Record<string, unknown>> = {
  banner: {
    title: "Welcome to Our Store",
    subtitle: "Shop the latest collection",
    backgroundColor: "#3b82f6",
    imageUrl: "",
    height: 180,
  },
  imageSlider: {
    images: [],
    autoPlay: true,
    interval: 3000,
    height: 160,
  },
  productGrid: {
    columns: 2,
    showPrice: true,
    showRating: true,
    itemCount: 4,
  },
  categoryList: {
    categories: ["Electronics", "Fashion", "Home & Garden", "Sports", "Books"],
    showIcon: true,
    showChevron: true,
  },
  searchBar: {
    placeholder: "Search products...",
    backgroundColor: "#f3f4f6",
    borderRadius: 24,
  },
  textBlock: {
    content: "Add your text content here. This is a customizable text block for your app.",
    fontSize: 14,
    alignment: "left" as string,
    color: "#374151",
  },
  videoPlayer: {
    videoUrl: "",
    autoPlay: false,
    showControls: true,
    height: 180,
  },
  button: {
    label: "Shop Now",
    color: "#3b82f6",
    textColor: "#ffffff",
    actionUrl: "",
    fullWidth: true,
  },
  divider: {
    thickness: 1,
    color: "#e5e7eb",
    margin: 12,
  },
  htmlBlock: {
    html: "<div>Custom HTML</div>",
  },
  blogPosts: {
    count: 3,
    showImage: true,
    showDate: true,
    showExcerpt: true,
  },
  map: {
    latitude: 40.7128,
    longitude: -74.006,
    zoom: 12,
    height: 200,
  },
};

// ─── Widget catalog ────────────────────────────────────────────
const WIDGET_CATALOG: WidgetDefinition[] = [
  { type: "banner", label: "Banner", icon: <ImageIcon className="w-4 h-4" /> },
  { type: "imageSlider", label: "Image Slider", icon: <Image className="w-4 h-4" /> },
  { type: "productGrid", label: "Product Grid", icon: <LayoutGrid className="w-4 h-4" /> },
  { type: "categoryList", label: "Category List", icon: <List className="w-4 h-4" /> },
  { type: "searchBar", label: "Search Bar", icon: <Search className="w-4 h-4" /> },
  { type: "textBlock", label: "Text Block", icon: <Type className="w-4 h-4" /> },
  { type: "videoPlayer", label: "Video Player", icon: <Play className="w-4 h-4" /> },
  { type: "button", label: "Button", icon: <MousePointerClick className="w-4 h-4" /> },
  { type: "divider", label: "Divider", icon: <Minus className="w-4 h-4" /> },
  { type: "htmlBlock", label: "HTML Block", icon: <Code2 className="w-4 h-4" /> },
  { type: "blogPosts", label: "Blog Posts", icon: <FileText className="w-4 h-4" /> },
  { type: "map", label: "Map", icon: <MapPin className="w-4 h-4" /> },
];

// ─── Widget Category Groups ───────────────────────────────────
interface WidgetCategory {
  label: string;
  types: WidgetType[];
}

const WIDGET_CATEGORIES: WidgetCategory[] = [
  { label: "Layout", types: ["banner", "imageSlider", "divider"] },
  { label: "Content", types: ["textBlock", "htmlBlock", "blogPosts"] },
  { label: "Commerce", types: ["productGrid", "categoryList"] },
  { label: "Media", types: ["videoPlayer", "map"] },
  { label: "Interactive", types: ["searchBar", "button"] },
];

const CATALOG_BY_TYPE = Object.fromEntries(
  WIDGET_CATALOG.map((def) => [def.type, def])
) as Record<WidgetType, WidgetDefinition>;

// ─── Property Section Groups per widget type ──────────────────
interface PropSection {
  label: string;
  keys: string[];
}

const PROP_SECTIONS: Partial<Record<WidgetType, PropSection[]>> = {
  banner: [
    { label: "Content", keys: ["title", "subtitle", "imageUrl"] },
    { label: "Style", keys: ["backgroundColor"] },
    { label: "Layout", keys: ["height"] },
  ],
  textBlock: [
    { label: "Content", keys: ["content"] },
    { label: "Style", keys: ["fontSize", "color"] },
    { label: "Layout", keys: ["alignment"] },
  ],
  button: [
    { label: "Content", keys: ["label", "actionUrl"] },
    { label: "Style", keys: ["color", "textColor"] },
    { label: "Layout", keys: ["fullWidth"] },
  ],
  productGrid: [
    { label: "Layout", keys: ["columns", "itemCount"] },
    { label: "Style", keys: ["showPrice", "showRating"] },
  ],
  searchBar: [
    { label: "Content", keys: ["placeholder"] },
    { label: "Style", keys: ["backgroundColor", "borderRadius"] },
  ],
  divider: [
    { label: "Style", keys: ["thickness", "color"] },
    { label: "Layout", keys: ["margin"] },
  ],
  imageSlider: [
    { label: "Content", keys: ["autoPlay", "interval"] },
    { label: "Layout", keys: ["height"] },
  ],
  videoPlayer: [
    { label: "Content", keys: ["videoUrl", "autoPlay", "showControls"] },
    { label: "Layout", keys: ["height"] },
  ],
  categoryList: [
    { label: "Content", keys: ["categories"] },
    { label: "Style", keys: ["showIcon", "showChevron"] },
  ],
  map: [
    { label: "Content", keys: ["latitude", "longitude"] },
    { label: "Layout", keys: ["zoom", "height"] },
  ],
  blogPosts: [
    { label: "Content", keys: ["count"] },
    { label: "Style", keys: ["showImage", "showDate", "showExcerpt"] },
  ],
  htmlBlock: [
    { label: "Content", keys: ["html"] },
  ],
};

let widgetIdCounter = 0;
function generateId(): string {
  widgetIdCounter += 1;
  return `widget-${Date.now()}-${widgetIdCounter}`;
}

// ─── Collapsible Category Section ─────────────────────────────
function CategorySection({
  category,
  isOpen,
  onToggle,
  activeDragId,
}: {
  category: WidgetCategory;
  isOpen: boolean;
  onToggle: () => void;
  activeDragId: UniqueIdentifier | null;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 w-full px-1 py-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 motion-safe:transition-colors"
      >
        <ChevronDown
          className={`w-3 h-3 flex-shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${isOpen ? "" : "-rotate-90"}`}
        />
        {category.label}
      </button>
      {isOpen && (
        <div className="space-y-1.5 pb-2">
          {category.types.map((type) => {
            const def = CATALOG_BY_TYPE[type];
            return def ? (
              <LibraryItem
                key={def.type}
                definition={def}
                activeDragId={activeDragId}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

// ─── Draggable Library Item ────────────────────────────────────
function LibraryItem({
  definition,
  activeDragId,
}: {
  definition: WidgetDefinition;
  activeDragId: UniqueIdentifier | null;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${definition.type}`,
    data: { type: "library", widgetType: definition.type },
  });

  const isBeingDragged = isDragging || activeDragId === `library-${definition.type}`;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-grab active:cursor-grabbing motion-safe:transition-all motion-safe:duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 ${isBeingDragged ? "opacity-50" : ""}`}
    >
      <GripVertical className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
        {definition.icon}
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {definition.label}
      </span>
    </div>
  );
}

// ─── Sortable Canvas Widget ────────────────────────────────────
function SortableCanvasWidget({
  widget,
  isSelected,
  onSelect,
  onDelete,
}: {
  widget: Widget;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const def = CATALOG_BY_TYPE[widget.type];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? "opacity-40 z-50" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Selection highlight */}
      <div
        className={`rounded-lg motion-safe:transition-all ${isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-gray-300"}`}
      >
        {/* Blue name bar when selected */}
        {isSelected && (
          <div className="bg-blue-500 text-white text-[7px] font-semibold px-2 py-0.5 rounded-t-lg flex items-center gap-1">
            <span className="flex-shrink-0 [&>svg]:w-2.5 [&>svg]:h-2.5">{def?.icon}</span>
            <span>{def?.label}</span>
          </div>
        )}
        {/* Drag handle + delete on hover */}
        <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity">
          <div
            {...attributes}
            {...listeners}
            className="p-0.5 bg-white dark:bg-gray-700 rounded shadow cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-3 h-3 text-gray-400" />
          </div>
        </div>
        <div className="absolute -right-0.5 top-0 z-10 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-0.5 bg-red-500 text-white rounded shadow hover:bg-red-600 motion-safe:transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        <WidgetPreview widget={widget} />
      </div>
    </div>
  );
}

// ─── Widget Preview Renderers ──────────────────────────────────
function WidgetPreview({ widget }: { widget: Widget }) {
  const c = widget.config;
  switch (widget.type) {
    case "banner":
      return <BannerPreview config={c} />;
    case "imageSlider":
      return <ImageSliderPreview />;
    case "productGrid":
      return <ProductGridPreview config={c} />;
    case "categoryList":
      return <CategoryListPreview config={c} />;
    case "searchBar":
      return <SearchBarPreview config={c} />;
    case "textBlock":
      return <TextBlockPreview config={c} />;
    case "videoPlayer":
      return <VideoPlayerPreview />;
    case "button":
      return <ButtonPreview config={c} />;
    case "divider":
      return <DividerPreview config={c} />;
    case "htmlBlock":
      return <HtmlBlockPreview />;
    case "blogPosts":
      return <BlogPostsPreview />;
    case "map":
      return <MapPreview />;
    default:
      return <div className="p-3 text-[8px] text-gray-400">Unknown widget</div>;
  }
}

function BannerPreview({ config }: { config: Record<string, unknown> }) {
  const bg = (config.backgroundColor as string) || "#3b82f6";
  const h = (config.height as number) || 180;
  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{ height: Math.min(h * 0.45, 100), background: `linear-gradient(135deg, ${bg}, ${bg}dd)` }}
    >
      <div className="absolute inset-0 flex flex-col justify-center px-3">
        <p className="text-[10px] font-bold text-white leading-tight truncate">
          {(config.title as string) || "Banner Title"}
        </p>
        <p className="text-[7px] text-white/80 mt-0.5 truncate">
          {(config.subtitle as string) || "Subtitle text"}
        </p>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10" />
      <div className="absolute -right-2 bottom-0 w-10 h-10 rounded-full bg-white/5" />
    </div>
  );
}

function ImageSliderPreview() {
  return (
    <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: 72 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image className="w-6 h-6 text-gray-400" />
      </div>
      {/* Dots indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full ${i === 0 ? "bg-blue-500" : "bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

function ProductGridPreview({ config }: { config: Record<string, unknown> }) {
  const cols = (config.columns as number) || 2;
  const showPrice = config.showPrice !== false;
  const showRating = config.showRating !== false;
  const items = Array.from({ length: Math.min(cols * 2, 6) });
  return (
    <div
      className="grid gap-1.5 p-1.5"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {items.map((_, i) => (
        <div key={i} className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-200 flex items-center justify-center" style={{ height: 36 }}>
            <Image className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="p-1">
            <div className="h-1 w-3/4 bg-gray-200 rounded-full mb-0.5" />
            {showPrice && (
              <p className="text-[7px] font-bold text-blue-600">$29.99</p>
            )}
            {showRating && (
              <div className="flex gap-px mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-1.5 h-1.5 ${s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryListPreview({ config }: { config: Record<string, unknown> }) {
  const cats = (config.categories as string[]) || ["Category 1", "Category 2", "Category 3"];
  return (
    <div className="divide-y divide-gray-100">
      {cats.slice(0, 5).map((cat, i) => (
        <div key={i} className="flex items-center gap-2 px-2.5 py-1.5">
          <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-2.5 h-2.5 text-blue-500" />
          </div>
          <span className="text-[8px] font-medium text-gray-700 flex-1 truncate">{cat}</span>
          <ChevronRight className="w-2.5 h-2.5 text-gray-300 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

function SearchBarPreview({ config }: { config: Record<string, unknown> }) {
  const bg = (config.backgroundColor as string) || "#f3f4f6";
  const placeholder = (config.placeholder as string) || "Search...";
  return (
    <div className="px-2.5 py-2">
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
        style={{ backgroundColor: bg }}
      >
        <Search className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-[8px] text-gray-400">{placeholder}</span>
      </div>
    </div>
  );
}

function TextBlockPreview({ config }: { config: Record<string, unknown> }) {
  const content = (config.content as string) || "Text content goes here.";
  const align = (config.alignment as string) || "left";
  const color = (config.color as string) || "#374151";
  const fontSize = (config.fontSize as number) || 14;
  return (
    <div className="px-2.5 py-2">
      <p
        className="leading-tight"
        style={{
          fontSize: Math.max(7, Math.min(fontSize * 0.6, 11)),
          textAlign: align as "left" | "center" | "right",
          color,
        }}
      >
        {content}
      </p>
    </div>
  );
}

function VideoPlayerPreview() {
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: 72 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-1.5 left-2 right-2">
        <div className="h-0.5 bg-white/20 rounded-full">
          <div className="h-full w-1/3 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ButtonPreview({ config }: { config: Record<string, unknown> }) {
  const label = (config.label as string) || "Button";
  const color = (config.color as string) || "#3b82f6";
  const textColor = (config.textColor as string) || "#ffffff";
  const fullWidth = config.fullWidth !== false;
  return (
    <div className={`px-2.5 py-2 ${fullWidth ? "" : "flex justify-center"}`}>
      <div
        className={`py-1.5 rounded-lg text-center ${fullWidth ? "w-full" : "px-6"}`}
        style={{ backgroundColor: color }}
      >
        <span className="text-[9px] font-semibold" style={{ color: textColor }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function DividerPreview({ config }: { config: Record<string, unknown> }) {
  const thickness = (config.thickness as number) || 1;
  const color = (config.color as string) || "#e5e7eb";
  const margin = (config.margin as number) || 12;
  return (
    <div style={{ paddingTop: margin * 0.4, paddingBottom: margin * 0.4, paddingLeft: 10, paddingRight: 10 }}>
      <div style={{ height: thickness, backgroundColor: color }} className="rounded-full" />
    </div>
  );
}

function HtmlBlockPreview() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-3 bg-gray-50 rounded-lg mx-1.5 my-1">
      <Code2 className="w-4 h-4 text-gray-400" />
      <span className="text-[8px] text-gray-500 font-mono">{"<html />"}</span>
    </div>
  );
}

function BlogPostsPreview() {
  const posts = [
    { title: "Getting Started with Mobile Commerce", date: "Apr 8, 2026" },
    { title: "Top 10 Design Tips for Your App", date: "Apr 5, 2026" },
    { title: "How to Boost Your Conversion Rate", date: "Apr 2, 2026" },
  ];
  return (
    <div className="space-y-1 p-1.5">
      {posts.map((post, i) => (
        <div key={i} className="flex gap-1.5 bg-gray-50 rounded-lg p-1.5 border border-gray-100">
          <div className="w-10 h-8 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
            <FileText className="w-3 h-3 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[7px] font-semibold text-gray-700 leading-tight line-clamp-1">
              {post.title}
            </p>
            <p className="text-[6px] text-gray-400 mt-0.5">{post.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapPreview() {
  return (
    <div className="relative bg-gray-200 rounded-lg overflow-hidden mx-1.5 my-1" style={{ height: 72 }}>
      {/* Grid lines to simulate map */}
      <div className="absolute inset-0 opacity-20">
        {[0, 1, 2, 3].map((i) => (
          <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-gray-400" style={{ top: `${25 * (i + 1)}%` }} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-gray-400" style={{ left: `${25 * (i + 1)}%` }} />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <MapPin className="w-5 h-5 text-red-500 fill-red-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/30 mt-px" />
        </div>
      </div>
    </div>
  );
}

// ─── Drop Zone (Canvas) ────────────────────────────────────────
function CanvasDropZone({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop-zone" });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-y-auto overflow-x-hidden motion-safe:transition-all ${
        isOver ? "bg-blue-50/50 ring-2 ring-blue-400 ring-dashed ring-inset" : ""
      }`}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full px-4">
          <div className="w-24 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-2 gap-1">
            <ArrowDown className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-[9px] text-gray-400 text-center font-medium">
            Drag widgets here to build your app
          </p>
        </div>
      ) : (
        <div className="p-1 space-y-1">{children}</div>
      )}
    </div>
  );
}

// ─── Property Section Header ──────────────────────────────────
function PropSectionHeader({ label }: { label: string }) {
  return (
    <div className="pt-2 first:pt-0">
      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </h4>
      <div className="h-px bg-gray-200 dark:bg-gray-700 -mx-4 mb-3" />
    </div>
  );
}

// ─── Property Inspector ────────────────────────────────────────
function PropertyInspector({
  widget,
  onUpdate,
  onClose,
}: {
  widget: Widget;
  onUpdate: (config: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const def = WIDGET_CATALOG.find((d) => d.type === widget.type);
  const c = widget.config;
  const sections = PROP_SECTIONS[widget.type];

  const set = (key: string, value: unknown) => {
    onUpdate({ ...c, [key]: value });
  };

  // Group the rendered properties by section
  const renderPropertiesWithSections = () => {
    if (!sections || sections.length === 0) {
      return renderWidgetProperties(widget.type, c, set);
    }

    return (
      <>
        {sections.map((section, i) => (
          <div key={section.label}>
            <PropSectionHeader label={section.label} />
            {renderWidgetProperties(widget.type, c, set, section.keys)}
            {i < sections.length - 1 && <div className="h-2" />}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      {/* Header with icon + type name */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            {def?.icon}
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block leading-tight">
              {def?.label}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">Properties</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded motion-safe:transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Properties with section grouping */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {renderPropertiesWithSections()}
      </div>
    </div>
  );
}

// ─── Render widget properties, optionally filtered by keys ────
function renderWidgetProperties(
  type: WidgetType,
  config: Record<string, unknown>,
  onChange: (key: string, value: unknown) => void,
  filterKeys?: string[]
): React.ReactNode {
  switch (type) {
    case "banner":
      return <BannerProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "textBlock":
      return <TextBlockProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "button":
      return <ButtonProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "productGrid":
      return <ProductGridProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "searchBar":
      return <SearchBarProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "divider":
      return <DividerProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "imageSlider":
      return <ImageSliderProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "videoPlayer":
      return <VideoPlayerProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "categoryList":
      return <CategoryListProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "map":
      return <MapProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "blogPosts":
      return <BlogPostsProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    case "htmlBlock":
      return <HtmlBlockProperties config={config} onChange={onChange} filterKeys={filterKeys} />;
    default:
      return null;
  }
}

// ─── Property Sections ─────────────────────────────────────────
function PropLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
      {children}
    </label>
  );
}

function PropInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  );
}

function PropTextArea({
  value,
  onChange,
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows || 3}
      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
    />
  );
}

function PropColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-shrink-0">
        <div
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function PropSelect({
  value,
  onChange,
  options,
}: {
  value: string | number;
  onChange: (v: string) => void;
  options: { label: string; value: string | number }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function PropNumberInput({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
}

function PropToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-gray-600 dark:text-gray-400">{label}</span>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function BannerProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("title") && (
        <div>
          <PropLabel>Title</PropLabel>
          <PropInput value={(config.title as string) || ""} onChange={(v) => onChange("title", v)} />
        </div>
      )}
      {show("subtitle") && (
        <div>
          <PropLabel>Subtitle</PropLabel>
          <PropInput value={(config.subtitle as string) || ""} onChange={(v) => onChange("subtitle", v)} />
        </div>
      )}
      {show("backgroundColor") && (
        <div>
          <PropLabel>Background Color</PropLabel>
          <PropColorPicker value={(config.backgroundColor as string) || "#3b82f6"} onChange={(v) => onChange("backgroundColor", v)} />
        </div>
      )}
      {show("imageUrl") && (
        <div>
          <PropLabel>Image URL</PropLabel>
          <PropInput value={(config.imageUrl as string) || ""} onChange={(v) => onChange("imageUrl", v)} placeholder="https://..." />
        </div>
      )}
      {show("height") && (
        <div>
          <PropLabel>Height (px)</PropLabel>
          <PropNumberInput value={(config.height as number) || 180} onChange={(v) => onChange("height", v)} min={80} max={400} step={10} />
        </div>
      )}
    </>
  );
}

function TextBlockProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("content") && (
        <div>
          <PropLabel>Content</PropLabel>
          <PropTextArea value={(config.content as string) || ""} onChange={(v) => onChange("content", v)} rows={4} />
        </div>
      )}
      {show("fontSize") && (
        <div>
          <PropLabel>Font Size</PropLabel>
          <PropNumberInput value={(config.fontSize as number) || 14} onChange={(v) => onChange("fontSize", v)} min={8} max={32} />
        </div>
      )}
      {show("alignment") && (
        <div>
          <PropLabel>Alignment</PropLabel>
          <PropSelect
            value={(config.alignment as string) || "left"}
            onChange={(v) => onChange("alignment", v)}
            options={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ]}
          />
        </div>
      )}
      {show("color") && (
        <div>
          <PropLabel>Text Color</PropLabel>
          <PropColorPicker value={(config.color as string) || "#374151"} onChange={(v) => onChange("color", v)} />
        </div>
      )}
    </>
  );
}

function ButtonProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("label") && (
        <div>
          <PropLabel>Label</PropLabel>
          <PropInput value={(config.label as string) || ""} onChange={(v) => onChange("label", v)} />
        </div>
      )}
      {show("color") && (
        <div>
          <PropLabel>Button Color</PropLabel>
          <PropColorPicker value={(config.color as string) || "#3b82f6"} onChange={(v) => onChange("color", v)} />
        </div>
      )}
      {show("textColor") && (
        <div>
          <PropLabel>Text Color</PropLabel>
          <PropColorPicker value={(config.textColor as string) || "#ffffff"} onChange={(v) => onChange("textColor", v)} />
        </div>
      )}
      {show("actionUrl") && (
        <div>
          <PropLabel>Action URL</PropLabel>
          <PropInput value={(config.actionUrl as string) || ""} onChange={(v) => onChange("actionUrl", v)} placeholder="https://..." />
        </div>
      )}
      {show("fullWidth") && (
        <PropToggleRow
          label="Full Width"
          value={config.fullWidth !== false}
          onChange={() => onChange("fullWidth", config.fullWidth === false)}
        />
      )}
    </>
  );
}

function ProductGridProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("columns") && (
        <div>
          <PropLabel>Columns</PropLabel>
          <PropSelect
            value={String((config.columns as number) || 2)}
            onChange={(v) => onChange("columns", Number(v))}
            options={[
              { label: "2 columns", value: "2" },
              { label: "3 columns", value: "3" },
              { label: "4 columns", value: "4" },
            ]}
          />
        </div>
      )}
      {show("showPrice") && (
        <PropToggleRow
          label="Show Price"
          value={config.showPrice !== false}
          onChange={() => onChange("showPrice", config.showPrice === false)}
        />
      )}
      {show("showRating") && (
        <PropToggleRow
          label="Show Rating"
          value={config.showRating !== false}
          onChange={() => onChange("showRating", config.showRating === false)}
        />
      )}
      {show("itemCount") && (
        <div>
          <PropLabel>Items</PropLabel>
          <PropNumberInput value={(config.itemCount as number) || 4} onChange={(v) => onChange("itemCount", v)} min={2} max={12} />
        </div>
      )}
    </>
  );
}

function SearchBarProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("placeholder") && (
        <div>
          <PropLabel>Placeholder Text</PropLabel>
          <PropInput value={(config.placeholder as string) || ""} onChange={(v) => onChange("placeholder", v)} />
        </div>
      )}
      {show("backgroundColor") && (
        <div>
          <PropLabel>Background Color</PropLabel>
          <PropColorPicker value={(config.backgroundColor as string) || "#f3f4f6"} onChange={(v) => onChange("backgroundColor", v)} />
        </div>
      )}
      {show("borderRadius") && (
        <div>
          <PropLabel>Border Radius</PropLabel>
          <PropNumberInput value={(config.borderRadius as number) || 24} onChange={(v) => onChange("borderRadius", v)} min={0} max={50} />
        </div>
      )}
    </>
  );
}

function DividerProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("thickness") && (
        <div>
          <PropLabel>Thickness (px)</PropLabel>
          <PropNumberInput value={(config.thickness as number) || 1} onChange={(v) => onChange("thickness", v)} min={1} max={10} />
        </div>
      )}
      {show("color") && (
        <div>
          <PropLabel>Color</PropLabel>
          <PropColorPicker value={(config.color as string) || "#e5e7eb"} onChange={(v) => onChange("color", v)} />
        </div>
      )}
      {show("margin") && (
        <div>
          <PropLabel>Margin (px)</PropLabel>
          <PropNumberInput value={(config.margin as number) || 12} onChange={(v) => onChange("margin", v)} min={0} max={40} />
        </div>
      )}
    </>
  );
}

function ImageSliderProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("autoPlay") && (
        <PropToggleRow
          label="Auto Play"
          value={(config.autoPlay as boolean) !== false}
          onChange={() => onChange("autoPlay", !(config.autoPlay as boolean))}
        />
      )}
      {show("interval") && (
        <div>
          <PropLabel>Interval (ms)</PropLabel>
          <PropNumberInput value={(config.interval as number) || 3000} onChange={(v) => onChange("interval", v)} min={1000} max={10000} step={500} />
        </div>
      )}
      {show("height") && (
        <div>
          <PropLabel>Height (px)</PropLabel>
          <PropNumberInput value={(config.height as number) || 160} onChange={(v) => onChange("height", v)} min={80} max={400} step={10} />
        </div>
      )}
    </>
  );
}

function VideoPlayerProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("videoUrl") && (
        <div>
          <PropLabel>Video URL</PropLabel>
          <PropInput value={(config.videoUrl as string) || ""} onChange={(v) => onChange("videoUrl", v)} placeholder="https://..." />
        </div>
      )}
      {show("autoPlay") && (
        <PropToggleRow
          label="Auto Play"
          value={(config.autoPlay as boolean) === true}
          onChange={() => onChange("autoPlay", !(config.autoPlay as boolean))}
        />
      )}
      {show("showControls") && (
        <PropToggleRow
          label="Show Controls"
          value={(config.showControls as boolean) !== false}
          onChange={() => onChange("showControls", config.showControls === false)}
        />
      )}
      {show("height") && (
        <div>
          <PropLabel>Height (px)</PropLabel>
          <PropNumberInput value={(config.height as number) || 180} onChange={(v) => onChange("height", v)} min={80} max={400} step={10} />
        </div>
      )}
    </>
  );
}

function CategoryListProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  const cats = (config.categories as string[]) || [];
  return (
    <>
      {show("categories") && (
        <div>
          <PropLabel>Categories (one per line)</PropLabel>
          <PropTextArea
            value={cats.join("\n")}
            onChange={(v) => onChange("categories", v.split("\n").filter((s: string) => s.trim()))}
            rows={5}
          />
        </div>
      )}
      {show("showIcon") && (
        <PropToggleRow
          label="Show Icon"
          value={(config.showIcon as boolean) !== false}
          onChange={() => onChange("showIcon", config.showIcon === false)}
        />
      )}
      {show("showChevron") && (
        <PropToggleRow
          label="Show Chevron"
          value={(config.showChevron as boolean) !== false}
          onChange={() => onChange("showChevron", config.showChevron === false)}
        />
      )}
    </>
  );
}

function MapProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("latitude") && (
        <div>
          <PropLabel>Latitude</PropLabel>
          <PropNumberInput value={(config.latitude as number) || 0} onChange={(v) => onChange("latitude", v)} min={-90} max={90} step={0.001} />
        </div>
      )}
      {show("longitude") && (
        <div>
          <PropLabel>Longitude</PropLabel>
          <PropNumberInput value={(config.longitude as number) || 0} onChange={(v) => onChange("longitude", v)} min={-180} max={180} step={0.001} />
        </div>
      )}
      {show("zoom") && (
        <div>
          <PropLabel>Zoom Level</PropLabel>
          <PropNumberInput value={(config.zoom as number) || 12} onChange={(v) => onChange("zoom", v)} min={1} max={20} />
        </div>
      )}
      {show("height") && (
        <div>
          <PropLabel>Height (px)</PropLabel>
          <PropNumberInput value={(config.height as number) || 200} onChange={(v) => onChange("height", v)} min={80} max={400} step={10} />
        </div>
      )}
    </>
  );
}

function BlogPostsProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("count") && (
        <div>
          <PropLabel>Number of Posts</PropLabel>
          <PropNumberInput value={(config.count as number) || 3} onChange={(v) => onChange("count", v)} min={1} max={10} />
        </div>
      )}
      {show("showImage") && (
        <PropToggleRow
          label="Show Image"
          value={(config.showImage as boolean) !== false}
          onChange={() => onChange("showImage", config.showImage === false)}
        />
      )}
      {show("showDate") && (
        <PropToggleRow
          label="Show Date"
          value={(config.showDate as boolean) !== false}
          onChange={() => onChange("showDate", config.showDate === false)}
        />
      )}
      {show("showExcerpt") && (
        <PropToggleRow
          label="Show Excerpt"
          value={(config.showExcerpt as boolean) !== false}
          onChange={() => onChange("showExcerpt", config.showExcerpt === false)}
        />
      )}
    </>
  );
}

function HtmlBlockProperties({
  config,
  onChange,
  filterKeys,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  filterKeys?: string[];
}) {
  const show = (key: string) => !filterKeys || filterKeys.includes(key);
  return (
    <>
      {show("html") && (
        <div>
          <PropLabel>HTML Content</PropLabel>
          <PropTextArea
            value={(config.html as string) || ""}
            onChange={(v) => onChange("html", v)}
            rows={6}
          />
        </div>
      )}
    </>
  );
}

// ─── Drag Overlay Widget ───────────────────────────────────────
function DragOverlayContent({ type }: { type: WidgetType }) {
  const def = WIDGET_CATALOG.find((d) => d.type === type);
  if (!def) return null;
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border-2 border-blue-400 rounded-xl shadow-xl opacity-90">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
        {def.icon}
      </div>
      <span className="text-xs font-medium text-gray-700">{def.label}</span>
    </div>
  );
}

// ─── Phone Frame Status Bar (realistic SVG icons) ─────────────
function WidgetPhoneStatusBar() {
  const fill = "#1f2937";
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-white">
      <span className="text-[11px] font-semibold tracking-tight text-gray-900">9:41</span>
      <div className="flex items-center gap-1">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="8" width="3" height="3" rx="0.5" fill={fill} opacity="0.4"/>
          <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" fill={fill} opacity="0.6"/>
          <rect x="9" y="3" width="3" height="8" rx="0.5" fill={fill} opacity="0.8"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill={fill}/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.5a1 1 0 100 2 1 1 0 000-2z" fill={fill}/>
          <path d="M4.93 8.47a4.5 4.5 0 016.14 0" stroke={fill} strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M2.1 5.64a8 8 0 0111.8 0" stroke={fill} strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2" stroke={fill} strokeWidth="1"/>
          <rect x="2" y="2" width="15" height="8" rx="1" fill={fill}/>
          <path d="M22 4v4a1.5 1.5 0 000-4z" fill={fill} opacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Main Widget Builder ───────────────────────────────────────
export function WidgetBuilder({ initialWidgets }: { initialWidgets?: Array<{ type: string; config: Record<string, unknown> }> } = {}) {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    if (!initialWidgets || initialWidgets.length === 0) return [];
    return initialWidgets.map(w => ({
      id: generateId(),
      type: w.type as WidgetType,
      config: { ...w.config },
    }));
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<WidgetType | null>(null);
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(WIDGET_CATEGORIES.map((cat) => [cat.label, true]))
  );

  const toggleCategory = useCallback((label: string) => {
    setOpenCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const selectedWidget = useMemo(
    () => widgets.find((w) => w.id === selectedId) ?? null,
    [widgets, selectedId]
  );

  const widgetIds = useMemo(() => widgets.map((w) => w.id), [widgets]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === "library") {
      setActiveDragType(data.widgetType as WidgetType);
      setActiveDragId(active.id);
    } else {
      // Reordering existing widget
      setActiveDragId(active.id);
      const w = widgets.find((w2) => w2.id === active.id);
      if (w) setActiveDragType(w.type);
    }
  }, [widgets]);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Could implement insertion indicator here
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveDragType(null);
      setActiveDragId(null);

      if (!over) return;

      const activeData = active.data.current;

      // Case 1: Dropping from library
      if (activeData?.type === "library") {
        const widgetType = activeData.widgetType as WidgetType;
        const newWidget: Widget = {
          id: generateId(),
          type: widgetType,
          config: { ...DEFAULT_CONFIGS[widgetType] },
        };

        if (over.id === "canvas-drop-zone") {
          // Drop at end
          setWidgets((prev) => [...prev, newWidget]);
        } else {
          // Drop near an existing widget -- insert after it
          setWidgets((prev) => {
            const overIndex = prev.findIndex((w) => w.id === over.id);
            if (overIndex === -1) return [...prev, newWidget];
            const newList = [...prev];
            newList.splice(overIndex + 1, 0, newWidget);
            return newList;
          });
        }
        setSelectedId(newWidget.id);
        return;
      }

      // Case 2: Reordering within canvas
      if (active.id !== over.id && over.id !== "canvas-drop-zone") {
        setWidgets((prev) => {
          const oldIndex = prev.findIndex((w) => w.id === active.id);
          const newIndex = prev.findIndex((w) => w.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return prev;
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    },
    []
  );

  const handleDeleteWidget = useCallback(
    (id: string) => {
      setWidgets((prev) => prev.filter((w) => w.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId]
  );

  const handleUpdateConfig = useCallback(
    (config: Record<string, unknown>) => {
      if (!selectedId) return;
      setWidgets((prev) =>
        prev.map((w) => (w.id === selectedId ? { ...w, config } : w))
      );
    },
    [selectedId]
  );

  // Custom collision detection: prefer pointerWithin for canvas, closestCenter for sortable
  const collisionDetection = useCallback(
    (args: Parameters<typeof closestCenter>[0]) => {
      const pointerCollisions = pointerWithin(args);
      if (pointerCollisions.length > 0) return pointerCollisions;
      return closestCenter(args);
    },
    []
  );

  return (
    <div className="flex-1 flex overflow-hidden">
      <DndContext
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* LEFT PANEL: Widget Library */}
        <div className="w-56 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Widgets
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
              Drag to add to your app
            </p>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
            {WIDGET_CATEGORIES.map((cat) => (
              <CategorySection
                key={cat.label}
                category={cat}
                isOpen={openCategories[cat.label] ?? true}
                onToggle={() => toggleCategory(cat.label)}
                activeDragId={activeDragId}
              />
            ))}
          </div>
        </div>

        {/* CENTER PANEL: Phone Preview Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full py-4">
            {/* Phone shell — iPhone 15 Pro style */}
            <div
              className="relative bg-[#1a1a1a] rounded-[50px]"
              style={{
                width: 280,
                padding: "12px 10px",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 0 0 2px #1a1a1a, 0 25px 60px -12px rgba(0,0,0,0.5), 0 0 100px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Side buttons */}
              <div className="absolute -left-[3px] top-[72px] w-[3px] h-6 bg-[#2a2a2a] rounded-l-sm" />
              <div className="absolute -left-[3px] top-[106px] w-[3px] h-10 bg-[#2a2a2a] rounded-l-sm" />
              <div className="absolute -left-[3px] top-[152px] w-[3px] h-10 bg-[#2a2a2a] rounded-l-sm" />
              <div className="absolute -right-[3px] top-[110px] w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />

              {/* Screen */}
              <div
                className="bg-white rounded-[42px] overflow-hidden relative"
                style={{ height: 560 }}
                onClick={() => setSelectedId(null)}
              >
                {/* Dynamic Island */}
                <div
                  className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black rounded-full flex items-center justify-center"
                  style={{ width: 92, height: 28, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)" }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a3a] border border-[#2a2a4a]" style={{marginLeft: 24}}/>
                </div>
                {/* Status bar */}
                <div className="absolute top-0 left-0 right-0 z-10">
                  <WidgetPhoneStatusBar />
                </div>

                {/* Canvas area */}
                <div
                  className="absolute left-0 right-0 bottom-0 overflow-hidden flex flex-col"
                  style={{ top: 42 }}
                >
                  <SortableContext
                    items={widgetIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <CanvasDropZone isEmpty={widgets.length === 0}>
                      {widgets.map((w) => (
                        <SortableCanvasWidget
                          key={w.id}
                          widget={w}
                          isSelected={w.id === selectedId}
                          onSelect={() => setSelectedId(w.id)}
                          onDelete={() => handleDeleteWidget(w.id)}
                        />
                      ))}
                    </CanvasDropZone>
                  </SortableContext>
                  {/* Home indicator */}
                  <div className="flex items-center justify-center py-1.5 bg-white flex-shrink-0">
                    <div className="w-[36%] h-[5px] rounded-full bg-gray-900/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Property Inspector */}
        {selectedWidget ? (
          <PropertyInspector
            widget={selectedWidget}
            onUpdate={handleUpdateConfig}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Sliders className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
              Select a widget to edit its properties
            </p>
          </div>
        )}

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={null}>
          {activeDragType && activeDragId ? (
            <DragOverlayContent type={activeDragType} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
