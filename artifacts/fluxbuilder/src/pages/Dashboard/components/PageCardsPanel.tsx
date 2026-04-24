import { useState, useRef, useEffect } from "react";
import { Plus, X, Star, Eye, EyeOff, Heart } from "lucide-react";
import type { DynamicTab } from "../types";
import { ICON_OPTIONS, ICON_MAP } from "../types";

function AddTabModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (tab: DynamicTab) => void;
}) {
  const [name, setName]         = useState("");
  const [iconKey, setIconKey]   = useState("home");
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: `t${Date.now()}`,
      label: name.trim(),
      iconKey,
      visible: true,
    });
    onClose();
  };

  return (
    /* backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-900">Add New Tab</p>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Tab name */}
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Tab Name</label>
            <input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Favorites"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Icon</label>
            <div className="grid grid-cols-4 gap-1.5">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setIconKey(opt.key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    iconKey === opt.key
                      ? "border-violet-500 bg-violet-50 text-violet-600"
                      : "border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                  }`}
                >
                  <span className="[&_svg]:w-4 [&_svg]:h-4">{opt.icon}</span>
                  <span className="text-[8px] leading-none text-center">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <span className="text-gray-600 [&_svg]:w-5 [&_svg]:h-5">{ICON_MAP[iconKey]}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">{name || "Tab Name"}</p>
              <p className="text-[10px] text-gray-400">New bottom tab</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm font-medium border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="flex-1 py-2 text-sm font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Add Tab
          </button>
        </div>
      </div>
    </div>
  );
}

export function PageCardsPanel({ tabs, activeTabId, onSelect, onToggleVisible, onAdd, onDelete }: {
  tabs: DynamicTab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onAdd: (tab: DynamicTab) => void;
  onDelete: (id: string) => void;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-2 py-4 px-2 overflow-y-auto"
        style={{ maxHeight: "100%" }}>
        {tabs.map(tab => (
          <div key={tab.id} className="relative group flex-shrink-0">
            {/* Card */}
            <button
              onClick={() => onSelect(tab.id)}
              className={`w-[72px] h-[72px] rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm ${
                activeTabId === tab.id
                  ? "border-gray-300 bg-white shadow-md"
                  : !tab.visible
                  ? "border-gray-100 bg-gray-50/80 opacity-60"
                  : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <span className={`[&_svg]:w-[22px] [&_svg]:h-[22px] ${tab.visible ? "text-gray-600" : "text-gray-400"}`}>
                {ICON_MAP[tab.iconKey] ?? <Heart className="w-[22px] h-[22px]"/>}
              </span>
              <span className={`text-[9px] font-medium leading-tight text-center px-1 truncate w-full text-center ${tab.visible ? "text-gray-600" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </button>

            {/* Star badge */}
            {tab.isStar && (
              <div className="absolute -top-1 -right-1 pointer-events-none">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"/>
              </div>
            )}

            {/* Eye toggle -- top-right, shown on hover or when hidden */}
            {!tab.isStar && (
              <button
                onClick={e => { e.stopPropagation(); onToggleVisible(tab.id); }}
                className={`absolute top-1 right-1 rounded-full p-0.5 transition-all ${
                  !tab.visible
                    ? "opacity-100 text-gray-400"
                    : "opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500"
                }`}
              >
                {tab.visible
                  ? <Eye className="w-3 h-3"/>
                  : <EyeOff className="w-3 h-3"/>}
              </button>
            )}

            {/* Delete -- shown on hover, only for non-default tabs */}
            {!tab.isDefault && (
              <button
                onClick={e => { e.stopPropagation(); onDelete(tab.id); }}
                className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all hidden group-hover:flex"
              >
                <X className="w-2.5 h-2.5"/>
              </button>
            )}
          </div>
        ))}

        {/* Add button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-[72px] h-[72px] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-violet-400 hover:text-violet-400 hover:bg-violet-50 transition-all flex-shrink-0 shadow-sm"
        >
          <Plus className="w-6 h-6"/>
        </button>
      </div>

      {showModal && (
        <AddTabModal
          onClose={() => setShowModal(false)}
          onAdd={onAdd}
        />
      )}
    </>
  );
}
