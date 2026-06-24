import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function SmsSettingsPage() {
  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-white">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">SMS shablonlari</h1>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 border border-indigo-200 text-indigo-600 rounded-lg text-[13px] font-bold hover:bg-indigo-50 transition-all uppercase tracking-tight shadow-sm">
            KATEGORIYA YARATISH
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase">
            <Plus size={18} />
            <span>SHABLON YARATISH</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 bg-slate-50/20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center bg-white shadow-sm"
        >
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-400">
              Kategoriyalar mavjud emas. 
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Yangi kategoriya yoki shablon yarating.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
