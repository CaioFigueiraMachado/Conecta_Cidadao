import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, FileWarning, CheckCircle, ShieldAlert, TrendingUp, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { getAllReports, getAllUsers, getPartnerRequests, resolvePartnerRequest } from '../../services/storage';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function DashboardAdmin() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [partnerRequests, setPartnerRequests] = useState([]);

  const loadData = async () => {
    const [r, u, pr] = await Promise.all([getAllReports(), getAllUsers(), getPartnerRequests()]);
    setReports(r); setUsers(u); setPartnerRequests(pr);
  };

  useEffect(() => { loadData(); }, []);

  const handleResolve = async (id, accept) => {
    const req = partnerRequests.find(r => r.id === id);
    await resolvePartnerRequest(id, accept);
    await loadData();
    if (accept && req) {
      Swal.fire({
        icon: 'success', title: 'Parceria Aprovada! 🏢',
        html: `Conta criada.<br><b>E-mail:</b> ${req.email}<br><b>Senha:</b> 123`,
        confirmButtonColor: '#2563eb'
      });
    }
  };

  const pendentes = reports.filter(r => r.status === 'Pendente').length;
  const resolvidos = reports.filter(r => r.status === 'Resolvido').length;
  const emAndamento = reports.filter(r => r.status === 'Em andamento').length;
  const totalOcorrencias = reports.length;
  const taxaResolucao = totalOcorrencias > 0 ? Math.round((resolvidos / totalOcorrencias) * 100) : 0;

  const stats = [
    { label: 'Usuários Ativos', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pendentes', value: pendentes, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Em Execução', value: emAndamento, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Resolvidos', value: resolvidos, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' }
  ];

  const categorias = reports.reduce((acc, r) => { if (r.categoria) acc[r.categoria] = (acc[r.categoria] || 0) + 1; return acc; }, {});
  const topCategorias = Object.entries(categorias).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <DashboardLayout title="Painel de Administração">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><s.icon size={22} /></div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-lg">+8%</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{s.label}</p>
            <span className="text-3xl font-bold text-slate-800">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-4 bg-blue-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6"><div className="bg-white/20 p-2.5 rounded-lg"><TrendingUp size={20} /></div><h3 className="text-lg font-bold">Performance</h3></div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Taxa de Resolução</p>
            <div className="flex items-end gap-3 mb-4"><span className="text-5xl font-bold">{taxaResolucao}%</span><ArrowUpRight className="text-green-300 mb-2" size={20} /></div>
            <div className="w-full bg-blue-900/40 rounded-full h-2 mb-3"><div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${taxaResolucao}%` }}></div></div>
            <p className="text-blue-200 text-xs font-bold">{resolvidos} de {totalOcorrencias} demandas resolvidas</p>
          </div>
        </div>
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8"><h3 className="text-lg font-bold text-slate-800">Principais Demandas</h3><Link to="/mapa" className="text-xs font-bold text-blue-600 hover:underline">Ver Mapa</Link></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {topCategorias.map(([cat, count]) => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-700">{cat}</span><span className="text-xs font-bold text-slate-400">{Math.round((count / totalOcorrencias) * 100)}%</span></div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.round((count / totalOcorrencias) * 100)}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Histórico do Sistema</h3>
          <Link to="/dashboard/admin/usuarios" className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600">Gestão de Usuários</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Protocolo / Título</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Localização</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Data</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {reports.slice(0, 6).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center font-bold text-[10px]">#{String(r.id).slice(-3)}</div><span className="font-semibold text-slate-800">{r.titulo}</span></div></td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{r.local}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${r.status === 'Resolvido' ? 'bg-green-100 text-green-600' : r.status === 'Em andamento' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>{r.status}</span></td>
                  <td className="px-6 py-4 text-right text-xs font-medium text-slate-400">{r.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-blue-50/30">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md"><ShieldCheck size={20} /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Aprovações de Parceiros</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{partnerRequests.filter(r => r.status === 'Pendente').length} pendentes</p>
          </div>
        </div>
        <div className="p-6">
          {partnerRequests.length === 0 ? (
            <p className="text-center text-slate-400 py-8 text-sm">Nenhuma solicitação encontrada</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerRequests.map(req => (
                <div key={req.id} className="border border-slate-100 rounded-2xl p-5 hover:border-blue-200 transition-all relative shadow-sm">
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[9px] font-bold uppercase tracking-wider ${req.status === 'Pendente' ? 'bg-orange-100 text-orange-600' : req.status === 'Aprovado' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{req.status}</div>
                  <h4 className="font-bold text-slate-800 mb-0.5">{req.empresa}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mb-3">{req.cnpj}</p>
                  <div className="space-y-1 mb-4">
                    <p className="text-xs text-slate-600"><strong>Contato:</strong> {req.email}</p>
                    <div className="bg-slate-50 p-3 rounded-xl mt-2"><p className="text-[11px] text-slate-500 italic">"{req.ideia}"</p></div>
                  </div>
                  {req.status === 'Pendente' && (
                    <div className="flex gap-3">
                      <button onClick={() => handleResolve(req.id, true)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-xs">Aprovar</button>
                      <button onClick={() => handleResolve(req.id, false)} className="flex-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold py-2 rounded-lg text-xs">Recusar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
