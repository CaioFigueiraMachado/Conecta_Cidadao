import DashboardLayout from '../../components/DashboardLayout';
import { Star, Gift, Ticket, Coffee, ShoppingBag, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUser } from '../../services/storage';
import { useState } from 'react';

const beneficios = [
  { id: 1, nome: 'Ingresso de Cinema', pontos: 150, icone: Ticket, cor: 'bg-red-50 text-red-600', empresa: 'Cineplex' },
  { id: 2, nome: 'Vale-Café', pontos: 50, icone: Coffee, cor: 'bg-amber-50 text-amber-600', empresa: 'Café do Ponto' },
  { id: 3, nome: 'Desconto 10%', pontos: 300, icone: ShoppingBag, cor: 'bg-green-50 text-green-600', empresa: 'Mercado Bom Preço' },
];

export default function Pontos() {
  const { user, updateUserSession } = useAuth();
  const pontos = user?.pontos || 0;
  const [resgatados, setResgatados] = useState([]);

  const nivelInfo = pontos < 100 ? { label: 'Iniciante', next: 100 } :
                   pontos < 300 ? { label: 'Fiscal da Cidade', next: 300 } :
                   { label: 'Guardião Urbano', next: 600 };

  const handleResgatar = (b) => {
    if (pontos < b.pontos || resgatados.includes(b.id)) return;
    const novosPontos = pontos - b.pontos;
    const updatedUser = { ...user, pontos: novosPontos };
    updateUser(user.id, { pontos: novosPontos });
    updateUserSession(updatedUser);
    setResgatados(prev => [...prev, b.id]);
  };

  return (
    <DashboardLayout title="Meus Pontos e Benefícios">

      {/* Saldo */}
      <div className="mb-8 bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-sm text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-blue-100 mb-2">Seu Saldo Atual</h2>
          <div className="flex items-center gap-3">
            <Star size={40} className="text-yellow-400" />
            <span className="text-5xl font-extrabold">{pontos} <span className="text-2xl font-normal text-blue-200">pts</span></span>
          </div>
        </div>
        <div className="bg-white/10 p-6 rounded-xl border border-white/20 text-center min-w-[200px]">
          <p className="text-sm text-blue-100 mb-1">Nível Atual</p>
          <p className="text-xl font-bold">{nivelInfo.label}</p>
          <div className="mt-3 w-full bg-blue-900/40 rounded-full h-2">
            <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${Math.min((pontos / nivelInfo.next) * 100, 100)}%` }}></div>
          </div>
          <p className="text-xs text-blue-200 mt-1">{pontos}/{nivelInfo.next} pts para o próximo nível</p>
        </div>
      </div>

      <h3 className="font-bold text-slate-800 text-lg mb-4">Catálogo de Resgate</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {beneficios.map(b => {
          const Icon = b.icone;
          const podeResgatar = pontos >= b.pontos;
          const jaResgatou = resgatados.includes(b.id);

          return (
            <div key={b.id} className={`bg-white p-6 rounded-2xl shadow-sm border flex flex-col justify-between transition-all ${
              jaResgatou ? 'border-green-200 bg-green-50' : 'border-slate-100'
            }`}>
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${b.cor}`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{b.nome}</h3>
                <p className="text-sm text-slate-400">{b.empresa}</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <span className={`font-bold flex items-center gap-1 ${podeResgatar ? 'text-blue-600' : 'text-slate-400'}`}>
                  <Star size={16} /> {b.pontos} pts
                </span>
                <button
                  onClick={() => handleResgatar(b)}
                  disabled={!podeResgatar || jaResgatou}
                  className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors flex items-center gap-1 ${
                    jaResgatou ? 'bg-green-100 text-green-700 cursor-default' :
                    podeResgatar ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' :
                    'bg-slate-50 text-slate-400 cursor-not-allowed'
                  }`}>
                  {jaResgatou ? <><Check size={14} /> Resgatado!</> :
                   podeResgatar ? 'Resgatar' : 'Pts Insuficientes'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
