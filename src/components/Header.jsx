import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

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
              <img src="/logo.png" alt="Logo Conecta Cidadão" className="w-10 h-10 object-contain" />
              <span className="font-bold text-xl text-slate-800">
                Conecta <span className="font-normal text-slate-500">Cidadão</span>
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
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
              <>
                <Link
                  to={`/dashboard/${user.role}`}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  title="Ir para o painel"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden lg:inline">Painel</span>
                </Link>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <Link to={`/dashboard/${user.role}`} className="text-sm font-medium text-gray-700 hover:text-blue-600 max-w-[120px] truncate hidden sm:block">
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Sair da conta"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
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
