import DashboardLayout from '../../components/DashboardLayout';
import { Star, Gift, Ticket, Coffee, ShoppingBag, Check, Sparkles, TrendingUp, ArrowRight, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUser, getAllBenefits, getRedeemedBenefits, getReportsByUser, redeemBenefit } from '../../services/storage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const beneficiosQuick = [
  { id: 1, nome: 'Ingresso de Cinema', pontos: 150, icone: Ticket, cor: 'bg-red-50 text-red-600', empresa: 'Cineplex' },
  { id: 2, nome: 'Vale-Café Gourmet', pontos: 50, icone: Coffee, cor: 'bg-amber-50 text-amber-600', empresa: 'Café do Ponto' },
  { id: 3, nome: 'Desconto 10% Mercado', pontos: 300, icone: ShoppingBag, cor: 'bg-green-50 text-green-600', empresa: 'Mercado Bom Preço' },
];

export default function Pontos() {
  const { user, updateUserSession } = useAuth();
  const pontos = user?.pontos || 0;
  const [resgatados, setResgatados] = useState([]);
  const [dbBenefits, setDbBenefits] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setDbBenefits(getAllBenefits());
    if (user) {
      const userRedeemed = getRedeemedBenefits(user.id);
      const userReports = getReportsByUser(user.id);
      
      const historyItems = [
        ...userRedeemed.map(r => ({
          title: `Resgate de ${r.nome}`,
          desc: `Código: ${r.code} - ${r.empresa}`,
          points: `-${r.pontos}`,
          date: r.data,
          type: 'loss',
          timestamp: parseInt(r.id)
        })),
        ...userReports.map(r => ({
          title: `Reporte de ${r.categoria}`,
          desc: `Protocolo #${r.id} - ${r.local}`,
          points: '+50',
          date: r.data,
          type: 'gain',
          timestamp: r.id
        }))
      ].sort((a, b) => b.timestamp - a.timestamp);
      
      setHistory(historyItems);
      setResgatados(userRedeemed.map(r => r.benefitId));
    }
  }, [user, user?.pontos]);

  const mappedDbBenefits = dbBenefits.map(b => ({
    id: `db-${b.id}`,
    nome: b.nome,
    pontos: b.pontos,
    icone: b.categoria === 'Alimentação' ? Coffee : b.categoria === 'Lazer' ? Ticket : b.categoria === 'Varejo' ? ShoppingBag : Gift,
    cor: 'bg-blue-50 text-blue-600',
    empresa: b.empresa || 'Parceiro'
  }));

  const allQuickBenefits = [...beneficiosQuick, ...mappedDbBenefits].slice(0, 4);

  const nivelInfo = pontos < 100 ? { label: 'Iniciante', next: 100, level: 1 } :
                   pontos < 300 ? { label: 'Fiscal da Cidade', next: 300, level: 2 } :
                   { label: 'Guardião Urbano', next: 600, level: 3 };

  const handleResgatar = (b) => {
    if (pontos < b.pontos) return;
    const novosPontos = pontos - b.pontos;
    const updatedUser = { ...user, pontos: novosPontos };
    updateUser(user.id, { pontos: novosPontos });
    updateUserSession(updatedUser);
    redeemBenefit(user.id, b);
    setResgatados(prev => [...prev, b.id]);
  };

  return (
    <DashboardLayout title="Extrato e Recompensas">
      
      {/* Hero Card - Wallet Style */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl mb-10 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20"><Wallet size={24} /></div>
              <h2 className="text-xl font-black text-blue-400 uppercase tracking-widest">Carteira Digital</h2>
            </div>
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-7xl font-black tracking-tighter">{pontos}</span>
              <span className="text-2xl font-bold text-slate-400 uppercase tracking-widest">Pontos</span>
            </div>
            <p className="text-slate-500 font-medium">Sua moeda social para trocar por benefícios exclusivos.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] min-w-[320px] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Nível {nivelInfo.level}</span>
              </div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{nivelInfo.label}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
              <div className="bg-blue-500 h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${Math.min((pontos / nivelInfo.next) * 100, 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>{pontos} PTS</span>
              <span>PRÓXIMO: {nivelInfo.next} PTS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Ganhos Recentes</h3>
              <div className="bg-green-50 border border-green-100 text-green-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">+50 PTS HOJE</div>
            </div>
            <div className="space-y-6">
              {history.length === 0 ? (
                <div className="text-center text-slate-400 py-10 font-bold uppercase tracking-widest text-sm">
                  Nenhum ganho ou resgate recente.
                </div>
              ) : history.slice(0, 5).map((h, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50/80 rounded-[2rem] border border-slate-50 group hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-inner ${h.type === 'gain' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {h.type === 'gain' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-800">{h.title}</p>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black ${h.type === 'gain' ? 'text-green-600' : 'text-red-500'}`}>{h.points}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Resgate Rápido</h3>
            <div className="space-y-6">
              {allQuickBenefits.map(b => {
                const Icon = b.icone;
                const podeResgatar = pontos >= b.pontos;
                const jaResgatou = resgatados.includes(b.id);
                return (
                  <div key={b.id} className={`p-6 rounded-[2rem] border transition-all ${jaResgatou ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-50 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:border-blue-100'}`}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`p-3.5 rounded-[1.2rem] shadow-sm ${b.cor}`}><Icon size={22} /></div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-tight">{b.nome}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{b.empresa}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                        <Star size={12} fill="currentColor" /> {b.pontos} PTS
                      </span>
                      <button 
                        disabled={!podeResgatar || jaResgatou}
                        onClick={() => handleResgatar(b)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          jaResgatou ? 'text-green-600 bg-green-100/50' : 
                          podeResgatar ? 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)] hover:scale-105 active:scale-95' : 
                          'text-slate-400 bg-slate-100'
                        }`}
                      >
                        {jaResgatou ? 'CONCLUÍDO' : podeResgatar ? 'RESGATAR' : 'BLOQUEADO'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link to="/beneficios" className="flex items-center justify-center gap-3 w-full mt-10 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1 transition-all duration-300 group">
              Ver Catálogo Completo <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
