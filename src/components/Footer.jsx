import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-slate-700 pb-12">
          
          {/* Coluna 1: Branding */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl text-blue-400">
                Conecta <span className="text-white">Cidadão</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Conectando a população com os serviços públicos e ações sociais para construir uma cidade melhor, transparente e mais inteligente para todos.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-white text-sm">Início</Link></li>
              <li><Link to="/quem-somos" className="text-slate-400 hover:text-white text-sm">Sobre o Projeto</Link></li>
              <li><Link to="/mapa" className="text-slate-400 hover:text-white text-sm">Mapa de Demandas</Link></li>
              <li><Link to="/beneficios" className="text-slate-400 hover:text-white text-sm">Recompensas</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm">contato@conectacidadao.com.br</li>
              <li className="text-slate-400 text-sm">0800 123 4567</li>
              <li><Link to="/parceiro" className="text-slate-400 hover:text-white text-sm">Parcerias para ONGs</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Conecta Cidadão. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
