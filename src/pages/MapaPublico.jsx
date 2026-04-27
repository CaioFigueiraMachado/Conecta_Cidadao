import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllReports, subscribeToReports } from '../services/storage';
import { Search, Filter } from 'lucide-react';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícones coloridos por status (Usando SVG embutido para não depender de APIs externas)
const getIcon = (status) => {
  const color = status === 'Resolvido' ? '#22c55e' : status === 'Em andamento' ? '#eab308' : '#ef4444';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`;
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="width: 36px; height: 36px; filter: drop-shadow(0 8px 8px rgba(0,0,0,0.2)); transform: translate(-18px, -36px); hover:scale-110 transition-transform cursor-pointer">${svg}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -36],
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
  const [mapCenter, setMapCenter] = useState([-23.5505, -46.6333]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllReports();
      setReports(data);
    };
    load();
    const unsub = subscribeToReports(load);
    return unsub;
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
      <div className="relative h-[calc(100vh-80px)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Panel - Glassmorphism style */}
        <div className="w-full md:w-96 bg-white/80 backdrop-blur-xl border-r border-slate-200 z-10 flex flex-col shadow-2xl relative overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Monitoramento</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Ocorrências em Tempo Real</p>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Pesquisar problema..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Chips */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Filtrar por Status</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: `Todos`, value: 'Todos', color: 'bg-slate-800 text-white', count: reports.length },
                  { label: `Pendentes`, value: 'Pendente', color: 'bg-red-500 text-white', count: pendentes },
                  { label: `Execução`, value: 'Em andamento', color: 'bg-orange-500 text-white', count: andamento },
                  { label: `Resolvidos`, value: 'Resolvido', color: 'bg-green-500 text-white', count: resolvidos },
                ].map(f => (
                  <button 
                    key={f.value} 
                    onClick={() => setFiltroStatus(f.value)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      filtroStatus === f.value 
                        ? `${f.color} border-transparent shadow-lg shadow-slate-200` 
                        : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {f.label}
                    <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${filtroStatus === f.value ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* List Preview */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Resultados ({filtrados.length})</p>
              {filtrados.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <p className="text-xs font-bold uppercase tracking-wider">Nenhum resultado</p>
                </div>
              ) : (
                filtrados.slice(0, 10).map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => setMapCenter([r.lat, r.lng])}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group bg-white"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-bold text-slate-400">#{r.id.toString().slice(-4)}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        r.status === 'Resolvido' ? 'bg-green-500' : r.status === 'Em andamento' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{r.titulo}</h4>
                    <p className="text-xs text-slate-500 truncate">{r.local}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-slate-100">
          <div className="absolute inset-0 z-0">
            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <MapUpdater center={mapCenter} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {filtrados.map(r => (
                <Marker key={r.id} position={[r.lat, r.lng]} icon={getIcon(r.status)}>
                  <Popup className="custom-popup">
                    <div className="min-w-[200px] p-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          r.status === 'Resolvido' ? 'bg-green-100 text-green-700' : 
                          r.status === 'Em andamento' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>{r.status}</span>
                        <span className="text-[9px] font-bold text-slate-300">{r.data}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{r.titulo}</h4>
                      <p className="text-xs text-slate-500 mb-2 font-medium leading-tight"> {r.local}</p>
                      {r.descricao && (
                        <div className="bg-slate-50 p-2 rounded-lg mb-2">
                          <p className="text-[11px] text-slate-600 italic">"{r.descricao}"</p>
                        </div>
                      )}
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{r.categoria}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Floating Action Button (Optional) */}
          <div className="absolute bottom-10 right-10 z-10">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-2xl space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 text-center">Visão do Mapa</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Pendente
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Em Execução
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold border border-green-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Resolvido
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
