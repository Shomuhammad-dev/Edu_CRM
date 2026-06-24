import { useState, useMemo } from 'react';
import { ROOMS, TIME_SLOTS, SCHEDULE_DATA } from '../constants';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Timetable() {
  const [activeTab, setActiveTab] = useState('TOQ KUNLAR');
  const { user } = useAuth();

  const getColumnIndex = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - 8) * 60 + minutes;
    return (totalMinutes / 15) + 2; // +2 because first column is labels
  };

  const filteredSchedule = useMemo(() => {
    if (user?.role === 'teacher') {
      // In a real app, you'd match the user's ID or name
      // For this demo, we'll mock that the teacher matches the 'teacher' role user
      return SCHEDULE_DATA.filter(event => event.teacher.toLowerCase().includes('o\'qituvchi'));
    }
    return SCHEDULE_DATA;
  }, [user]);

  return (
    <div className="mx-2 sm:mx-6 mb-4 sm:mb-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100">
      {/* Header with Tabs and Utils */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          {['JUFT KUNLAR', 'TOQ KUNLAR', 'BOSHQA'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative py-2 text-sm font-bold tracking-wider transition-colors
                ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="bg-rose-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
            MARKAZ FOYDALILIGI 0%
          </div>
          
          <div className="flex items-center gap-2 pl-0 sm:pl-4 border-l-0 sm:border-l border-slate-200">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Vaqt oralig'i</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
              <span className="text-sm font-semibold text-slate-700">15 Daqiqa</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Timetable Grid */}
      <div className="timetable-scroll overflow-x-auto">
        <div 
          className="min-w-max grid" 
          style={{ 
            gridTemplateColumns: `120px repeat(${TIME_SLOTS.length}, minmax(40px, 60px))`,
            gridTemplateRows: `auto repeat(${ROOMS.length}, minmax(40px, 60px))`
          }}
        >
          {/* Header Row: Time Slots */}
          <div className="bg-slate-50 border-r border-b border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Xonalar / Soat
          </div>
          {TIME_SLOTS.map((time) => (
            <div 
              key={time} 
              className="px-2 py-3 bg-slate-50 border-r border-b border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600"
            >
              {time}
            </div>
          ))}

          {/* Table Body */}
          {ROOMS.map((room) => (
            <div key={room} className="contents">
              {/* Room Label */}
              <div className="bg-slate-50/50 border-r border-b border-slate-200 flex items-center justify-center text-[12px] font-medium text-slate-500">
                {room}
              </div>
              
              {/* Grid Cells */}
              {TIME_SLOTS.map((time) => (
                <div 
                  key={`${room}-${time}`} 
                  className="border-r border-b border-slate-100 last:border-r-0"
                ></div>
              ))}
            </div>
          ))}

          {/* Schedule Blocks (Absolute-ish inside the grid) */}
          {filteredSchedule.map((event, idx) => {
            const startCol = getColumnIndex(event.startTime);
            const endCol = getColumnIndex(event.endTime);
            const roomIndex = ROOMS.indexOf(event.room);
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className={`
                  m-1 p-2 rounded-lg border shadow-sm z-10 flex flex-col justify-center gap-0.5 overflow-hidden
                  ${event.color}
                `}
                style={{
                  gridColumnStart: startCol,
                  gridColumnEnd: endCol,
                  gridRowStart: roomIndex + 2 // +2 because header is row 1
                }}
              >
                <div className="text-[10px] font-bold truncate leading-none uppercase opacity-80">
                  {event.startTime} - {event.endTime} / {event.title.split(' ')[0]}
                </div>
                <div className="text-[11px] font-extrabold truncate leading-tight">
                  {event.title}
                </div>
                <div className="text-[9px] font-medium truncate opacity-70">
                  {event.teacher}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
