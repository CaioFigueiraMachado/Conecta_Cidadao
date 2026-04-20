import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getBenefitsByPartner, addBenefit, deleteBenefit } from '../../services/storage';
import { Gift, Plus, Trash2, Tag, Star, TrendingUp, Users, Calendar, ArrowUpRight, Loader2, X, Sparkles } from 'lucide-react';

export default function DashboardParceiro() {
  const { user } = useAuth();
  const [benefits, setBenefits] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBenefit, setNewBenefit] = useState({
    nome: '',
    pontos: 0,
    categoria: 'Alimentação',
    code: ''
  });

  useEffect(() => {
    if (user) {
      setBenefits(getBenefitsByPartner(user.id));
    }
  }, [user]);

  const handleAdd = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      addBenefit({ ...newBenefit, partnerId: user.id, empresa: user.name });
      setBenefits(getBenefitsByPartner(user.id));
      setShowAddModal(false);
      setNewBenefit({ nome: '', pontos: 0, categoria: 'Alimentação', code: '' });
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    if (confirm('Deseja excluir este benefício?')) {
      deleteBenefit(id);
      setBenefits(getBenefitsByPartner(user.id));
    }
  };

  const stats = [
    { label: 'Benefícios Ativos', value: benefits.length, icon: Gift, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resgates (Mês)', value: 124, icon: Tag, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Novos Clientes', value: 48, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Engajamento', value: '+18%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <DashboardLayout title="Painel do Parceiro">
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-blue-100 transition-all duration-500">
            <div className={`w-16 h-16 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <s.icon size={28} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <p className="text-4xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main Area */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Meus Benefícios</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Gerencie os cupons e prêmios oferecidos aos cidadãos.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            <Plus size={20} /> NOVO BENEFÍCIO
          </button>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <Gift size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-400 font-bold">Nenhum benefício cadastrado.</p>
                <button onClick={() => setShowAddModal(true)} className="text-blue-600 font-black text-sm mt-2 hover:underline">Começar agora</button>
              </div>
            ) : benefits.map(b => (
              <div key={b.id} className="bg-slate-50/50 rounded-[3rem] p-8 border border-slate-100 flex flex-col justify-between group hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-white p-4 rounded-2xl text-blue-600 shadow-sm border border-slate-50"><Star size={24} fill="currentColor" /></div>
                    <button onClick={() => handleDelete(b.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{b.nome}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.categoria}</p>
                </div>
                <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Custo</span>
                    <span className="text-2xl font-black text-blue-600">{b.pontos} <span className="text-xs font-bold text-slate-400 uppercase">pts</span></span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 text-xs font-black text-slate-800 shadow-sm">
                    {b.code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Add Benefit (Premium) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Novo Benefício</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form className="space-y-6" onSubmit={handleAdd}>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Título do Benefício</label>
                <input required type="text" value={newBenefit.nome} onChange={e => setNewBenefit({...newBenefit, nome: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Cupom 20% OFF" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Custo (Pontos)</label>
                  <input required type="number" value={newBenefit.pontos} onChange={e => setNewBenefit({...newBenefit, pontos: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Categoria</label>
                  <select value={newBenefit.categoria} onChange={e => setNewBenefit({...newBenefit, categoria: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold appearance-none">
                    <option value="Alimentação">Alimentação</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Varejo">Varejo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Código Promocional</label>
                <input required type="text" value={newBenefit.code} onChange={e => setNewBenefit({...newBenefit, code: e.target.value.toUpperCase()})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="EX: PROMO2026" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : 'CADASTRAR BENEFÍCIO'}
              </button>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
