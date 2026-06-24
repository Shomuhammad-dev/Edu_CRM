import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Lock, User, AlertCircle, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

type FormMode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<FormMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher'>('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (mode === 'register') {
      setPassword('12345');
    } else {
      setPassword('');
    }
    setError('');
    setSuccess('');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const body = mode === 'login' ? { username, password } : { username, name, role };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user);
        setSuccess(mode === 'login' ? 'Tizimga muvaffaqiyatli kirdingiz' : 'Ro‘yxatdan o‘tish muvaffaqiyatli bajarildi');
      } else {
        setError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError("Serverga bog'lanishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-200 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-3xl">A</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">Alouddin CRM</h1>
              <p className="text-slate-400 text-sm mt-1">Tizimga kirish uchun ma'lumotlarni kiriting</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-3 rounded-2xl font-semibold transition ${mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Kirish
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-3 rounded-2xl font-semibold transition ${mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || success) && (
              <div className={`p-3 rounded-xl flex items-center gap-3 text-sm ${error ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-600'}`}>
                <AlertCircle size={18} />
                <span>{error || success}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Login</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Ism</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Ali"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Rol</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'teacher')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">O'qituvchi</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Parol</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => mode === 'login' && setPassword(e.target.value)}
                  placeholder={mode === 'register' ? '12345' : '••••••••'}
                  required
                  disabled={mode === 'register'}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`
                w-full py-4 ${mode === 'login' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]
                flex items-center justify-center gap-2
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                  <span>{mode === 'login' ? 'KIRISH' : 'RO‘YXATDAN O‘TISH'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Test ma'lumotlari</p>
            <div className="flex flex-col gap-3 text-xs font-medium text-slate-500">
              <div className="flex flex-col gap-1">
                <span className="text-indigo-600 font-bold">Admin:</span>
                <span>admin / root</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-indigo-600 font-bold">O'qituvchi:</span>
                <span>teacher / teacher123</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-emerald-600 font-bold">Ro'yxatdan o'tish uchun:</span>
                <span>parol avtomatik 12345</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
