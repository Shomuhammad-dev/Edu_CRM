import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, CalendarDays, Clock, MapPin, Phone, Sparkles, Users } from 'lucide-react';

const groupData = {
  name: "IT 2 (Shomuhammad)",
  course: "IT",
  schedule: "13 Aprel 2026 - 16:00 / 18:00",
  room: "18-xona",
  days: "Dushanba, Chorshanba, Juma",
  total: 2,
  active: 2,
  exam: 1,
  duration: "12 oy",
  studentsCount: '2 ta',
  gradingSystem: "Standart 100 ballik baholash tizimi",
  teacherLink: "Shonug'monov Shomuhammad",
  courseDuration: "13.04.2026 - 13.04.2027",
  filial: "Alouddin Filiali",
  price: "400.000 So'm"
};

const students = [
  { id: 1, name: 'Abdurahimov Maqsad', phone: '+998950033179', balance: '-400 000' },
  { id: 2, name: 'Meyirbek Padaybekov', phone: '+998958853405', balance: '-646 000' },
  { id: 3, name: 'Turg\'unaliyev Bek', phone: '+998942471185', balance: '-646 153' }
];

const details = [
  { label: "Jami o'quvchi", value: '2 ta', icon: Users },
  { label: 'Faol guruh', value: '1', icon: Users },
  { label: 'Sinov dars', value: '1', icon: Sparkles },
  { label: 'Kurs muddati', value: '12 oy', icon: Clock }
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [showArchive, setShowArchive] = useState(false);

  const initials = useMemo(() => {
    return user?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'OQ';
  }, [user]);

  return (
    <div className="bg-slate-50 px-6 py-8 min-h-[calc(100vh-72px)]">
      <div className="max-w-[1600px] mx-auto grid gap-8 lg:grid-cols-[420px_1fr]">
        <section className="rounded-[28px] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-4xl font-bold text-white shadow-xl">
              {initials}
            </div>
            <div>
              <p className="text-sm uppercase text-slate-400 tracking-[0.18em]">O'qituvchi</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{user?.name}</h2>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ro'yxatdan o'tgan sana</p>
              <p className="mt-2 text-base font-semibold text-slate-900">24 Noyabr 2025</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Filial</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{groupData.filial}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Telefon</p>
              <p className="mt-2 text-base font-semibold text-slate-900">+998 99 363 21 09</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4">
            {details.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-[28px] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Dashboard</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Guruhlar va O'quvchilar</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowArchive(!showArchive)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${showArchive ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                >
                  Arxiv
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <BookOpen size={18} />
                  <span className="text-sm font-semibold">Kurs nomi</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{groupData.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{groupData.course}</p>
                <div className="mt-6 space-y-4 text-slate-600">
                  <p className="flex items-center gap-2"><CalendarDays size={16} /> {groupData.schedule}</p>
                  <p className="flex items-center gap-2"><Clock size={16} /> {groupData.days}</p>
                  <p className="flex items-center gap-2"><MapPin size={16} /> {groupData.room}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Kurs haqida</p>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Jami talaba</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{groupData.total} ta</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Faol talaba</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{groupData.active} ta</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Sinov darslar</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{groupData.exam} ta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Joriy guruhdagi o'quvchilar</h2>
                  <p className="mt-2 text-sm text-slate-500">Guruhingizdagi barcha o'quvchilarni kuzatib boring.</p>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase text-slate-600">
                  {students.length} o'quvchi
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="rounded-3xl border border-slate-200 p-5 hover:border-indigo-500 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Qarzdorlik</p>
                        <p className="mt-1 font-semibold text-slate-900">{student.balance}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Kurs ma'lumotlari</h2>
                  <p className="mt-2 text-sm text-slate-500">Imtihon va narx bo'yicha qisqa ma'lumot.</p>
                </div>
                <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">Aktiv</div>
              </div>

              <div className="mt-8 space-y-4 text-slate-600">
                <p className="flex items-center gap-2"><BookOpen size={16} /> Narxi: <span className="font-semibold text-slate-900">{groupData.price}</span></p>
                <p className="flex items-center gap-2"><MapPin size={16} /> Filial: <span className="font-semibold text-slate-900">{groupData.filial}</span></p>
                <p className="flex items-center gap-2"><CalendarDays size={16} /> Davomiylik: <span className="font-semibold text-slate-900">{groupData.courseDuration}</span></p>
                <p className="flex items-center gap-2"><Phone size={16} /> O'qituvchi: <span className="font-semibold text-slate-900">{groupData.teacherLink}</span></p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
