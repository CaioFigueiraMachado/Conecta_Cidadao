import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllReports } from '../services/storage';
import { Search, Filter } from 'lucide-react';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícones coloridos por status
const getIcon = (status) => {
  const color = status === 'Resolvido' ? '2ecc71' : status === 'Em andamento' ? 'f39c12' : 'e74c3c';
  return L.icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}|ffffff`,
    iconSize: [21, 34],
    iconAnchor: [10, 34],
    popupAnchor: [1, -34],
  });
};

// Componente para atualizar o mapa quando há novos relatórios
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center]);
  return null;
}

export default function MapaPublico() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [reports, setReports] = useState([]);

  // Recarrega do storage a cada vez que a aba fica visível
  useEffect(() => {
    const load = () => setReports(getAllReports());
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);

  const filtrados = reports.filter(r => {
    const matchSearch = !searchTerm || r.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || r.categoria?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filtroStatus === 'Todos' || r.status === filtroStatus;
    return matchSearch && matchStatus && r.lat && r.lng;
  });

  const pendentes = reports.filter(r => r.status === 'Pendente').length;
  const andamento = reports.filter(r => r.status === 'Em andamento').length;
  const resolvidos = reports.filter(r => r.status === 'Resolvido').length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-blue-600">📍</span> Mapa Interativo de Ocorrências
              </h1>
              <p className="text-slate-500 text-sm mt-1">Visualize e filtre todos os problemas reportados em tempo real.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por título ou categoria..."
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-full w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Filtros de Status */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { label: `Todos (${reports.length})`, value: 'Todos', cls: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
              { label: `🔴 Pendentes (${pendentes})`, value: 'Pendente', cls: 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' },
              { label: `🟡 Em Andamento (${andamento})`, value: 'Em andamento', cls: 'bg-yellow-50 text-yellow-700 border border-yellow-100 hover:bg-yellow-100' },
              { label: `🟢 Resolvidos (${resolvidos})`, value: 'Resolvido', cls: 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100' },
            ].map(f => (
              <button key={f.value} onClick={() => setFiltroStatus(f.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${f.cls} ${filtroStatus === f.value ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="flex gap-4 mb-3 text-xs text-slate-500 px-1">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Pendente</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> Em andamento</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Resolvido</span>
        </div>

        {/* Mapa */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="h-[580px] w-full rounded-xl overflow-hidden relative z-0">
            <MapContainer center={[-23.5505, -46.6333]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtrados.map(r => (
                <Marker key={r.id} position={[r.lat, r.lng]} icon={getIcon(r.status)}>
                  <Popup>
                    <div className="min-w-[200px]">
                      {r.categoria && <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{r.categoria}</p>}
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{r.titulo}</h4>
                      {r.local && <p className="text-xs text-slate-500 mb-2">📍 {r.local}</p>}
                      {r.descricao && <p className="text-xs text-slate-600 mb-2 italic">"{r.descricao}"</p>}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-400">{r.data}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.status === 'Pendente' ? 'bg-red-100 text-red-700' :
                          r.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {filtrados.length === 0 && (
          <p className="text-center text-slate-400 mt-4 text-sm">Nenhuma ocorrência encontrada com os filtros aplicados.</p>
        )}
      </div>
    </Layout>
  );
}
