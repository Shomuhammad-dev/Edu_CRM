import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Send, 
  ChevronDown, 
  MoreVertical,
  Zap,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentGroup {
  name: string;
  time: string;
  teacher: string;
}

interface Student {
  id: string;
  name: string;
  avatarLetter: string;
  avatarBg: string;
  rating: string;
  nextPaymentDate: string;
  phone: string;
  comment: string;
  groups: StudentGroup[];
  balance: string;
  status: 'Yangi' | 'Faol' | 'Muzlatilgan';
  points: number;
}

const MOCK_GROUPS = [
  { name: 'IT 2(Shomuhammad)', time: '16:00-18:00', teacher: 'Shonug\'monov Shomuhammad' },
  { name: '2ingliz tili Cefr', time: '16:00-18:00', teacher: 'Xolnazarov Ozod' },
  { name: 'Sena tili yangi guruh', time: '15:00-17:00', teacher: 'Abdurahmonov Muhiddin' },
  { name: 'ingliz tili kids 15 00da', time: '16:00-18:00', teacher: 'Usilbekova Meruert' },
  { name: '1kids (Jaksibayeva Dilnura)', time: '09:00-11:00', teacher: 'Jaksibayeva Dilnura' },
  { name: 'Xusniddin matematika ustoz', time: '14:00-16:00', teacher: 'Pardayev Xusniddin' }
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Abdurahimov Maqsad',
    avatarLetter: 'A',
    avatarBg: 'bg-sky-100 text-sky-600',
    rating: 'Bahosi yo\'q',
    nextPaymentDate: '2026-05-01',
    phone: '+998950033179',
    comment: '8 sinf 34 maktabda oqiydi oldin hech qayerda oqimagan bugun probni darsga kirdi',
    groups: [MOCK_GROUPS[0]],
    balance: '0 so\'m',
    status: 'Yangi',
    points: 0
  },
  {
    id: '2',
    name: 'Doston Maxmudov',
    avatarLetter: 'D',
    avatarBg: 'bg-indigo-100 text-indigo-600',
    rating: 'Bahosi yo\'q',
    nextPaymentDate: '2026-05-01',
    phone: '+998946073200',
    comment: 'Ustoz None - Xolnazarov Ozod ga o\'zgartirildi',
    groups: [MOCK_GROUPS[1]],
    balance: '0 so\'m',
    status: 'Yangi',
    points: 0
  },
  {
    id: '3',
    name: 'Asel Abdumutalipova',
    avatarLetter: 'A',
    avatarBg: 'bg-emerald-100 text-emerald-600',
    rating: 'Bahosi yo\'q',
    nextPaymentDate: '2026-05-01',
    phone: '+998952128678',
    comment: 'bugun darsga keldi, dugonasi bizda o\'qirkan, 25may kuni imtihon ekan',
    groups: [MOCK_GROUPS[2]],
    balance: '0 so\'m',
    status: 'Yangi',
    points: 0
  },
  {
    id: '4',
    name: 'Turdimurodova Barno',
    avatarLetter: 'T',
    avatarBg: 'bg-rose-100 text-rose-600',
    rating: 'Bahosi yo\'q',
    nextPaymentDate: '2026-05-01',
    phone: '+998943555581',
    comment: '2 sinf 26-maktab ingliz tili oqimoqchi (Meruetni sorab keldi)ortogi shu yerda o\'qir ekan.darsga kirdi',
    groups: [MOCK_GROUPS[3]],
    balance: '0 so\'m',
    status: 'Yangi',
    points: 0
  },
  {
    id: '5',
    name: 'Hasanov Diyorbek',
    avatarLetter: 'H',
    avatarBg: 'bg-amber-100 text-amber-600',
    rating: 'Bahosi yo\'q',
    nextPaymentDate: '2026-05-01',
    phone: '+998949102492',
    comment: 'darsga keldi',
    groups: [MOCK_GROUPS[4]],
    balance: '0 so\'m',
    status: 'Yangi',
    points: 0
  },
  {
    id: '6',
    name: 'Jaloliddin Baxtiyorov',
    avatarLetter: 'J',
    avatarBg: 'bg-purple-100 text-purple-600',
    rating: 'Bahosi yo\'q',
    nextPaymentDate: '2026-05-01',
    phone: '+998940733050',
    comment: 'eslatilgan maktabdan chiqib keladi',
    groups: [MOCK_GROUPS[5]],
    balance: '0 so\'m',
    status: 'Yangi',
    points: 0
  }
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Yangi');
  const [groupFilter, setGroupFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [birthDate, setBirthDate] = useState('');
  const [balance, setBalance] = useState('0');
  const [statusVal, setStatusVal] = useState<'Yangi' | 'Faol' | 'Muzlatilgan'>('Yangi');
  const [comment, setComment] = useState('');
  const [selectedGroupIndex, setSelectedGroupIndex] = useState('0');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Form validations & submission
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !birthDate) {
      setNotification({ message: "Iltimos, barcha majburiy maydonlarni to'ldiring", type: 'error' });
      return;
    }

    // Validate phone number regex matching backend
    const phoneRegex = /^\+?998?\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setNotification({ message: "Telefon raqami noto'g'ri formatda (Masalan: +998991234567)", type: 'error' });
      return;
    }

    const group = MOCK_GROUPS[parseInt(selectedGroupIndex)];

    const newStudent: Student = {
      id: String(students.length + 1),
      name: `${lastName} ${firstName}`,
      avatarLetter: firstName.charAt(0).toUpperCase(),
      avatarBg: 'bg-indigo-100 text-indigo-600',
      rating: 'Bahosi yo\'q',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      phone,
      comment,
      groups: [group],
      balance: `${parseInt(balance).toLocaleString()} so'm`,
      status: statusVal,
      points: 0
    };

    // Attempt backend save (Django DRF or Express API fallback)
    try {
      const response = await fetch('/api/students/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
          birth_date: birthDate,
          balance: parseFloat(balance) || 0,
          status: statusVal,
          comment,
          groups: [parseInt(selectedGroupIndex) + 1] // map mock group indices to IDs
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.groups?.[0] || errorData.phone?.[0] || "API xatolik");
      }

      setNotification({ message: "O'quvchi muvaffaqiyatli qo'shildi", type: 'success' });
    } catch (err: any) {
      console.warn("Backend API not reachable/configured yet. Adding to local state (Frontend mock mode). Details:", err.message);
      // We still update local state to allow instant user UI testing
      setNotification({ message: `O'quvchi qo'shildi (Lokal ma'lumotlar bazasida saqlandi)`, type: 'success' });
    }

    setStudents([newStudent, ...students]);

    // Reset Form
    setFirstName('');
    setLastName('');
    setPhone('+998');
    setBirthDate('');
    setBalance('0');
    setStatusVal('Yangi');
    setComment('');
    setSelectedGroupIndex('0');

    setTimeout(() => {
      setShowAddModal(false);
      setNotification(null);
    }, 1500);
  };

  // Filter students based on UI selections
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.phone.includes(searchQuery) ||
                          student.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || student.status === statusFilter;
    
    const matchesGroup = !groupFilter || student.groups.some(g => g.name.includes(groupFilter));
    
    const matchesCourse = !courseFilter || student.groups.some(g => g.name.toLowerCase().includes(courseFilter.toLowerCase()));
    
    const matchesTeacher = !teacherFilter || student.groups.some(g => g.teacher.toLowerCase().includes(teacherFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesGroup && matchesCourse && matchesTeacher;
  });

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Header with Metrics and Actions */}
      <div className="bg-white px-6 py-6 border-b border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800">O'quvchilar</h1>
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold border border-indigo-100">
              O'quvchilar soni: {filteredStudents.length} ta
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors uppercase">
              <FileSpreadsheet size={16} />
              <span>EXCEL</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-orange-200 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors uppercase">
              <Send size={16} />
              <span>SMS YUBORISH</span>
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all uppercase flex items-center gap-2"
                    onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              <span>YANGI QO'SHISH</span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="relative group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Ism yoki telefon qidirish" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <FilterSelect 
            label="Kurslar" 
            value={courseFilter} 
            options={['IT', 'Ingliz tili', 'Sona tili', 'Matematika']} 
            onChange={setCourseFilter} 
          />
          <FilterSelect 
            label="Guruhdagi holati" 
            value={statusFilter} 
            options={['Yangi', 'Faol', 'Muzlatilgan']} 
            onChange={setStatusFilter} 
            isHighlighted
          />
          <FilterSelect 
            label="Guruh" 
            value={groupFilter} 
            options={MOCK_GROUPS.map(g => g.name)} 
            onChange={setGroupFilter} 
          />
          <FilterSelect 
            label="Ustoz" 
            value={teacherFilter} 
            options={Array.from(new Set(MOCK_GROUPS.map(g => g.teacher)))} 
            onChange={setTeacherFilter} 
          />
          
          {(courseFilter || statusFilter || groupFilter || teacherFilter || searchQuery) && (
            <button 
              className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors text-center py-2"
              onClick={() => {
                setCourseFilter('');
                setStatusFilter('');
                setGroupFilter('');
                setTeacherFilter('');
                setSearchQuery('');
              }}
            >
              Filtrlarni tozalash
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="min-w-max bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-12 text-center">ID</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16">Rasm</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-64">Ism familiya</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Baho</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Keyingi to'lov</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Telefon</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-80">Izoh</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-64">Guruhlar</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Balans</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center w-24">Harakatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-400 font-medium">
                    Hech qanday o'quvchi topilmadi
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-6 text-sm font-medium text-slate-400 text-center">{student.id}</td>
                    <td className="px-4 py-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${student.avatarBg}`}>
                        {student.avatarLetter}
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <button className="text-sm font-bold text-indigo-600 hover:underline text-left">
                        {student.name}
                      </button>
                    </td>
                    <td className="px-4 py-6">
                      <span className="text-xs text-slate-400 font-medium">{student.rating}</span>
                    </td>
                    <td className="px-4 py-6">
                      <span className="text-sm font-semibold text-slate-700">{student.nextPaymentDate}</span>
                    </td>
                    <td className="px-4 py-6 text-sm font-medium text-slate-500">
                      {student.phone}
                    </td>
                    <td className="px-4 py-6">
                      <p className="text-xs leading-relaxed text-slate-500 line-clamp-3">
                        {student.comment || <span className="italic text-slate-300">Izoh yo'q</span>}
                      </p>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col gap-2">
                        {student.groups.map((group, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-800 leading-tight">{group.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{group.time}</span>
                            <span className="text-[11px] text-slate-500 italic">{group.teacher}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold border border-orange-100 whitespace-nowrap">
                          {student.status}
                          <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-orange-600 border border-orange-100 ml-1">
                            {student.points}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                          {student.balance}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-transparent hover:shadow-sm">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Premium Modal: Add Student */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Yangi o'quvchi qo'shish</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {notification && (
                <div className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-3 text-sm font-medium ${notification.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                  {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                  <span>{notification.message}</span>
                </div>
              )}

              <form onSubmit={handleAddStudent} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ismi *</label>
                    <input 
                      type="text" 
                      placeholder="Maqsad"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Familiyasi *</label>
                    <input 
                      type="text" 
                      placeholder="Abdurahimov"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telefon *</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tug'ilgan sana *</label>
                    <input 
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Boshlang'ich Balans (so'm)</label>
                    <input 
                      type="number" 
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guruhdagi holati</label>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="Yangi">Yangi</option>
                      <option value="Faol">Faol</option>
                      <option value="Muzlatilgan">Muzlatilgan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guruh tanlash *</label>
                  <select
                    value={selectedGroupIndex}
                    onChange={(e) => setSelectedGroupIndex(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 cursor-pointer"
                  >
                    {MOCK_GROUPS.map((g, idx) => (
                      <option key={idx} value={String(idx)}>
                        {g.name} — {g.time} ({g.teacher})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Izoh</label>
                  <textarea 
                    rows={3}
                    placeholder="Qo'shimcha tafsilotlar kiriting..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all"
                  >
                    Qo'shish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterSelect({ 
  label, 
  value, 
  options, 
  onChange,
  isHighlighted 
}: { 
  label: string; 
  value: string; 
  options: string[]; 
  onChange: (val: string) => void;
  isHighlighted?: boolean;
}) {
  return (
    <div className="flex flex-col relative">
      {isHighlighted && value && (
        <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] font-bold text-slate-400 z-10 leading-none">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full pl-3 pr-8 py-2.5 bg-white border rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm
            ${isHighlighted && value ? 'border-indigo-400 ring-2 ring-indigo-500/5' : 'border-slate-200'}
          `}
        >
          <option value="">{label} (Barchasi)</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
