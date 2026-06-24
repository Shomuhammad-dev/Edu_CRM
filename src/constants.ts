import { 
  Users, 
  UserRound, 
  GraduationCap, 
  Layers, 
  Settings, 
  BarChart3, 
  Home,
  MessageSquare,
  Search,
  ChevronDown,
  Bell,
  Scan,
  CreditCard,
  Target,
  FileWarning,
  Clock,
  UserPlus,
  BookOpen,
  ClipboardList,
  CalendarDays
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Bosh sahifa', icon: Home },
  { id: 'leads', label: 'Lidlar', icon: Target },
  { id: 'teachers', label: 'O\'qituvchilar', icon: GraduationCap },
  { id: 'groups', label: 'Guruhlar', icon: Layers },
  { id: 'students', label: 'O\'quvchilar', icon: UserRound },
  { id: 'settings', label: 'Sozlamalar', icon: Settings, hasDropdown: true },
  { id: 'reports', label: 'Hisobotlar', icon: BarChart3, hasDropdown: true },
];

export const STATS = [
  { label: 'Faol Lidlar', value: 100, icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Guruhlar', value: 68, icon: Layers, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Qolib ketgan', value: '-', icon: FileWarning, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Qarzdorlar', value: '-', icon: CreditCard, color: 'text-rose-500', bg: 'bg-rose-50' },
  { label: 'To\'lovi yaqin', value: '-', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Faol talabalar', value: '-', icon: UserRound, color: 'text-sky-500', bg: 'bg-sky-50' },
  { label: 'Jami guruhlar', value: '-', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Sinov darslari', value: 15, icon: CalendarDays, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Kelib ketgan', value: '-', icon: Users, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'O\'qituvchilar', value: 35, icon: GraduationCap, color: 'text-teal-500', bg: 'bg-teal-50' },
  { label: 'Imtihonlar', value: 0, icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Yangi guruhlar', value: 0, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50', isNew: true },
];

export const ROOMS = [
  '1-xona', '2-xona', '3-xona', '4-xona', '5-xona', '6-xona', '7-xona'
];

export const TIME_SLOTS = [
  '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
  '14:00'
];

export const SCHEDULE_DATA = [
  {
    room: '1-xona',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Rus tili',
    teacher: 'O\'qituvchi: O\'ralbekova Nigina',
    color: 'bg-pink-100 border-pink-200 text-pink-700'
  },
  {
    room: '3-xona',
    startTime: '13:00',
    endTime: '15:00',
    title: 'Rus tili',
    teacher: 'O\'qituvchi: Abdurahmonov Muhiddin',
    color: 'bg-purple-100 border-purple-200 text-purple-700'
  },
  {
    room: '4-xona',
    startTime: '10:00',
    endTime: '12:00',
    title: 'Ingliz tili (O\'ralbekova Sevinch)',
    teacher: 'O\'qituvchi: O\'ralbekova Sevinch',
    color: 'bg-lime-100 border-lime-200 text-lime-700'
  },
  {
    room: '5-xona',
    startTime: '09:00',
    endTime: '11:00',
    title: '1kids (Jaksibayeva Dilnura)',
    teacher: 'O\'qituvchi: Jaksibayeva Dilnura',
    color: 'bg-yellow-100 border-yellow-200 text-yellow-700'
  },
  {
    room: '6-xona',
    startTime: '11:30',
    endTime: '12:30',
    title: '2 A yangi guruh',
    teacher: 'O\'qituvchi: Kuchkarov Azamat',
    color: 'bg-slate-100 border-slate-200 text-slate-700'
  }
];
