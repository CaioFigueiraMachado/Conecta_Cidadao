import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Gift, Star, Search, ArrowRight, Zap, Info, ShieldCheck, ShoppingBag, Lock, Check, Loader2 } from 'lucide-react';
import { getAllBenefits, getRedeemedBenefits, redeemBenefit, updateUser, subscribeToBenefits } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Beneficios() {
  const { user, updateUserSession } = useAuth();
  const [benefits, setBenefits] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [resgatados, setResgatados] = useState([]);
  const [resgatando, setResgatando] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega dados iniciais
    const fetchData = async () => {
      const data = await getAllBenefits();
      setBenefits(data);
      if (user?.id) {
        const r = await getRedeemedBenefits(user.id);
        setResgatados(r.map(x => x.benefit_id));
      }
      setLoading(false);
    };
    fetchData();

    // Realtime: atualiza lista de benefícios quando um novo for adicionado
    const unsubBenefits = subscribeToBenefits(() => {
      getAllBenefits().then(setBenefits);
    });

    return () => {
      if (unsubBenefits) unsubBenefits();
    };
  }, [user?.id]);

  const categories = ['Todos', 'Alimentação', 'Lazer', 'Varejo', 'Serviços'];

  const filtered = benefits.filter(b => {
    const matchCat = filter === 'Todos' || b.categoria === filter;
    const matchSearch = (b.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.empresa || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleResgatar = async (benefit) => {
    if (!user) {
      Swal.fire({ icon: 'warning', title: 'Login necessário', text: 'Faça login para resgatar benefícios.', confirmButtonColor: '#2563eb' });
      return;
    }
    if (user.pontos < benefit.pontos) {
      Swal.fire({ icon: 'error', title: 'Pontos insuficientes', text: 'Você não possui pontos suficientes para este resgate.', confirmButtonColor: '#2563eb' });
      return;
    }
    if (resgatados.includes(benefit.id)) {
      Swal.fire({ icon: 'info', title: 'Já resgatado', text: 'Este benefício já foi resgatado por você.', confirmButtonColor: '#2563eb' });
      return;
    }

    const confirm = await Swal.fire({
      title: 'Confirmar Resgate?',
      html: `<b>${benefit.nome}</b><br>Custo: ${benefit.pontos} pontos<br><br>Você será redirecionado para obter o voucher.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Resgatar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b'
    });

    if (!confirm.isConfirmed) return;

    setResgatando(benefit.id);
    try {
      const novosPontos = user.pontos - benefit.pontos;
      const redeemResult = await redeemBenefit(user.id, benefit);
      updateUserSession({ ...user, pontos: novosPontos });
      setResgatados(prev => [...prev, benefit.id]);
      Swal.fire({
        icon: 'success',
        title: 'Benefício Resgatado!',
        html: `<b>Código do Voucher:</b> ${redeemResult.code || benefit.code || 'GERADO'}<br>Apresente no estabelecimento.`,
        confirmButtonColor: '#2563eb'
      });
    } catch (error) {
      console.error('Erro ao resgatar:', error);
      Swal.fire({ icon: 'error', title: 'Erro', text: `Não foi possível resgatar: ${error.message}`, confirmButtonColor: '#2563eb' });
    } finally {
      setResgatando(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Gift size={24} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">Benefícios e Recompensas</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Troque os pontos acumulados por reportes validados por benefícios exclusivos em nossos parceiros locais.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="O que você deseja resgatar hoje?"
              className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${filter === cat ? 'bg-blue-600 text-white border-transparent shadow-lg shadow-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 items-start">

          {/* Main Content: Benefits Grid */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full py-20 text-center">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando catálogo...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                  <Gift size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-xl font-bold text-slate-400 uppercase tracking-tighter">Nenhum benefício encontrado.</p>
                </div>
              ) : filtered.map(b => (
                <div key={b.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="relative h-48 bg-slate-100">
                    <img src={b.imagem || `https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800`} alt={b.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-blue-600 text-xs shadow-md flex items-center gap-1.5">
                      <Star size={14} fill="currentColor" /> {b.pontos} PTS
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg">{b.categoria}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.empresa}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{b.nome}</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 line-clamp-2" title={b.descricao}>
                      {b.descricao || `Válido em ${b.empresa}. Use seus pontos acumulados para resgatar este voucher e aproveitar!`}
                    </p>
                    <button
                      onClick={() => handleResgatar(b)}
                      disabled={resgatando === b.id || resgatados.includes(b.id) || (!user || user.pontos < b.pontos)}
                      className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 ${resgatados.includes(b.id)
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : !user
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : user.pontos < b.pontos
                            ? 'bg-red-50 text-red-500 border border-red-100'
                            : 'bg-slate-900 text-white hover:bg-blue-600'
                        }`}
                    >
                      {resgatando === b.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> PROCESSANDO
                        </>
                      ) : resgatados.includes(b.id) ? (
                        <>
                          <Check size={16} /> RESGATADO
                        </>
                      ) : !user ? (
                        <>
                          <Lock size={16} /> FAÇA LOGIN
                        </>
                      ) : user.pontos < b.pontos ? (
                        <>
                          <Lock size={16} /> PONTOS INSUFICIENTES
                        </>
                      ) : (
                        'RESGATAR AGORA'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </Layout >
  );
}
