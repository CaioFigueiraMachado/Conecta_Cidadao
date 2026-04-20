import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { CheckCircle, Clock, MapPin, AlertTriangle, Star, Plus, X, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getReportsByUser, addReport } from '../../services/storage';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function DashboardCidadao() {
  const { user, updateUserSession } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: '', categoria: 'Vias e Conservação', local: '', urgencia: 'Média', descricao: '' });
  const [markerPos, setMarkerPos] = useState([-23.5505, -46.6333]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (user?.id) {
      setReports(getReportsByUser(user.id));
    }
  }, [user]);

  const handleReport = (e) => {
    e.preventDefault();
    addReport({ 
      ...form, 
      userId: user.id, 
      lat: markerPos[0], 
      lng: markerPos[1],
      data: new Date().toLocaleDateString('pt-BR')
    });

    const updatedUser = { ...user, pontos: (user.pontos || 0) + 50 };
    updateUserSession(updatedUser);
    setShowModal(false);
    setForm({ titulo: '', categoria: 'Vias e Conservação', local: '', urgencia: 'Média', descricao: '' });
    setReports(getReportsByUser(user.id));
  };

  const stats = [
    { label: 'Seus Reportes', value: reports.length, icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resolvidos', value: reports.filter(r => r.status === 'Resolvido').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Seus Pontos', value: user?.pontos || 0, icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  const nivelInfo = (user?.pontos || 0) < 100 ? { label: 'Iniciante', next: 100 } :
                   (user?.pontos || 0) < 300 ? { label: 'Fiscal da Cidade', next: 300 } :
                   { label: 'Guardião Urbano', next: 600 };

  return (
    <DashboardLayout title="Visão Geral">
      
      {/* Hero Welcome */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl mb-10 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
            <Sparkles size={14} className="text-blue-400" />
            Cidadão engajado
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Bem-vindo de volta, {user?.name.split(' ')[0]}!</h2>
          <p className="text-slate-400 max-w-xl font-medium leading-relaxed mb-8">
            Você já ajudou a resolver {reports.filter(r => r.status === 'Resolvido').length} problemas na sua região. 
            Continue contribuindo para tornar a cidade um lugar melhor para todos.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all flex items-center gap-2 shadow-xl shadow-black/20 active:scale-95"
          >
            <Plus size={20} /> REPORTAR PROBLEMA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-blue-100 transition-all duration-500">
            <div className={`w-16 h-16 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <s.icon size={28} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <p className="text-4xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recentes */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Atividade Recente</h3>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Histórico Completo</button>
        </div>
        <div className="divide-y divide-slate-50">
          {reports.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <AlertTriangle size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">Nenhum reporte realizado ainda.</p>
            </div>
          ) : [...reports].reverse().slice(0, 5).map(oc => (
            <div key={oc.id} className="p-6 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  oc.status === 'Resolvido' ? 'bg-green-100 text-green-600' :
                  oc.status === 'Em andamento' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {oc.status === 'Resolvido' ? <CheckCircle size={24} /> : oc.status === 'Em andamento' ? <Clock size={24} /> : <AlertTriangle size={24} />}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{oc.titulo}</h4>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {oc.local}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                  oc.status === 'Resolvido' ? 'bg-green-50 text-green-600 border-green-100' :
                  oc.status === 'Em andamento' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                }`}>{oc.status}</span>
                <span className="text-xs font-bold text-slate-300">{oc.data}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Novo Reporte (Premium) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl p-10 overflow-hidden animate-in zoom-in duration-300 flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Novo Reporte</h3>
                <button onClick={() => setShowModal(false)} className="lg:hidden text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleReport} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">O que está acontecendo?</label>
                  <input required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                    placeholder="Ex: Vazamento de água na calçada" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Categoria</label>
                    <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold appearance-none">
                      <option>Vias e Conservação</option>
                      <option>Iluminação</option>
                      <option>Acúmulo de Lixo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Urgência</label>
                    <select value={form.urgencia} onChange={e => setForm({...form, urgencia: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold appearance-none">
                      <option>Alta</option>
                      <option>Média</option>
                      <option>Baixa</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Onde?</label>
                  <input required value={form.local} onChange={e => setForm({...form, local: e.target.value})}
                    placeholder="Endereço aproximado..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">CANCELAR</button>
                  <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">ENVIAR AGORA</button>
                </div>
              </form>
            </div>

            <div className="flex-1 hidden lg:flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-1">Confirme no Mapa</label>
              <div className="flex-1 bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200 relative">
                <MapContainer center={[-23.5505, -46.6333]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker position={markerPos} setPosition={setMarkerPos} />
                </MapContainer>
                <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-lg text-[10px] font-black text-blue-600">
                  CLIQUE NO MAPA PARA MARCAR
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
