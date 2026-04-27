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
  const [platformName, setPlatformName] = useState('Conecta Cidadão');

  useEffect(() => {
    getSystemConfig().then(config => {
      setPlatformName(config.platformName || 'Conecta Cidadão');
    });
  }, []);

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
    const mainLinks = [
      { path: `/dashboard/${user?.role}`, icon: Home, label: user?.role === 'parceiro' ? 'Painel do Parceiro' : 'Visão Geral' },
    ];

    if (user?.role === 'orgao') {
      mainLinks.push({ path: '/dashboard/orgao/demandas', icon: List, label: 'Fila de Demandas' });
      mainLinks.push({ path: '/dashboard/orgao/mapa', icon: MapIcon, label: 'Mapa Operacional' });
    } else if (user?.role === 'admin') {
      mainLinks.push({ path: '/dashboard/admin/usuarios', icon: User, label: 'Gestão de Usuários' });
      mainLinks.push({ path: '/dashboard/admin/config', icon: Settings, label: 'Configurações' });
    }

    const citizenLinks = [];
    if (user?.role !== 'cidadao') {
      citizenLinks.push({ path: '/dashboard/cidadao', icon: Sparkles, label: 'Área do Cidadão' });
      citizenLinks.push({ path: '/dashboard/cidadao/ocorrencias', icon: List, label: 'Minhas Ocorrências' });
      citizenLinks.push({ path: '/beneficios', icon: Award, label: 'Catálogo de Prêmios' });
      citizenLinks.push({ path: '/dashboard/cidadao/pontos', icon: Star, label: 'Meus Pontos' });
    } else {
      // For citizen role, these are part of their main menu
      mainLinks.push({ path: '/dashboard/cidadao/ocorrencias', icon: List, label: 'Minhas Ocorrências' });
      mainLinks.push({ path: '/beneficios', icon: Award, label: 'Catálogo de Prêmios' });
      mainLinks.push({ path: '/dashboard/cidadao/pontos', icon: Star, label: 'Meus Pontos' });
    }

    return [...mainLinks, ...citizenLinks];
  };

  const links = getLinks();

  return (
    <div className="flex h-screen bg-slate-50 font-sans">

      {/* Sidebar - Classic Clean Style */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo Section */}
        <div className="h-24 flex items-center px-8 border-b border-slate-50">
          <Link to="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt={`Logo ${platformName}`} className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl text-slate-800 leading-tight tracking-tight">
              {platformName.split(' ')[0]} <span className="font-normal text-slate-500">{platformName.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>
        </div>

        {/* User Quick Info */}
        <div className="p-6 border-b border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-bold border border-slate-100 overflow-hidden">
               {user?.profilepic || user?.profilePic ? (
                 <img src={user?.profilepic || user?.profilePic} alt="User" className="w-full h-full object-cover" />
               ) : (
                 user?.name?.charAt(0).toUpperCase()
               )}
             </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 ml-4">Menu Principal</p>
          {links.map((link, index) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            // Show "Área do Cidadão" header only once before the first citizen link
            const isCitizenLink = link.path.startsWith('/dashboard/cidadao') || link.path.startsWith('/beneficios');
            const previousIsCitizen = index > 0 && (links[index - 1].path.startsWith('/dashboard/cidadao') || links[index - 1].path.startsWith('/beneficios'));
            const shouldShowCitizenHeader = user?.role !== 'cidadao' && isCitizenLink && !previousIsCitizen;

            return (
              <div key={link.path}>
                {shouldShowCitizenHeader && (
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 mt-6 ml-4">Área do Cidadão</p>
                )}
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {link.label}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title || 'Painel'}</h1>
          </div>

          <div className="flex items-center gap-4">




            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-all"
              >
                   <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200 overflow-hidden shadow-sm">
                   {user?.profilepic || user?.profilePic ? (
                     <img src={user?.profilepic || user?.profilePic} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     user?.name ? user.name.charAt(0).toUpperCase() : '?'
                   )}
                 </div>
                 <div className="hidden md:flex flex-col text-left">
                   <span className="text-xs font-bold text-slate-800 leading-tight max-w-[100px] truncate">{user?.name || 'Usuário'}</span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user?.role || ''}</span>
                 </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs font-medium text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link to="/perfil" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors" onClick={() => setShowUserMenu(false)}>
                    <User size={18} /> Meu Perfil
                  </Link>

                  <button onClick={() => { setShowUserMenu(false); logout(); }} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 w-full transition-colors text-left">
                    <LogOut size={18} /> Sair da Conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
