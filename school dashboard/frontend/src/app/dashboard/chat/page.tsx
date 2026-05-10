import { MessageSquare, Users, History, Settings } from "lucide-react";

export default function ChatDashboard() {
  return (
    <div className="h-full flex bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar for chat */}
      <div className="w-80 border-r border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Conversations</h2>
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`p-4 border-b border-slate-50 flex items-center space-x-3 cursor-pointer hover:bg-slate-50 transition-colors ${i === 1 ? 'bg-blue-50/50' : ''}`}>
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                U{i}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-slate-800">User {i}</span>
                  <span className="text-[10px] text-slate-400">12:3{i} PM</span>
                </div>
                <p className="text-xs text-slate-500 truncate">Can you help me with the admission process?</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC]">
        <div className="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">U1</div>
            <span className="font-semibold text-slate-800">User 1</span>
          </div>
          <div className="flex space-x-3 text-slate-400">
            <History className="h-5 w-5 hover:text-slate-600 cursor-pointer" />
            <Settings className="h-5 w-5 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-end">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 max-w-lg shadow-sm mb-4">
            <p className="text-sm text-slate-700">Can you help me with the admission process?</p>
            <span className="text-[10px] text-slate-400 mt-2 block">12:31 PM</span>
          </div>
          <div className="bg-blue-600 rounded-2xl p-4 max-w-lg self-end shadow-sm shadow-blue-200">
            <p className="text-sm text-white">Of course! What specific questions do you have about the application?</p>
            <span className="text-[10px] text-blue-200 mt-2 block text-right">12:32 PM</span>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Reply to User 1..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700">
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
