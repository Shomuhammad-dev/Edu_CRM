import { STATS } from '../constants';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function StatsGrid() {
  const { user } = useAuth();
  
  const filteredStats = STATS.filter(stat => {
    if (user?.role === 'teacher') {
      // Teachers only see activity related stats
      return ['Guruhlar', 'O\'quvchilar', 'Guruhlar soni', 'Jami guruhlar'].some(label => stat.label.includes(label)) || 
             ['Faol Lidlar', 'O\'qituvchilar'].includes(stat.label);
    }
    return true;
  });

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4">
      {filteredStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
        >
          {stat.isNew && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-600 text-[10px] font-bold text-white rounded leading-none uppercase tracking-wider">
              New
            </div>
          )}
          
          <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
            <stat.icon size={20} />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
            <span className="text-lg font-bold text-slate-800">{stat.value}</span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50 overflow-hidden">
            <div className={`h-full w-1/3 opacity-30 ${stat.color.replace('text-', 'bg-')}`}></div>
          </div>
        </motion.div>
      ))}
      
      <div className="col-span-full flex justify-end mt-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-100">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
          Raqamlarni yopish
        </button>
      </div>
    </div>
  );
}
