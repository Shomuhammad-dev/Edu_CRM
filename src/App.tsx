import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- STATIC DATA ---
const teacher = {
  name: "Shonug'monov Shomuhammad",
  initial: "S",
  registeredDate: "24 Noyabr 2025",
  filial: "Alouddin Filliali",
  coursesCount: 1,
  activeGroupsCount: 1,
  activeStudentsCount: 2,
  phone: "+998 (99) 363-21-09"
};

const group = {
  id: 1,
  name: "IT 2(Shomuhammad)",
  course: "IT",
  schedule: "13 Aprel 2026 - 16:00 / 18:00",
  room: "18-xona-xona",
  days: "Dushanba, Chorshanba, Juma",
  total: 2, active: 2, sinov: 1, duration: "12 oy",
  studentsCount: "2 ta",
  gradingSystem: "Standart 100 Ballik Baholash Tizimi (Default)",
  lessonDays: [
    { day: "Dushanba", time: "16:00 - 18:00", room: "18-xona" },
    { day: "Chorshanba", time: "16:00 - 18:00", room: "18-xona" },
    { day: "Juma", time: "16:00 - 18:00", room: "18-xona" }
  ],
  teacherLink: "Shonug'monov Shomuhammad",
  courseDuration: "13.04.2026 - 13.04.2027",
  filial: "Alouddin Filliali",
  price: "400.000 So'm"
};

const monthNamesUz = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
const generatedMonths: { label: string, year: number, month: number }[] = [];
for (let i = 0; i <= 12; i++) {
  const m = (3 + i) % 12; // Start from April (index 3)
  const y = 2026 + Math.floor((3 + i) / 12);
  generatedMonths.push({
    label: `${monthNamesUz[m]} ${y}`,
    year: y,
    month: m
  });
}

const months = generatedMonths.map(m => m.label);

const getLessonDates = (year: number, monthIndex: number) => {
  const res: number[] = [];
  const days = new Date(year, monthIndex + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const dayOfWeek = new Date(year, monthIndex, d).getDay();
    if ([1, 3, 5].includes(dayOfWeek)) res.push(d);
  }
  return res;
};

const allMonthsDates = generatedMonths.map(m => getLessonDates(m.year, m.month));

const studentsData = [
  {
    id: 1,
    name: "Abdurahimov Maqsad",
    phone: "+998950033179",
    balance: "-400 000",
    attendance: ['locked', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked', 'absent']
  },
  {
    id: 2,
    name: "Meyirbek Padaybekov",
    phone: "+998958853405",
    balance: "-646 000",
    attendance: ['absent', 'absent', 'present', 'absent', 'absent', 'absent', 'absent', 'absent']
  },
  {
    id: 3,
    name: "Turg'unaliyev Bek",
    phone: "+998942471185",
    balance: "-646 153",
    attendance: ['absent', 'absent', 'present', 'absent', 'absent', 'absent', 'absent', 'absent']
  }
];

const detailTabs = ["DAVOMAT", "BAHO", "IMTIHON", "COINLAR", "O'QUVCHIGA IZOH"];

// --- ICONS ---
const Icons: { [key: string]: React.FC<any> } = {
  SnakeLogo: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.47 2 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 12L12 9" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  ChevronDown: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  ),
  ChevronLeft: ({ size = 14, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  QR: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M7 7h.01M17 7h.01M17 17h.01M7 17h.01"/></svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  Home: ({ color = 'currentColor' }: { color?: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
  ),
  Location: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Book: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  People: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Phone: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  Clock: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ),
  Dollar: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Monitor: ({ size = 20, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  ),
  Calendar: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Walk: ({ size = 20, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M13 18l-2-4-2.5-1.5L8 18m7-10l-3 2-2-1"/></svg>
  ),
  GradCap: ({ size = 20, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  ),
  Flag: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
  ),
  Filter: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  Chat: ({ size = 16, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Paperclip: ({ size = 14, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
  ),
  Archive: ({ size = 14, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
  ),
  X: ({ size = 18, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  ),
  Lock: ({ size = 14, color = '#BDBDBD' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" fill={color} fillOpacity="0.1"/>
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Check: () => (
    <div style={{ width: 22, height: 22, borderRadius: 5, background: '#4CAF50', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ),
  EyeOff: ({ size = 20, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7c1.55 0 3.03-.34 4.39-.94"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
  ),
  Eye: ({ size = 20, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Warning: ({ size = 16, color = '#FF9800' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  ),
  Excel: ({ size = 14, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
      <path d="M12 11h3.5" />
      <path d="M9 11v6" />
      <path d="M12 15h3.5" />
      <path d="M9 7h3.5" />
      <path d="M12 11h3.5" />
    </svg>
  ),
  GridIcon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
  )
};

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fa',
    color: '#1a1a2e'
  },
  navbar: {
    height: 72,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer'
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
    letterSpacing: '-0.025em'
  },
  searchContainer: {
    flex: 1,
    margin: '0 32px',
    maxWidth: 700,
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    height: 44,
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '0 44px 0 16px',
    fontSize: 15,
    color: '#334155',
    background: '#f8fafc',
    outline: 'none',
    transition: 'all 0.2s'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  iconBtn: {
    width: 36,
    height: 36,
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#666',
    background: '#fff'
  },
  branchSelect: {
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    color: '#444',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    background: '#fff'
  },
  flag: {
    width: 24,
    height: 16,
    borderRadius: 2,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    objectFit: 'cover'
  },
  avatarContainer: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#e0e0e0',
    position: 'relative',
    cursor: 'pointer',
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px #e8eaed'
  },
  onlineDot: {
    width: 9,
    height: 9,
    background: '#4CAF50',
    borderRadius: '50%',
    border: '1.5px solid #fff',
    position: 'absolute',
    bottom: -1,
    right: -1
  },
  subNav: {
    display: 'flex',
    padding: '8px 24px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e8eaed',
    gap: 8
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 24px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  viewContainer: {
    padding: '32px',
    display: 'flex',
    gap: 32,
    flex: 1,
    maxWidth: 1600,
    margin: '0 auto',
    width: '100%'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  profileAvatar: {
    width: 84,
    height: 84,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 700,
    color: '#fff',
    margin: '0 auto 20px',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
  },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: 20,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    textTransform: 'uppercase'
  },
  groupCard: {
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: 24,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  detailLeftPanel: {
    width: 580,
    flexShrink: 0,
    backgroundColor: '#fff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  detailHeader: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '24px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e2e8f0'
  },
  tabNav: {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 32px',
    backgroundColor: '#fff',
    overflowX: 'auto'
  },
  tab: {
    padding: '20px 24px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
    background: 'transparent',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
    tableLayout: 'fixed'
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    border: '1.5px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#fff',
    transition: 'all 0.2s'
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeMonth, setActiveMonth] = useState(0);
  const currentDates = allMonthsDates[activeMonth] || [];
  const [activeDetailTab, setActiveDetailTab] = useState(0);
  const [isArchiveOn, setIsArchiveOn] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [selectedStudentForTask, setSelectedStudentForTask] = useState<any>(null);
  const [selectedStudentForCoin, setSelectedStudentForCoin] = useState<any>(null);
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<any>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState({ code: 'uz', label: 'Uzbek', flag: 'https://flagcdn.com/w40/uz.png' });
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const isMobile = windowWidth < 1024;
  const isSmallMobile = windowWidth < 640;

  const languages = [
    { code: 'uz', label: 'Uzbek', flag: 'https://flagcdn.com/w40/uz.png' },
    { code: 'ru', label: 'Russian', flag: 'https://flagcdn.com/w40/ru.png' },
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' }
  ];

  // Global styles injection
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; background: #f5f7fa; overflow-x: hidden; font-size: 16px; line-height: 1.5; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: #f1f1f1; }
      ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .hover-scale { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
      .hover-scale:active { transform: scale(0.98); }
      .student-row { transition: background-color 0.2s; }
      .student-row:hover { background-color: #f8faff; }
      input, textarea, button { font-family: inherit; }
      @media (max-width: 640px) {
        .mobile-hide { display: none !important; }
      }
    `;
    document.head.appendChild(styleTag);
    return () => { 
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(styleTag); 
    };
  }, []);

  const DashboardView = () => (
    <div style={{ ...styles.viewContainer, flexDirection: isMobile ? 'column' : 'row', padding: isSmallMobile ? 16 : 32 }}>
      {/* Left Sidebar Profile */}
      <div style={{ ...styles.card, width: isMobile ? '100%' : 420, flexShrink: 0, alignSelf: 'flex-start' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#334155' }}>Mening ma'lumotlarim</h3>
        <div style={styles.profileAvatar}>{teacher.initial}</div>
        <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, marginBottom: 32, color: '#0f172a' }}>{teacher.name}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { icon: Icons.Calendar, label: "Ro'yxatdan o'tgan sana:", value: teacher.registeredDate },
            { icon: Icons.Location, label: "Filial:", value: teacher.filial },
            { icon: Icons.Book, label: "O'qitayotgan kurslar soni:", value: teacher.coursesCount },
            { icon: Icons.People, label: "Faol guruhlar soni:", value: teacher.activeGroupsCount },
            { icon: Icons.People, label: "Faol o'quvchilar soni:", value: teacher.activeStudentsCount },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28 }}>
                <item.icon size={18} color="#64748b" />
              </div>
              <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, marginLeft: isSmallMobile ? 0 : 'auto', color: '#1e293b', width: isSmallMobile ? '100%' : 'auto', paddingLeft: isSmallMobile ? 40 : 0 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '24px 0' }} />
        <p style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 16, letterSpacing: '0.05em' }}>KONTAKT</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icons.Phone size={18} color="#4f46e5" />
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{teacher.phone}</span>
        </div>
      </div>

      {/* Main Groups Panel */}
      <div style={{ ...styles.card, flex: 1, alignSelf: 'flex-start', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Guruhlar</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
             <div 
              onClick={() => setIsArchiveOn(!isArchiveOn)}
              style={{ 
                width: 44, height: 24, backgroundColor: isArchiveOn ? '#4f46e5' : '#cbd5e0', 
                borderRadius: 12, position: 'relative', cursor: 'pointer', transition: '0.3s' 
              }}
            >
              <div style={{ 
                width: 20, height: 20, backgroundColor: '#fff', borderRadius: '50%', 
                position: 'absolute', top: 2, left: isArchiveOn ? 22 : 2, transition: '0.3s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>Arxiv</span>
          </div>
        </div>

        <h4 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Hozirgi/Keyingi dars</h4>
        <p style={{ fontSize: 15, color: '#94a3b8', fontStyle: 'italic', marginBottom: 24 }}>Bugun dars yo'q</p>

        <h4 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Barcha guruhlar</h4>
        
        {/* GROUP CARD */}
        <div 
          onClick={() => setCurrentView('group-detail')}
          className="hover-scale"
          onMouseEnter={() => setHoveredGroup(1)}
          onMouseLeave={() => setHoveredGroup(null)}
          style={{ 
            ...styles.groupCard,
            borderColor: hoveredGroup === 1 ? '#4f46e5' : '#e2e8f0',
            boxShadow: hoveredGroup === 1 ? '0 10px 25px -5px rgba(79, 70, 229, 0.1)' : 'none'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{group.name}</span>
            <span style={{ ...styles.badge, backgroundColor: '#f1f5f9', color: '#475569', fontSize: 12, border: 'none', borderRadius: 8, padding: '6px 12px' }}>{group.course}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icons.Clock size={16} color="#4f46e5" />
              <span style={{ fontSize: 15, color: '#4f46e5', fontWeight: 600 }}>{group.schedule}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icons.Location size={16} color="#4f46e5" />
              <span style={{ fontSize: 15, color: '#4f46e5', fontWeight: 600 }}>{group.room}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icons.Calendar size={16} color="#4f46e5" />
              <span style={{ fontSize: 15, color: '#4f46e5', fontWeight: 600 }}>{group.days}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ ...styles.badge, border: '1px solid #10b981', color: '#047857', background: '#ecfdf5', padding: '6px 14px', fontSize: 12 }}>
              <Icons.People size={14} color="#059669" /> Jami: {group.total}
            </span>
            <span style={{ ...styles.badge, border: '1px solid #4f46e5', color: '#4338ca', background: '#eef2ff', padding: '6px 14px', fontSize: 12 }}>
              <Icons.People size={14} color="#4f46e5" /> Faol: {group.active}
            </span>
            <span style={{ ...styles.badge, border: '1px solid #94a3b8', color: '#475569', background: '#f8fafc', padding: '6px 14px', fontSize: 12 }}>
              <Icons.People size={14} color="#64748b" /> Sinov: {group.sinov}
            </span>
            <span style={{ ...styles.badge, border: '1px solid #f59e0b', color: '#b45309', background: '#fffbeb', padding: '6px 14px', fontSize: 12 }}>
              <Icons.Calendar size={14} color="#d97706" /> {group.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const TaskModal = () => {
    if (!isTaskModalOpen) return null;

    return (
      <div style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        backdropFilter: 'blur(4px)', padding: 20
      }}>
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 700,
            padding: isSmallMobile ? 32 : 48, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative', border: '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>Vazifa berish</h2>
            <button onClick={() => setIsTaskModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} className="hover-scale">
               <Icons.ChevronLeft size={24} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '16px 20px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#4338ca' }}>
              {selectedStudentForTask?.name?.charAt(0)}
            </div>
            <p style={{ fontSize: 18, color: '#1e293b', fontWeight: 600, margin: 0 }}>
              {selectedStudentForTask?.name} ga vazifa bering
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#334155', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
              Vazifa nomi *
            </label>
            <input 
              type="text" 
              placeholder="Vazifaning nomini kiriting..." 
              style={{
                width: '100%', height: 60, borderRadius: 12, border: '2px solid #e2e8f0',
                padding: '0 20px', fontSize: 16, color: '#1e293b', outline: 'none',
                background: '#fff', transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#334155', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
              Vazifa tavsifi *
            </label>
            <textarea 
              placeholder="Vazifaning batafsil tavsifini kiriting..." 
              style={{
                width: '100%', height: 160, borderRadius: 12, border: '2px solid #e2e8f0',
                padding: '20px', fontSize: 16, color: '#1e293b', outline: 'none',
                background: '#fff', resize: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                lineHeight: 1.6
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setIsTaskModalOpen(false)}
              className="hover-scale"
              style={{
                padding: '14px 40px', borderRadius: 12, border: '2px solid #e2e8f0',
                background: '#fff', color: '#64748b', fontSize: 15, fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              BEKOR QILISH
            </button>
            <button 
              className="hover-scale"
              style={{
                padding: '14px 40px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
              }}
            >
              VAZIFA BERISH
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CoinModal = () => {
    if (!isCoinModalOpen) return null;

    return (
      <div 
        onClick={() => setIsCoinModalOpen(false)}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)', padding: 20
        }}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 650,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '40px 40px 0 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
               <h3 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>Coin berish</h3>
               <button onClick={() => setIsCoinModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} className="hover-scale">
                 <Icons.ChevronLeft size={24} style={{ transform: 'rotate(-90deg)' }} />
               </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 16, padding: '20px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div>
                <p style={{ fontSize: 18, color: '#1e293b', fontWeight: 600, marginBottom: 8 }}>
                   {selectedStudentForCoin?.name}
                </p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Sana: 2026-04-29</p>
                  <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Joriy coin: <span style={{ color: '#4f46e5', fontWeight: 700 }}>0</span></p>
                </div>
              </div>
              <button 
                className="hover-scale"
                style={{
                  padding: '10px 20px', borderRadius: 10, border: '2px solid #4f46e5',
                  background: '#fff', color: '#4f46e5', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                O'ZGARTIRISH
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                 <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#334155', marginBottom: 12, textTransform: 'uppercase' }}>Coin miqdori *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    placeholder="0" 
                    style={{
                      width: '100%', height: 56, borderRadius: 12, border: '2px solid #e2e8f0',
                      padding: '0 20px', fontSize: 16, color: '#1e293b', outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#334155', marginBottom: 12, textTransform: 'uppercase' }}>Sabab / Izoh *</label>
                <div style={{ position: 'relative' }}>
                  <textarea 
                    placeholder="Nima uchun coin berilayotganini yozing..." 
                    style={{
                      width: '100%', height: 120, borderRadius: 12, border: '2px solid #e2e8f0',
                      padding: '20px', fontSize: 16, color: '#1e293b', outline: 'none',
                      resize: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                      lineHeight: 1.6
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '40px', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <button 
              onClick={() => setIsCoinModalOpen(false)}
              className="hover-scale"
              style={{
                padding: '14px 40px', borderRadius: 12, border: '2px solid #e2e8f0',
                background: '#fff', color: '#64748b', fontSize: 15, fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              BEKOR QILISH
            </button>
            <button 
              className="hover-scale"
              style={{
                padding: '14px 48px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
              }}
            >
              SAQLASH
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const NoteModal = () => {
    if (!isNoteModalOpen) return null;

    return (
      <div 
        onClick={() => setIsNoteModalOpen(false)}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(8px)', padding: 20
        }}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative', display: 'flex', flexDirection: 'column',
            padding: 48, border: '1px solid #e2e8f0'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 24, right: 24 }}>
             <button onClick={() => setIsNoteModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} className="hover-scale">
                <Icons.ChevronLeft size={24} style={{ transform: 'rotate(-90deg)' }} />
             </button>
          </div>

          <h3 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 32 }}>
            Yangi eslatma qo'shing
          </h3>
          
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#334155', marginBottom: 12, textTransform: 'uppercase' }}>Izoh / Eslatma *</label>
            <textarea 
              placeholder="Eslatmani kiriting..." 
              style={{
                width: '100%', height: 160, borderRadius: 12, border: '2px solid #e2e8f0',
                padding: '20px', fontSize: 16, color: '#1e293b', outline: 'none',
                background: '#fff', resize: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                lineHeight: 1.6
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button 
              className="hover-scale"
              style={{
                flex: 1, padding: '14px 40px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
              }}
            >
              SAQLASH
            </button>
            <button 
              onClick={() => setIsNoteModalOpen(false)}
              className="hover-scale"
              style={{
                flex: 1, padding: '14px 32px', borderRadius: 12, border: '2px solid #e2e8f0',
                background: 'transparent', color: '#64748b', fontSize: 15, fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              BEKOR QILISH
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const LeaveModal = () => {
    if (!isLeaveModalOpen) return null;

    return (
      <div 
        onClick={() => setIsLeaveModalOpen(false)}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
          backdropFilter: 'blur(8px)', padding: 20
        }}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative', display: 'flex', flexDirection: 'column',
            padding: 40, border: '1px solid #e2e8f0'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Dam berish</h3>
            <button 
              onClick={() => setIsLeaveModalOpen(false)}
              className="hover-scale"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icons.ChevronLeft size={24} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase' }}>Izoh *</label>
              <textarea 
                placeholder="Dam olish sababini yozing..." 
                style={{
                  width: '100%', height: 120, borderRadius: 12, border: '2px solid #e2e8f0',
                  padding: '20px', fontSize: 16, color: '#1e293b', outline: 'none',
                  resize: 'none', fontFamily: 'inherit', background: '#fff', transition: 'all 0.2s',
                  lineHeight: 1.6
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase' }}>Sana *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="дд.мм.гггг"
                  style={{
                    width: '100%', height: 56, borderRadius: 12, border: '2px solid #e2e8f0',
                    padding: '0 56px 0 20px', fontSize: 16, color: '#1e293b', outline: 'none', background: '#fff', transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }}>
                  <Icons.Calendar size={22} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <button 
              onClick={() => setIsLeaveModalOpen(false)}
              className="hover-scale"
              style={{
                flex: 1, height: 56, borderRadius: 12, border: '2px solid #e2e8f0',
                background: 'transparent', color: '#64748b', fontSize: 15, fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              BEKOR QILISH
            </button>
            <button 
              className="hover-scale"
              style={{
                flex: 1.5, height: 56, borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
              }}
            >
              SAQLASH
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const ExamModal = () => {
    return (
      <AnimatePresence>
        {isExamModalOpen && (
          <div 
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              display: 'flex', justifyContent: 'flex-end',
            }}
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExamModalOpen(false)}
              style={{
                position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(2px)',
              }}
            />

            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                background: '#fff', width: '100%', maxWidth: 480, height: '100%',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                position: 'relative', display: 'flex', flexDirection: 'column',
                zIndex: 1001
              }}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '20px 24px', borderBottom: '1px solid #f0f2f5' 
              }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#4c556f' }}>Imtihon qo'shish</h3>
                <button 
                  onClick={() => setIsExamModalOpen(false)}
                  style={{ 
                    background: '#f8f9fa', border: 'none', cursor: 'pointer', color: '#999', 
                    display: 'flex', padding: 8, borderRadius: '50%',
                    transition: 'all 0.2s'
                  }}
                  className="hover-scale"
                >
                  <Icons.X size={20} />
                </button>
              </div>

              {/* Body */}
              <div 
                style={{ 
                  padding: '24px', display: 'flex', flexDirection: 'column', gap: 24, 
                  flex: 1, overflowY: 'auto' 
                }} 
                className="no-scrollbar"
              >
                {/* Qayta topshirish checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input 
                      type="checkbox" 
                      id="qayta" 
                      style={{ 
                        width: 20, height: 20, cursor: 'pointer', appearance: 'none',
                        border: '2px solid #e0e4ec', borderRadius: 4, transition: 'all 0.2s'
                      }} 
                    />
                    <div style={{ position: 'absolute', pointerEvents: 'none' }}>
                       {/* Custom checkbox checkmark icon could go here if needed */}
                    </div>
                  </div>
                  <label htmlFor="qayta" style={{ fontSize: 16, color: '#5b6582', fontWeight: 500, cursor: 'pointer' }}>
                    Qayta topshirish
                  </label>
                </div>

                {/* Group Selector */}
                <div style={{ position: 'relative' }}>
                  <label style={{ 
                    position: 'absolute', top: -10, left: 12, background: '#fff', 
                    padding: '0 4px', fontSize: 12, color: '#999', zIndex: 1 
                  }}>Guruh</label>
                  <div style={{ 
                    border: '1px solid #e0e4ec', borderRadius: 10, padding: '14px 16px', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#fff', color: '#4c556f', fontSize: 16, cursor: 'pointer'
                  }}>
                    {group.name}
                    <Icons.ChevronDown size={14} />
                  </div>
                </div>

                {/* Exam Name */}
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Imtihon nomi" 
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e4ec',
                      fontSize: 16, color: '#1a1a2e', outline: 'none', transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3B5BDB'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e4ec'}
                  />
                </div>

                {/* Examiner Selector */}
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    border: '1px solid #e0e4ec', borderRadius: 10, padding: '14px 16px', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#fff', color: '#bdc3d1', fontSize: 16, cursor: 'pointer'
                  }}>
                    Imtihon oluvchi
                    <Icons.ChevronDown size={14} />
                  </div>
                </div>

                {/* Date Selector */}
                <div style={{ position: 'relative' }}>
                  <label style={{ 
                    position: 'absolute', top: -10, left: 12, background: '#fff', 
                    padding: '0 4px', fontSize: 12, color: '#999', zIndex: 1 
                  }}>Imtihon sanasi</label>
                  <div style={{ 
                    border: '1px solid #e0e4ec', borderRadius: 10, padding: '14px 16px', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#fff', color: '#4c556f', fontSize: 16, cursor: 'pointer'
                  }}>
                    30.04.2026
                    <Icons.Calendar size={18} color="#4c556f" />
                  </div>
                </div>

                {/* Room Selector */}
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    border: '1px solid #e0e4ec', borderRadius: 10, padding: '14px 16px', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#fff', color: '#bdc3d1', fontSize: 16, cursor: 'pointer'
                  }}>
                    Xona
                    <Icons.ChevronDown size={14} />
                  </div>
                </div>

              {/* Time range */}
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Boshlanish vaqti</label>
                    <input 
                      type="text" 
                      placeholder="09:00" 
                      style={{
                        width: '100%', height: 56, borderRadius: 12, border: '2px solid #e2e8f0',
                        fontSize: 16, color: '#1e293b', outline: 'none', textAlign: 'center', fontWeight: 600
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Tugash vaqti</label>
                    <input 
                      type="text" 
                      placeholder="11:00" 
                      style={{
                        width: '100%', height: 56, borderRadius: 12, border: '2px solid #e2e8f0',
                        fontSize: 16, color: '#1e293b', outline: 'none', textAlign: 'center', fontWeight: 600
                      }}
                    />
                  </div>
                </div>

                {/* Passing score with error */}
                <div>
                   <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>O'tish balli *</label>
                   <input 
                      type="text" 
                      defaultValue="60"
                      style={{
                        width: '100%', height: 56, borderRadius: 12, border: '2px solid #ef4444',
                        padding: '0 20px', fontSize: 16, color: '#ef4444', outline: 'none', background: '#fef2f2'
                      }}
                    />
                   <div style={{ fontSize: 12, color: '#ef4444', marginTop: 8, marginLeft: 4, fontWeight: 600 }}>
                     Maydonni to'ldirishingiz shart
                   </div>
                </div>

                {/* Max score */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Maksimal ball</label>
                  <input 
                    type="text" 
                    defaultValue="100"
                    style={{
                      width: '100%', height: 56, borderRadius: 12, border: '2px solid #e2e8f0',
                      padding: '0 20px', fontSize: 16, color: '#1e293b', outline: 'none', fontWeight: 600
                    }}
                  />
                </div>

                {/* Footer Action */}
                <div style={{ marginTop: 'auto', paddingTop: 32 }}>
                  <button 
                    className="hover-scale"
                    style={{
                      width: '100%', height: 60, borderRadius: 15, border: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', fontSize: 17, fontWeight: 800,
                      cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
                    }}
                  >
                    SAQLASH
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const GroupDetailView = () => (
    <div style={{ ...styles.viewContainer, flexDirection: isMobile ? 'column' : 'row', padding: isSmallMobile ? 12 : 24, minHeight: 'calc(100vh - 120px)', position: 'relative' }}>
      {/* Sidebar Details Panel */}
      {!isSidebarCollapsed && (
        <div style={{ ...styles.detailLeftPanel, width: isMobile ? '100%' : 580, flexShrink: 0, height: isMobile ? 'auto' : 'calc(100vh - 168px)', transition: 'all 0.3s ease' }}>
          <div style={styles.detailHeader}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <Icons.GradCap size={24} color="#4f46e5" />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginLeft: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.name}</span>
            </div>
            <button 
              onClick={() => setIsSidebarCollapsed(true)}
              className="hover-scale"
              style={{ 
                width: 40, height: 40, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4f46e5',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <Icons.ChevronLeft size={20} />
            </button>
          </div>

          <div style={{ padding: '24px 32px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Icons.People color="#94a3b8" size={18} />
                <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>O'quvchilar soni:</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginLeft: 'auto' }}>{group.studentsCount}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icons.Book color="#94a3b8" size={18} />
                <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Kurs:</span>
                <span style={{ ...styles.badge, background: '#e0e7ff', color: '#4338ca', fontSize: 13, padding: '4px 14px', marginLeft: 'auto', borderRadius: 20, fontWeight: 600 }}>{group.course}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Icons.Warning color="#f59e0b" size={18} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500, display: 'block' }}>Baholash tizimi:</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#b45309' }}>{group.gradingSystem}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>
                  <Icons.Calendar color="#94a3b8" size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 8 }}>Dars kunlari:</span>
                  {group.lessonDays.map((ld, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', flexWrap: 'wrap', gap: 8, borderBottom: i < group.lessonDays.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <span style={{ fontSize: 14, color: '#64748b', width: 100, fontWeight: 500 }}>{ld.day}</span>
                      <span style={{ fontSize: 14, color: '#334155', flex: 1, fontWeight: 600 }}>{ld.time}</span>
                      <span style={{ pointerEvents: 'none', color: '#4f46e5', fontSize: 13, fontWeight: 600, background: '#eef2ff', padding: '2px 12px', borderRadius: 6 }}>{ld.room}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icons.People color="#94a3b8" size={18} />
                <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>O'qituvchi:</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#4f46e5', marginLeft: 'auto', textDecoration: 'underline', cursor: 'pointer' }}>{group.teacherLink}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icons.Calendar color="#94a3b8" size={18} />
                <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Kurs davomiyligi:</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginLeft: 'auto' }}>{group.courseDuration}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icons.QR color="#94a3b8" size={18} />
                <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Filial:</span>
                <span style={{ ...styles.badge, background: '#dcfce7', color: '#15803d', fontSize: 13, padding: '4px 14px', marginLeft: 'auto', fontWeight: 600 }}>{group.filial}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icons.Dollar color="#94a3b8" size={18} />
                <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Kurs narxi:</span>
                <span style={{ ...styles.badge, background: '#f1f5f9', color: '#475569', fontSize: 13, border: 'none', marginLeft: 'auto', borderRadius: 8, fontWeight: 600 }}>{group.price}</span>
              </div>
            </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
              <button style={{ ...styles.actionBtn, width: 48, height: 48, borderRadius: 12 }} className="hover-scale"><Icons.Monitor size={22} color="#4f46e5" /></button>
              <button style={{ ...styles.actionBtn, width: 48, height: 48, borderRadius: 12 }} className="hover-scale"><Icons.QR size={22} color="#4f46e5" /></button>
              <button 
                style={{ ...styles.actionBtn, width: 48, height: 48, borderRadius: 12 }} 
                className="hover-scale"
                onClick={() => setIsLeaveModalOpen(true)}
              >
                <Icons.Walk size={22} color="#4f46e5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24, marginBottom: 24, justifyContent: 'center' }}>
              {[
                { label: 'sinov', color: '#f59e0b' },
                { label: 'aktiv', color: '#10b981' },
                { label: 'arxiv', color: '#ef4444' },
                { label: 'muzlatilgan', color: '#94a3b8' }
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: l.color }} />
                  <span style={{ fontSize: 13, color: '#475569', fontWeight: 600, textTransform: 'capitalize' }}>{l.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Ism bo'yicha qidirish..." 
                  style={{ 
                    width: '100%', height: 52, borderRadius: 12, border: '1px solid #e2e8f0',
                    padding: '0 16px 0 48px', fontSize: 16, color: '#1e293b', outline: 'none',
                    background: '#f8fafc', transition: 'all 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                   <Icons.Search size={22} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              className="hover-scale" style={{ 
              width: '100%', height: 52, background: '#fff', border: '2px solid #4f46e5', borderRadius: 12, 
              color: '#4f46e5', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              marginBottom: 16
            }}>
              {isBalanceHidden ? <Icons.Eye size={22} color="#4f46e5" /> : <Icons.EyeOff size={22} color="#4f46e5" />}
              {isBalanceHidden ? "BALANSNI KO'RSATISH" : "BALANSNI YOPISH"}
            </button>

            <button className="hover-scale" style={{ 
              width: '100%', height: 56, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', borderRadius: 12, 
              color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)',
              marginBottom: 24
            }}>
              O'QUVCHILARNI FAOLLASHTRISH
            </button>

            {/* Student Table/List */}
            <div style={{ display: 'flex', padding: '20px 24px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ width: '50px', fontSize: 14, fontWeight: 700, color: '#475569' }}>ID</div>
              <div style={{ width: '200px', fontSize: 14, fontWeight: 700, color: '#475569' }}>Ism familiya</div>
              <div style={{ width: '160px', fontSize: 14, fontWeight: 700, color: '#475569' }}>Telefon raqam</div>
              <div style={{ width: '100px', fontSize: 14, fontWeight: 700, color: '#475569', textAlign: 'center' }}>Holat</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#475569', textAlign: 'right' }}>Balans</div>
            </div>

            {studentsData.slice(1).map((s, idx) => (
              <div key={s.id} style={{ 
                display: 'flex', alignItems: 'center', padding: '24px', background: '#fff', borderRadius: 16, 
                border: '1px solid #e2e8f0', marginBottom: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s'
              }} className="student-row">
                <div style={{ width: '50px', fontSize: 15, color: '#64748b' }}>{idx + 1}</div>
                <div style={{ width: '200px', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{s.name}</div>
                <div style={{ width: '160px', fontSize: 15, color: '#64748b' }}>{s.phone}</div>
                <div style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #10b981', 
                    borderRadius: 12, padding: '6px 12px', color: '#059669', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: '#fff'
                  }}>
                    Faol <Icons.ChevronDown size={14} />
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'right', minWidth: 160 }}>
                  <div style={{ 
                    display: 'inline-block', border: '1.5px solid #ef4444', borderRadius: 24, padding: isBalanceHidden ? '8px 20px' : '8px 20px', 
                    color: '#dc2626', fontSize: 15, fontWeight: 700, background: '#fef2f2', whiteSpace: 'nowrap',
                    minWidth: isBalanceHidden ? 120 : 'auto', textAlign: isBalanceHidden ? 'center' : 'right'
                  }}>
                    {isBalanceHidden ? (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Icons.EyeOff size={18} color="#dc2626" />
                      </div>
                    ) : (
                      <>{s.balance}{s.id === 3 ? '....' : '...'}</>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="hover-scale" style={{ 
                background: 'none', border: 'none', color: '#ef4444', fontSize: 14, 
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 
              }}>
                <Icons.Warning size={16} color="#ef4444" />
                ARXIVDAGI O'QUVCHILARNI KO'RISH
              </button>
            </div>
          </div>
        </div>
      )}

      {isSidebarCollapsed && !isMobile && (
        <button 
          onClick={() => setIsSidebarCollapsed(false)}
          className="hover-scale"
          style={{ 
            position: 'absolute', left: 24, top: 40, zIndex: 10,
            width: 36, height: 36, borderRadius: '50%', border: '1px solid #d0d9ff', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3B5BDB',
            boxShadow: '0 4px 12px rgba(59,91,219,0.2)'
          }}
        >
          <div style={{ transform: 'rotate(180deg)', display: 'flex' }}>
            <Icons.ChevronLeft />
          </div>
        </button>
      )}

      {/* Right Main Attendance Panel */}
      <div style={{ flex: 1, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', width: '100%', borderRadius: isSidebarCollapsed ? 12 : 0, transition: 'all 0.3s ease' }}>
        <div style={{ ...styles.tabNav, overflowX: 'auto', whiteSpace: 'nowrap' }} className="no-scrollbar">
          {detailTabs.map((tab, i) => (
            <button 
              key={tab}
              onClick={() => setActiveDetailTab(i)}
              style={{
                ...styles.tab,
                color: activeDetailTab === i ? '#3B5BDB' : '#666',
                borderBottomColor: activeDetailTab === i ? '#3B5BDB' : 'transparent',
                flexShrink: 0
              }}
            >
              {[Icons.People, Icons.GradCap, Icons.Flag, Icons.People, Icons.Chat][i]({ size: 14 })}
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: isSmallMobile ? 12 : 20 }}>
          {activeDetailTab === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Davomat</h3>
                <button className="hover-scale" style={{ 
                  background: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 
                }}>
                  <Icons.Excel size={14} /> EXCEL
                </button>
              </div>

              <div className="no-scrollbar" style={{ display: 'flex', gap: 0, overflowX: 'auto', borderBottom: '1px solid #e8eaed', marginBottom: 16 }}>
                {months.map((m, i) => (
                  <button 
                    key={m}
                    onClick={() => setActiveMonth(i)}
                    style={{
                      padding: '8px 14px', fontSize: 13, border: 'none', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
                      color: activeMonth === i ? '#3B5BDB' : '#666', fontWeight: activeMonth === i ? 600 : 400,
                      borderBottom: activeMonth === i ? '2px solid #3B5BDB' : '2px solid transparent',
                      flexShrink: 0
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div style={{ border: '1px solid #e8eaed', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }} className="no-scrollbar">
                  <table style={{ ...styles.table, minWidth: 800 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ width: 44, border: '1px solid #e2e8f0', background: '#f8fafc' }}></th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: 14, border: '1px solid #e2e8f0', width: 220 }}>Mavzular</th>
                        {currentDates.map((d, i) => (
                          <th key={i} style={{ border: '1px solid #e2e8f0', padding: '8px 4px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                              <Icons.Calendar size={14} color="#94a3b8" />
                              <Icons.Paperclip size={14} color="#94a3b8" />
                            </div>
                          </th>
                        ))}
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ fontSize: 13, fontWeight: 700, color: '#475569', textAlign: 'center', padding: '12px', border: '1px solid #e2e8f0' }}>№</th>
                        <th style={{ fontSize: 13, fontWeight: 700, color: '#475569', padding: '12px 16px', border: '1px solid #e2e8f0', textAlign: 'left' }}>O'quvchilar</th>
                        {currentDates.map((d, i) => (
                          <th key={i} style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', textAlign: 'center', padding: '10px 4px', border: '1px solid #e2e8f0' }}>{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.map((s, idx) => (
                        <tr key={s.id} className="student-row" style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ textAlign: 'center', color: '#64748b', padding: '12px 8px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 600, border: '1px solid #e2e8f0', lineHeight: '1.4', whiteSpace: 'nowrap' }}>{s.name}</td>
                          {currentDates.map((d, si) => {
                            const status = s.attendance[si] || 'absent';
                            return (
                              <td key={si} style={{ border: '1px solid #e2e8f0', textAlign: 'center', padding: '12px 4px' }}>
                                {status === 'locked' && <Icons.Lock size={16} color="#cbd5e0" />}
                                {status === 'present' && <Icons.Check />}
                                {status === 'absent' && <div style={{ width: 24, height: 24, borderRadius: 6, border: '2px solid #cbd5e0', background: 'white', display: 'inline-block', cursor: 'pointer' }} />}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <span style={{ color: '#f44336', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, textAlign: 'right' }}>
                  <Icons.Archive color="#f44336" /> Arxivdagi o'quvchilarni ko'rish
                </span>
              </div>
            </div>
          ) : activeDetailTab === 2 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                <button 
                  onClick={() => setIsExamModalOpen(true)}
                  className="hover-scale" 
                  style={{ 
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' 
                  }}
                >
                  YARATISH
                </button>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ overflowX: 'auto' }} className="no-scrollbar">
                  <table style={{ ...styles.table, minWidth: 900 }}>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '20px 24px', color: '#1e293b', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Nomi</th>
                        <th style={{ textAlign: 'center', padding: '20px 16px', color: '#1e293b', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Topshirish sanasi</th>
                        <th style={{ textAlign: 'center', padding: '20px 16px', color: '#1e293b', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>O'tish bali</th>
                        <th style={{ textAlign: 'center', padding: '20px 16px', color: '#1e293b', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Maksimal bal</th>
                        <th style={{ textAlign: 'center', padding: '20px 16px', color: '#1e293b', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Xona</th>
                        <th style={{ textAlign: 'center', padding: '20px 16px', color: '#1e293b', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Vaqt</th>
                        <th style={{ textAlign: 'center', padding: '20px 16px', color: '#1e293b', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Imtihon oluvchi</th>
                        <th style={{ textAlign: 'right', padding: '20px 24px', color: '#1e293b', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Amallar</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                
                <div style={{ padding: '100px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 320, height: 220, marginBottom: 32, opacity: 0.6 }}>
                    <svg viewBox="0 0 800 600" style={{ width: '100%', height: '100%' }}>
                      <circle cx="400" cy="500" r="150" fill="#f1f5f9" />
                      <rect x="350" y="300" width="100" height="150" rx="4" fill="#6366f1" opacity="0.2" />
                      <rect x="300" y="350" width="100" height="100" rx="4" fill="#6366f1" opacity="0.3" />
                      <rect x="400" y="320" width="100" height="130" rx="4" fill="#6366f1" opacity="0.4" />
                      <path d="M350 450 L450 450 L400 480 Z" fill="#6366f1" opacity="0.5" />
                    </svg>
                  </div>
                  <h4 style={{ fontSize: 24, color: '#94a3b8', fontWeight: 600 }}>Hech qanday ma'lumot yo'q</h4>
                </div>
              </div>
            </div>
          ) : activeDetailTab === 3 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ overflowX: 'auto' }} className="no-scrollbar">
                  <table style={{ ...styles.table, tableLayout: 'auto', minWidth: 900 }}>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '20px 24px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '10%', textTransform: 'uppercase', letterSpacing: '0.05em' }}>O'RIN</th>
                        <th style={{ textAlign: 'left', padding: '20px 16px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '30%', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TALABA ISMI</th>
                        <th style={{ textAlign: 'left', padding: '20px 16px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '20%', textTransform: 'uppercase', letterSpacing: '0.05em' }}>JAMI COINLAR</th>
                        <th style={{ textAlign: 'left', padding: '20px 16px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '25%', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IZOH</th>
                        <th style={{ textAlign: 'right', padding: '20px 24px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '15%', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AMALLAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.map((s, idx) => (
                        <tr key={s.id} style={{ borderBottom: idx === studentsData.length - 1 ? 'none' : '1px solid #f1f5f9' }} className="student-row">
                          <td style={{ padding: '24px 24px', color: '#64748b', fontSize: 15, fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ padding: '24px 16px', color: '#1e293b', fontSize: 16, fontWeight: 600 }}>{s.name}</td>
                          <td style={{ padding: '24px 16px' }}>
                            <div style={{ 
                              width: 40, height: 40, borderRadius: '50%', border: '2px solid #e2e8f0',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
                              fontSize: 15, fontWeight: 700, background: '#f8fafc'
                            }}>0</div>
                          </td>
                          <td style={{ padding: '24px 16px', color: '#94a3b8', fontSize: 15 }}></td>
                          <td style={{ padding: '24px 24px', textAlign: 'right' }}>
                            <button 
                              onClick={() => {
                                setSelectedStudentForCoin(s);
                                setIsCoinModalOpen(true);
                              }}
                              className="hover-scale"
                              style={{ 
                                border: '2px solid #4f46e5', background: '#fff', color: '#4f46e5', borderRadius: 10, 
                                padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#4f46e5'; }}
                            >
                              COIN BERISH
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '20px 32px', gap: 32, borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 15, color: '#64748b', fontWeight: 500 }}>1-3 of 3</span>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <button className="hover-scale" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', color: '#64748b', display: 'flex', padding: 8 }}>
                      <Icons.ChevronLeft size={20} />
                    </button>
                    <button className="hover-scale" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', color: '#64748b', display: 'flex', padding: 8, transform: 'rotate(180deg)' }}>
                      <Icons.ChevronLeft size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeDetailTab === 4 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icons.Warning size={20} color="#64748b" />
                <h3 style={{ fontSize: 20, color: '#1e293b', fontWeight: 700 }}>Izohlar</h3>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ overflowX: 'auto' }} className="no-scrollbar">
                  <table style={{ ...styles.table, tableLayout: 'auto', minWidth: 900 }}>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '20px 24px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '80px', textTransform: 'uppercase' }}>T/R</th>
                        <th style={{ textAlign: 'left', padding: '20px 16px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '220px', textTransform: 'uppercase' }}>O'QUVCHI</th>
                        <th style={{ textAlign: 'left', padding: '20px 16px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>IZOH</th>
                        <th style={{ textAlign: 'left', padding: '20px 16px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '200px', textTransform: 'uppercase' }}>YARATILGAN SANA</th>
                        <th style={{ textAlign: 'center', padding: '20px 24px', color: '#475569', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #e2e8f0', width: '180px', textTransform: 'uppercase' }}>AMALLAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, name: "Abdurahimov Maqsad", comment: "8 sinf 34 maktabda oqiydi oldin hech qayerda oqimagan bugun probni darsga kirdi", date: "2026-04-29 17-47" },
                        { id: 2, name: "Meyirbek Padaybekov", comment: "ikkta lid va ikkta guruh bolib qolgan", date: "2026-04-27 17-59" },
                        { id: 3, name: "Turg'unaliyev Bek", comment: "ko'tarmadi", date: "2026-04-27 17-56" }
                      ].map((c, idx) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="student-row">
                          <td style={{ padding: '24px 24px', color: '#64748b', fontSize: 15, fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ padding: '24px 16px', color: '#1e293b', fontSize: 16, fontWeight: 600 }}>{c.name}</td>
                          <td style={{ padding: '24px 16px', color: '#475569', fontSize: 15, lineHeight: 1.6 }}>{c.comment}</td>
                          <td style={{ padding: '24px 16px', color: '#64748b', fontSize: 15 }}>{c.date}</td>
                          <td style={{ padding: '24px 24px', textAlign: 'center' }}>
                            <button 
                              onClick={() => {
                                setSelectedStudentForNote(c);
                                setIsNoteModalOpen(true);
                              }}
                              className="hover-scale"
                              style={{ 
                                border: '2px solid #4f46e5', background: '#fff', color: '#4f46e5', borderRadius: 10, 
                                padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#4f46e5'; }}
                            >
                              IZOH QO'SHISH
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination for comments */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 24px', gap: 24, borderTop: '1px solid #f0f2f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, color: '#9ba4b5' }}>Rows per page:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <span style={{ fontSize: 14, color: '#4c556f' }}>100</span>
                      <Icons.ChevronDown size={14} color="#9ba4b5" />
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: '#4c556f' }}>1-3 of 3</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ba4b5', display: 'flex', padding: 4 }}>
                      <Icons.ChevronLeft size={20} />
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ba4b5', display: 'flex', padding: 4, transform: 'rotate(180deg)' }}>
                      <Icons.ChevronLeft size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeDetailTab === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: '#5b6582' }}>Baho</h3>
                
                <div style={{ 
                  background: '#FFA000', color: 'white', padding: '8px 16px', borderRadius: 20, 
                  fontSize: 13, fontWeight: 500, display: isMobile ? 'none' : 'block'
                }}>
                  Baholash tizimi: Standart 100 ballik baholash tizimi (default)
                </div>

                <button className="hover-scale" style={{ 
                  background: '#fff', color: '#4CAF50', border: '1px solid #4CAF50', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 
                }}>
                  <Icons.Excel size={14} color="#4CAF50" /> EXCEL
                </button>
              </div>

              {isMobile && (
                <div style={{ 
                  background: '#FFA000', color: 'white', padding: '8px 16px', borderRadius: 12, 
                  fontSize: 12, fontWeight: 500, marginBottom: 16, textAlign: 'center'
                }}>
                  Baholash tizimi: Standart 100 ballik baholash tizimi (default)
                </div>
              )}

              <div style={{ display: 'flex', borderBottom: '1px solid #e8eaed', marginBottom: 20, overflowX: 'auto', alignItems: 'center' }} className="no-scrollbar">
                {months.map((m, i) => (
                  <button 
                    key={m}
                    onClick={() => setActiveMonth(i)}
                    style={{
                      padding: '8px 14px', fontSize: 13, border: 'none', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
                      color: activeMonth === i ? '#3B5BDB' : '#666', fontWeight: activeMonth === i ? 600 : 400,
                      borderBottom: activeMonth === i ? '2px solid #3B5BDB' : '2px solid transparent',
                      flexShrink: 0
                    }}
                  >
                    {m}
                  </button>
                ))}
                <div style={{ marginLeft: 'auto', padding: '0 8px', color: '#999' }}>
                  <Icons.ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                </div>
              </div>

              <div style={{ border: '1px solid #e8eaed', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }} className="no-scrollbar">
                  <table style={{ ...styles.table, minWidth: 900 }}>
                    <thead style={{ background: '#f0f5ff' }}>
                      <tr>
                        <th style={{ width: 60, padding: '12px', border: '1px solid #e8eaed', color: '#5b6582', fontSize: 13 }}>№</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: '#5b6582', fontSize: 13, border: '1px solid #e8eaed', width: 220 }}>O'quvchilar</th>
                        {currentDates.map((d, i) => (
                          <th key={i} style={{ border: '1px solid #e8eaed', padding: '12px', textAlign: 'center', color: '#5b6582', fontSize: 14, fontWeight: 600 }}>
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.map((s, idx) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #e8eaed' }}>
                          <td style={{ textAlign: 'center', color: '#1a1a2e', padding: '16px 8px', border: '1px solid #e8eaed', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ padding: '16px 12px', border: '1px solid #e8eaed' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>GPA: 0</div>
                          </td>
                          {currentDates.map((d, si) => (
                            <td key={si} style={{ border: '1px solid #e8eaed', textAlign: 'center', padding: '12px 8px' }}>
                              <div style={{ 
                                width: '100%', height: 44, borderRadius: 8, border: '1px solid #e0e4ec',
                                background: '#fff', cursor: 'pointer'
                              }} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <span style={{ color: '#f44336', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14, border: '1.5px solid #f44336', borderRadius: '50%' }}>
                    <Icons.ChevronDown size={10} style={{ transform: 'rotate(180deg)' }} color="#f44336" />
                  </div>
                  ARXIVDAGI O'QUVCHILARNI KO'RISH
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: '#999', fontSize: 14, textAlign: 'center', padding: 20 }}>
              <div style={{ opacity: 0.2, marginBottom: 12 }}><Icons.Chat size={48} /></div>
              {detailTabs[activeDetailTab]} bo'limi tez orada ishga tushadi
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TasksView = () => (
    <div style={{ padding: isSmallMobile ? '24px 16px' : '48px 48px', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontSize: isSmallMobile ? 28 : 36, fontWeight: 800, color: '#0f172a', marginBottom: 40, letterSpacing: '-0.02em' }}>Vazifalar</h1>
        
        {/* Filters Bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
              <Icons.Search size={22} />
            </div>
            <input 
              type="text" 
              placeholder="O'quvchini qidirish..." 
              style={{ 
                width: '100%', height: 60, background: '#fff', border: '2px solid #e2e8f0', borderRadius: 15,
                padding: '0 20px 0 54px', fontSize: 16, color: '#1e293b', outline: 'none', transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }} 
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          <div style={{ width: isMobile ? '100%' : 360, position: 'relative' }}>
            <div style={{ 
              height: 60, background: '#fff', border: '2px solid #e2e8f0', borderRadius: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px',
              cursor: 'pointer', color: '#1e293b', fontSize: 16, fontWeight: 600,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icons.Filter size={20} color="#4f46e5" />
                Barcha guruhlar
              </div>
              <Icons.ChevronDown size={16} color="#64748b" />
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <div style={{ overflowX: 'auto' }} className="no-scrollbar">
            <table style={{ ...styles.table, tableLayout: 'auto', minWidth: 1200 }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ width: 80, padding: '24px 20px', borderBottom: '2px solid #f1f5f9', textAlign: 'center' }}>
                    <div style={{ width: 22, height: 22, border: '2px solid #cbd5e1', borderRadius: 6, margin: '0 auto' }} />
                  </th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TARTIB</th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>O'QUVCHI NOMI</th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GURUH</th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TELEFON RAQAMI</th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>JAMI VAZIFALARI</th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOPSHIRILGAN</th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TEKSHIRILMAGAN</th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>O'RTACHA BALL</th>
                  <th style={{ padding: '24px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AMALLAR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: "Turg'unaliyev Bek", group: "IT 2(Shomuhammad)", phone: "+998942471185" },
                  { id: 2, name: "Meyirbek Padaybekov", group: "IT 2(Shomuhammad)", phone: "+998958853405" },
                  { id: 3, name: "Abdurahimov Maqsad", group: "IT 2(Shomuhammad)", phone: "+998950033179" }
                ].map((s, i) => (
                  <tr key={s.id} className="student-row" style={{ borderBottom: i === 2 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px', textAlign: 'center' }}>
                      <div style={{ width: 22, height: 22, border: '2px solid #cbd5e1', borderRadius: 6, margin: '0 auto' }} />
                    </td>
                    <td style={{ padding: '20px 16px', color: '#64748b', fontSize: 15, fontWeight: 600 }}>{s.id}</td>
                    <td style={{ padding: '20px 16px', color: '#1e293b', fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap' }}>{s.name}</td>
                    <td style={{ padding: '20px 16px' }}>
                      <span style={{ 
                        border: '2px solid #e0e7ff', color: '#4338ca', borderRadius: 20, padding: '6px 16px', 
                        fontSize: 14, fontWeight: 700, background: '#f5f7ff', whiteSpace: 'nowrap' 
                      }}>{s.group}</span>
                    </td>
                    <td style={{ padding: '20px 16px', color: '#475569', fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap' }}>{s.phone}</td>
                    <td style={{ padding: '20px 16px', textAlign: 'center', color: '#1e293b', fontSize: 16, fontWeight: 700 }}>0</td>
                    <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                      <div style={{ minWidth: 44, height: 32, borderRadius: 10, background: '#ecfdf5', border: '2px solid #10b981', color: '#047857', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, padding: '0 8px' }}>0</div>
                    </td>
                    <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                      <div style={{ minWidth: 44, height: 32, borderRadius: 10, background: '#fef2f2', border: '2px solid #ef4444', color: '#b91c1c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, padding: '0 8px' }}>0</div>
                    </td>
                    <td style={{ padding: '20px 16px', textAlign: 'center', color: '#ef4444', fontSize: 16, fontWeight: 800 }}>0.0</td>
                    <td style={{ padding: '20px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => {
                            setSelectedStudentForTask(s);
                            setIsTaskModalOpen(true);
                          }}
                          className="hover-scale"
                          style={{ 
                            border: '2px solid #4f46e5', background: '#fff', color: '#4f46e5', borderRadius: 10, 
                            padding: '10px 20px', fontSize: 13, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#4f46e5'; }}
                        >VAZIFA BERISH</button>
                        <button style={{ 
                          border: '2px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', borderRadius: 10, 
                          padding: '10px 20px', fontSize: 13, fontWeight: 800, cursor: 'not-allowed', whiteSpace: 'nowrap'
                        }}>TEKSHIRISH</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.app}>
      <header style={{ ...styles.navbar, padding: isSmallMobile ? '0 12px' : '0 20px' }}>
        <div style={styles.logo} onClick={() => setCurrentView('dashboard')}>
          <Icons.SnakeLogo />
          <span style={{ ...styles.logoText, display: isSmallMobile ? 'none' : 'block' }}>Alouddin</span>
        </div>
        <div style={{ ...styles.searchContainer, display: isSmallMobile ? 'none' : 'block' }}>
          <input type="text" placeholder="Qidirish..." style={styles.searchInput} />
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            <Icons.ChevronDown size={14} />
          </div>
        </div>
        <div style={{ ...styles.navRight, gap: isSmallMobile ? 12 : 20 }}>
          {!isSmallMobile && <button style={styles.iconBtn} className="hover-scale"><Icons.QR /></button>}
          <div style={{ ...styles.branchSelect, display: isSmallMobile ? 'none' : 'flex' }} className="hover-scale">
            Alouddin Filliali
            <Icons.ChevronDown size={14} />
          </div>
          
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setIsLangOpen(!isLangOpen)}
              style={{ ...styles.iconBtn, width: 'auto', padding: '0 8px', gap: 4, position: 'relative' }} 
              className="hover-scale"
            >
              <img src={currentLang.flag} style={styles.flag} alt={currentLang.code} />
              <Icons.ChevronDown size={14} />
            </div>
            
            {isLangOpen && (
              <>
                <div 
                  style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
                  onClick={() => setIsLangOpen(false)} 
                />
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  background: '#fff', border: '1px solid #e8eaed', borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden',
                  minWidth: 140, padding: 4
                }}>
                  {languages.map(lang => (
                    <div 
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        setIsLangOpen(false);
                      }}
                      style={{
                        padding: '10px 12px', fontSize: 13, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 10,
                        borderRadius: 8, transition: 'background 0.2s',
                        background: currentLang.code === lang.code ? '#eff3ff' : 'transparent',
                        color: currentLang.code === lang.code ? '#3B5BDB' : '#1a1a2e',
                        fontWeight: currentLang.code === lang.code ? 600 : 400
                      }}
                    >
                      <img src={lang.flag} style={{ width: 20, height: 14, borderRadius: 2 }} alt={lang.code} />
                      {lang.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ position: 'relative', cursor: 'pointer', color: '#666' }}>
            <Icons.Bell />
          </div>
          <div style={styles.avatarContainer}>
            <div style={styles.onlineDot} />
          </div>
        </div>
      </header>
      
      <div style={{ ...styles.subNav, overflowX: 'auto', whiteSpace: 'nowrap' }} className="no-scrollbar">
        <button 
          onClick={() => setCurrentView('dashboard')}
          style={{ 
            ...styles.navBtn, 
            backgroundColor: (currentView === 'dashboard' || currentView === 'group-detail') ? '#3B5BDB' : 'transparent', 
            color: (currentView === 'dashboard' || currentView === 'group-detail') ? 'white' : '#666' 
          }}
        >
          <Icons.Home color={(currentView === 'dashboard' || currentView === 'group-detail') ? 'white' : '#666'} /> Guruhlar
        </button>
        <button 
          onClick={() => setCurrentView('tasks')}
          style={{ 
            ...styles.navBtn, 
            backgroundColor: currentView === 'tasks' ? '#3B5BDB' : 'transparent', 
            color: currentView === 'tasks' ? 'white' : '#666' 
          }}
        >
          <Icons.Home color={currentView === 'tasks' ? 'white' : '#666'} /> Vazifalar
        </button>
      </div>

      {currentView === 'dashboard' ? <DashboardView /> : 
       currentView === 'tasks' ? <TasksView /> : 
       <GroupDetailView />}
      <TaskModal />
      <ExamModal />
      <CoinModal />
      <NoteModal />
      <LeaveModal />
    </div>
  );
}
