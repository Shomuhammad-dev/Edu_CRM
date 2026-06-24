import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Monitor, 
  ChevronDown, 
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface Group {
  id: string;
  name: string;
  course: string;
  teacher: string;
  supportTeacher: string;
  days: string;
  time: string;
  studentCount: number;
  startDate: string;
  endDate: string;
  status: 'Faol' | 'Tugallangan' | 'Kutilmoqda';
  colorClass: string;
}

const MOCK_GROUPS: Group[] = [
  {
    id: '1.',
    name: '3A guruh',
    course: 'Biologiya',
    teacher: 'Qodirova Madina',
    supportTeacher: '-',
    days: 'Juft kunlari',
    time: '17:00 / 19:00',
    studentCount: 8,
    startDate: '25/04/2026',
    endDate: '25/04/2027',
    status: 'Faol',
    colorClass: 'bg-slate-100/50'
  },
  {
    id: '2.',
    name: '1Fizika',
    course: 'Fizika',
    teacher: 'Balzira Jumakulova',
    supportTeacher: '-',
    days: 'Juft kunlari',
    time: '14:00 / 16:00',
    studentCount: 0,
    startDate: '23/04/2026',
    endDate: '23/04/2027',
    status: 'Faol',
    colorClass: 'bg-rose-50'
  },
  {
    id: '3.',
    name: 'individual(Ozod ingliz tili)',
    course: 'Ingliz tili',
    teacher: 'Xolnazarov Ozod',
    supportTeacher: '-',
    days: 'Juft kunlari',
    time: '19:00 / 20:00',
    studentCount: 2,
    startDate: '16/04/2026',
    endDate: '16/04/2027',
    status: 'Faol',
    colorClass: 'bg-lime-50'
  },
  {
    id: '4.',
    name: 'IT 2(Shomuhammad)',
    course: 'IT',
    teacher: "Shonug'monov Shomuhammad",
    supportTeacher: '-',
    days: 'Toq kunlari',
    time: '16:00 / 18:00',
    studentCount: 2,
    startDate: '13/04/2026',
    endDate: '13/04/2027',
    status: 'Faol',
    colorClass: 'bg-cyan-50'
  },
  {
    id: '5.',
    name: 'Matematika 2(Xusniddin)',
    course: 'Matematika',
    teacher: 'Pardayev Xusniddin',
    supportTeacher: '-',
    days: 'Toq kunlari',
    time: '16:00 / 18:00',
    studentCount: 1,
    startDate: '13/04/2026',
    endDate: '13/04/2027',
    status: 'Faol',
    colorClass: 'bg-emerald-50'
  },
  {
    id: '6.',
    name: '2Kimyo yangi guruh',
    course: 'Kimyo',
    teacher: 'Abdukarimova Asila',
    supportTeacher: '-',
    days: 'Toq kunlari',
    time: '16:00 / 18:00',
    studentCount: 10,
    startDate: '10/04/2026',
    endDate: '10/04/2027',
    status: 'Faol',
    colorClass: 'bg-slate-100/50'
  },
  {
    id: '7.',
    name: 'Ona tili yangi guruh',
    course: 'Ona tili',
    teacher: 'Abdurahmonov Muhiddin',
    supportTeacher: '-',
    days: 'Toq kunlari',
    time: '15:00 / 17:00',
    studentCount: 9,
    startDate: '07/04/2026',
    endDate: '07/04/2027',
    status: 'Faol',
    colorClass: 'bg-fuchsia-50'
  },
  {
    id: '8.',
    name: '1yangi guruh Xurshid',
    course: 'Ingliz tili',
    teacher: 'Maxkamov Xurshidbek',
    supportTeacher: '-',
    days: 'Toq kunlari',
    time: '14:00 / 16:00',
    studentCount: 8,
    startDate: '04/04/2026',
    endDate: '04/04/2027',
    status: 'Faol',
    colorClass: 'bg-lime-50'
  },
  {
    id: '9.',
    name: 'Xusniddin matematika ustoz',
    course: 'Matematika',
    teacher: 'Pardayev Xusniddin',
    supportTeacher: '-',
    days: 'Toq kunlari',
    time: '14:00 / 16:00',
    studentCount: 1,
    startDate: '04/03/2026',
    endDate: '04/03/2027',
    status: 'Faol',
    colorClass: 'bg-slate-50'
  },
  {
    id: '10.',
    name: 'pochemuchka (uzbekcha)',
    course: 'pochemuchka (uzbekcha)',
    teacher: 'Sultonova Tamila',
    supportTeacher: '-',
    days: 'Juft kunlari',
    time: '14:00 / 15:00',
    studentCount: 1,
    startDate: '31/03/2026',
    endDate: '31/03/2027',
    status: 'Faol',
    colorClass: 'bg-rose-50'
  }
];

export default function GroupsPage() {
  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">Guruhlar</h1>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold border border-indigo-100">
            68
          </span>
        </div>
        
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-[13px] font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase">
          <Plus size={18} />
          <span>YANGI QO'SHISH</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative group flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Qidirish" 
              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <FilterDropdown label="Status" value="Faol" />
          <FilterDropdown label="O'qituvchi" value="" />
          <FilterDropdown label="Kurs" value="" />
          <FilterDropdown label="Dars Kunlari" value="" />

          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-600 rounded-lg text-[13px] font-bold hover:bg-emerald-50 transition-colors uppercase shadow-sm bg-white">
              <FileSpreadsheet size={16} />
              <span>EXCEL</span>
            </button>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white hover:text-indigo-600 transition-all bg-white shadow-sm">
              <Monitor size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto p-6 bg-white">
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm shadow-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-12 text-center">ID</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Guruh nomi</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kurs</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">O'qituvchi</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Support ustoz</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dars Kunlari</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dars vaqti</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">O'quvchilar soni</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ochilgan</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Yakunlanadi</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_GROUPS.map((group, index) => (
                  <motion.tr 
                    key={group.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`${group.colorClass} border-b border-white transition-colors hover:brightness-95 cursor-pointer`}
                  >
                    <td className="px-4 py-4 text-xs font-medium text-slate-400 text-center">{group.id}</td>
                    <td className="px-4 py-4">
                      <span className="text-[13px] font-bold text-slate-800">{group.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[12px] text-slate-600">{group.course}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[12px] font-medium text-slate-700">{group.teacher}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-xs text-slate-400">{group.supportTeacher}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[12px] text-slate-500">{group.days}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[12px] font-bold text-slate-700">{group.time}</span>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-slate-800 text-[13px]">{group.studentCount}</td>
                    <td className="px-4 py-4 text-[12px] text-slate-500">{group.startDate}</td>
                    <td className="px-4 py-4 text-[12px] text-slate-500">{group.endDate}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold border border-emerald-200">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        <span>{group.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col relative min-w-[140px]">
      <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] font-bold text-slate-400 z-10 leading-none">
        {label}
      </span>
      <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-all shadow-sm">
        <span className="text-[13px] font-semibold text-slate-700">{value || label}</span>
        <ChevronDown size={14} className="text-slate-400 ml-2" />
      </div>
    </div>
  );
}
