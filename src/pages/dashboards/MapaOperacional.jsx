import DashboardLayout from '../../components/DashboardLayout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correção ícones Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapaOperacional() {
  const demandas = [
    { id: 1, lat: -23.5505, lng: -46.6333, titulo: 'Buraco na via', status: 'Pendente' },
    { id: 2, lat: -23.5615, lng: -46.6553, titulo: 'Lâmpada queimada', status: 'Em andamento' },
  ];

  return (
    <DashboardLayout title="Mapa Operacional">
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-[600px]">
        <MapContainer center={[-23.5505, -46.6333]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className="rounded-xl z-0 relative">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {demandas.map(d => (
            <Marker key={d.id} position={[d.lat, d.lng]}>
              <Popup>
                <div className="font-bold">{d.titulo}</div>
                <div className="text-xs">{d.status}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </DashboardLayout>
  );
}
