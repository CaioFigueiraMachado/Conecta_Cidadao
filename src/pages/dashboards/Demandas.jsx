import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllReports, updateReportStatus, addMessage, getMessagesByReport, subscribeToReports, subscribeToMessages } from '../../services/storage';
import { Search, MapPin, Calendar, Clock, CheckCircle2, AlertTriangle, ChevronRight, User, Send, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

export default function Demandas() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOc, setSelectedOc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    const data = await getAllReports();
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
    // Realtime: atualiza lista quando qualquer ocorrência mudar
    const unsub = subscribeToReports(loadReports);
    return unsub;
  }, []);

  const loadMessages = async (ocId) => {
    const data = await getMessagesByReport(ocId);
    setMessages(data);
  };

  useEffect(() => {
    if (!selectedOc) return;
    loadMessages(selectedOc.id);
    // Realtime: novas mensagens aparecem em tempo real
    const unsub = subscribeToMessages(selectedOc.id, () => loadMessages(selectedOc.id));
    return unsub;
  }, [selectedOc]);

  const handleStatusChange = async (id, newStatus) => {
    const { pointsAwarded } = await updateReportStatus(id, newStatus);
    await loadReports();
    if (pointsAwarded) {
      Swal.fire({
        icon: 'success',
        title: 'Ocorrência Validada',
        text: 'Sucesso! 50 pontos foram creditados ao cidadão.',
        confirmButtonColor: '#22c55e'
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addMessage(selectedOc.id, {
      senderId: user.id,
      senderName: 'Órgão Público',
      text: newMessage,
      role: user.role
    });
    setNewMessage('');
    await loadMessages(selectedOc.id);
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
                {loading ? (
                  <div className="py-10 text-center">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carregando...</p>
                  </div>
                ) : filteredReports.filter(r => r.status === col.id).length === 0 ? (
                  <p className="text-center text-xs font-bold text-slate-300 py-10 uppercase tracking-widest">Nenhuma demanda</p>
                ) : filteredReports.filter(r => r.status === col.id).map(r => (
                  <div key={r.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-2xl rounded-full"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${r.urgencia === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          Urgência {r.urgencia}
                        </span>
                        <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">#{String(r.id).slice(-4)}</p>
                      </div>
                      <h4 className="text-xl font-black text-slate-800 mb-6 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{r.titulo}</h4>
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <MapPin size={14} className="text-blue-500" /> <span className="truncate">{r.local}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <Calendar size={14} /> {r.data}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOc(r); }}
                          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg transition-transform active:scale-90"
                          title="Abrir Chat com Cidadão"
                        >
                          <User size={18} />
                        </button>
                        <div className="flex gap-2">
                          {columns.filter(c => c.id !== r.status).map(targetCol => (
                            <button
                              key={targetCol.id}
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(r.id, targetCol.id); }}
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

      {selectedOc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-2xl h-[600px] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tight">{selectedOc.titulo}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chat com Cidadão · #{selectedOc.id}</p>
              </div>
              <button onClick={() => setSelectedOc(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4"><Send size={24} /></div>
                  <p className="font-bold text-sm">Nenhuma mensagem ainda.</p>
                </div>
              ) : messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-[1.5rem] shadow-sm ${m.sender_id === user.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase opacity-70 tracking-widest">{m.sender_name}</span>
                      <span className="text-[9px] font-bold opacity-50">{m.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4 items-center">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escreva sua resposta..."
                className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              />
              <button type="submit" className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
