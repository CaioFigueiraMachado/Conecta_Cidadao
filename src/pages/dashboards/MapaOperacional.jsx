import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllReports, deleteReport, subscribeToReports } from '../../services/storage';
import { Search, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getIcon = (status) => {
  const color = status === 'Resolvido' ? '#22c55e' : status === 'Em andamento' ? '#eab308' : '#ef4444';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="width:32px;height:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));transform:translate(-16px,-32px)">${svg}</div>`,
    iconSize: [0, 0], iconAnchor: [0, 0], popupAnchor: [0, -32],
  });
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export default function MapaOperacional() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [reports, setReports] = useState([]);
  const [mapCenter, setMapCenter] = useState([-23.5505, -46.6333]);

  const loadReports = async () => {
    const data = await getAllReports();
    setReports(data);
  };

  useEffect(() => {
    loadReports();
    const unsub = subscribeToReports(loadReports);
    return unsub;
  }, []);

  const filtrados = reports.filter(r => {
    const matchSearch = !searchTerm || r.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || r.categoria?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filtroStatus === 'Todos' || r.status === filtroStatus;
    return matchSearch && matchStatus && r.lat && r.lng;
  });

  const handleDelete = (e, id) => {
    if (e) e.stopPropagation();
    Swal.fire({
      title: 'Tem certeza?', text: 'Deseja excluir esta ocorrência?', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, excluir!', cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteReport(id);
        await loadReports();
        Swal.fire({ title: 'Excluído!', icon: 'success', confirmButtonColor: '#2563eb' });
      }
    });
  };

  const pendentes = reports.filter(r => r.status === 'Pendente').length;
  const andamento = reports.filter(r => r.status === 'Em andamento').length;
  const resolvidos = reports.filter(r => r.status === 'Resolvido').length;

  return (
    <DashboardLayout title="Mapa Operacional">
      <div className="relative h-[calc(100vh-160px)] -m-8 overflow-hidden flex flex-col md:flex-row bg-white">
        <div className="w-full md:w-96 bg-white border-r border-slate-200 z-10 flex flex-col shadow-2xl">
          <div className="p-8 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Monitoramento</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Ocorrências em Tempo Real</p>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Pesquisar..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Todos', value: 'Todos', color: 'bg-[#1e293b] text-white', count: reports.length },
                { label: 'Pendentes', value: 'Pendente', color: 'bg-red-500 text-white', count: pendentes },
                { label: 'Execução', value: 'Em andamento', color: 'bg-orange-500 text-white', count: andamento },
                { label: 'Resolvidos', value: 'Resolvido', color: 'bg-green-500 text-white', count: resolvidos },
              ].map(f => (
                <button key={f.value} onClick={() => setFiltroStatus(f.value)} className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border ${filtroStatus === f.value ? `${f.color} border-transparent shadow-lg` : 'bg-white text-slate-500 border-slate-100'}`}>
                  {f.label}<span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${filtroStatus === f.value ? 'bg-white/20' : 'bg-slate-100'}`}>{f.count}</span>
                </button>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {filtrados.map(r => (
                <div key={r.id} onClick={() => setMapCenter([r.lat, r.lng])} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-500 transition-all cursor-pointer bg-white">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-bold text-slate-400">#PRTC-{String(r.id).slice(-4)}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${r.status === 'Resolvido' ? 'bg-green-500' : r.status === 'Em andamento' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                      <button onClick={(e) => handleDelete(e, r.id)} className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 truncate">{r.titulo}</h4>
                  <p className="text-xs text-slate-500 truncate">{r.local}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
            <MapUpdater center={mapCenter} />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            {filtrados.map(r => (
              <Marker key={r.id} position={[r.lat, r.lng]} icon={getIcon(r.status)}>
                <Popup>
                  <div className="min-w-[180px] p-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${r.status === 'Resolvido' ? 'bg-green-100 text-green-700' : r.status === 'Em andamento' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
                      <button onClick={() => handleDelete(null, r.id)} className="text-red-500 text-[10px] font-bold flex items-center gap-1"><Trash2 size={11} />Excluir</button>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{r.titulo}</h4>
                    <p className="text-xs text-slate-500">{r.local}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className="absolute bottom-10 right-10 z-10 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl">
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-[9px] font-bold">Pendente</div>
              <div className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-[9px] font-bold">Execução</div>
              <div className="px-3 py-1.5 rounded-xl bg-green-50 text-green-600 text-[9px] font-bold">Resolvido</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
