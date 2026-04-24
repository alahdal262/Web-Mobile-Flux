import { useState, useRef, useEffect } from "react";
import {
  MessageSquare, Search, MoreVertical, Plus, ChevronRight,
} from "lucide-react";
import type { ChatMessage } from "./types";

export function ChatPanel({ messages, onSendMessage }: { messages: ChatMessage[]; onSendMessage: (text: string) => void }) {
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    onSendMessage(text);
    setMsg("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white"/>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Mobile-WP Support</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"/>
              <span className="text-[10px] text-gray-400">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Search className="w-4 h-4"/></button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><MoreVertical className="w-4 h-4"/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((m,i)=>(
          <div key={i} className={`flex ${m.from==="user"?"justify-end":"justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
              m.from==="user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm shadow-sm"
            }`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
              <p className={`text-[9px] mt-1 ${m.from==="user"?"text-white/60":"text-gray-400"}`}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}/>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"><Plus className="w-4 h-4"/></button>
          <input
            value={msg}
            onChange={e=>setMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 transition-all"
            onKeyDown={e=>{ if(e.key==="Enter") handleSend(msg); }}
          />
          <button
            onClick={()=>handleSend(msg)}
            className={`p-2.5 rounded-xl transition-all ${msg.trim()?"bg-blue-600 text-white hover:bg-blue-700":"bg-gray-100 text-gray-300"}`}
          >
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
        <div className="flex gap-2 mt-2 px-1">
          {["How to build?","Firebase setup","Connect WordPress","Payment integration"].map(q=>(
            <button key={q} onClick={()=>handleSend(q)}
              className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
