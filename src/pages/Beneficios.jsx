import Layout from '../components/Layout';
import { Gift, Star, Ticket, Coffee, ShoppingBag } from 'lucide-react';

export default function Beneficios() {
  const beneficios = [
    { id: 1, nome: 'Ingresso de Cinema', pontos: 150, icone: Ticket, empresa: 'Cineplex', cor: 'bg-red-50 text-red-600' },
    { id: 2, nome: 'Vale-Café', pontos: 50, icone: Coffee, empresa: 'Café do Ponto', cor: 'bg-amber-50 text-amber-600' },
    { id: 3, nome: 'Desconto 10% Supermercado', pontos: 300, icone: ShoppingBag, empresa: 'Mercado Bom Preço', cor: 'bg-green-50 text-green-600' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Catálogo de Benefícios</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            A sua participação ativa transforma a cidade e ainda garante prêmios! Troque seus pontos por descontos e cortesias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map(b => {
            const Icon = b.icone;
            return (
              <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${b.cor}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{b.nome}</h3>
                  <p className="text-sm text-slate-500 mb-4">Oferecido por {b.empresa}</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <span className="font-bold text-blue-600 flex items-center gap-1">
                    <Star size={16} /> {b.pontos} pts
                  </span>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    Resgatar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
