import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, LogOut, LayoutDashboard, ChevronDown, User } from 'lucide-react';
import { getSystemConfig } from '../services/storage';

export default function Header() {
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

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/quem-somos', label: 'Quem Somos' },
    { to: '/problematica', label: 'Problemática' },
    { to: '/mapa', label: 'Mapa Interativo' },
    { to: '/parceiro', label: 'Seja Parceiro' },
    { to: '/beneficios', label: 'Benefícios' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt={`Logo ${platformName}`} className="w-10 h-10 object-contain" />
              <span className="font-bold text-xl text-slate-800 leading-tight">
                {platformName.split(' ')[0]} <span className="font-normal text-slate-500">{platformName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Área do Usuário */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm overflow-hidden">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="hidden sm:block text-left mr-1">
                    <p className="text-sm font-medium text-gray-700 max-w-[120px] truncate leading-tight">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{user.role}</p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to={`/dashboard/${user.role}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LayoutDashboard size={18} /> Meu Dashboard
                    </Link>

                    <Link
                      to="/perfil"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} /> Perfil
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
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-full transition-colors shadow-sm"
              >
                Entrar / Cadastrar
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
