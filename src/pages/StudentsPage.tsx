import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Send, 
  ChevronDown, 
  MoreVertical,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ─────────────────────────────────────────────────────────────
interface Group {
  id: number;
  name: string;
  time_slot: string;
  teacher: string;
  course: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  birth_date: string | null;
  balance: number;
  status: 'Yangi' | 'Faol' | 'Muzlatilgan';
  comment: string;
  group_id: number | null;
  group_name: string | null;
  group_time: string | null;
  group_teacher: string | null;
  group_course: string | null;
  next_payment_date: string;
  points: number;
}

// Avatar background colors pool
const AVATAR_COLORS = [
  'bg-sky-100 text-sky-600',
  'bg-indigo-100 text-indigo-600',
  'bg-emerald-100 text-emerald-600',
  'bg-rose-100 text-rose-600',
  'bg-amber-100 text-amber-600',
  'bg-purple-100 text-purple-600',
  'bg-teal-100 text-teal-600',
  'bg-orange-100 text-orange-600',
];

function getAvatarColor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Main Page ──────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Student | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [birthDate, setBirthDate] = useState('');
  const [balance, setBalance] = useState('0');
  const [statusVal, setStatusVal] = useState<'Yangi' | 'Faol' | 'Muzlatilgan'>('Yangi');
  const [comment, setComment] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ─── API Calls ───────────────────────────────────────────────────────

  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      if (data.success) setGroups(data.data);
    } catch {
      // If API unavailable, keep groups empty
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter) params.set('status', statusFilter);
      if (groupFilter) params.set('group_id', groupFilter);
      if (courseFilter) params.set('course', courseFilter);
      if (teacherFilter) params.set('teacher', teacherFilter);

      const res = await fetch(`/api/students?${params.toString()}`);
      if (!res.ok) throw new Error(`Server xatosi: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        throw new Error(data.message || 'Ma\'lumot olishda xatolik');
      }
    } catch (err: any) {
      setError(err.message || 'API bilan ulanishda xatolik');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, groupFilter, courseFilter, teacherFilter]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // ─── Form Helpers ────────────────────────────────────────────────────

  function resetForm() {
    setFirstName('');
    setLastName('');
    setPhone('+998');
    setBirthDate('');
    setBalance('0');
    setStatusVal('Yangi');
    setComment('');
    setSelectedGroupId(groups.length > 0 ? String(groups[0].id) : '');
    setNotification(null);
    setEditStudent(null);
  }

  function openAddModal() {
    resetForm();
    setShowAddModal(true);
  }

  function openEditModal(student: Student) {
    setEditStudent(student);
    setFirstName(student.first_name);
    setLastName(student.last_name);
    setPhone(student.phone);
    setBirthDate(student.birth_date || '');
    setBalance(String(student.balance));
    setStatusVal(student.status);
    setComment(student.comment || '');
    setSelectedGroupId(student.group_id ? String(student.group_id) : '');
    setNotification(null);
    setShowAddModal(true);
  }

  function showNotification(message: string, type: 'success' | 'error') {
    setNotification({ message, type });
    if (type === 'success') {
      setTimeout(() => setNotification(null), 3000);
    }
  }

  // ─── CRUD Handlers ───────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      showNotification("Ism va familiyani kiriting", 'error');
      return;
    }

    const phoneRegex = /^\+?998\d{9}$/;
    if (!phoneRegex.test(phone)) {
      showNotification("Telefon raqami noto'g'ri (+998XXXXXXXXX)", 'error');
      return;
    }

    setFormLoading(true);
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone,
      birth_date: birthDate || null,
      balance: parseFloat(balance) || 0,
      status: statusVal,
      comment,
      group_id: selectedGroupId || null,
    };

    try {
      const url = editStudent ? `/api/students/${editStudent.id}` : '/api/students';
      const method = editStudent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Saqlashda xatolik');
      }

      showNotification(
        editStudent ? "O'quvchi muvaffaqiyatli yangilandi" : "O'quvchi muvaffaqiyatli qo'shildi",
        'success'
      );

      await fetchStudents();

      setTimeout(() => {
        setShowAddModal(false);
        resetForm();
      }, 1200);

    } catch (err: any) {
      showNotification(err.message || 'Server bilan ulanishda xatolik', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (student: Student) => {
    try {
      const res = await fetch(`/api/students/${student.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setShowDeleteConfirm(null);
      await fetchStudents();
    } catch (err: any) {
      alert("O'chirishda xatolik: " + err.message);
    }
  };

  // Derived filter data for dropdowns
  const uniqueCourses = [...new Set(groups.map(g => g.course).filter(Boolean))];
  const uniqueTeachers = [...new Set(groups.map(g => g.teacher).filter(Boolean))];

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800">O'quvchilar</h1>
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold border border-indigo-100">
              {loading ? '...' : `${students.length} ta`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchStudents}
              title="Yangilash"
              className="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors uppercase">
              <FileSpreadsheet size={16} />
              <span>EXCEL</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-orange-200 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors uppercase">
              <Send size={16} />
              <span>SMS YUBORISH</span>
            </button>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all uppercase flex items-center gap-2"
              onClick={openAddModal}
            >
              <Plus size={18} />
              <span>YANGI QO'SHISH</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="relative group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Ism yoki telefon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <FilterSelect
            label="Kurslar"
            value={courseFilter}
            options={uniqueCourses}
            onChange={setCourseFilter}
          />
          <FilterSelect
            label="Holati"
            value={statusFilter}
            options={['Yangi', 'Faol', 'Muzlatilgan']}
            onChange={setStatusFilter}
            isHighlighted
          />
          <FilterSelect
            label="Guruh"
            value={groupFilter}
            options={groups.map(g => ({ label: g.name, value: String(g.id) }))}
            onChange={setGroupFilter}
          />
          <FilterSelect
            label="Ustoz"
            value={teacherFilter}
            options={uniqueTeachers}
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

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        {error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 max-w-md">
              <AlertCircle size={20} />
              <div>
                <p className="font-bold text-sm">Ulanish xatosi</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
            <button onClick={fetchStudents} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
              <RefreshCw size={16} />
              Qayta urinish
            </button>
          </div>
        ) : (
          <div className="min-w-max bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-12 text-center">ID</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16">Rasm</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-56">Ism familiya</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Keyingi to'lov</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Telefon</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-80">Izoh</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-64">Guruh</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Balans</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center w-28">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Loader2 size={28} className="animate-spin text-indigo-500" />
                        <span className="text-sm font-medium">Yuklanmoqda...</span>
                      </div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <Search size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium">O'quvchi topilmadi</p>
                        <button
                          onClick={openAddModal}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          + Yangi o'quvchi qo'shish
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.04, 0.3) }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-4 py-5 text-sm font-medium text-slate-400 text-center">{student.id}</td>
                      <td className="px-4 py-5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${getAvatarColor(student.id)}`}>
                          {student.first_name.charAt(0).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <p className="text-sm font-bold text-indigo-600">
                          {student.last_name} {student.first_name}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          student.status === 'Faol' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          student.status === 'Muzlatilgan' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-sm font-semibold text-slate-700">
                          {student.next_payment_date ? new Date(student.next_payment_date).toLocaleDateString('uz-UZ') : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-sm font-medium text-slate-500">{student.phone}</td>
                      <td className="px-4 py-5">
                        <p className="text-xs leading-relaxed text-slate-500 line-clamp-2 max-w-xs">
                          {student.comment || <span className="italic text-slate-300">Izoh yo'q</span>}
                        </p>
                      </td>
                      <td className="px-4 py-5">
                        {student.group_name ? (
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-800 leading-tight">{student.group_name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{student.group_time}</span>
                            <span className="text-[11px] text-slate-500 italic">{student.group_teacher}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 italic">Guruh yo'q</span>
                        )}
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                            Number(student.balance) > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            Number(student.balance) < 0 ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                            {Number(student.balance).toLocaleString('uz-UZ')} so'm
                          </span>
                          {student.points > 0 && (
                            <span className="text-[10px] text-amber-600 font-bold">⭐ {student.points} ball</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Tahrirlash"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(student)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="O'chirish"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => { setShowAddModal(false); resetForm(); }}
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">
                  {editStudent ? "O'quvchini tahrirlash" : "Yangi o'quvchi qo'shish"}
                </h2>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <AnimatePresence>
                {notification && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-3 text-sm font-medium ${
                      notification.type === 'error'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}
                  >
                    {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                    <span>{notification.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
                      placeholder="+998901234567"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tug'ilgan sana</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Boshlang'ich balans (so'm)</label>
                    <input
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Holati</label>
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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guruh tanlash</label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="">— Guruh tanlang —</option>
                    {groups.map((g) => (
                      <option key={g.id} value={String(g.id)}>
                        {g.name} — {g.time_slot} ({g.teacher})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Izoh</label>
                  <textarea
                    rows={3}
                    placeholder="Qo'shimcha tafsilotlar..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
                  >
                    {formLoading && <Loader2 size={16} className="animate-spin" />}
                    {editStudent ? 'Saqlash' : "Qo'shish"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-sm w-full z-10"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                  <Trash2 size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">O'chirishni tasdiqlang</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    <strong>{showDeleteConfirm.last_name} {showDeleteConfirm.first_name}</strong> o'quvchisi o'chiriladi. Bu amalni qaytarib bo'lmaydi.
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Filter Select Component ─────────────────────────────────────────────
function FilterSelect({
  label,
  value,
  options,
  onChange,
  isHighlighted,
}: {
  label: string;
  value: string;
  options: string[] | { label: string; value: string }[];
  onChange: (val: string) => void;
  isHighlighted?: boolean;
}) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

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
            w-full pl-3 pr-8 py-2.5 bg-white border rounded-lg text-sm font-semibold text-slate-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            transition-all appearance-none cursor-pointer shadow-sm
            ${isHighlighted && value ? 'border-indigo-400 ring-2 ring-indigo-500/5' : 'border-slate-200'}
          `}
        >
          <option value="">{label} (Barchasi)</option>
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
