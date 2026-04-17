import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { CheckCircle, Clock, MapPin, AlertTriangle, Star, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getReportsByUser, addReport } from '../../services/storage';

export default function DashboardCidadao() {
  const { user, updateUserSession } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: '', categoria: 'Vias e Conservação', local: '', urgencia: 'Média', descricao: '' });

  const ocorrencias = getReportsByUser(user?.id);
  const pontos = user?.pontos || 0;

  const nivelInfo = pontos < 100 ? { label: 'Iniciante', next: 100 } :
                   pontos < 300 ? { label: 'Fiscal da Cidade', next: 300 } :
                   { label: 'Guardião Urbano', next: 600 };

  const handleReport = (e) => {
    e.preventDefault();
    const novaOcorrencia = addReport({ ...form, userId: user.id, lat: -23.5505 + (Math.random() - 0.5) * 0.1, lng: -46.6333 + (Math.random() - 0.5) * 0.1 });
    // Atualizar os pontos na sessão
    const updatedUser = { ...user, pontos: (user.pontos || 0) + 50 };
    updateUserSession(updatedUser);
    setShowModal(false);
    setForm({ titulo: '', categoria: 'Vias e Conservação', local: '', urgencia: 'Média', descricao: '' });
  };

  return (
    <DashboardLayout title="Visão Geral">

      {/* Modal de Reporte */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Reportar Novo Problema</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Título do Problema</label>
                <input required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                  placeholder="Ex: Buraco na calçada" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Categoria</label>
                  <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Vias e Conservação</option>
                    <option>Iluminação</option>
                    <option>Acúmulo de Lixo</option>
                    <option>Acessibilidade</option>
                    <option>Drenagem</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Urgência</label>
                  <select value={form.urgencia} onChange={e => setForm({...form, urgencia: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Alta</option>
                    <option>Média</option>
                    <option>Baixa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Localização</label>
                <input required value={form.local} onChange={e => setForm({...form, local: e.target.value})}
                  placeholder="Ex: Av. Paulista, 1000" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Descrição</label>
                <textarea rows="3" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}
                  placeholder="Descreva o problema em detalhes..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Enviar Reporte (+50pts)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Botão de ação flutuante */}
      <button onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-40 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-transform hover:scale-110">
        <Plus size={28} />
      </button>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Bem-vindo(a), {user?.name}!</h2>
          <p className="text-slate-500 mb-6">Clique no botão <strong>+</strong> para reportar um novo problema e ganhar pontos.</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <span className="text-orange-500 font-bold block text-2xl">{ocorrencias.length}</span>
              <span className="text-xs text-orange-700 font-medium">Reportes</span>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <span className="text-green-500 font-bold block text-2xl">{ocorrencias.filter(o => o.status === 'Resolvido').length}</span>
              <span className="text-xs text-green-700 font-medium">Resolvidos</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <span className="text-blue-500 font-bold block text-2xl">{pontos}</span>
              <span className="text-xs text-blue-700 font-medium">Pontos</span>
            </div>
          </div>
        </div>

        {/* Gamification */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 text-blue-500 opacity-20"><Star size={120} /></div>
          <div className="relative z-10">
            <h3 className="font-bold text-blue-100 mb-1">Nível Atual</h3>
            <p className="text-xl font-extrabold mb-4">{nivelInfo.label}</p>
            <div className="mb-2 flex justify-between text-xs font-medium text-blue-100">
              <span>{pontos} pts</span><span>Próx: {nivelInfo.next} pts</span>
            </div>
            <div className="w-full bg-blue-900/50 rounded-full h-2.5 mb-6">
              <div className="bg-yellow-400 h-2.5 rounded-full transition-all" style={{ width: `${Math.min((pontos / nivelInfo.next) * 100, 100)}%` }}></div>
            </div>
            <button onClick={() => setShowModal(true)} className="w-full bg-white text-blue-700 font-bold py-2 rounded-lg text-sm hover:bg-blue-50">
              + Reportar e Ganhar Pontos
            </button>
          </div>
        </div>
      </div>

      {/* Últimas Ocorrências */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Minhas Últimas Ocorrências</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {ocorrencias.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <AlertTriangle size={40} className="mx-auto mb-3 opacity-40" />
              <p>Você ainda não reportou nenhum problema.</p>
              <button onClick={() => setShowModal(true)} className="mt-4 text-blue-600 font-medium hover:underline">Reportar agora →</button>
            </div>
          ) : ocorrencias.slice(0, 5).map(oc => (
            <div key={oc.id} className="p-5 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  oc.status === 'Resolvido' ? 'bg-green-100 text-green-600' :
                  oc.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                }`}>
                  {oc.status === 'Resolvido' ? <CheckCircle size={20} /> : oc.status === 'Em andamento' ? <Clock size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{oc.titulo}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={13} /> {oc.local}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
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
