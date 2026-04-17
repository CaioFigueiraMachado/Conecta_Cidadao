import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Clock, CheckCircle, AlertTriangle, MapPin, MoreVertical } from 'lucide-react';
import { getAllReports, updateReportStatus } from '../../services/storage';

export default function DashboardOrgao() {
  const [filtro, setFiltro] = useState('Todos');
  const [reports, setReports] = useState(getAllReports());

  const todasDemandas = reports;
  const filtradas = filtro === 'Todos' ? todasDemandas : todasDemandas.filter(d => d.status === filtro);

  const handleStatusChange = (id, novoStatus) => {
    updateReportStatus(id, novoStatus);
    setReports(getAllReports()); // Recarrega do storage
  };

  return (
    <DashboardLayout title="Fila de Demandas">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full sm:w-auto">
          {['Todos', 'Pendente', 'Em andamento', 'Resolvido'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium transition-colors ${filtro === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {f} ({f === 'Todos' ? todasDemandas.length : todasDemandas.filter(d => d.status === f).length})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtradas.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center text-slate-400">
            Nenhuma demanda encontrada para o filtro selecionado.
          </div>
        ) : filtradas.map((demanda) => (
          <div key={demanda.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 justify-between lg:items-center hover:shadow-md transition-shadow">
            <div className="flex gap-4 items-start lg:items-center flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                demanda.status === 'Resolvido' ? 'bg-green-100 text-green-600' :
                demanda.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
              }`}>
                {demanda.status === 'Resolvido' ? <CheckCircle size={22} /> :
                 demanda.status === 'Em andamento' ? <Clock size={22} /> : <AlertTriangle size={22} />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800">{demanda.titulo}</h3>
                  {demanda.urgencia && (
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      demanda.urgencia === 'Alta' ? 'bg-red-50 text-red-600 border border-red-100' : 
                      demanda.urgencia === 'Média' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-gray-50 text-gray-600 border border-gray-100'
                    }`}>
                      {demanda.urgencia}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  {demanda.categoria && <span className="font-medium text-slate-700">{demanda.categoria}</span>}
                  {demanda.local && <><span>•</span><span className="flex items-center gap-1"><MapPin size={13} /> {demanda.local}</span></>}
                  <span>•</span><span>{demanda.data}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                demanda.status === 'Resolvido' ? 'bg-green-100 text-green-700' :
                demanda.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>{demanda.status}</span>

              <select
                value={demanda.status}
                onChange={(e) => handleStatusChange(demanda.id, e.target.value)}
                className="border border-slate-200 rounded-lg text-sm font-medium text-slate-700 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer bg-slate-50">
                <option value="Pendente">Pendente</option>
                <option value="Em andamento">Em Andamento</option>
                <option value="Resolvido">Resolvido</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
