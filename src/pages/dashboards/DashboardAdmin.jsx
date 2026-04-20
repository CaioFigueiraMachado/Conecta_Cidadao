import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, FileWarning, CheckCircle, ShieldAlert, TrendingUp, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { getAllReports, getAllUsers, getPartnerRequests, resolvePartnerRequest } from '../../services/storage';
import { Link } from 'react-router-dom';

export default function DashboardAdmin() {
  const [reports] = useState(getAllReports());
  const [users] = useState(getAllUsers());
  const [partnerRequests, setPartnerRequests] = useState(getPartnerRequests());

  const handleResolve = (id, accept) => {
    resolvePartnerRequest(id, accept);
    setPartnerRequests(getPartnerRequests());
    
    if (accept) {
      const req = partnerRequests.find(r => r.id === id);
      alert(`Parceria Aprovada! 🏢\n\nUma conta foi criada automaticamente para a empresa.\n\nE-mail de acesso: ${req.email}\nSenha provisória: 123\n\n(A empresa poderá alterar a senha pelo painel de Perfil depois)`);
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

  const categorias = reports.reduce((acc, r) => {
    if (r.categoria) acc[r.categoria] = (acc[r.categoria] || 0) + 1;
    return acc;
  }, {});
  const topCategorias = Object.entries(categorias).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <DashboardLayout title="Painel de Controle Administrativo">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-500 group">
            <div className={`w-16 h-16 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <s.icon size={28} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-800">{s.value}</span>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full mb-1">+8%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
        
        {/* Gráfico / Taxa de Resolução */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl"><TrendingUp size={24} /></div>
              <h3 className="text-xl font-black">Performance Global</h3>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Taxa de Resolução</p>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-6xl font-black">{taxaResolucao}%</span>
              <ArrowUpRight className="text-green-400 mb-2" />
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${taxaResolucao}%` }}></div>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase">{resolvidos} de {totalOcorrencias} demandas resolvidas</p>
          </div>
        </div>

        {/* Categorias */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-800">Principais Demandas</h3>
            <Link to="/mapa" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Mapa Completo</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {topCategorias.map(([cat, count]) => (
              <div key={cat} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-700">{cat}</span>
                  <span className="text-xs font-bold text-slate-400">{Math.round((count / totalOcorrencias) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.round((count / totalOcorrencias) * 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Atividade */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">Histórico do Sistema</h3>
          <div className="flex gap-4">
            <Link to="/dashboard/admin/usuarios" className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">Gestão de Usuários</Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo / Título</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.slice(0, 6).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center font-black text-xs">#{r.id.toString().slice(-3)}</div>
                      <span className="text-sm font-black text-slate-800">{r.titulo}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-xs font-bold text-slate-500">{r.local}</td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase ${
                      r.status === 'Resolvido' ? 'bg-green-50 text-green-600' : 
                      r.status === 'Em andamento' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-10 py-6 text-right text-[10px] font-black text-slate-300 uppercase">{r.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Solicitações de Parceria */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden mt-10">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-blue-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg"><ShieldCheck size={24} /></div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Aprovações de Parceiros</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {partnerRequests.filter(r => r.status === 'Pendente').length} pendentes
              </p>
            </div>
          </div>
        </div>
        <div className="p-8">
          {partnerRequests.length === 0 ? (
             <p className="text-center text-slate-400 py-10 font-bold uppercase tracking-widest text-sm">Nenhuma solicitação encontrada</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnerRequests.map(req => (
                <div key={req.id} className="border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-[1rem] text-[10px] font-black uppercase tracking-widest ${
                    req.status === 'Pendente' ? 'bg-orange-100 text-orange-600' :
                    req.status === 'Aprovado' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {req.status}
                  </div>
                  <h4 className="text-lg font-black text-slate-800 mb-1">{req.empresa}</h4>
                  <p className="text-xs font-bold text-slate-400 mb-4">{req.cnpj}</p>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-slate-600"><strong>Responsável:</strong> {req.responsavel} ({req.cargo})</p>
                    <p className="text-sm text-slate-600"><strong>Contato:</strong> {req.email} | {req.telefone}</p>
                    <div className="bg-slate-50 p-4 rounded-2xl mt-4">
                      <p className="text-xs text-slate-500 italic">"{req.ideia}"</p>
                    </div>
                  </div>

                  {req.status === 'Pendente' && (
                    <div className="flex gap-4">
                      <button onClick={() => handleResolve(req.id, true)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all text-[10px] shadow-lg shadow-green-200">
                        Aprovar Parceria
                      </button>
                      <button onClick={() => handleResolve(req.id, false)} className="flex-1 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 font-black uppercase tracking-widest py-4 rounded-xl transition-all text-[10px]">
                        Recusar
                      </button>
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
