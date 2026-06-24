import { 
  MoreVertical, 
  Plus, 
  Send, 
  User, 
  MessageSquare,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface Mentor {
  id: string;
  displayId: string;
  name: string;
  phone: string;
  salary: string;
  percentage: string;
  lessonPrice: string;
  birthDate: string;
  hireDate: string;
  avatarLetter: string;
  avatarBg: string;
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    displayId: '10045',
    name: 'Shokiraliyev Shoxruxmirzo Komiljonovich',
    phone: '+998 91 123 45 67',
    salary: '4,000,000 UZS',
    percentage: '15%',
    lessonPrice: '0 UZS',
    birthDate: '15.04.1998',
    hireDate: '20.09.2023',
    avatarLetter: 'S',
    avatarBg: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: '2',
    displayId: '10042',
    name: 'Karimov Dilyorbek Otabekovich',
    phone: '+998 90 987 65 43',
    salary: '0 UZS',
    percentage: '50%',
    lessonPrice: '25,000 UZS',
    birthDate: '22.08.1995',
    hireDate: '15.10.2023',
    avatarLetter: 'D',
    avatarBg: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: '3',
    displayId: '10039',
    name: 'O\'ralbekova Nigina Alisherovna',
    phone: '+998 93 111 22 33',
    salary: '3,500,000 UZS',
    percentage: '20%',
    lessonPrice: '0 UZS',
    birthDate: '10.12.2000',
    hireDate: '01.11.2023',
    avatarLetter: 'N',
    avatarBg: 'bg-pink-100 text-pink-600'
  },
  {
    id: '4',
    displayId: '10035',
    name: 'Abdurahmonov Muhiddin Shokir o\'g\'li',
    phone: '+998 94 444 55 66',
    salary: '5,000,000 UZS',
    percentage: '0%',
    lessonPrice: '30,000 UZS',
    birthDate: '05.05.1992',
    hireDate: '12.08.2023',
    avatarLetter: 'M',
    avatarBg: 'bg-amber-100 text-amber-600'
  },
  {
    id: '5',
    displayId: '10032',
    name: 'Jaksibayeva Dilnura Bahodir qizi',
    phone: '+998 97 777 88 99',
    salary: '0 UZS',
    percentage: '40%',
    lessonPrice: '20,000 UZS',
    birthDate: '18.09.2001',
    hireDate: '05.01.2024',
    avatarLetter: 'D',
    avatarBg: 'bg-blue-100 text-blue-600'
  }
];

export default function MentorsPage() {
  const [activeTab, setActiveTab] = useState('O\'QITUVCHILAR');

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">Mentorlar</h1>
            <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100">
              35
            </span>
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
            <span className="text-[13px] font-semibold text-slate-500">Arxiv</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 border border-orange-200 text-orange-600 rounded-lg text-[13px] font-bold hover:bg-orange-50 transition-colors uppercase tracking-tight">
            <Send size={16} />
            <span>SMS YUBORISH</span>
          </button>
          
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-[13px] font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase">
            <Plus size={18} />
            <span>YANGI QO'SHISH</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex items-center gap-8">
          {['O\'QITUVCHILAR', 'SUPPORT O\'QITUVCHILAR'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative py-4 text-[13px] font-bold tracking-wider transition-colors
                ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="mentor-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center w-16">ID</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16">Rasm</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ism familiya</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Telefon raqam</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doimiy oylik</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Foiz ulush (%)</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dars haqi</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tug'ilgan sana</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ishga olingan sana</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right w-16 px-6">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_MENTORS.map((mentor, index) => (
                  <motion.tr 
                    key={mentor.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-slate-400 text-center">
                      {mentor.displayId}
                    </td>
                    <td className="px-4 py-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${mentor.avatarBg}`}>
                        {mentor.avatarLetter}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-slate-800">{mentor.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-slate-600">{mentor.phone}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-emerald-600">{mentor.salary}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                        {mentor.percentage}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-slate-600">{mentor.lessonPrice}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-slate-500">{mentor.birthDate}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold text-slate-700">{mentor.hireDate}</span>
                    </td>
                    <td className="px-4 py-4 text-right px-6">
                      <button className="p-2 text-slate-400 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer / Pagination Placeholder */}
          <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-400">Jami 35 ta mentor ko'rsatilmoqda</span>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
                Oldingi
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                Keyingi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
