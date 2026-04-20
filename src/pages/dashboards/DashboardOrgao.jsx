import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllReports, updateReportStatus } from '../../services/storage';
import { AlertCircle, Clock, CheckCircle, BarChart3, TrendingUp, Filter, Search, MoreHorizontal, MapPin, Calendar, ArrowUpRight, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';

export default function DashboardOrgao() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    emAndamento: 0,
    resolvidos: 0,
    eficiencia: 0
  });

  useEffect(() => {
    const all = getAllReports();
    setReports(all);
    
    const pendentes = all.filter(r => r.status === 'Pendente').length;
    const emAndamento = all.filter(r => r.status === 'Em andamento').length;
    const resolvidos = all.filter(r => r.status === 'Resolvido').length;
    const total = all.length;
    const eficiencia = total > 0 ? Math.round((resolvidos / total) * 100) : 0;

    setStats({ total, pendentes, emAndamento, resolvidos, eficiencia });
  }, []);

  const metricas = [
    { label: 'Demandas Totais', value: stats.total, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pendentes Agora', value: stats.pendentes, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Em Execução', value: stats.emAndamento, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Eficiência Urbanística', value: `${stats.eficiencia}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' }
  ];

  return (
    <DashboardLayout title="Central de Operações Urbanas">
      
      {/* Alertas Críticos / Notificações */}
      <div className="mb-10 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-red-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <ShieldAlert size={32} />
            </div>
            <div>
              <p className="text-red-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Alerta Prioritário</p>
              <h3 className="text-xl font-black mb-1">Vazamento Crítico - Zona Sul</h3>
              <p className="text-red-100/80 text-xs font-medium">Equipe enviada. Previsão de chegada: 15 min.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex items-center gap-6 min-w-[300px] hover:shadow-xl hover:border-blue-100 transition-all duration-500">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
            <MessageSquare size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Feedback Médio</p>
            <h4 className="text-2xl font-black text-slate-800 tracking-tight">4.8 / 5.0</h4>
            <p className="text-green-500 text-[10px] font-black uppercase tracking-widest mt-1">Satisfeito</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {metricas.map((m, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-blue-100 transition-all duration-500">
            <div className={`w-16 h-16 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <m.icon size={28} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{m.label}</p>
            <p className="text-4xl font-black text-slate-800">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Área de Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Demandas em Tempo Real</h3>
            <Link to="/dashboard/orgao/demandas" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2">
              Ver Fila Completa <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo / Título</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgência</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reports.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">#{r.id.toString().slice(-3)}</div>
                        <span className="text-sm font-black text-slate-800">{r.titulo}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-slate-500">{r.local}</td>
                    <td className="px-10 py-6">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        r.urgencia === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>{r.urgencia}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                        r.status === 'Resolvido' ? 'bg-green-50 text-green-600 border-green-100' : 
                        r.status === 'Em andamento' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>{r.status}</span>
                    </td>
                    <td className="px-10 py-6 text-right text-[10px] font-black text-slate-300 uppercase">{r.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}
