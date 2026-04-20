import DashboardLayout from '../../components/DashboardLayout';
import { AlertTriangle, MapPin, CheckCircle, Clock, ChevronRight, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getReportsByUser } from '../../services/storage';

export default function Ocorrencias() {
  const { user } = useAuth();
  const ocorrencias = getReportsByUser(user?.id);

  return (
    <DashboardLayout title="Minhas Ocorrências">
      <div className="flex flex-col gap-8">
        
        {/* Filtros Simbolizados */}
        <div className="bg-white p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Filter size={24} /></div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Filtrar Histórico</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total de {ocorrencias.length} registros</p>
            </div>
          </div>
          <div className="hidden md:flex gap-2 bg-slate-50 p-2 rounded-full border border-slate-100">
            {['Todos', 'Pendentes', 'Resolvidos'].map(f => (
              <button key={f} className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${f === 'Todos' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Listagem Estilo Premium */}
        <div className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-50">
            {ocorrencias.length === 0 ? (
              <div className="p-24 text-center">
                <AlertTriangle size={64} className="mx-auto mb-6 text-slate-200" />
                <h3 className="text-2xl font-black text-slate-800 mb-2">Sem registros</h3>
                <p className="text-slate-400 font-medium">Você ainda não reportou nenhum problema na cidade.</p>
              </div>
            ) : [...ocorrencias].reverse().map((oc) => (
              <div key={oc.id} className="p-8 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div className="flex gap-6">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                    oc.status === 'Resolvido' ? 'bg-green-100 text-green-600' :
                    oc.status === 'Em andamento' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {oc.status === 'Resolvido' ? <CheckCircle size={28} /> :
                     oc.status === 'Em andamento' ? <Clock size={28} /> : <AlertTriangle size={28} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        oc.urgencia === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>Urgência {oc.urgencia || 'Média'}</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Protocolo #{oc.id}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{oc.titulo}</h4>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500" /> {oc.local}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {oc.data}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    oc.status === 'Resolvido' ? 'bg-green-50 text-green-600 border-green-100' :
                    oc.status === 'Em andamento' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>{oc.status}</span>
                  <button className="p-4 bg-slate-50 text-slate-300 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
