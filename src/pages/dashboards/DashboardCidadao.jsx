import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { CheckCircle, Clock, MapPin, AlertTriangle, Star, Plus, X, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getReportsByUser, addReport } from '../../services/storage';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 15); }, [center, map]);
  return null;
}

function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });
  return position ? <Marker position={position} /> : null;
}

const categorias = ['Vias e Conservação', 'Iluminação', 'Acúmulo de Lixo', 'Áreas Verdes', 'Saneamento', 'Trânsito', 'Outros'];

export default function DashboardCidadao() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: '', categoria: 'Vias e Conservação', local: '', urgencia: 'Média', descricao: '' });
  const [customCategory, setCustomCategory] = useState('');
  const [markerPos, setMarkerPos] = useState([-23.5505, -46.6333]);
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    if (user?.id) {
      const data = await getReportsByUser(user.id);
      setReports(data);
    }
  };

  useEffect(() => { loadReports(); }, [user]);

  const handleAddressSearch = async (address) => {
    if (!address || address.length < 5) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMarkerPos([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) { console.error('Erro ao buscar endereço:', error); }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    await addReport({
      ...form,
      categoria: form.categoria === 'Outros' ? customCategory : form.categoria,
      userId: user.id,
      lat: markerPos[0],
      lng: markerPos[1],
      data: new Date().toLocaleDateString('pt-BR')
    });
    setShowModal(false);
    setForm({ titulo: '', categoria: 'Vias e Conservação', local: '', urgencia: 'Média', descricao: '' });
    await loadReports();
    Swal.fire({ icon: 'success', title: 'Ocorrência Registrada!', text: 'Seus pontos serão creditados após validação.', confirmButtonColor: '#2563eb' });
  };

  const pontos = user?.pontos || 0;
  const nivelInfo = pontos < 100 ? { label: 'Iniciante', next: 100 } :
    pontos < 300 ? { label: 'Fiscal da Cidade', next: 300 } :
    pontos < 600 ? { label: 'Guardião Urbano', next: 600 } : { label: 'Sentinela da Paz', next: 1000 };

  const stats = [
    { label: 'Reportes Enviados', value: reports.length, icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Em Andamento', value: reports.filter(r => r.status === 'Em andamento').length, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Resolvidos', value: reports.filter(r => r.status === 'Resolvido').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Seus Pontos', value: pontos, icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  const statusColor = (s) => s === 'Resolvido' ? 'bg-green-100 text-green-700' : s === 'Em andamento' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700';
  const statusIcon = (s) => s === 'Resolvido' ? CheckCircle : s === 'Em andamento' ? Clock : AlertTriangle;

  return (
    <DashboardLayout title="Meu Painel">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-xl transition-all group">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><s.icon size={22} /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-3xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-800">Nível: <span className="text-blue-600">{nivelInfo.label}</span></h3>
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
              <Star size={16} className="text-orange-500" fill="currentColor" />
              <span className="text-sm font-black text-orange-600">{pontos} PTS</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-1000" style={{ width: `${Math.min((pontos / nivelInfo.next) * 100, 100)}%` }}></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pontos} / {nivelInfo.next} PTS para o próximo nível</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white p-10 rounded-[3rem] shadow-2xl shadow-blue-100 flex flex-col items-center justify-center gap-4 transition-all hover:-translate-y-1 group">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={32} /></div>
          <div className="text-center">
            <p className="font-black text-lg">Nova Ocorrência</p>
            <p className="text-blue-200 text-xs font-bold">+50 pontos após validação</p>
          </div>
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 mb-8">Minhas Ocorrências</h3>
        {reports.length === 0 ? (
          <div className="py-20 text-center opacity-30">
            <AlertTriangle size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Nenhuma ocorrência ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(r => {
              const Icon = statusIcon(r.status);
              return (
                <div key={r.id} className="flex items-center gap-6 p-6 bg-slate-50/80 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${statusColor(r.status).replace('text-', 'bg-').split(' ')[0].replace('bg-', 'bg-').replace('100', '50')} ${statusColor(r.status).split(' ')[1]}`}><Icon size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 truncate">{r.titulo}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={10} /> {r.local}</span>
                      <span className="text-[10px] font-bold text-slate-300">{r.data}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex-shrink-0 ${statusColor(r.status)}`}>{r.status}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div><h3 className="text-xl font-black">Nova Ocorrência</h3><p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Você ganhará 50 pontos após validação</p></div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={handleReport} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Título</label>
                <input required value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Buraco na calçada" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Categoria</label>
                  <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold">
                    {categorias.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Urgência</label>
                  <select value={form.urgencia} onChange={e => setForm({ ...form, urgencia: e.target.value })} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold">
                    {['Baixa', 'Média', 'Alta'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              {form.categoria === 'Outros' && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Especifique</label>
                  <input value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
              )}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Endereço</label>
                <div className="flex gap-2">
                  <input required value={form.local} onChange={e => setForm({ ...form, local: e.target.value })} className="flex-1 px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Rua, número, bairro" />
                  <button type="button" onClick={() => handleAddressSearch(form.local)} className="px-5 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-bold text-sm"><Search size={18} /></button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Localização no Mapa</label>
                <div className="h-48 rounded-2xl overflow-hidden border border-slate-100">
                  <MapContainer center={markerPos} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <MapUpdater center={markerPos} />
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    <LocationPicker position={markerPos} setPosition={setMarkerPos} />
                  </MapContainer>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Descrição</label>
                <textarea rows={3} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold resize-none" placeholder="Descreva o problema em detalhes..." />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3">
                <Sparkles size={20} /> Registrar Ocorrência
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
