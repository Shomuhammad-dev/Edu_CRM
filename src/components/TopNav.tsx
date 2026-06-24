import { Search, MessageSquare, Scan, ChevronDown, Bell, Menu } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: (open: boolean) => void;
}

export default function TopNav({ isMobileMenuOpen, onMobileMenuToggle }: TopNavProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-xl">A</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight hidden sm:block">Alouddin</span>
        </div>

        {/* Mobile Menu Hamburger - Only on Mobile */}
        <button 
          onClick={() => onMobileMenuToggle(true)}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <button className="flex items-center gap-2 bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-100">
          <MessageSquare size={18} />
          <span className="hidden lg:inline">Fikr bildiring</span>
        </button>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Qidirish..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48 lg:w-64 transition-all"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search */}
        <div className="relative group md:hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Qidirish..." 
            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-32 transition-all"
          />
        </div>

        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <Scan size={20} />
        </button>
        
        <button className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <span>TO'LOV</span>
        </button>

        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
          <span className="text-sm font-medium text-slate-700">Alouddin Filiali</span>
          <ChevronDown size={16} className="text-slate-400" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-2 pl-2 sm:pl-4 border-l border-slate-200">
          <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
            <Bell size={20} />
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-slate-500 font-bold group-hover:border-indigo-200 transition-all">
              S
            </div>
            <div className="hidden lg:block">
              <div className="text-sm font-medium text-slate-700">Super Admin</div>
              <div className="text-xs text-slate-500">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-100 w-full justify-center">
              <MessageSquare size={18} />
              <span>Fikr bildiring</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <span className="text-sm font-medium text-slate-700">Alouddin Filiali</span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>

            <div className="flex items-center gap-3 cursor-pointer group justify-center">
              <div className="w-9 h-9 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-slate-500 font-bold group-hover:border-indigo-200 transition-all">
                S
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Super Admin</div>
                <div className="text-xs text-slate-500">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
