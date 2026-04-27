import { getAllReports, getAllUsers, subscribeToReports } from '../services/storage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Map, Gift, ArrowRight, CheckCircle2, Users, Building, Award, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';

export default function Home() {
  const [allReports, setAllReports] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { user } = useAuth();

  const actionLink = user ? '/dashboard/cidadao' : '/login';

  const refreshData = async () => {
    const [reports, users] = await Promise.all([getAllReports(), getAllUsers()]);
    setAllReports(reports);
    setAllUsers(users);
  };

  useEffect(() => {
    refreshData();
    // Realtime: atualiza ranking e stats quando ocorrências mudam
    const unsub = subscribeToReports(refreshData);
    return unsub;
  }, []);

  const reports = allReports.slice(0, 3);

  // Lógica para Cidadãos do Mês (Top 3 por pontos)
  const topCidadaos = [...allUsers]
    .filter(u => u.role === 'cidadao')
    .sort((a, b) => (b.pontos || 0) - (a.pontos || 0))
    .slice(0, 3);

  const statusColor = (s) => s === 'Resolvido' ? 'bg-green-100 text-green-700' : s === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600';

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-slate-900 text-white pb-32 pt-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop")' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              A cidade que você quer <br />começa com a sua voz.
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg">
              Reporte problemas urbanos, ganhe pontos e troque por benefícios reais. Conectamos cidadãos, prefeituras e empresas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={actionLink} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2">
                <span>+</span> Reportar Problema
              </Link>
              <Link to="/parceiro" className="border border-white hover:bg-white/10 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                Seja Parceiro
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-10 md:mt-0 relative z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="text-green-400"></span> Ações Rápidas</h3>
              <div className="space-y-3">
                {[
                  { to: actionLink, icon: AlertTriangle, color: 'orange', title: 'Registrar Ocorrência', sub: 'Ganhe +50 pontos por reporte' },
                  { to: '/mapa', icon: Map, color: 'blue', title: 'Mapa ao Vivo', sub: 'Veja as demandas da região' },
                  { to: '/beneficios', icon: Gift, color: 'pink', title: 'Benefícios', sub: 'Troque seus pontos por prêmios' },
                ].map(({ to, icon: Icon, color, title, sub }) => (
                  <Link key={to + title} to={to} className="flex items-center justify-between bg-black/20 hover:bg-black/40 p-4 rounded-xl transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`bg-${color}-500/20 text-${color}-400 p-2 rounded-lg group-hover:bg-${color}-500 group-hover:text-white transition-colors`}><Icon size={22} /></div>
                      <div><h4 className="font-semibold text-white">{title}</h4><p className="text-xs text-slate-300">{sub}</p></div>
                    </div>
                    <ArrowRight size={18} className="text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: CheckCircle2, color: 'green', value: allReports.filter(r => r.status === 'Resolvido').length, label: 'Problemas Resolvidos' },
            { icon: Users, color: 'blue', value: allUsers.filter(u => u.role === 'cidadao').length, label: 'Cidadãos Ativos' },
            { icon: Building, color: 'purple', value: allUsers.filter(u => u.role === 'parceiro').length, label: 'Empresas Parceiras' },
            { icon: Award, color: 'orange', value: allUsers.reduce((acc, curr) => acc + (curr.pontos || 0), 0), label: 'Pontos Distribuídos' },
          ].map(({ icon: Icon, color, value, label }) => (
            <div key={label} className="text-center">
              <div className={`w-12 h-12 mx-auto bg-${color}-100 text-${color}-600 rounded-full flex items-center justify-center mb-3`}><Icon size={24} /></div>
              <p className="text-3xl font-bold text-slate-800">
                {typeof value === 'number' && value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}
              </p>
              <p className="text-sm font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mapa Preview + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Map className="text-blue-600" /> Mapa de Ocorrências</h2>
                <Link to="/mapa" className="text-sm text-blue-600 font-medium border border-blue-200 px-4 py-1.5 rounded-full hover:bg-blue-50">Ver completo</Link>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden relative bg-slate-200 min-h-[300px]">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" alt="Prévia do mapa interativo" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <Link to="/mapa" className="bg-white text-slate-800 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                    <Map size={20} /> Abrir Mapa Interativo
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-orange-50 rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Award className="text-orange-500" /> Ranking do Mês</h3>
                <TrendingUp size={18} className="text-orange-400" />
              </div>
              <div className="space-y-4">
                {topCidadaos.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6 bg-white/50 rounded-2xl">Aguardando as primeiras ocorrências do mês!</p>
                ) : topCidadaos.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-4 bg-white/80 p-3 rounded-2xl border border-white shadow-sm group hover:scale-[1.02] transition-all">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200' :
                        index === 1 ? 'bg-slate-300 text-white' :
                          'bg-orange-200 text-orange-700'
                      }`}>
                      {index + 1}º
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.pontos || 0} Pontos</p>
                    </div>
                    {index === 0 && <span className="text-xl"></span>}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[10px] text-center text-orange-600/60 font-bold uppercase tracking-widest italic">A cada reporte resolvido você sobe no ranking!</p>
            </div>
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white text-center shadow-2xl shadow-blue-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <Gift size={40} className="mx-auto mb-4 text-white/90" />
              <h3 className="text-xl font-bold mb-2">Novos Benefícios</h3>
              <p className="text-sm text-blue-100 mb-6">Use seus pontos e ajude o comércio local.</p>
              <Link to="/beneficios" className="block w-full bg-white text-blue-600 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-colors shadow-lg">Ver Prêmios</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feed de Atualizações */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">Últimas Ocorrências</h2>
            <Link to="/mapa" className="text-sm text-blue-600 font-bold hover:underline">Ver todas no mapa →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allReports.length === 0 ? (
              <p className="col-span-full text-center text-slate-400 py-12">Nenhuma ocorrência ainda. Seja o primeiro a reportar!</p>
            ) : allReports.slice(0, 3).map(r => (
              <div key={r.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${statusColor(r.status)}`}>{r.status}</span>
                  <span className="text-[10px] font-bold text-slate-400">{r.data}</span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors truncate">{r.titulo}</h4>
                <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-4 flex items-center gap-1">
                  <Map size={12} className="text-slate-300" /> {r.local}
                </p>
                <Link to="/mapa" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                  Ver no mapa <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
