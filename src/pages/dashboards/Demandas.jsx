import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllReports, updateReportStatus } from '../../services/storage';
import { Search, MapPin, Calendar, Clock, CheckCircle2, AlertTriangle, ChevronRight, User } from 'lucide-react';

export default function Demandas() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setReports(getAllReports());
  }, []);

  const handleStatusChange = (id, newStatus) => {
    updateReportStatus(id, newStatus);
    setReports(getAllReports());
  };

  const columns = [
    { id: 'Pendente', title: 'Fila de Entrada', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'Em andamento', title: 'Em Execução', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'Resolvido', title: 'Concluído', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
  ];

  const filteredReports = reports.filter(r => 
    r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Gestão de Fluxo Urbanístico">
      <div className="flex flex-col h-full gap-8">
        
        {/* Search Bar */}
        <div className="bg-white p-6 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center max-w-xl group focus-within:border-blue-300 transition-all">
          <Search className="text-slate-400 ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por protocolo ou endereço..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-6 py-2 bg-transparent border-none focus:ring-0 font-bold text-sm text-slate-700 placeholder:text-slate-300 outline-none"
          />
        </div>

        {/* Kanban Board */}
        <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[700px] overflow-x-auto pb-8">
          {columns.map(col => (
            <div key={col.id} className="flex-1 min-w-[350px] bg-slate-50/80 rounded-[3rem] border border-slate-100 flex flex-col p-4 shadow-inner">
              
              <div className="p-6 flex items-center justify-between mb-4 bg-white/50 rounded-full border border-white backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${col.bg} ${col.color} shadow-sm`}>
                    <col.icon size={22} />
                  </div>
                  <h3 className="font-black text-slate-800 tracking-tight text-lg">{col.title}</h3>
                </div>
                <span className="bg-white px-4 py-1.5 rounded-full text-xs font-black text-slate-400 border border-slate-50 shadow-sm">
                  {filteredReports.filter(r => r.status === col.id).length}
                </span>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-2 custom-scrollbar">
                {filteredReports.filter(r => r.status === col.id).map(r => (
                  <div key={r.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-2xl rounded-full"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                          r.urgencia === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          Urgência {r.urgencia}
                        </span>
                        <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">#{r.id.toString().slice(-4)}</p>
                      </div>
                      
                      <h4 className="text-xl font-black text-slate-800 mb-6 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {r.titulo}
                      </h4>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <MapPin size={14} className="text-blue-500" /> <span className="truncate">{r.local}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <Calendar size={14} /> {r.data}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-blue-600 font-black">
                            <User size={14} />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {columns.filter(c => c.id !== r.status).map(targetCol => (
                            <button 
                              key={targetCol.id}
                              onClick={() => handleStatusChange(r.id, targetCol.id)}
                              className="p-3 bg-slate-50 text-slate-300 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm"
                              title={`Mover para ${targetCol.title}`}
                            >
                              <ChevronRight size={18} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredReports.filter(r => r.status === col.id).length === 0 && (
                  <div className="py-20 text-center opacity-10">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Vazio</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
