import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, List, Map as MapIcon, Award, User, LogOut, Settings, Bell, Search, Menu, ChevronDown, Sparkles, Star } from 'lucide-react';
import { getSystemConfig } from '../services/storage';

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const platformName = getSystemConfig().platformName || 'Conecta Cidadão';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLinks = () => {
    const base = [
      { path: `/dashboard/${user?.role}`, icon: Home, label: user?.role === 'parceiro' ? 'Painel do Parceiro' : 'Visão Geral' },

    ];

    if (user?.role === 'orgao') {
      base.splice(1, 0, { path: '/dashboard/orgao/demandas', icon: List, label: 'Fila de Demandas' });
      base.splice(2, 0, { path: '/dashboard/orgao/mapa', icon: MapIcon, label: 'Mapa Operacional' });
    } else if (user?.role === 'admin') {
      base.splice(1, 0, { path: '/dashboard/admin/usuarios', icon: User, label: 'Gestão de Usuários' });
      base.splice(2, 0, { path: '/dashboard/admin/config', icon: Settings, label: 'Configurações' });
    }

    const insertIdx = base.length - 1; // Insere antes de 'Meu Perfil'

    if (user?.role !== 'cidadao') {
      base.splice(insertIdx, 0, { path: '/dashboard/cidadao', icon: Sparkles, label: 'Área do Cidadão' });
      base.splice(insertIdx + 1, 0, { path: '/dashboard/cidadao/ocorrencias', icon: List, label: 'Minhas Ocorrências' });

      base.splice(insertIdx + 3, 0, { path: '/dashboard/cidadao/pontos', icon: Star, label: 'Meus Pontos' });
    } else {
      base.splice(1, 0, { path: '/dashboard/cidadao/ocorrencias', icon: List, label: 'Minhas Ocorrências' });
      base.splice(2, 0, { path: '/beneficios', icon: Award, label: 'Catálogo de Prêmios' });
      base.splice(3, 0, { path: '/dashboard/cidadao/pontos', icon: Star, label: 'Meus Pontos' });
    }

    return base;
  };

  const links = getLinks();

  return (
    <div className="flex h-screen bg-[#F8FAFC]">

      {/* Sidebar - Premium Design */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo Section */}
        <div className="h-24 flex items-center px-8">
          <Link to="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt={`Logo ${platformName}`} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl text-slate-800 leading-tight">
              {platformName.split(' ')[0]} <span className="font-normal text-slate-500">{platformName.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>
        </div>

        {/* User Quick Info */}
        <div className="px-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black border border-slate-100 overflow-hidden">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="User" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 ml-4">Menu Principal</p>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-6 border-t border-slate-100">
          <button
            onClick={logout}
            className="flex items-center gap-4 px-4 py-4 w-full rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
          >
            <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100"><LogOut size={20} /></div>
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500"><Menu size={24} /></button>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">{title || 'Dashboard'}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Busca global..." className="bg-transparent border-none focus:ring-0 text-xs font-medium w-48" />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors mr-2">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm overflow-hidden">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight max-w-[100px] truncate">{user?.name}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">{user?.role}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs font-medium text-slate-500 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to={`/dashboard/${user?.role}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Home size={18} /> Meu Dashboard
                  </Link>

                  <Link
                    to="/perfil"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={18} /> Perfil e Configurações
                  </Link>

                  <div className="h-px bg-slate-50 my-1"></div>

                  <button
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={18} /> Sair da Conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-6 md:p-10">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
