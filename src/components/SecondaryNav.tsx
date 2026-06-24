import { NAV_ITEMS } from '../constants';
import { ChevronDown, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SecondaryNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: (open: boolean) => void;
}

interface DropdownItemProps {
  label: string;
  isActive?: boolean;
  showDot?: boolean;
  showArrow?: boolean;
  onClick: () => void;
}

// Framer Motion Variants
const sidebarVariants = {
  hidden: { x: -400, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20, duration: 0.3 }
  },
  exit: { 
    x: -400, 
    opacity: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20, duration: 0.2 }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

const menuItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
};

function DropdownItem({ label, isActive, showDot, showArrow, onClick }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={
        `w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors ` +
        `${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`
      }
    >
      <div className="flex items-center gap-2">
        {showDot && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
        <span>{label}</span>
      </div>
      {showArrow && <ChevronRight size={14} className="text-slate-400" />}
    </button>
  );
}

export default function SecondaryNav({ activeTab, onTabChange, isMobileMenuOpen, onMobileMenuToggle }: SecondaryNavProps) {
  const { user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (user?.role === 'teacher') {
      return ['dashboard', 'groups'].includes(item.id);
    }
    return true;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        onMobileMenuToggle(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const handleItemClick = (id: string, hasDropdown?: boolean) => {
    if (hasDropdown) {
      setOpenDropdown((current) => (current === id ? null : id));
      return;
    }

    onTabChange(id);
    setOpenDropdown(null);
    onMobileMenuToggle(false);
  };

  const handleLogout = () => {
    onMobileMenuToggle(false);
    logout();
  };

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="hidden md:block bg-white border-b border-slate-200 px-6 py-3 relative z-40" ref={dropdownRef}>
        <div className="flex items-center justify-between gap-4">
          <ul className="flex items-center gap-1">
            {filteredNavItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => handleItemClick(item.id, item.hasDropdown)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative z-10
                    ${activeTab === item.id || (item.id === 'settings' && activeTab.startsWith('settings'))
                      ? 'text-white'
                      : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      size={14}
                      className={activeTab.includes(item.id) ? 'text-white' : 'text-slate-400'}
                    />
                  )}
                  {(activeTab === item.id || (item.id === 'settings' && activeTab.startsWith('settings'))) && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-lg shadow-indigo-100"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {item.hasDropdown && openDropdown === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 overflow-hidden"
                    >
                      {item.id === 'settings' && (
                        <>
                          <DropdownItem
                            label="SMS Sozlamalari"
                            isActive={activeTab === 'settings-sms'}
                            showDot
                            onClick={() => {
                              onTabChange('settings-sms');
                              setOpenDropdown(null);
                            }}
                          />
                          <DropdownItem label="Ofis" showArrow onClick={() => {}} />
                          <DropdownItem label="Formalar" onClick={() => {}} />
                          <DropdownItem label="Amo CRM sozlamalari" onClick={() => {}} />
                        </>
                      )}
                      {item.id === 'reports' && (
                        <>
                          <DropdownItem label="Oylik hisobot" onClick={() => {}} />
                          <DropdownItem label="Kunlik hisobot" onClick={() => {}} />
                          <DropdownItem label="O'quvchilar hisoboti" onClick={() => {}} />
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end pr-4 border-r border-slate-100">
              <span className="text-sm font-semibold text-slate-800 leading-none">{user?.name}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 mt-1 opacity-80">
                {user?.role === 'admin' ? 'Administrator' : "O'qituvchi"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-medium"
            >
              <LogOut size={18} />
              <span className="text-sm">Chiqish</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer with Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => onMobileMenuToggle(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Sidebar Drawer */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 h-screen w-72 bg-white shadow-2xl z-50 md:hidden flex flex-col overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="px-6 py-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Alouddin</p>
                    <p className="text-xs text-indigo-600 font-semibold uppercase">CRM</p>
                  </div>
                </div>
                <button
                  onClick={() => onMobileMenuToggle(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-2">
                  {filteredNavItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      custom={index}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      className="relative"
                    >
                      <button
                        onClick={() => handleItemClick(item.id, item.hasDropdown)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                          ${activeTab === item.id || (item.id === 'settings' && activeTab.startsWith('settings'))
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'text-slate-700 hover:bg-slate-100'}
                        `}
                      >
                        <item.icon size={20} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.hasDropdown && (
                          <motion.div
                            animate={{ rotate: openDropdown === item.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                        )}
                      </button>

                      {/* Dropdown Items */}
                      <AnimatePresence>
                        {item.hasDropdown && openDropdown === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 ml-2 border-l-2 border-indigo-200 pl-2 space-y-1"
                          >
                            {item.id === 'settings' && (
                              <>
                                <button
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                                    activeTab === 'settings-sms'
                                      ? 'bg-indigo-100 text-indigo-700'
                                      : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                  onClick={() => {
                                    onTabChange('settings-sms');
                                    setOpenDropdown(null);
                                    onMobileMenuToggle(false);
                                  }}
                                >
                                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                                  SMS Sozlamalari
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all">
                                  <ChevronRight size={12} />
                                  Ofis
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all">
                                  Formalar
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all">
                                  Amo CRM sozlamalari
                                </button>
                              </>
                            )}
                            {item.id === 'reports' && (
                              <>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all">
                                  Oylik hisobot
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all">
                                  Kunlik hisobot
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all">
                                  O'quvchilar hisoboti
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Sidebar Footer - Logout Button */}
              <div className="px-3 py-4 border-t border-slate-200">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg shadow-rose-200 active:scale-95"
                >
                  <LogOut size={18} />
                  <span>Chiqish</span>
                </motion.button>

                {/* User Info Footer */}
                <div className="mt-4 px-2 py-3 rounded-lg bg-slate-50 text-center border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Siz kirgan sifatida</p>
                  <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-indigo-600 font-semibold mt-1">
                    {user?.role === 'admin' ? 'Administrator' : "O'qituvchi"}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
