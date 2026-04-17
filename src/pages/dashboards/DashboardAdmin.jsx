import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, FileWarning, CheckCircle, ShieldAlert, TrendingUp, Clock } from 'lucide-react';
import { getAllReports, getAllUsers } from '../../services/storage';
import { Link } from 'react-router-dom';

export default function DashboardAdmin() {
  const [reports] = useState(getAllReports());
  const [users] = useState(getAllUsers());

  const pendentes = reports.filter(r => r.status === 'Pendente').length;
  const resolvidos = reports.filter(r => r.status === 'Resolvido').length;
  const emAndamento = reports.filter(r => r.status === 'Em andamento').length;
  const totalOcorrencias = reports.length;
  const taxaResolucao = totalOcorrencias > 0 ? Math.round((resolvidos / totalOcorrencias) * 100) : 0;

  // Contagem por categoria
  const categorias = reports.reduce((acc, r) => {
    if (r.categoria) acc[r.categoria] = (acc[r.categoria] || 0) + 1;
    return acc;
  }, {});
  const topCategorias = Object.entries(categorias).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <DashboardLayout title="Painel de Administração">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Users size={22} /></div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Usuários</p>
            <p className="text-2xl font-bold text-slate-800">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-red-100 text-red-500 p-3 rounded-xl"><ShieldAlert size={22} /></div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Pendentes</p>
            <p className="text-2xl font-bold text-slate-800">{pendentes}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl"><Clock size={22} /></div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Em Andamento</p>
            <p className="text-2xl font-bold text-slate-800">{emAndamento}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-xl"><CheckCircle size={22} /></div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Resolvidos</p>
            <p className="text-2xl font-bold text-slate-800">{resolvidos}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Taxa de Resolução */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={22} className="text-blue-200" />
            <h3 className="font-bold text-lg">Taxa de Resolução</h3>
          </div>
          <div className="text-5xl font-extrabold mb-2">{taxaResolucao}%</div>
          <p className="text-blue-200 text-sm mb-4">{resolvidos} de {totalOcorrencias} ocorrências resolvidas</p>
          <div className="w-full bg-blue-900/40 rounded-full h-2">
            <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${taxaResolucao}%` }}></div>
          </div>
        </div>

        {/* Top Categorias */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <FileWarning size={20} className="text-orange-500" /> Categorias Mais Reportadas
          </h3>
          {topCategorias.length === 0 ? (
            <p className="text-slate-400 text-sm">Nenhuma ocorrência registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {topCategorias.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{cat}</span>
                    <span className="text-slate-400">{count} ocorrência{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.round((count / totalOcorrencias) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Link to="/dashboard/admin/usuarios" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><Users size={22} /></div>
            <div>
              <p className="font-bold text-slate-800">Gerenciar Usuários</p>
              <p className="text-xs text-slate-500">{users.length} cadastrados</p>
            </div>
          </div>
        </Link>
        <Link to="/mapa" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-3 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors"><CheckCircle size={22} /></div>
            <div>
              <p className="font-bold text-slate-800">Ver Mapa Global</p>
              <p className="text-xs text-slate-500">{totalOcorrencias} ocorrências no mapa</p>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/admin/config" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors"><ShieldAlert size={22} /></div>
            <div>
              <p className="font-bold text-slate-800">Configurações</p>
              <p className="text-xs text-slate-500">Sistema e plataforma</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Últimas Ocorrências */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Ocorrências Recentes</h3>
          <Link to="/mapa" className="text-sm text-blue-600 hover:underline font-medium">Ver no mapa →</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {reports.length === 0 ? (
            <p className="p-8 text-center text-slate-400">Nenhuma ocorrência registrada ainda.</p>
          ) : reports.slice(0, 5).map(r => (
            <div key={r.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800 text-sm">{r.titulo}</p>
                <p className="text-xs text-slate-400">{r.categoria} · {r.local} · {r.data}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                r.status === 'Resolvido' ? 'bg-green-100 text-green-700' :
                r.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}
