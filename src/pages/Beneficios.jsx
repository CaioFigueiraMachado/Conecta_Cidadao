import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Gift, Star, Ticket, Coffee, ShoppingBag, ShieldCheck, AlertCircle, Loader2, Sparkles, Tag, ExternalLink, CheckCircle2 } from 'lucide-react';
import { getAllBenefits, redeemBenefit, updateUser } from '../services/storage';

export default function Beneficios() {
  const { user, updateUserSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [redeemedId, setRedeemedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dbBenefits, setDbBenefits] = useState([]);

  useEffect(() => {
    setDbBenefits(getAllBenefits());
  }, []);

  const beneficios = [
    { 
      id: 1, 
      nome: 'Ingresso de Cinema VIP', 
      pontos: 150, 
      icone: Ticket, 
      empresa: 'Cineplex Prime', 
      cor: 'from-rose-500 to-rose-600',
      tags: ['Lazer', 'Entretenimento'],
      highlight: true
    },
    { 
      id: 2, 
      nome: 'Combo Café Gourmet', 
      pontos: 50, 
      icone: Coffee, 
      empresa: 'Café do Ponto', 
      cor: 'from-amber-500 to-amber-600',
      tags: ['Alimentação']
    },
    { 
      id: 3, 
      nome: 'Vale-Desconto 15%', 
      pontos: 300, 
      icone: ShoppingBag, 
      empresa: 'Mercado Bom Preço', 
      cor: 'from-emerald-500 to-emerald-600',
      tags: ['Varejo', 'Economia']
    },
    { 
      id: 4, 
      nome: 'Acesso VIP Museu', 
      pontos: 200, 
      icone: Sparkles, 
      empresa: 'Cultura Viva', 
      cor: 'from-indigo-500 to-indigo-600',
      tags: ['Cultura']
    },
    { 
      id: 5, 
      nome: 'Desconto 20% Farmácia', 
      pontos: 150, 
      icone: ShieldCheck, 
      empresa: 'Drogaria Saúde', 
      cor: 'from-teal-500 to-teal-600',
      tags: ['Saúde', 'Varejo']
    },
    { 
      id: 6, 
      nome: '1 Mês Grátis Academia', 
      pontos: 500, 
      icone: Star, 
      empresa: 'FitLife Center', 
      cor: 'from-purple-500 to-purple-600',
      tags: ['Saúde', 'Lazer']
    },
  ];

  const mappedDbBenefits = dbBenefits.map(b => ({
    id: `db-${b.id}`,
    nome: b.nome,
    pontos: b.pontos,
    icone: b.categoria === 'Alimentação' ? Coffee : b.categoria === 'Lazer' ? Ticket : b.categoria === 'Varejo' ? ShoppingBag : b.categoria === 'Serviços' ? ShieldCheck : Gift,
    empresa: b.empresa || 'Parceiro Local',
    cor: 'from-blue-500 to-cyan-500',
    tags: [b.categoria || 'Geral'],
    highlight: false
  }));

  const allBeneficios = [...beneficios, ...mappedDbBenefits];

  const handleRedeem = (benefit) => {
    setErrorMsg('');
    if (!user) {
      setErrorMsg('Você precisa estar logado para resgatar benefícios.');
      return;
    }
    const currentPoints = user.pontos || 0;
    if (currentPoints < benefit.pontos) {
      setErrorMsg('Pontos insuficientes para este resgate.');
      return;
    }

    setLoading(benefit.id);
    setTimeout(() => {
      const novosPontos = currentPoints - benefit.pontos;
      const updatedUser = { ...user, pontos: novosPontos };
      updateUser(user.id, { pontos: novosPontos });
      updateUserSession(updatedUser);
      redeemBenefit(user.id, benefit);
      setLoading(false);
      setRedeemedId(benefit.id);
      setTimeout(() => setRedeemedId(null), 3000);
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Section with Deep Blue Gradient */}
      <div className="bg-[#0F172A] pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-black uppercase tracking-widest">Recompensas Exclusivas</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
              Troque Pontos por <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Benefícios Reais</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-10">
              Sua participação na melhoria da cidade vale ouro. Cada reporte resolvido gera moedas sociais que você pode trocar em nossa rede de parceiros.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">
                  <Star size={20} fill="currentColor" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Seu Saldo</p>
                  <p className="text-white font-black">{user ? (user.pontos || 0) : 'Faça login para ver'} Pontos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#F8FAFC] min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Catálogo de Prêmios</h2>
              <p className="text-slate-500 font-medium">Os melhores cupons e experiências para você.</p>
            </div>
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
              {['Todos', 'Lazer', 'Alimentação', 'Varejo'].map(f => (
                <button key={f} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${f === 'Todos' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'}`}>{f}</button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 font-bold rounded-2xl flex items-center gap-3">
              <AlertCircle size={20} />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {allBeneficios.map(b => {
              const Icon = b.icone;
              const isRedeemed = redeemedId === b.id;
              const isRedeeming = loading === b.id;

              return (
                <div key={b.id} className={`group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all duration-500 overflow-hidden flex flex-col ${b.highlight ? 'ring-2 ring-blue-500/10' : ''}`}>
                  {/* Card Header */}
                  <div className={`h-48 bg-gradient-to-br ${b.cor} p-8 relative overflow-hidden flex flex-col justify-end`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                      <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 border border-white/20">
                        <Icon size={32} />
                      </div>
                      <div className="flex gap-2">
                        {b.tags.map(tag => (
                          <span key={tag} className="bg-black/10 backdrop-blur-sm text-[8px] font-black text-white uppercase tracking-widest px-2 py-0.5 rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-8">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Tag size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{b.empresa}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {b.nome}
                      </h3>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custo</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-800">{b.pontos}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">pts</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleRedeem(b)}
                        disabled={isRedeeming || isRedeemed || (user?.pontos || 0) < b.pontos}
                        className={`px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                          isRedeemed ? 'bg-green-100 text-green-600' :
                          isRedeeming || (user?.pontos || 0) < b.pontos ? 'bg-slate-100 text-slate-400' :
                          'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isRedeeming ? <Loader2 className="animate-spin" size={16} /> : 
                         isRedeemed ? <CheckCircle2 size={16} /> : null}
                        {isRedeemed ? 'RESGATADO' : isRedeeming ? 'PROCESSANDO' : (user?.pontos || 0) < b.pontos ? 'BLOQUEADO' : 'RESGATAR AGORA'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State / Coming Soon */}
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group cursor-help hover:bg-white hover:border-blue-200 transition-all duration-500">
              <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-400 transition-all">
                <ExternalLink size={24} />
              </div>
              <h4 className="text-lg font-black text-slate-400 mb-2">Novos Parceiros</h4>
              <p className="text-xs font-medium text-slate-400 px-6 uppercase tracking-widest">Estamos fechando novas parcerias para você.</p>
            </div>
          </div>

          <div className="mt-20 bg-blue-600 rounded-[3rem] p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="relative z-10 flex-1">
               <h3 className="text-3xl font-black mb-4">Tem uma empresa?</h3>
               <p className="text-blue-100 text-lg font-medium max-w-lg mb-8 opacity-80 leading-relaxed">
                 Torne-se um parceiro do Conecta Cidadão e atraia novos clientes engajados com o desenvolvimento da cidade.
               </p>
               <button className="bg-white text-blue-600 px-10 py-5 rounded-[2rem] font-black text-sm hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 active:scale-95">SEJA UM PARCEIRO</button>
             </div>
             <div className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 max-w-xs">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">Plataforma</p>
                    <p className="text-lg font-black">Auditada</p>
                  </div>
                </div>
                <p className="text-[10px] text-blue-100 font-medium leading-relaxed mb-6 opacity-70">
                  Garantimos a validade e segurança de todos os cupons gerados através da tecnologia blockchain social.
                </p>
                <div className="flex items-center gap-2 text-[9px] font-black text-blue-200 uppercase tracking-widest">
                  <CheckCircle2 size={12} className="text-green-400" /> Sistema 100% Confiável
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
