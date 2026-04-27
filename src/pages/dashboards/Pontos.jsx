import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getPointsTransactions, subscribeToPointsTransactions, getRedeemedBenefits, findUserByEmail } from '../../services/storage';
import { RefreshCw, Ticket, Gift, Building } from 'lucide-react';

export default function Pontos() {
  const { user, updateUserSession } = useAuth();
  const pontos = user?.pontos || 0;
  const [transactions, setTransactions] = useState([]);
  const [redeemed, setRedeemed] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Atualiza o saldo de pontos buscando o usuário atualizado
      const freshUser = await findUserByEmail(user.email);
      if (freshUser && freshUser.pontos !== user.pontos) {
        updateUserSession(freshUser);
      }
      
      const transData = await getPointsTransactions(user.id);
      setTransactions(transData);

      const redeemedData = await getRedeemedBenefits(user.id);
      setRedeemed(redeemedData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, user?.pontos]);

  useEffect(() => {
    if (!user?.id) return;

    const unsub = subscribeToPointsTransactions(user.id, (payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        setTransactions(prev => [payload.new, ...prev]);
      }
    });

    return unsub;
  }, [user?.id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const creditTransactions = transactions.filter(t => t.tipo === 'credito');
  const debitTransactions = transactions.filter(t => t.tipo === 'debito');

  return (
    <DashboardLayout title="Extrato e Recompensas">
      <div className="p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Meus Pontos</h1>
          <button 
            onClick={loadData} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Atualizar Saldo
          </button>
        </div>

        {/* Saldo Atual */}
        <div className="bg-blue-50 p-10 rounded-2xl text-center mb-10 border border-blue-100 shadow-inner">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Saldo Atual</p>
          <p className="text-7xl font-black text-blue-600">{pontos}</p>
          <p className="text-slate-500 mt-4 font-medium">Pontos disponíveis para resgate em benefícios</p>
        </div>

        {/* Extrato de Pontos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Pontos Recebidos */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pontos Recebidos
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {creditTransactions.length === 0 ? (
                <p className="text-slate-400 text-sm font-medium">Nenhum ponto recebido ainda.</p>
              ) : (
                creditTransactions.map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-green-50/50 rounded-xl border border-green-100">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{t.descricao}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{formatDate(t.created_at)}</p>
                    </div>
                    <span className="text-lg font-black text-green-600 ml-4">+{t.pontos}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pontos Gastos */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pontos Gastos
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {debitTransactions.length === 0 ? (
                <p className="text-slate-400 text-sm font-medium">Nenhum ponto gasto ainda.</p>
              ) : (
                debitTransactions.map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{t.descricao}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{formatDate(t.created_at)}</p>
                    </div>
                    <span className="text-lg font-black text-red-600 ml-4">-{t.pontos}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Benefícios Resgatados (Vouchers) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Ticket className="text-blue-600" size={24} />
            Meus Benefícios Resgatados (Vouchers)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redeemed.length === 0 ? (
              <div className="col-span-full py-10 text-center opacity-50">
                <Gift size={40} className="mx-auto text-slate-400 mb-4" />
                <p className="font-bold text-slate-500">Você ainda não resgatou nenhum benefício.</p>
              </div>
            ) : (
              redeemed.map(r => (
                <div key={r.id} className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -right-6 -top-6 text-slate-100 rotate-12">
                    <Ticket size={100} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 mb-2">
                      <Building size={14} /> {r.empresa}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{r.nome}</h3>
                    <p className="text-xs text-slate-400 font-medium mb-6">Resgatado em {r.data}</p>
                    
                    <div className="bg-slate-800 text-white rounded-xl p-4 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">CÓDIGO DO VOUCHER</p>
                      <p className="text-2xl font-black tracking-widest">{r.code}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
