"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  Globe, Layout, Image as ImageIcon, 
  FileText, Edit3, Eye, Search,
  RefreshCw, CheckCircle2, CloudUpload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function CMSControlPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: contents, isLoading } = useQuery({
    queryKey: ["cms-content"],
    queryFn: async () => {
      const res = await api.get("/superadmin/cms/all");
      return res.data;
    },
  });

  const filteredContents = contents?.filter((c: any) => 
    c.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">CMS Control</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage platform landing pages, notices, and dynamic highlights.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-200">
            <Eye className="h-4 w-4" />
            <span>Preview Website</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Module Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Modules</h2>
          {["Landing Page", "Announcements", "Campus Life", "SEO & Meta"].map((mod) => (
            <div key={mod} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer">
              <span className="text-sm font-bold text-slate-700">{mod}</span>
              <Layout className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>

        {/* Content Table */}
        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader className="bg-white border-b border-slate-50 p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search content keys..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content Key</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value Preview</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredContents?.map((content: any) => (
                      <tr key={content._id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800 leading-tight">{content.key}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{content.module}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {content.type === 'image' ? (
                              <ImageIcon className="h-4 w-4 text-blue-500 mr-2" />
                            ) : (
                              <FileText className="h-4 w-4 text-slate-400 mr-2" />
                            )}
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{content.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                            {typeof content.value === 'string' ? content.value : JSON.stringify(content.value)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            {content.type === 'image' && (
                              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <CloudUpload className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
