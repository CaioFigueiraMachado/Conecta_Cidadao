import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { AlertTriangle, MapPin, CheckCircle, Clock, ChevronRight, Filter, Send, X, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getReportsByUser, addMessage, getMessagesByReport, subscribeToMessages } from '../../services/storage';

export default function Ocorrencias() {
  const { user } = useAuth();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [selectedOc, setSelectedOc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        const data = await getReportsByUser(user.id);
        setOcorrencias(data);
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  useEffect(() => {
    if (selectedOc) {
      const loadMessages = async () => {
        const msgs = await getMessagesByReport(selectedOc.id);
        setMessages(msgs);
      };
      loadMessages();
      const unsub = subscribeToMessages(selectedOc.id, () => loadMessages());
      return unsub;
    }
  }, [selectedOc]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    await addMessage(selectedOc.id, {
      senderId: user.id,
      senderName: user.name,
      text: newMessage,
      role: user.role
    });
    
    const msgs = await getMessagesByReport(selectedOc.id);
    setMessages(msgs);
    setNewMessage('');
  };

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
            {loading ? (
              <div className="p-24 text-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando...</p>
              </div>
            ) : ocorrencias.length === 0 ? (
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
                  <button 
                    onClick={() => setSelectedOc(oc)}
                    className="p-4 bg-slate-50 text-slate-300 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center gap-2 font-bold text-xs"
                  >
                    CHAT <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {selectedOc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-2xl h-[600px] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
            {/* Header */}
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tight">{selectedOc.titulo}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chat com Órgão Público · #{selectedOc.id}</p>
              </div>
              <button onClick={() => setSelectedOc(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4"><Send size={24} /></div>
                  <p className="font-bold text-sm">Nenhuma mensagem ainda.<br/>Inicie o contato com a prefeitura.</p>
                </div>
              ) : messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-[1.5rem] shadow-sm ${
                    m.sender_id === user.id 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase opacity-70 tracking-widest">{m.sender_name}</span>
                      <span className="text-[9px] font-bold opacity-50">{m.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4 items-center">
              <input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escreva sua mensagem..." 
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
