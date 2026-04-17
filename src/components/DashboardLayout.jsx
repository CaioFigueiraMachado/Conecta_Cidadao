import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, List, Map as MapIcon, Award, User, LogOut, Settings } from 'lucide-react';

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Define os links baseados na role
  const getLinks = () => {
    const base = [
      { path: `/dashboard/${user?.role}`, icon: Home, label: 'Visão Geral' },
      { path: '/perfil', icon: User, label: 'Meu Perfil' }
    ];

    if (user?.role === 'cidadao') {
      base.splice(1, 0, { path: '/dashboard/cidadao/ocorrencias', icon: List, label: 'Minhas Ocorrências' });
      base.splice(2, 0, { path: '/dashboard/cidadao/pontos', icon: Award, label: 'Meus Pontos' });
    } else if (user?.role === 'orgao') {
      base.splice(1, 0, { path: '/dashboard/orgao/demandas', icon: List, label: 'Fila de Demandas' });
      base.splice(2, 0, { path: '/dashboard/orgao/mapa', icon: MapIcon, label: 'Mapa Operacional' });
    } else if (user?.role === 'admin') {
      base.splice(1, 0, { path: '/dashboard/admin/usuarios', icon: User, label: 'Gestão de Usuários' });
      base.splice(2, 0, { path: '/dashboard/admin/config', icon: Settings, label: 'Configurações' });
    }
    
    return base;
  };

  const links = getLinks();

  return (
    <div className="flex h-screen bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Conecta Cidadão" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg text-slate-800">
              Conecta <span className="font-normal text-slate-600">Cidadão</span>
            </span>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-blue-700' : 'text-slate-400'} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Mobile / Title */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8">
          <h1 className="text-xl font-semibold text-slate-800">{title || 'Dashboard'}</h1>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children}
        </div>
      </main>

    </div>
  );
}
