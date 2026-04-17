import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import QuemSomos from './pages/QuemSomos';
import Problematica from './pages/Problematica';
import MapaPublico from './pages/MapaPublico';
import Parceiro from './pages/Parceiro';
import Beneficios from './pages/Beneficios';

// Dashboards
import DashboardCidadao from './pages/dashboards/DashboardCidadao';
import Ocorrencias from './pages/dashboards/Ocorrencias';
import Pontos from './pages/dashboards/Pontos';
import DashboardAdmin from './pages/dashboards/DashboardAdmin';
import GestaoUsuarios from './pages/dashboards/GestaoUsuarios';
import Configuracoes from './pages/dashboards/Configuracoes';
import DashboardOrgao from './pages/dashboards/DashboardOrgao';
import MapaOperacional from './pages/dashboards/MapaOperacional';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/problematica" element={<Problematica />} />
        <Route path="/mapa" element={<MapaPublico />} />
        <Route path="/parceiro" element={<Parceiro />} />
        <Route path="/beneficios" element={<Beneficios />} />

        {/* Rotas Privadas */}
        <Route 
          path="/dashboard/cidadao" 
          element={
            <PrivateRoute allowedRoles={['cidadao']}>
              <DashboardCidadao />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/cidadao/ocorrencias" 
          element={
            <PrivateRoute allowedRoles={['cidadao']}>
              <Ocorrencias />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/cidadao/pontos" 
          element={
            <PrivateRoute allowedRoles={['cidadao']}>
              <Pontos />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <DashboardAdmin />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/admin/usuarios" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <GestaoUsuarios />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/admin/config" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Configuracoes />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/orgao" 
          element={
            <PrivateRoute allowedRoles={['orgao']}>
              <DashboardOrgao />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/orgao/demandas" 
          element={
            <PrivateRoute allowedRoles={['orgao']}>
              <DashboardOrgao />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/orgao/mapa" 
          element={
            <PrivateRoute allowedRoles={['orgao']}>
              <MapaOperacional />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <PrivateRoute allowedRoles={['cidadao', 'admin', 'orgao', 'parceiro']}>
              <Perfil />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
