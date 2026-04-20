import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllReports } from '../../services/storage';

// Correção ícones Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícones coloridos por status
const getIcon = (status) => {
  const color = status === 'Resolvido' ? '#22c55e' : status === 'Em andamento' ? '#eab308' : '#ef4444';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`;
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="width: 36px; height: 36px; filter: drop-shadow(0 8px 8px rgba(0,0,0,0.2)); transform: translate(-18px, -36px); cursor-pointer">${svg}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -36],
  });
};

export default function MapaOperacional() {
  const [demandas, setDemandas] = useState([]);

  useEffect(() => {
    setDemandas(getAllReports().filter(r => r.lat && r.lng));
  }, []);

  return (
    <DashboardLayout title="Mapa Operacional">
      <div className="bg-white p-4 md:p-6 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-[700px] mb-10 relative overflow-hidden">
        <MapContainer center={[-23.5505, -46.6333]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} className="rounded-[2.5rem] z-0 relative">
          <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          />
          {demandas.map(d => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={getIcon(d.status)}>
              <Popup>
                <div className="min-w-[200px] p-1">
                  {d.categoria && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{d.categoria}</p>}
                  <h4 className="font-black text-slate-800 text-base mb-1">{d.titulo}</h4>
                  {d.local && <p className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1">📍 {d.local}</p>}
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.data}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      d.status === 'Pendente' ? 'bg-red-50 text-red-600' :
                      d.status === 'Em andamento' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-green-50 text-green-600'}`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </DashboardLayout>
  );
}
