import DashboardLayout from '../../components/DashboardLayout';
import { AlertTriangle, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getReportsByUser } from '../../services/storage';

export default function Ocorrencias() {
  const { user } = useAuth();
  const ocorrencias = getReportsByUser(user?.id);

  return (
    <DashboardLayout title="Minhas Ocorrências">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Histórico Completo ({ocorrencias.length})</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {ocorrencias.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <AlertTriangle size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">Você ainda não reportou nenhum problema.</p>
              <p className="text-sm mt-1">Use o botão <strong>+</strong> no painel principal para começar!</p>
            </div>
          ) : ocorrencias.map((oc) => (
            <div key={oc.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                  oc.status === 'Resolvido' ? 'bg-green-100 text-green-600' :
                  oc.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                }`}>
                  {oc.status === 'Resolvido' ? <CheckCircle size={22} /> :
                   oc.status === 'Em andamento' ? <Clock size={22} /> : <AlertTriangle size={22} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{oc.titulo}</h4>
                  {oc.categoria && <p className="text-xs text-blue-600 font-medium mb-0.5">{oc.categoria}</p>}
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={13} /> {oc.local}
                  </p>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  oc.status === 'Resolvido' ? 'bg-green-100 text-green-700' :
                  oc.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>{oc.status}</span>
                <span className="text-xs text-slate-400">{oc.data}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
