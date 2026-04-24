import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, RotateCcw, Smartphone, Settings, Grid, Plus, ZoomIn,
} from "lucide-react";

export function BottomToolbar() {
  const { toast } = useToast();
  return (
    <div className="h-10 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-4 flex-shrink-0">
      <button onClick={()=>toast({title:"Raw View",description:"Raw code view is not available in this demo."})} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"><ArrowLeft className="w-3.5 h-3.5"/> Raw</button>
      <button onClick={()=>toast({title:"Refreshed",description:"Preview has been refreshed."})} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"><RotateCcw className="w-3.5 h-3.5"/></button>
      <button onClick={()=>toast({title:"Demo Mode",description:"Launch your app in the simulator to preview on device."})} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"><Smartphone className="w-3.5 h-3.5"/> Demo</button>
      <div className="h-4 w-px bg-gray-200"/>
      <button onClick={()=>toast({title:"Settings",description:"Advanced preview settings coming soon."})} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"><Settings className="w-3.5 h-3.5"/></button>
      <button onClick={()=>toast({title:"Grid",description:"Grid overlay toggled."})} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"><Grid className="w-3.5 h-3.5"/></button>
      <button onClick={()=>toast({title:"Add Widget",description:"Drag-and-drop widgets coming soon."})} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"><Plus className="w-3.5 h-3.5"/></button>
      <button onClick={()=>toast({title:"Zoom In",description:"Zoom controls coming soon."})} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"><ZoomIn className="w-3.5 h-3.5"/></button>
    </div>
  );
}
