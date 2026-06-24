import { 
  Search, 
  Trash2, 
  Edit3, 
  Plus, 
  FileSpreadsheet, 
  Users, 
  MessageSquare, 
  StickyNote, 
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_COLUMNS = [
  {
    id: 'new-leads',
    title: 'NEW LEADS',
    count: 0,
    leads: []
  }
];

export default function LeadsPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Filter and Action Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Qidirish" 
                className="pl-4 pr-10 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 transition-all"
              />
            </div>

            {/* Arxiv Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <span className="text-[13px] font-medium text-slate-500">Arxiv</span>
            </div>

            {/* Manba Button */}
            <button className="px-4 sm:px-5 py-1.5 border border-indigo-200 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors uppercase tracking-tight">
              MANBA
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
              <Trash2 size={20} />
            </button>
            <button className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors mr-2">
              <Edit3 size={20} />
            </button>
            
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase whitespace-nowrap">
              <Plus size={18} />
              <span>BO'LIM YARATISH</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors min-w-[140px]">
              <span className="text-sm font-semibold text-slate-700">29-aprel (0)</span>
              <ChevronDown size={14} className="text-slate-400 ml-auto" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border border-indigo-200 text-indigo-600 rounded-lg text-[13px] font-bold hover:bg-indigo-50 transition-colors uppercase shadow-sm">
              <Plus size={18} />
              <span>LIDLARNI GURUHGA QO'SHISH</span>
            </button>
            <button className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border border-emerald-200 text-emerald-600 rounded-lg text-[13px] font-bold hover:bg-emerald-50 transition-colors uppercase shadow-sm">
              <FileSpreadsheet size={18} />
              <span>EXCEL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-x-auto bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 h-full min-w-max sm:min-w-0">
          {MOCK_COLUMNS.map((column) => (
            <div key={column.id} className="w-full sm:w-80 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
              <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-700">{column.title}</span>
                  <span className="w-8 h-8 rounded-full bg-slate-100 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100">
                    {column.count}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                    <MessageSquare size={18} />
                  </button>
                  <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                    <StickyNote size={18} />
                  </button>
                  <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[300px]">
                {column.leads.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-200">
                      <Users size={24} className="text-slate-300" />
                    </div>
                    <span className="text-sm font-medium text-slate-400">Bo'sh kanban</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-indigo-100 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all uppercase group">
                  <Plus size={18} className="group-hover:scale-110 transition-transform" />
                  <span>YANGI LID QO'SHISH</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add Column Placeholder */}
          <button className="w-80 h-14 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all bg-white/50 hover:bg-white group">
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-tight">QO'SHIMCHA USTUN QO'SHISH</span>
          </button>
        </div>
      </div>
    </div>
  );
}
